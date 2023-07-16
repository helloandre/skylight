import { useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import { config as getConfig, save as saveConfig } from "../lib/config.server";
import { adminLoaderWrap } from "~/lib/loader";
import { adminActionWrap } from "~/lib/action";

export const handle = {
  navbar: () => [
    <h1 key="title" className="text-2xl">
      Skylight Settings
    </h1>,
  ],
};

export const action = adminActionWrap(
  async ({ request }) => {
    const formData = await request.formData();
    const siteTitle = formData.get("siteTitle") as string;
    const siteDescription = formData.get("siteDescription") as string;
    const config = await getConfig();

    const newConfig = {
      site: {
        ...config.site,
        description: siteDescription,
        title: siteTitle,
      },
      ghost: {
        ...config.ghost,
      },
    };
    await saveConfig(newConfig);

    return json({ actionData: newConfig, actionErrors: {} });
  },
  { json: true }
);

export const loader = adminLoaderWrap(async () => {
  return json(await getConfig());
});

export default function Index() {
  const { actionData } = useActionData<typeof action>() || {};
  const loaderData = useLoaderData<typeof loader>();
  const values = actionData || loaderData;

  const defaultValues = {
    siteTitle: values.site.title,
    siteDescription: values.site.title,
  };

  return (
    <form method="post">
      <div className="form-control my-5">
        <label className="label">
          <span className="label-text font-bold">Site URL</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          name="siteUrl"
          defaultValue={loaderData.ghost.url}
          disabled
        />

        <label className="label">
          <span className="label-text font-bold">Site Title</span>
        </label>
        <input
          type="text"
          className={`input input-bordered w-full ${
            actionData?.errors?.siteTitle ? "input-error" : ""
          }`}
          name="siteTitle"
          defaultValue={defaultValues.siteTitle}
        />
        <label className="label">
          {actionData?.errors?.siteTitle ? (
            <span className="label-text-alt text-error">
              {actionData?.errors?.siteTitle}
            </span>
          ) : (
            ""
          )}
        </label>

        <label className="label">
          <span className="label-text font-bold">Description</span>
        </label>
        <input
          type="text"
          className={`input input-bordered w-full ${
            actionData?.errors?.siteDescription ? "input-error" : ""
          }`}
          name="siteDescription"
          defaultValue={defaultValues.siteDescription}
        />
        <label className="label">
          {actionData?.errors?.siteDescription ? (
            <span className="label-text-alt text-error">
              {actionData?.errors?.siteDescription}
            </span>
          ) : (
            ""
          )}
        </label>
      </div>
      <div className="card-actions justify-end">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
