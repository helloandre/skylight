import { redirect, type LoaderFunction } from "@remix-run/cloudflare";
import { env } from "~/lib/env.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { hostname } = new URL(request.url);

  // SeCuRiTy
  if (hostname !== "skylightdemo.pages.dev" && hostname !== "localhost") {
    return redirect("/");
  }

  // wipe all things
  const KV = env("KV") as KVNamespace;
  await KV.delete("v1.config");
  await KV.delete("v1.themes.active");
  await KV.delete("v1.themes.list");

  const users = await KV.list({ prefix: "v1.users.user", limit: 1000 });
  for (const key of users.keys) {
    await KV.delete(key.name);
  }

  return redirect("/setup");
};
