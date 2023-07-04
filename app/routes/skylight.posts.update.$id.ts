import type { ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import type { Post } from "~/lib/posts.server";
import { publish, save, unpublish, draft } from "~/lib/posts.server";
import { getFromSession } from "~/lib/users.server";

type UpdateAction = "save" | "publish" | "unpublish";

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getFromSession(request);
  if (!user) {
    return json({ errors: { form: "invalid user" } });
  }
  if (!params.id) {
    return json({ errors: { form: "unknown post" } });
  }
  const exists = await draft(params.id);
  if (!exists) {
    return json({ errors: { form: "unknown post" } });
  }

  const form = await request.formData();
  const action = form.get("action") as UpdateAction;
  form.delete("action");

  const post: any = {
    id: params.id,
  };
  for (const [key, val] of form.entries()) {
    post[key] = val;
  }

  post.plaintext = "";

  switch (action) {
    case "save":
      await save(post as Post, user);
      return json({});
    case "publish":
      await publish(post as Post, user);
      return json({});
    case "unpublish":
      await unpublish(post as Post, user);
      return json({});
    default:
      return json({ errors: { form: "invalid action" } });
  }
};
