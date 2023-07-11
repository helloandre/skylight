import { json } from "@remix-run/cloudflare";
import { adminActionWrap } from "~/lib/action";
import { activate, list, del } from "~/lib/themes.server";

export const action = adminActionWrap(async ({ request, params }) => {
  const themes = await list();
  if (!params.id || !themes.find((t) => t.id === params.id)) {
    return json({ message: "unknown theme" }, { status: 400 });
  }

  if (request.method === "PUT") {
    await activate(params.id);
    return json({});
  }

  if (request.method === "DELETE") {
    const result = await del(params.id);
    return result
      ? json({})
      : json({ message: "cannot delete active theme" }, { status: 400 });
  }

  return json({ message: "Method not allowed" }, { status: 405 });
});
