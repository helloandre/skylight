import type { LoaderArgs } from "@remix-run/cloudflare";
import {
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";
import { userActionWrap } from "~/lib/action";
import { get, save } from "~/lib/uploads.server";

const MAX_UPLOAD_SIZE = 5000000; // 5MB

export const action = userActionWrap(
  async ({ request }) => {
    const uploadHandler = unstable_createMemoryUploadHandler({
      maxPartSize: MAX_UPLOAD_SIZE,
    });
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );
    const url = await save(formData.get("file") as File);
    return json({ url }, url ? 200 : 400);
  },
  { allowedMethods: ["POST"] }
);

type LoaderWithContext = LoaderArgs & {
  context: { waitUntil: (p: Promise<any>) => void };
};

export const loader = async ({
  request,
  params,
  context,
}: LoaderWithContext) => {
  const url = new URL(request.url);

  // Construct the cache key from the cache URL
  const cacheKey = new Request(url.toString(), request);
  // @ts-ignore
  const cache = caches.default;

  // Check whether the value is already available in the cache
  // if not, you will need to fetch it from R2, and store it in the cache
  // for future access
  let response = await cache.match(cacheKey);
  if (response) {
    return response;
  }

  // If not in cache, get it from R2
  const filename = params["*"];
  if (!filename) {
    return new Response("Not Found", { status: 404 });
  }
  const object = await get(filename);
  if (object === null) {
    return new Response("Not Found", { status: 404 });
  }

  // Set the appropriate object headers
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  // Cache API respects Cache-Control headers. Setting s-max-age to 10
  // will limit the response to be in cache for 10 seconds max
  // Any changes made to the response here will be reflected in the cached value
  headers.append("Cache-Control", "s-maxage=10");

  response = new Response(object.body, { headers });

  // Store the fetched response as cacheKey
  // Use waitUntil so you can return the response without blocking on
  // writing to cache
  context.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
};
