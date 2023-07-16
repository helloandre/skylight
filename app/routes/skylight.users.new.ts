import { json } from "@remix-run/cloudflare";
import { adminActionWrap } from "~/lib/action";
import { randomHex } from "~/lib/crypto.server";
import { admin } from "~/lib/urls.server";
import { create } from "~/lib/users.server";

export const action = adminActionWrap(
  async ({ request }) => {
    if (request.method !== "POST") {
      return json({}, 405);
    }

    const user = await create({
      password: randomHex(20),
      email: "",
      role: "author",
      name: "",
    });

    return user?.signup_code === null
      ? json({}, 400)
      : json({
          link: await admin(`/signup/${user?.signup_code}`, true),
        });
  },
  { json: true }
);
