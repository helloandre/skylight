import type { RouteMatch } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { draft } from "~/lib/posts.server";
import type { Post } from "~/lib/posts.server";
import { userLoaderWrap } from "~/lib/loader";
import { template } from "~/lib/themes.server";
import { useRef, type FormEvent, useState } from "react";
import type { Validity } from "~/lib/validation.server";

// type FormData = {};

type LoaderData = {
  post: Post;
};
// type FormData = {
//   title?: string;
//   slug?: string;
//   html?: string;
// };
type UpdateResponse = { errors?: Validity[] };

export const handle = {
  sidebar: (match: RouteMatch, matches: RouteMatch[]) => {
    return [];
  },
};

export const loader = userLoaderWrap(async ({ params, request }) => {
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

  return {
    post: obj,
  };
});

export default function SkylightIndex() {
  const { post } = useLoaderData<LoaderData>();
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Validity[] | undefined>();
  const field = (n: string) => errors?.find((f) => f.name === n);
  const formError = field("form");
  const title = field("title");
  const slug = field("slug");
  const html = field("html");

  async function submit(
    action: string,
    event: FormEvent,
    form: HTMLFormElement
  ) {
    event.preventDefault();
    const fd = new FormData(form);
    fd.append("action", action);

    for (const [e, es] of fd.entries()) {
      console.log(e, es);
    }

    const resp = await fetch("/skylight/posts/update/" + fd.get("id"), {
      method: "post",
      body: fd,
    }).then((r) => r.json() as UpdateResponse);
    setErrors(resp.errors);
  }

  return (
    <div className="p-5 w-full">
      <form method="POST" ref={form}>
        <input name="id" type="hidden" value={post.id} />
        <div className="w-full justify-start">
          <button
            id="save"
            type="submit"
            className="me-3 btn btn-primary btn-sm"
            onClick={(event) =>
              submit("save", event, form.current as HTMLFormElement)
            }
          >
            Save
          </button>
          {post.status === "draft" ? (
            <button
              id="publish"
              type="submit"
              className="me-3 btn btn-secondary btn-sm"
              onClick={(event) =>
                submit("publish", event, form.current as HTMLFormElement)
              }
            >
              Publish
            </button>
          ) : null}
          {post.status === "published" ? (
            <>
              <button
                id="unpublish"
                type="submit"
                className="me-3 btn btn-secondary btn-sm"
                onClick={(event) =>
                  submit("publish", event, form.current as HTMLFormElement)
                }
              >
                Republish
              </button>
              <button
                id="unpublish"
                type="submit"
                className="me-3 btn btn-error btn-sm"
                onClick={(event) =>
                  submit("unpublish", event, form.current as HTMLFormElement)
                }
              >
                Unpublish
              </button>
            </>
          ) : null}
        </div>

        <div className="my-5">
          <div className="join">
            <input
              className="join-item btn-xs btn btn-outline"
              type="radio"
              name="type"
              value="post"
              aria-label="Post"
              defaultChecked={post.type === "post"}
            />
            <input
              className="join-item btn-xs btn btn-outline"
              type="radio"
              name="type"
              value="page"
              aria-label="Page"
              defaultChecked={post.type === "page"}
            />
          </div>
        </div>

        <div className="form-control my-5">
          {formError && !formError.valid && (
            <label className="label">
              <span className="label-text font-bold text-error">
                {formError.message || "There was an error"}
              </span>
            </label>
          )}
          <label className="label">
            <span className="label-text font-bold">Title</span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full ${
              errors && title && !title.valid ? "input-error" : ""
            }`}
            name="title"
            defaultValue={post.title ?? ""}
          />
          <label className="label">
            {title?.message ? (
              <span className="label-text-alt text-error">{title.message}</span>
            ) : (
              ""
            )}
          </label>

          <label className="label">
            <span className="label-text font-bold">Url</span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full ${
              errors && slug && !slug.valid ? "input-error" : ""
            }`}
            name="slug"
            defaultValue={post.slug ?? ""}
          />
          <label className="label">
            {slug?.message ? (
              <span className="label-text-alt text-error">{slug.message}</span>
            ) : (
              ""
            )}
          </label>

          <label className="label">
            <span className="label-text font-bold">Body</span>
          </label>
          <textarea
            className={`input input-bordered w-full ${
              errors && html && !html.valid ? "input-error" : ""
            }`}
            name="html"
            defaultValue={post.html ?? ""}
          />
          <label className="label">
            {html?.message ? (
              <span className="label-text-alt text-error">{html.message}</span>
            ) : (
              ""
            )}
          </label>
        </div>
      </form>
    </div>
  );
}
