import { json } from "@remix-run/cloudflare";
import { adminActionWrap } from "~/lib/action";
import { setStatus, type User } from "~/lib/users.server";

export const action = adminActionWrap(
  async ({ request, params, context }) => {
    const { status } = await request.json<{ status?: User["status"] }>();
    if (!params.id || !status || params.id === (context.user as User).id) {
      return json({}, 400);
    }

    await setStatus(params.id, status);
    return json({});
  },
  { json: true, allowedMethods: ["PUT"] }
);
