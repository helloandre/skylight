import { useActionData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { config } from "../lib/config.server";
import { create as createUser } from "~/lib/users.server";
import { getSession, setSessionUser } from "~/lib/sessions";
import { setupTheme, setupData } from "~/lib/setup/index.server";
import { type Validity, validate, setValid, field } from "~/lib/validation";

type ActionData = { fields?: Validity[] };

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const fields = validate([
    {
      name: "title",
      validator: "nonempty",
      value: title,
    },
    {
      name: "url",
      validator: "fullurl",
      value: url,
    },
    {
      name: "name",
      validator: "nonempty",
      value: name,
    },
    {
      name: "email",
      validator: "email",
      value: email,
    },
    {
      name: "password",
      validator: "password",
      value: password,
    },
  ]);

  if (!fields.every(({ valid }) => valid)) {
    return json({ fields });
  }

  const user = await createUser({
    email,
    password,
    name,
    role: "admin",
    withSignup: false,
  });
  if (!user) {
    setValid(fields, {
      name: "email",
      valid: false,
      message: "Invalid email or password",
      value: email,
    });
    setValid(fields, {
      name: "password",
      valid: false,
      message: "Invalid email or password",
      value: password,
    });
    return json({ fields });
  }

  await setupTheme({ url, title }, user);
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
  const { fields = [] } = (useActionData() || {}) as ActionData;
  const url = field(fields, "url");
  const title = field(fields, "title");
  const name = field(fields, "name");
  const email = field(fields, "email");
  const password = field(fields, "password");

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
                    url && !url.valid ? "input-error" : ""
                  }`}
                  name="url"
                  defaultValue={url?.value ?? ""}
                />
                <label className="label">
                  {url && !url.valid ? (
                    <p
                      className="text-xs text-error"
                      role="alert"
                      id="url-error"
                    >
                      {url?.message}
                    </p>
                  ) : null}
                </label>

                <label className="label">
                  <span className="label-text font-bold">Site Title</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    title && !title?.valid ? "input-error" : ""
                  }`}
                  name="title"
                  defaultValue={title?.value ?? ""}
                />
                <label className="label">
                  {title && !title?.valid ? (
                    <p
                      className="text-xs text-error"
                      role="alert"
                      id="title-error"
                    >
                      {title?.message}
                    </p>
                  ) : null}
                </label>

                <label className="label">
                  <span className="label-text font-bold">Admin Name</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    name && !name?.valid ? "input-error" : ""
                  }`}
                  name="name"
                  defaultValue={name?.value ?? ""}
                />
                <label className="label">
                  {name && !name?.valid ? (
                    <p
                      className="text-xs text-error"
                      role="alert"
                      id="name-error"
                    >
                      {name?.message}
                    </p>
                  ) : null}
                </label>

                <label className="label">
                  <span className="label-text font-bold">Admin Email</span>
                </label>
                <input
                  type="email"
                  className={`input input-bordered w-full ${
                    email && !email?.valid ? "input-error" : ""
                  }`}
                  defaultValue={email?.value ?? ""}
                  name="email"
                />
                <label className="label">
                  {email && !email?.valid ? (
                    <p
                      className="text-xs text-error"
                      role="alert"
                      id="email-error"
                    >
                      {email?.message}
                    </p>
                  ) : null}
                </label>

                <label className="label">
                  <span className="label-text font-bold">Admin Password</span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered w-full ${
                    password && !password?.valid ? "input-error" : ""
                  }`}
                  name="password"
                />
                <label className="label">
                  {password && !password?.valid ? (
                    <p
                      className="text-xs text-error"
                      role="alert"
                      id="password-error"
                    >
                      {password?.message}
                    </p>
                  ) : null}
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
