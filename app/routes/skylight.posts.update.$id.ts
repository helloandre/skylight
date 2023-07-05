import type { ActionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import type { Post } from "~/lib/posts.server";
import { publish, save, unpublish, draft } from "~/lib/posts.server";
import { getFromSession } from "~/lib/users.server";

type UpdateAction = "save" | "publish" | "unpublish";

export async function action({ request, params }: ActionArgs) {
  const user = await getFromSession(request);
  const form = await request.formData();
  const action = form.get("action") as UpdateAction;
  form.delete("action");

  if (!user) {
    return json({
      errors: [{ name: "form", valid: false, message: "invalid user" }],
    });
  }
  if (!params.id) {
    return json({
      errors: [{ name: "form", valid: false, message: "unknown post" }],
    });
  }
  const exists = await draft(params.id);
  if (!exists) {
    return json({
      errors: [{ name: "form", valid: false, message: "unknown post" }],
    });
  }

  const post: Post = {
    ...exists,
    // TODO plaintext
    plaintext: "",
  };
  for (const [key, val] of form.entries()) {
    // @ts-ignore
    post[key] = val;
  }

  switch (action) {
    case "save":
      await save(post as Post, user);
      return json({});
    case "publish":
      const errors = await publish(post as Post, user);
      return json({ errors });
    case "unpublish":
      await unpublish(post as Post, user);
      return json({});
    default:
      return json({
        errors: [{ name: "form", valid: false, message: "invalid action" }],
      });
  }
}
