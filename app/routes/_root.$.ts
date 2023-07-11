import { render } from "~/lib/themes.server";
import { published } from "~/lib/posts.server";
import { loaderWrap } from "~/lib/loader";

export const loader = loaderWrap(async ({ params }) => {
  const slug = (params["*"] || "").replace(/\/$/, "");
  const obj = await published(slug);

  if (!obj) {
    return render("error404", {
      relativeUrl: slug,
      // @TODO context helper
      context: ["error"],
    }).then(
      (html) =>
        new Response(html, {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        })
    );
  }

  const objType = obj.type === "post" ? "post" : "page";
  // TODO support custom template names
  const templateName = obj.type === "post" ? "post" : "page";

  return render(templateName, {
    relativeUrl: slug,
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
