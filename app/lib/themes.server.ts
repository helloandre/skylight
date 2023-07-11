import { env } from "./env.server";
import type {
  ThemeConfiguration,
  SiteConfiguration,
  GhostConfiguration,
  TemplatesObj,
  PaginationSettings,
} from "skylight-theme-compat-ghost";
import ghostTheme, { layout_tree } from "skylight-theme-compat-ghost";
import type { SkylightConfiguration } from "./config.server";
import { config as getConfig, save as saveConfig } from "./config.server";
import type { Post } from "./posts.server";
import type { User } from "./users.server";
import { randomHex } from "./crypto.server";
import { now } from "./time";

type TemplateKVFormat = {
  template: string;
  deps: string[];
};
type TemplateContextParam = {
  relativeUrl: string;
  context: string[];
  post?: Post;
  authors?: User[];
  page?: Post | undefined;
  posts?: Post[];
  pagination?: PaginationSettings;
};
export type ThemeListFormat = {
  name: string;
  id: string;
  uploaded_at: string;
  uploaded_by: string;
}[];
export type ThemeUploadObj = {
  name: string;
  assets: {
    [idx: string]: string;
  };
  templates: {
    index: string;
    post: string;
    [idx: string]: string;
  };
  partials?: {
    [idx: string]: string;
  };
  config: any;
};
export type ThemeData = {
  themeId: string;
  name: string;
  type: "asset" | "partial" | "template" | "config";
  content: string;
};

const KEY_BASE = "v1.themes";
const THEME_LIST = `${KEY_BASE}.list`;
const THEME_ACTIVE = `${KEY_BASE}.active`;

export async function render(
  templateName: string,
  context: TemplateContextParam
) {
  const id = await active();
  if (!id) {
    throw new Error("theme not set");
  }

  const globalConfig = (await getConfig()) as SkylightConfiguration;
  // you shouldn't be able to even get here without getting to /setup first
  // but anyway
  if (!globalConfig) {
    throw new Error(`theme ${id} does not exist`);
  }

  return ghostTheme
    .withTemplates(await _templates(templateName, id))
    .withPartials(await _partials(id))
    .withConfig(
      globalConfig.ghost as GhostConfiguration,
      globalConfig.site as SiteConfiguration,
      globalConfig.themes[id] as ThemeConfiguration
    )
    .render(templateName, {
      ...context,
      navigation: globalConfig.site.navigation || [],
      secondary_navigation: globalConfig.site.secondary_navigation || [],
    });
}

export async function create(
  { name, assets, templates, partials, config }: ThemeUploadObj,
  user: User
) {
  const KV = env("KV") as KVNamespace;
  const themeId = randomHex(20);
  const themeBase = `${KEY_BASE}.${themeId}`;
  // step 1: save assets to their own key based on the name
  // which we can derive later based on the url requested
  // to derive:
  // [config.url]/[config.subdir]/[asset key]
  const assetPromises = Object.keys(assets).map((key) =>
    KV.put(`${themeBase}.assets.${key}`, assets[key])
  );

  // step 2: save template files to their own keys based on object key
  const templatePromises = Object.keys(templates).map((key) =>
    KV.put(
      `${themeBase}.templates.${key}`,
      JSON.stringify({
        template: templates[key],
        deps: layout_tree(key, templates),
      })
    )
  );

  // step 2.1: save an index of the templates so we can register them
  // @TODO optimizae this by building dependencies array
  // dep array should look like { templates: [], partials: []}
  const templateIndexPromise = KV.put(
    `${themeBase}.templatesIdx`,
    JSON.stringify(Object.keys(templates))
  );

  // step 3: save partial files to their own keys based on object key
  const partialPromises = partials
    ? Object.keys(partials).map((key) =>
        KV.put(`${themeBase}.partials.${key}`, partials[key])
      )
    : [];

  // step 3.1: save an index of the partials so we can register them
  // @TODO optimizae this by building dependencies array
  const partialIndexPromise = KV.put(
    `${themeBase}.partialsIdx`,
    JSON.stringify(Object.keys(partials || {}))
  );

  // step 4: save the config as included in the package.json config
  const configPromise = saveConfig(`themes.${themeId}`, config);

  return Promise.all(
    assetPromises
      .concat([templateIndexPromise, partialIndexPromise, configPromise])
      .concat(templatePromises)
      .concat(partialPromises)
  )
    .then(async () => {
      // final step is to update the list of available themes
      // but we *don't* activate it automatically
      // we also don't filter by anything, we blindly concat to the existing list
      const existing = await list();
      return KV.put(
        THEME_LIST,
        JSON.stringify(
          existing.concat({
            name,
            id: themeId,
            uploaded_at: now(),
            uploaded_by: user.id,
          })
        )
      );
    })
    .then(() => themeId);
}

