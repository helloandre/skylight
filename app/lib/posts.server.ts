import { env } from "./env.server";
import type { Tag } from "./tags.server";
import { getUser, type User } from "./users.server";
import { tags } from "./tags.server";

export type Post = {
  id: string;
  title: string;
  slug: string;
  html: string;
  plaintext: string;
  feature_image?: string;
  featured: boolean;
  type: "page" | "post";
  status: "draft" | "scheduled" | "published";
  locale?: string;
  visibility: "public" | "hidden";
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  published_at?: string;
  published_by?: string;
  custom_excerpt?: string;
  excerpt?: string; // hydrated on fetch
  codeinjection_head?: string;
  codeinjection_foot?: string;
  custom_template?: string;
  canonical_url?: string;
  tag_ids?: string[];
  tags?: Tag[]; // hydrated on fetch
  primary_tag?: Tag;
  author_ids?: string[];
  authors?: User[]; // hydrated on fetch
};

type GetPageParams = {
  // 1-indexed
  page: number;
  limit: number;
};
type PostFilters = {
  type?: "page" | "post";
  status: "draft" | "scheduled" | "published";
  slug?: string;
};

const POST_BASE = "v1.posts";

export async function getSlug(slug: string) {
  const posts = await getList({ status: "published", slug });
  return posts.pop();
}

export async function getPage({ page, limit }: GetPageParams) {
  if (page === 0) {
    page = 1;
  }
  const posts = await getList({ type: "post", status: "published" });
  return posts.slice((page - 1) * limit, page * limit);
}

export async function save(post: Post) {
  const KV = env("KV") as KVNamespace;

  // @TODO lock via durable object?
  const posts = (await KV.get<Post[]>(POST_BASE, "json")) || [];
  return KV.put(
    POST_BASE,
    JSON.stringify(posts.filter((p) => p.id !== post.id).concat(post))
  );
}

export async function saveAll(posts: Post[]) {
  const KV = env("KV") as KVNamespace;
  return KV.put(POST_BASE, JSON.stringify(posts));
}

async function getList({ type, status, slug }: PostFilters) {
  const KV = env("KV") as KVNamespace;
  const posts = (await KV.get<Post[]>(POST_BASE, "json")) || [];

  return Promise.all(
    posts
      .filter(
        (p) =>
          p.status === status &&
          (!slug || p.slug === slug) &&
          (!type || p.type === type)
      )
      .map(async (post) => {
        // hydrate tags
        if (post.tag_ids) {
          post.tags = await tags(post.tag_ids);
          if (post.tags) {
            post.primary_tag = post.tags[0];
          }
        }

        // hydrate authors
        if (post.author_ids) {
          // @ts-ignore
          post.authors = (
            await Promise.all(post.author_ids.map((id) => getUser({ id })))
          ).filter((u) => u !== null);
        }

        // hydrate excerpt
        if (post.custom_excerpt) {
          post.excerpt = post.custom_excerpt;
        } else {
          post.excerpt = post.plaintext.substring(0, 500);
        }

        return post;
      })
  );
}
