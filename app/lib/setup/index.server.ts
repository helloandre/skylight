/**
 * This file is mostly self contained so that we don't have to
 * load any of its contents on most pageloads
 * it also makes it easy to update any defaults
 */
import { activate, save as saveTheme } from "../themes.server";
import { save as saveConfig } from "../config.server";
import { save as saveTag } from "../tags.server";
import { saveAll as saveAllPosts } from "../posts.server";
import { randomHex } from "../crypto.server";
import { CONFIG, THEME } from "./casper.server";
import { POSTS, TAGS, SITE } from "./seed_data.server";
import type { User } from "../users.server";
import { DateTime } from "luxon";

const DEFAULT_THEME = "casper";

export async function setupTheme({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  await saveConfig({
    ghost: { url },
    site: { ...SITE, title },
    themes: { casper: { asset_hash: randomHex(10), defaults: CONFIG } },
  });
  await saveTheme({ name: DEFAULT_THEME, ...THEME });
  await activate(DEFAULT_THEME);
}

export async function setupData({ user }: { user: User }) {
  const tag = await saveTag(TAGS[0]);

  POSTS.forEach((p) => {
    const now = DateTime.now().toUTC().toISO() as string;
    p.author_ids = [user.id];
    p.created_at = now;
    p.created_by = user.id;
    p.updated_at = now;
    p.updated_by = user.id;
    p.published_at = now;
    p.published_by = user.id;

    if (p.type === "post") {
      p.tag_ids = [tag.id];
    }
  });
  await saveAllPosts(POSTS);
}
