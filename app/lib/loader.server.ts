import type { LoaderArgs, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { config } from "../lib/config.server";
import { getFromSession } from "./users.server";

export function loaderWrap(fn: LoaderFunction) {
  return async function loaderWrapper(args: LoaderArgs) {
    const installed = await config("ghost");
    if (!installed) {
      return redirect("/setup");
    }

    return fn(args);
  };
}

export function userLoaderWrap(fn: LoaderFunction) {
  return async function loaderWrapper(args: LoaderArgs) {
    const installed = await config("ghost");
    if (!installed) {
      return redirect("/setup");
    }

    const user = await getFromSession(args.request);
    if (!user) {
      return redirect("/skylight/login");
    }

    return fn(args);
  };
}

export function adminLoaderWrap(fn: LoaderFunction) {
  return async function loaderWrapper(args: LoaderArgs) {
    const installed = await config("ghost");
    if (!installed) {
      return redirect("/setup");
    }

    const user = await getFromSession(args.request);
    if (!user || user.role !== "admin") {
      return redirect("/skylight/login");
    }

    return fn(args);
  };
}
