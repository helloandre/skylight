import { env } from "./env.server";
import type { Tag } from "./tags.server";
import { getUser, type User } from "./users.server";
import { tags } from "./tags.server";
import { randomHex } from "./crypto.server";
import { now } from "./time";

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
export type NewPost = {
  id: string;
  status: "draft";
  type: "post" | "page";
  slug?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

type PostStatus = "draft" | "scheduled" | "published";
type PostType = "page" | "post";
type ListParams = {
  status?: PostStatus;
  type?: PostType;
  limit: number;
  offset: number;
};
type PostsList = {
  id: string;
  type: string;
  updated_at: string;
  status: PostStatus;
}[];

const POSTS_BASE = "v1.posts";
const POSTS_LIST = `${POSTS_BASE}.list`;
// by post.id
const POSTS_DRAFT = `${POSTS_BASE}.draft`;
// by post.slug
const POSTS_PUBLISHED = `${POSTS_BASE}.published`;

export function published(slug: string) {
  return env("KV")
    .get<Post>(`${POSTS_PUBLISHED}.${slug}`, "json")
    .then(hydrate);
}

export function draft(id: string) {
  return env("KV").get<Post>(`${POSTS_DRAFT}.${id}`, "json").then(hydrate);
}

export async function list({
  offset,
  limit,
  status,
  type,
}: ListParams): Promise<{ results: Post[]; total: number }> {
  limit = Math.min(limit, 10);

  // TODO replace with DO or D1
  const list = (await env("KV").get<PostsList>(POSTS_LIST, "json")) || [];
  list.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));

  return {
    total: list.length,
    results: await Promise.all(
      list
        .filter(
          (p) => (!status || p.status === status) && (!type || p.type === type)
        )
        .slice(offset * limit, (offset + 1) * limit)
        .map(({ status, id }) =>
          status === "published" ? published(id) : draft(id)
        )
    ).then((ps) => ps.filter((p) => p !== null) as Post[]),
  };
}

export async function create(user: User) {
  const post: NewPost = {
    id: randomHex(20),
    status: "draft",
    type: "post",
    created_at: now(),
    created_by: user.id,
    updated_at: now(),
    updated_by: user.id,
  };

  await setStatus(post);
  await save(post as Post, user);
  return post.id;
}

export async function publish(
  post: Post,
  user: User,
  dangerouslyDoNotUpdateStatus = false
) {
  post.status = "published";
  post.updated_at = now();
  post.updated_by = user.id;

  // we don't want to update the published_at if its already published
  // as we can "republish" posts with updated content
  if (!post.published_at) {
    post.published_at = now();
    post.published_by = user.id;
  }

  // only set to true when seeding
  if (!dangerouslyDoNotUpdateStatus) {
    await setStatus(post);
  }
  await save(post, user);
  await env("KV").put(`${POSTS_PUBLISHED}.${post.slug}`, JSON.stringify(post));
}
export async function unpublish(post: Post, user: User) {
  post.status = "draft";
  post.updated_at = now();
  post.updated_by = user.id;

  await setStatus(post);
  await save(post, user);
  return env("KV").delete(`${POSTS_PUBLISHED}.${post.slug}`);
}

export async function save(post: Post, user: User) {
  post.updated_at = now();
  post.updated_by = user.id;
  return env("KV").put(`${POSTS_DRAFT}.${post.id}`, JSON.stringify(post));
}

export async function seed(posts: Post[], user: User) {
  const list: PostsList = [];

  for (const post of posts) {
    list.push({
      id: post.status === "published" ? post.slug : post.id,
      status: post.status,
      updated_at: now(),
      type: post.type,
    });
    await save(post, user);
    if (post.status === "published") {
      await publish(post, user, true);
    }
  }

  await env("KV").put(POSTS_LIST, JSON.stringify(list));
}

// @TODO use DO or D1
async function setStatus(post: Post | NewPost) {
  const KV = env("KV");
  const posts = ((await KV.get<PostsList>(POSTS_LIST, "json")) || [])
    .filter((p) => p.id !== post.id && p.id !== post.slug)
    .concat({
      id: post.status === "published" ? post.slug : post.id,
      status: post.status,
      updated_at: post.updated_at,
      type: post.type,
    });
  return KV.put(POSTS_LIST, JSON.stringify(posts));
}

async function hydrate(post: Post | null) {
  if (!post) {
    return post;
  }

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
    post.excerpt = (post.plaintext || "").substring(0, 500);
  }

  return post;
}
