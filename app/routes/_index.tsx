import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { loaderWrap } from "~/lib/loader.server";
import { getPage } from "~/lib/posts.server";
import { template } from "~/lib/themes.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = loaderWrap(async () =>
  template("index", {
    relativeUrl: "/",
    posts: await getPage({ page: 1, limit: 10 }),
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
  )
);
