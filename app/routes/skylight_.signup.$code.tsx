import type { ActionFunction } from "@remix-run/cloudflare";
import { redirect, json } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import { getUser, signup } from "~/lib/users.server";
import { getSession, setSessionUser } from "~/lib/sessions";
import type { Validity } from "~/lib/validation";
import { validate } from "~/lib/validation";
import { loaderWrap } from "~/lib/loader";

type ActionData = {
  formError?: string;
  fields?: Validity[];
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);
  const form = await request.formData();
  const password = form.get("password") as string;
  const email = form.get("email") as string;
  const code = form.get("code") as string;
  const name = form.get("name") as string;

  if (!code) {
    return json({ formError: "Invalid Signup Code" });
  }

  const exists = await getUser({ email });
  const fields = validate([
    {
      name: "name",
      validator: "nonempty",
      value: name,
    },
    {
      name: "email",
      validators: ["email", () => !exists],
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

  const user = await signup({ email, code, name, password });
  if (!user) {
    return json({
      fields,
      formError: "Invalid Signup Code",
    });
  }

  return redirect("/skylight", {
    headers: {
      "Set-Cookie": await setSessionUser(session, user.id),
    },
  });
};

export const loader = loaderWrap(({ params }) => json({ code: params.code }));

export default function LoginSignup() {
  const actionData = useActionData<ActionData>();
  const { code } = useLoaderData<{ code: string }>();
  const field = (n: string) => actionData?.fields?.find((f) => f.name === n);
  const password = field("password");
  const email = field("email");
  const name = field("name");

  return (
    <div className="container mx-auto">
      <div className="bg-base-200 mx-auto lg:mt-24 md:w-full lg:w-1/2 card card-bordered card-normal shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-4xl">Signup to Skylight 🌤️</h2>
          <div>
            <form method="post">
              <input type="hidden" name="code" value={code} />
              <div className="form-control my-5">
                <label className="label">
                  <span className="label-text font-bold">Name</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    name && !name?.valid ? "input-error" : ""
                  }`}
                  defaultValue={name?.value ?? ""}
                  name="name"
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
                  <span className="label-text font-bold">Email</span>
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
                  <span className="label-text font-bold">Password</span>
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
                    <span className="label-text-alt text-error">
                      {password?.message}
                    </span>
                  ) : null}
                </label>
              </div>
              <div id="form-error-message">
                {actionData?.formError ? (
                  <p className="text-xs text-error" role="alert">
                    {actionData.formError}
                  </p>
                ) : null}
              </div>
              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
