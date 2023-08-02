import type { ActionArgs, ActionFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import * as configServer from "./config.server";
import { getFromSession } from "./users.server";

type WrapperOptions = {
  json?: boolean;
  allowedMethods?: string[];
};

export function userActionWrap(fn: ActionFunction, options?: WrapperOptions) {
  return async function actionWrapper(args: ActionArgs) {
    if (
      options?.allowedMethods &&
      !options?.allowedMethods?.includes(args.request.method)
    ) {
      return options?.json
        ? json({ message: "Method not allowed" }, { status: 405 })
        : new Response("Method not allowed", { status: 405 });
    }

    const installed = await configServer.config("ghost");
    if (!installed) {
      return redirect("/setup");
    }

    const user = await getFromSession(args.request);
    if (!user) {
      return redirect("/skylight/login");
    }
    args.context.user = user;

    return fn(args);
  };
}

export function adminActionWrap(fn: ActionFunction, options?: WrapperOptions) {
  return async function actionWrapper(args: ActionArgs) {
    if (
      options?.allowedMethods &&
      !options?.allowedMethods?.includes(args.request.method)
    ) {
      return options?.json
        ? json({ message: "Method not allowed" }, { status: 405 })
        : new Response("Method not allowed", { status: 405 });
    }

    const installed = await configServer.config("ghost");
    if (!installed) {
      return options?.json ? json({}, 401) : redirect("/setup");
    }

    const user = await getFromSession(args.request);
    if (!user || user.role !== "admin") {
      return options?.json ? json({}, 401) : redirect("/skylight/login");
    }
    args.context.user = user;

    return fn(args);
  };
}