export async function list() {
  const KV = env("KV") as KVNamespace;
  return (await KV.get<ThemeListFormat>(THEME_LIST, "json")) || [];
}

export async function activate(id: string) {
  const KV = env("KV") as KVNamespace;
  await KV.put(THEME_ACTIVE, id);
}

export async function del(id: string) {
  const current = await active();
  if (current === id) {
    return false;
  }

  const KV = env("KV") as KVNamespace;

  const themes = await list();
  KV.put(THEME_LIST, JSON.stringify(themes.filter((t) => t.id !== id)));

  const { keys } = await KV.list({ prefix: `${KEY_BASE}.${id}`, limit: 1000 });
  for (const key of keys) {
    await KV.delete(key.name);
  }

  return true;
}

export function active() {
  const KV = env("KV") as KVNamespace;
  return KV.get(THEME_ACTIVE);
}

/**
 * returns the custom config as defined in the package.json config.custom property
 * @see https://ghost.org/docs/themes/custom-settings/
 */
export async function config() {
  const theme = await active();
  return await getConfig<ThemeConfiguration>(`themes.${theme}`);
}

export async function asset(path: string) {
  const id = await active();
  if (!id) {
    throw new Error(`no theme active`);
  }

  const KV = env("KV") as KVNamespace;
  return KV.get(`${KEY_BASE}.${id}.assets.${path}`);
}

/**
 * @TODO optimize this by building a depedencies array
 * so we can only load the partials we need based on the entry template
 */
async function _partials(id: string) {
  const KV = env("KV") as KVNamespace;
  const keys = await KV.get<string[]>(`${KEY_BASE}.${id}.partialsIdx`, "json");
  if (!keys) {
    return {};
  }
  const promises = keys.map((key) =>
    KV.get(`${KEY_BASE}.${id}.partials.${key}`)
  );

  return Promise.all(promises).then((partials) => {
    const partialsObj: { [idx: string]: string } = {};
    keys.forEach((key, idx) => {
      partialsObj[key] = partials[idx] || "";
    });
    return partialsObj;
  });
}

async function _templates(baseName: string, id: string) {
  const KV = env("KV") as KVNamespace;
  const keys = await KV.get<string[]>(`${KEY_BASE}.${id}.templatesIdx`, "json");
  if (!keys) {
    throw new Error(`theme ${id} does not exist`);
  }

  const base = await KV.get<TemplateKVFormat>(
    `${KEY_BASE}.${id}.templates.${baseName}`,
    "json"
  );
  if (!base) {
    throw new Error(`template ${baseName} does not exist`);
  }

  // we ignore the deps of the parent templates as we've already got a complete dep tree in base.deps
  const promises = base.deps.map((d) =>
    KV.get<TemplateKVFormat>(`${KEY_BASE}.${id}.templates.${d}`, "json").then(
      (t) => (t === null ? "" : t.template)
    )
  );

  return Promise.all(promises).then((templates) => {
    // TODO figure out how to make TS happy that we're *going* to make this object the correct type
    // @ts-ignore
    const templatesObj: TemplatesObj = {
      [baseName]: base.template,
    };
    base.deps.forEach((key, idx) => {
      templatesObj[key] = templates[idx] || "";
    });
    return templatesObj;
  });
}
