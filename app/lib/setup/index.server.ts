/**
 * This file is mostly self contained so that we don't have to
 * load any of its contents on most pageloads
 * it also makes it easy to update any defaults
 */
import { activate, create as createTheme } from "../themes.server";
import { save as saveConfig } from "../config.server";
import { save as saveTag } from "../tags.server";
import { seed as seedPosts } from "../posts.server";
import { randomHex } from "../crypto.server";
import {
  DEFAULTS as CASPER_DEFAULTS,
  THEME as CASPER_THEME,
} from "./casper.server";
import { DEFAULTS as SOLO_DEFAULTS, THEME as SOLO_THEME } from "./solo.server";
import { POSTS, TAGS, SITE } from "./seed_data.server";
import type { User } from "../users.server";
import { now } from "../time";

export async function setupTheme(
  {
    url,
    title,
  }: {
    url: string;
    title: string;
  },
  user: User
) {
  await saveConfig({
    ghost: { url },
    site: { ...SITE, title },
    themes: {},
  });

  const themeId = await createTheme(
    {
      ...CASPER_THEME,
      config: {
        asset_hash: randomHex(10),
        defaults: CASPER_DEFAULTS,
      },
    },
    user
  );
  await activate(themeId);

  await createTheme(
    {
      ...SOLO_THEME,
      config: {
        asset_hash: randomHex(10),
        defaults: SOLO_DEFAULTS,
      },
    },
    user
  );
}

export async function setupData({ user }: { user: User }) {
  const tag = await saveTag(TAGS[0]);

  POSTS.forEach((p) => {
    p.id = randomHex(20);
    p.author_ids = [user.id];
    p.created_at = now();
    p.created_by = user.id;
    p.updated_at = now();
    p.updated_by = user.id;
    if (p.status === "published") {
      p.published_at = now();
      p.published_by = user.id;
    }

    if (p.type === "post") {
      p.tag_ids = [tag.id];
    }
  });
  await seedPosts(POSTS, user);
}
