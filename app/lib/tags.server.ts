import { randomHex } from "./crypto.server";
import { env } from "./env.server";

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description: null | string;
  feature_image: null | string;
  parent_id?: string;
  visibility: "public";
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
};

const TAG_BASE = "v1.tags";

export async function tags(ids: string[]) {
  const kvTags = (await env("KV").get<Tag[]>(TAG_BASE, "json")) || [];
  return kvTags.filter((t) => ids.includes(t.id));
}

export async function save(tag: Tag) {
  const KV = env("KV");
  const kvTags = (await KV.get<Tag[]>(TAG_BASE, "json")) || [];
  tag.id = randomHex(20);

  await KV.put(
    TAG_BASE,
    JSON.stringify(kvTags.filter((t) => t.id !== tag.id).concat(tag))
  );
  return tag;
}
