import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { list } from "~/lib/posts.server";
import type { Post } from "~/lib/posts.server";
import { DateTime } from "luxon";

// type FormData = {};

type LoaderData = {
  posts: {
    results: Post[];
    total: number;
  };
};

export const loader: LoaderFunction = async () => {
  return {
    // TODO pageination of posts
    posts: await list({ offset: 0, limit: 10 }),
  };
};

export default function SkylightIndex() {
  const { posts } = useLoaderData<LoaderData>();
  console.log(posts);

  return (
    <div className="p-5 w-full">
      <div className="p-5">
        <span className="text-2xl me-3">Posts</span>
        <a href="/skylight/posts/new">
          <span className="btn btn-xs btn-secondary btn-outline">new</span>
        </a>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Url</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.results.map((post) => (
            <tr key={post.id} className="hover">
              <td>{post.type.toLocaleUpperCase()}</td>
              <td>{post.title}</td>
              <td>
                <a
                  href={
                    post.status === "published"
                      ? `/${post.slug}`
                      : `/p/${post.id}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  {post.status === "published" ? post.slug : "Draft Preview"}
                </a>
              </td>
              <td>{DateTime.fromISO(post.created_at).toFormat("ff")}</td>
              <td>{DateTime.fromISO(post.updated_at).toFormat("ff")}</td>
              <td>{post.status}</td>
              <td>
                <a
                  href={`/skylight/posts/edit/${post.id}`}
                  className="link link-primary"
                >
                  edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
