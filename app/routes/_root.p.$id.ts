import { template } from "~/lib/themes.server";
import { draft } from "~/lib/posts.server";
import { loaderWrap } from "~/lib/loader";

export const loader = loaderWrap(async ({ params, request }) => {
  const id = (params.id || "").replace(/\/$/, "");
  const obj = await draft(id);

  if (!obj) {
    return template("error404", {
      relativeUrl: new URL(request.url).pathname,
      // @TODO context helper
      context: ["error"],
    }).then(
      (html) =>
        new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        })
    );
  }

  const objType = obj.type === "post" ? "post" : "page";
  // TODO support custom template names
  const templateName = obj.type === "post" ? "post" : "page";

  return template(templateName, {
    relativeUrl: new URL(request.url).pathname,
    post: obj,
    authors: obj.authors,
    page: objType === "page" ? obj : undefined,
    // @TODO context helper
    context: [objType],
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
