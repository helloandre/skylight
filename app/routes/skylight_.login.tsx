import type { ActionFunction } from "@remix-run/cloudflare";
import { redirect, json } from "@remix-run/cloudflare";
import { useActionData } from "@remix-run/react";
import { login } from "~/lib/users.server";
import { getSession, setSessionUser } from "~/lib/sessions";
import type { Validity } from "~/lib/validation";
import { validate, field } from "~/lib/validation";
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

  const fields = validate([
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

  const user = await login({ email, password });
  if (!user) {
    return json({
      fields,
      formError: "Username/Password combination is incorrect",
    });
  }
  if (user) {
    return redirect("/skylight", {
      headers: {
        "Set-Cookie": await setSessionUser(session, user.id),
      },
    });
  }

  return json({
    fields,
    formError: `an error occurred`,
  });
};

export const loader = loaderWrap(() => null);

export default function LoginSignup() {
  const { fields = [], formError } = (useActionData() || {}) as ActionData;
  const password = field(fields, "password");
  const email = field(fields, "email");

  return (
    <div className="container mx-auto">
      <div className="bg-base-200 mx-auto lg:mt-24 md:w-full lg:w-1/2 card card-bordered card-normal shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-4xl">Login to Skylight 🌤️</h2>
          <div>
            <form method="post">
              <div className="form-control my-5">
                <label className="label">
                  <span className="label-text font-bold">Email</span>
                </label>
                <input
                  type="email"
                  className={`input input-bordered w-full ${
                    email && !email.valid ? "input-error" : ""
                  }`}
                  defaultValue={email?.value ?? ""}
                  name="email"
                />
                <label className="label">
                  {email && !email.valid ? (
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
                {formError ? (
                  <p className="text-xs text-error" role="alert">
                    {formError}
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
