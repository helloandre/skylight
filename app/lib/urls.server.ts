import { DateTime } from "luxon";
import { config } from "./config.server";
import { randomHex } from "./crypto.server";

export async function admin(path: string, absolute = true) {
  const { url } = await config("ghost");
  return `${absolute ? url.replace(/\/$/, "") : ""}/skylight/${path.replace(
    /^\/?skylight\/?|\/?/,
    ""
  )}`;
}

export function filenameToUrl(filename: string) {
  const now = DateTime.utc();
  const salt = randomHex(5);
  return `${now.toFormat("y/MM")}/${salt}/${filename}`;
}
