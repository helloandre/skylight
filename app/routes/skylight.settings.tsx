import { useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import type { SkylightConfiguration } from "../lib/config.server";
import { config as getConfig, save as saveConfig } from "../lib/config.server";
import { userLoaderWrap } from "~/lib/loader";
import { userActionWrap } from "~/lib/action";

type FormData = {
  siteTitle: string;
  siteUrl: string;
  siteDescription: string;
};

export const action = userActionWrap(async ({ request }) => {
  const formData = await request.formData();
  const siteTitle = formData.get("siteTitle") as string;
  const siteUrl = formData.get("siteUrl") as string;
  const siteDescription = formData.get("siteDescription") as string;
  const config = (await getConfig()) as SkylightConfiguration;

  await saveConfig({
    site: {
      ...config.site,
      description: siteDescription,
      title: siteTitle,
    },
    ghost: {
      ...config.ghost,
      url: siteUrl,
    },
  });
});

export const loader = userLoaderWrap(async () => {
  return json((await getConfig()) as SkylightConfiguration);
});

export default function Index() {
  const actionData = useActionData<{ errors?: FormData; values?: FormData }>();
  const loaderData = useLoaderData<typeof loader>();

  const defaultValues = {
    siteUrl: actionData ? actionData.values?.siteUrl : loaderData.ghost.url,
    siteTitle: actionData
      ? actionData.values?.siteTitle
      : loaderData.site.title,
    siteDescription: actionData
      ? actionData.values?.siteDescription
      : loaderData.site.title,
  };

  return (
    <form method="post">
      <div className="form-control my-5">
        <label className="label">
          <span className="label-text font-bold">Site URL</span>
        </label>
        <input
          type="text"
          className={`input input-bordered w-full ${
            actionData?.errors?.siteUrl ? "input-error" : ""
          }`}
          name="siteUrl"
          defaultValue={defaultValues.siteUrl}
        />
        <label className="label">
          {actionData?.errors?.siteUrl ? (
            <span className="label-text-alt text-error">
              {actionData?.errors?.siteUrl}
            </span>
          ) : (
            ""
          )}
        </label>

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
