import type { LoaderArgs } from "@remix-run/cloudflare";
import { asset } from "~/lib/themes.server";

function contentType(name: string) {
  const matches = name.match(/\.[^?]+/);
  if (!matches) {
    return "text/html";
  }

  switch (matches[0]) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    default:
      return "text/html";
  }
}

export const loader = async ({ params }: LoaderArgs) => {
  const name = params["*"] || "";
  const file = await asset(name);

  return file === null
    ? new Response("", { status: 404 })
    : new Response(file, { headers: { "Content-Type": contentType(name) } });
};
