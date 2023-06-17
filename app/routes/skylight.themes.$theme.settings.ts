import type { ActionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import type { ThemeObj } from "~/lib/themes.server";
import * as themeLib from "~/lib/themes.server";

const REQUIRED_PROPS: (keyof ThemeObj)[] = [
  "name",
  "templates",
  "assets",
  "partials",
];

export const action = async ({ request }: ActionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, { status: 405 });
  }

  const { theme, activate }: { theme: ThemeObj; activate?: boolean } =
    await request.json();
  for (const prop of REQUIRED_PROPS) {
    if (!theme[prop]) {
      return json({ message: `missing ${prop} property` }, 400);
    }
  }

  try {
    await themeLib.save(theme);
    if (activate) {
      await themeLib.activate(theme.name);
    }
    return new Response("OK");
  } catch (e: any) {
    return json({ message: e.toString() }, 500);
  }
};
