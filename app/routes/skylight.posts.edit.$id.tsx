import type { RouteMatch } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { draft } from "~/lib/posts.server";
import type { Post } from "~/lib/posts.server";
import { userLoaderWrap } from "~/lib/loader";
import { template } from "~/lib/themes.server";
import { useRef, type FormEvent } from "react";

// type FormData = {};

type LoaderData = {
  post: Post;
};
type FormData = {
  title?: string;
  slug?: string;
  html?: string;
};

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

async function submit(action: string, event: FormEvent, form: HTMLFormElement) {
  event.preventDefault();
  const fd = new FormData(form.current);
  fd.append("action", action);
  const resp = await fetch("/skylight/posts/update/" + fd.get("id"), {
    method: "post",
    body: fd,
  });
  console.log(await resp.json());
}

export default function SkylightIndex() {
  const { post } = useLoaderData<LoaderData>();
  const form = useRef<HTMLFormElement>(null);
  let errors: FormData = {};

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
              aria-label="Post"
              defaultChecked={post.type === "post"}
            />
            <input
              className="join-item btn-xs btn btn-outline"
              type="radio"
              name="type"
              aria-label="Page"
              defaultChecked={post.type === "page"}
            />
          </div>
        </div>

        <div className="form-control my-5">
          <label className="label">
            <span className="label-text font-bold">Title</span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full ${
              errors.title ? "input-error" : ""
            }`}
            name="title"
            defaultValue={post.title ?? ""}
          />
          <label className="label">
            {errors.title ? (
              <span className="label-text-alt text-error">{errors.title}</span>
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
              errors.slug ? "input-error" : ""
            }`}
            name="slug"
            defaultValue={post.slug ?? ""}
          />
          <label className="label">
            {errors.slug ? (
              <span className="label-text-alt text-error">{errors.slug}</span>
            ) : (
              ""
            )}
          </label>

          <label className="label">
            <span className="label-text font-bold">Body</span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full ${
              errors.html ? "input-error" : ""
            }`}
            name="html"
            defaultValue={post.html ?? ""}
          />
          <label className="label">
            {errors.html ? (
              <span className="label-text-alt text-error">{errors.html}</span>
            ) : (
              ""
            )}
          </label>
        </div>
      </form>
    </div>
  );
}
