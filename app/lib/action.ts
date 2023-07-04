import type { ActionArgs, ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import * as configServer from "./config.server";
import type { User } from "./users.server";
import { getFromSession } from "./users.server";

export function userActionWrap(fn: ActionFunction) {
  return async function actionWrapper(args: ActionArgs) {
    const installed = await configServer.config("ghost");
    if (!installed) {
      return redirect("/setup");
    }

    const user = await getFromSession(args.request);
    if (!user) {
      return redirect("/skylight/login");
    }

    return fn({ ...args, user } as ActionArgs & { user: User });
  };
}

export function adminActionWrap(fn: ActionFunction) {
  return async function actionWrapper(args: ActionArgs) {
    const installed = await configServer.config("ghost");
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
