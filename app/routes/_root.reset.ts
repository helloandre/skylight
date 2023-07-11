import { redirect, type LoaderFunction } from "@remix-run/cloudflare";
import { env } from "~/lib/env.server";
import { save as saveConfig } from "~/lib/config.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { hostname } = new URL(request.url);

  // SeCuRiTy
  if (hostname !== "demo.skylight.rocks" && hostname !== "localhost") {
    return redirect("/");
  }

  // wipe all things
  const KV = env("KV") as KVNamespace;
  await KV.delete("v1.themes.active");
  await KV.delete("v1.themes.list");

  const users = await KV.list({ prefix: "v1.users", limit: 1000 });
  for (const key of users.keys) {
    await KV.delete(key.name);
  }
  const posts = await KV.list({ prefix: "v1.posts", limit: 1000 });
  for (const key of posts.keys) {
    await KV.delete(key.name);
  }

  await saveConfig({});
  return redirect("/setup");
};
