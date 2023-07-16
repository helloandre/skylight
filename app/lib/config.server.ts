import { get, set } from "lodash-es";
import { env } from "./env.server";
import type {
  GhostConfiguration,
  SiteConfiguration,
  ThemeConfiguration,
} from "skylight-theme-compat-ghost";

const CONFIG_BASE = "v1.config";
let cache: null | Promise<any> = null;

export type SkylightConfiguration = {
  ghost: GhostConfiguration;
  site: SiteConfiguration;
  themes: {
    [idx: string]: ThemeConfiguration;
  };
};

export function config(path?: "ghost"): Promise<GhostConfiguration>;
export function config(path?: "site"): Promise<SiteConfiguration>;
export function config(path?: "theme"): Promise<ThemeConfiguration>;
export function config(path?: undefined): Promise<SkylightConfiguration>;
export function config(path?: string) {
  if (cache === null) {
    const KV = env("KV");
    cache = KV.get<SkylightConfiguration>(CONFIG_BASE, "json");
  }

  return cache.then((c) => (path === undefined ? c : get(c, path)));
}

/**
 * WARNING: if you do not provide a second parameter
 *          it will completely overwrite the config
 */
export function save(path: string | any, value?: any) {
  const KV = env("KV");
  return config()
    .then((c) =>
      KV.put(
        CONFIG_BASE,
        JSON.stringify(value === undefined ? path : set(c, path, value))
      )
    )
    .then(() => {
      cache = null;
    });
}
