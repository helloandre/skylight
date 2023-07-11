import { useActionData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { config } from "../lib/config.server";
import { create as createUser } from "~/lib/users.server";
import { getSession, setSessionUser } from "~/lib/sessions";
import { setupTheme, setupData } from "~/lib/setup/index.server";

type FormData = {
  siteTitle: string;
  siteUrl: string;
  name: string;
  email: string;
  password: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const siteTitle = formData.get("siteTitle") as string;
  const siteUrl = formData.get("siteUrl") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const values = { siteTitle, siteUrl, email };

  if (!siteTitle || !siteTitle.length) {
    return json({
      errors: { siteTitle: "Site Title must be non-empty" },
      values,
    });
  }
  if (!siteUrl || !siteUrl.length) {
    return json({
      errors: { siteUrl: "Site URL must be non-empty" },
      values,
    });
  }
  try {
    new URL(siteUrl);
  } catch (e) {
    return json({
      errors: {
        siteUrl: "Site URL must include the full domain name and protocol",
      },
      values,
    });
  }

  const user = await createUser({ email, password, role: "admin", name });
  if (!user) {
    return json({
      errors: {
        email: "Invalid email or password",
        password: "Invalid email or password",
      },
      values,
    });
  }

  await setupTheme({ url: siteUrl, title: siteTitle }, user);
  await setupData({ user });

  const session = await getSession(request);
  return redirect("/skylight", {
    headers: {
      "Set-Cookie": await setSessionUser(session, user.id),
    },
  });
};

export const loader: LoaderFunction = async () => {
  const installed = await config("ghost");
  return installed ? redirect("/") : null;
};

export default function Index() {
  const actionData = useActionData<{ errors?: FormData; values?: FormData }>();

  return (
    <div className="container mx-auto">
      <div className="bg-base-200 mx-auto lg:mt-24 md:w-full lg:w-1/2 card card-bordered card-normal shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-4xl">Welcome to Skylight 🌤️</h2>
          <div>
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
                  defaultValue={actionData?.values?.siteUrl ?? ""}
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
                  defaultValue={actionData?.values?.siteTitle ?? ""}
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
                  <span className="label-text font-bold">Admin Name</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    actionData?.errors?.name ? "input-error" : ""
                  }`}
                  name="name"
                  defaultValue={actionData?.values?.name ?? ""}
                />
                <label className="label">
                  {actionData?.errors?.name ? (
                    <span className="label-text-alt text-error">
                      {actionData?.errors?.name}
                    </span>
                  ) : (
                    ""
                  )}
                </label>

                <label className="label">
                  <span className="label-text font-bold">Admin Email</span>
                </label>
                <input
                  type="email"
                  className={`input input-bordered w-full ${
                    actionData?.errors?.email ? "input-error" : ""
                  }`}
                  name="email"
                  defaultValue={actionData?.values?.email ?? ""}
                />
                <label className="label">
                  {actionData?.errors?.email ? (
                    <span className="label-text-alt text-error">
                      {actionData?.errors?.email}
                    </span>
                  ) : (
                    ""
                  )}
                </label>

                <label className="label">
                  <span className="label-text font-bold">Admin Password</span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered w-full ${
                    actionData?.errors?.password ? "input-error" : ""
                  }`}
                  name="password"
                />
                <label className="label">
                  {actionData?.errors?.password ? (
                    <span className="label-text-alt text-error">
                      {actionData?.errors?.password}
                    </span>
                  ) : (
                    ""
                  )}
                </label>
              </div>
              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary">
                  Install
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
