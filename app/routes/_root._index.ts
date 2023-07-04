import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { loaderWrap } from "~/lib/loader";
import { list } from "~/lib/posts.server";
import { template } from "~/lib/themes.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = loaderWrap(async () => {
  const posts = await list({
    offset: 0,
    limit: 10,
    type: "post",
    status: "published",
  });

  return template("index", {
    relativeUrl: "/",
    posts: posts.results,
    // @TODO context helper
    context: ["home"],
    // @TODO pagination helper
    pagination: {
      page: 1,
      pages: 2,
      total: 20,
      next: 2,
      limit: 10,
    },
  }).then(
    (html) =>
      new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
  );
});
