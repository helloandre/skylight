import { json } from "@remix-run/cloudflare";
import { adminActionWrap } from "~/lib/action";
import { create } from "~/lib/themes.server";
import type { ThemeUploadObj } from "~/lib/themes.server";
import JSZIP from "jszip";
import { randomHex } from "~/lib/crypto.server";
import { now } from "~/lib/time";
import type { User } from "~/lib/users.server";

const REQUIRED_PROPS: (keyof ThemeUploadObj)[] = [
  "name",
  "config",
  "templates",
  "assets",
  "partials",
];

export const action = adminActionWrap(
  async ({ request, context }) => {
    let zip: JSZIP;
    try {
      zip = await JSZIP.loadAsync(request.arrayBuffer());
    } catch {
      return json({ message: "invalid zip" }, { status: 400 });
    }
    const theme: ThemeUploadObj = {
      // @ts-ignore
      templates: {},
      partials: {},
      assets: {},
    };

    for (const rp of Object.keys(zip.files)) {
      const zfile = zip.files[rp];
      if (zfile.dir) {
        continue;
      }

      const partial = rp.includes("partials/");
      const asset = rp.includes("assets/");
      const name = rp
        .split("/")
        .slice(partial || asset ? 2 : 1)
        .join("/")
        .replace(/\.hbs$/, "");

      if (name === "package.json") {
        const pkg = JSON.parse(await zfile.async("string"));
        theme.name = pkg.name;
        theme.config = {
          asset_hash: randomHex(10),
          defaults: pkg.config,
        };
      } else {
        const idx = partial
          ? "partials"
          : asset
          ? "assets"
          : rp.endsWith(".hbs")
          ? "templates"
          : null;

        if (idx) {
          // @ts-ignore
          theme[idx][name] = await zfile.async("string");
        }
      }
    }

    for (const rp of REQUIRED_PROPS) {
      if (!theme[rp]) {
        return json({ message: `missing property: "${rp}"` }, { status: 400 });
      }
    }

    try {
      const id = await create(theme, context.user as User);
      return json({ id, name: theme.name, uploaded_at: now() });
    } catch (e) {
      console.log(e);
      return json({ message: "unknown error" }, { status: 500 });
    }
  },
  { allowedMethods: ["POST"] }
);
