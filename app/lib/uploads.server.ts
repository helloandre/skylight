import { env } from "./env.server";
import { filenameToUrl } from "./urls.server";

export async function save(file: File) {
  if (!file) {
    return null;
  }

  const filename = filenameToUrl(file.name);
  await env("UPLOADS").put(filename, file.stream());
  return filename;
}

export async function get(filename: string) {
  return env("UPLOADS").get(filename);
}
