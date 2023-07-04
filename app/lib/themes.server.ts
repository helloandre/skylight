import { env } from "./env.server";
import type {
  ThemeConfiguration,
  SiteConfiguration,
  GhostConfiguration,
  TemplatesObj,
  PaginationSettings,
} from "skylight-theme-compat-ghost";
import ghostTheme from "skylight-theme-compat-ghost";
import type { SkylightConfiguration } from "./config.server";
import { config as getConfig } from "./config.server";
import type { Post } from "./posts.server";
import type { User } from "./users.server";

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

const KEY_BASE = "v1.themes";
const THEME_LIST = `${KEY_BASE}.list`;
const THEME_ACTIVE = `${KEY_BASE}.active`;

export type ThemeObj = {
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
};

export async function save({ name, assets, templates, partials }: ThemeObj) {
  const KV = env("KV") as KVNamespace;
  const themeBase = `${KEY_BASE}.${name}`;
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
        deps: buildDeps(templates[key]),
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

  return Promise.all(
    assetPromises
      .concat([templateIndexPromise, partialIndexPromise])
      .concat(templatePromises)
      .concat(partialPromises)
  ).then(() => {
    // final step is to update the list of available themes
    // but we *don't* activate it automatically
    return addTheme(name);
  });
}

export function list() {
  const KV = env("KV") as KVNamespace;
  return KV.get<string[]>(THEME_LIST, "json");
}

async function addTheme(theme: string) {
  const KV = env("KV") as KVNamespace;
  let existing = await list();
  existing = existing === null ? [] : existing.filter((i) => i !== theme);
  return KV.put(THEME_LIST, JSON.stringify(existing.concat(theme)));
}

function buildDeps(template: string) {
  return [];
}

export async function activate(name: string) {
  const KV = env("KV") as KVNamespace;
  await KV.put(THEME_ACTIVE, name);
}

export function active() {
  const KV = env("KV") as KVNamespace;
  return KV.get(THEME_ACTIVE);
}

/**
 * returns the custom config as defined in the package.json config.custom property
 * @see https://ghost.org/docs/themes/custom-settings/
 */
export async function config(): Promise<ThemeConfiguration | null> {
  const theme = await active();
  return (await getConfig(`themes.${theme}`)) as ThemeConfiguration;
}

export async function asset(path: string) {
  const name = await active();
  if (!name) {
    throw new Error(`no theme active`);
  }

  const KV = env("KV") as KVNamespace;
  return KV.get(`${KEY_BASE}.${name}.assets.${path}`);
}

/**
 * @TODO optimize this by building a depedencies array
 * so we can only load the templates we need based on the entry template
 */
async function _partials(name: string) {
  const KV = env("KV") as KVNamespace;
  const keys = await KV.get<string[]>(
    `${KEY_BASE}.${name}.partialsIdx`,
    "json"
  );
  if (!keys) {
    return {};
  }
  const promises = keys.map((key) =>
    KV.get(`${KEY_BASE}.${name}.partials.${key}`)
  );

  return Promise.all(promises).then((partials) => {
    const partialsObj: { [idx: string]: string } = {};
    keys.forEach((key, idx) => {
      partialsObj[key] = partials[idx] || "";
    });
    return partialsObj;
  });
}

/**
 * @TODO optimize this by building a depedencies array
 * so we can only load the templates we need based on the entry template
 */
async function _templates(themeName: string) {
  const KV = env("KV") as KVNamespace;
  const keys = await KV.get<string[]>(
    `${KEY_BASE}.${themeName}.templatesIdx`,
    "json"
  );
  if (!keys) {
    throw new Error(`theme ${themeName} does not exist`);
  }
  const promises = keys.map((key) =>
    KV.get<TemplateKVFormat>(
      `${KEY_BASE}.${themeName}.templates.${key}`,
      "json"
    ).then((t) => (t === null ? "" : t.template))
  );

  return Promise.all(promises).then((templates) => {
    // TODO figure out how to make TS happy that we're *going* to make this object the correct type
    // @ts-ignore
    const templatesObj: TemplatesObj = {};
    keys.forEach((key, idx) => {
      templatesObj[key] = templates[idx] || "";
    });
    return templatesObj;
  });
}

export async function template(
  template: string,
  context: TemplateContextParam
) {
  const name = await active();
  if (!name) {
    throw new Error("theme not set");
  }

  const globalConfig = (await getConfig()) as SkylightConfiguration;
  // you shouldn't be able to even get here without getting to /setup first
  // but anyway
  if (!globalConfig) {
    throw new Error(`theme ${name} does not exist`);
  }

  return ghostTheme
    .withTemplates(await _templates(name))
    .withPartials(await _partials(name))
    .withConfig(
      globalConfig.ghost as GhostConfiguration,
      globalConfig.site as SiteConfiguration,
      globalConfig.themes[name] as ThemeConfiguration
    )
    .render(template, {
      ...context,
      navigation: globalConfig.site.navigation || [],
      secondary_navigation: globalConfig.site.secondary_navigation || [],
    });
}
