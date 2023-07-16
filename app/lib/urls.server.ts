import { config } from "./config.server";

export async function admin(path: string, absolute = true) {
  const { url } = await config("ghost");
  return `${absolute ? url.replace(/\/$/, "") : ""}/skylight/${path.replace(
    /^\/?skylight\/?|\/?/,
    ""
  )}`;
}
