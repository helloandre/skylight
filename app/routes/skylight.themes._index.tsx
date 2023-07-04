import type { ActionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { adminActionWrap } from "~/lib/action";
import { adminLoaderWrap } from "~/lib/loader";
import type { ThemeObj } from "~/lib/themes.server";
import {
  list,
  active,
  activate as activateTheme,
  save,
} from "~/lib/themes.server";

const REQUIRED_PROPS: (keyof ThemeObj)[] = [
  "name",
  "templates",
  "assets",
  "partials",
];

export const action = adminActionWrap(async ({ request }: ActionArgs) => {
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
    await save(theme);
    if (activate) {
      await activateTheme(theme.name);
    }
    return new Response("OK");
  } catch (e: any) {
    return json({ message: e.toString() }, 500);
  }
});

export const loader = adminLoaderWrap(async () => {
  return json({ themes: await list(), active: await active() });
});

export default function SkylightThemes() {
  const { themes, active }: { themes: string[]; active: string } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-2xl">Themes</h1>

      <div className="py-5">
        {themes ? (
          <ul>
            {themes.map((theme) => (
              <li key={theme} className={`${active ? "active" : ""}`}>
                <Link to={`/skylight/themes/${theme}/settings`}>{theme}</Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
