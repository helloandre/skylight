import { json } from "@remix-run/cloudflare";
import { userActionWrap } from "~/lib/action";
import type { Post } from "~/lib/posts.server";
import { publish, unpublish, draft, published, save } from "~/lib/posts.server";
import { type User } from "~/lib/users.server";
import { validate } from "~/lib/validation";

type UpdateAction = "save" | "publish" | "unpublish";

export const action = userActionWrap(async ({ request, params, context }) => {
  const form = await request.formData();
  const action = form.get("action") as UpdateAction;
  form.delete("action");

  if (!params.id) {
    return json({
      fields: [{ name: "form", valid: false, message: "unknown post" }],
    });
  }
  const exists = await draft(params.id);
  if (!exists) {
    return json({
      fields: [{ name: "form", valid: false, message: "unknown post" }],
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

  const fields = validate([
    {
      name: "title",
      value: post.title,
      validator: "nonempty",
    },
    {
      name: "slug",
      value: post.slug,
      validator: "nonempty",
    },
    {
      name: "html",
      value: post.html,
      validator: "nonempty",
    },
  ]);

  if (!fields.every(({ valid }) => valid)) {
    return json({ fields }, 400);
  }

  switch (action) {
    case "save":
      await save(post as Post, context.user as User);
      return json({});
    case "publish":
      const exists = await published(post.slug);
      const publishFields = validate([
        {
          name: "slug",
          value: post.slug,
          validator: () => !!exists && exists.id === post.id,
          message: `post with slug ${post.slug} already exists`,
        },
      ]);
      if (!publishFields.every(({ valid }) => valid)) {
        return json({ fields }, 400);
      }

      await publish(post as Post, context.user as User);
      return json({});
    case "unpublish":
      await unpublish(post as Post, context.user as User);
      return json({});
    default:
      return json({
        fields: [{ name: "form", valid: false, message: "invalid action" }],
      });
  }
});
