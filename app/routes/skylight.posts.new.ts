import { redirect, type LoaderFunction } from "@remix-run/cloudflare";
import { userLoaderWrap } from "~/lib/loader";
import { getFromSession } from "~/lib/users.server";
import { create } from "~/lib/posts.server";

export const loader: LoaderFunction = userLoaderWrap(async ({ request }) => {
  const user = await getFromSession(request);

  if (!user) {
    return redirect("/skylight/login");
  }

  const id = await create(user);
  return redirect(`/skylight/posts/edit/${id}`);
});
