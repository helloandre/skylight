import { json, redirect } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import { userLoaderWrap } from "~/lib/loader";
import Uploader from "~/components/Uploader";
import type { ImageListType } from "react-images-uploading";
import {
  login,
  savePassword,
  save as saveUser,
  type User,
} from "~/lib/users.server";
import Avatar from "~/components/Avatar";
import { useRef, useState } from "react";
import { userActionWrap } from "~/lib/action";
import { type Validity, field, validate } from "~/lib/validation";

type ActionData = { fields?: Validity[] };

export const handle = {
  navbar: () => [
    <span key="title" className="text-2xl me-3">
      Edit User
    </span>,
  ],
};

export const action = userActionWrap(
  async ({ context, request }) => {
    const user = context.user as User;
    const formData = await request.formData();
    const formtype = formData.get("formtype") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (formtype === "password") {
      const correctCurrentPassword = await login({
        email: user.email,
        password: currentPassword,
      });
      const fields = validate([
        {
          name: "currentPassword",
          validator: () => correctCurrentPassword !== null,
          value: "",
          message: "incorrect password",
        },
        {
          name: "newPassword",
          validator: "password",
          value: newPassword,
        },
        {
          name: "confirmPassword",
          validator: () => newPassword === confirmPassword,
          value: "",
          message: "passwords do not match",
        },
      ]);

      if (fields.every(({ valid }) => valid)) {
        await savePassword({ id: user.id, password: newPassword });
      }

      return json({ fields });
    } else if (formtype === "user") {
      const fields = validate([
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
      ]);

      if (fields.every(({ valid }) => valid)) {
        user.name = name;
        user.email = email;
        await saveUser(user);
      }

      return json({ fields });
    }

    return json({});
  },
  {
    allowedMethods: ["POST"],
    json: true,
  }
);

export const loader = userLoaderWrap(async ({ params, context }) => {
  const user = context.user as User;
  if (user?.role !== "admin" || user?.id !== params.id) {
    return redirect("/skylight/login");
  }

  return json({ user });
});

export default function SkylightThemes() {
  const { user } = useLoaderData<{ user: User }>();
  const { fields = [] } = (useActionData() || {}) as ActionData;
  const modal = useRef<HTMLDialogElement>(null);
  const [mutableUser, setMutableUser] = useState(user);
  const name = field(fields, "name");
  const email = field(fields, "email");
  const currentPassword = field(fields, "currentPassword");
  const newPassword = field(fields, "newPassword");
  const confirmPassword = field(fields, "confirmPassword");

  function handleUploadChange(images: ImageListType) {
    const image = images[0];
    if (!image.file) {
      console.log("no file");
      return;
    }

    // cheating because uploads don't work locally
    // TODO move to the .then block below
    if (image.dataUrl) {
      setMutableUser({ ...user, profile_image: image.dataUrl });
    }

    const fd = new FormData();
    fd.append("file", image.file, image.file.name);
    fetch("/content/uploads", {
      method: "POST",
      body: fd,
    })
      .then((r) => {
        modal?.current?.close();
      })
      .catch((e) => console.log("form error", e));
  }

  function openUploadDialog() {
    modal?.current?.showModal();
  }

  return (
    <div className="form-control my-5 flex-row">
      <div className="px-10">
        <form method="post">
          <input type="hidden" name="formtype" value="user" />
          <label className="label py-5">
            <span className="label-text font-bold">Name</span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full ${
              name && !name?.valid ? "input-error" : ""
            }`}
            name="name"
            defaultValue={user.name}
          />
          {name && !name.valid ? (
            <label className="label">
              <p className="text-xs text-error" role="alert" id="name-error">
                {name?.message}
              </p>
            </label>
          ) : null}

          <label className="label py-5">
            <span className="label-text font-bold">Email</span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full ${
              email && !email?.valid ? "input-error" : ""
            }`}
            name="email"
            defaultValue={user.email}
          />
          {email && !email.valid ? (
            <label className="label">
              <p className="text-xs text-error" role="alert" id="email-error">
                {email?.message}
              </p>
            </label>
          ) : null}

          <div className="py-5">
            <button className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>

      <div className="px-10">
        <form method="post">
          <input type="hidden" name="formtype" value="password" />
          <label className="label py-5">
            <span className="label-text font-bold">Current Password</span>
          </label>
          <input
            type="password"
            className={`input input-bordered w-full ${
              currentPassword && !currentPassword?.valid ? "input-error" : ""
            }`}
            name="current_password"
          />
          {currentPassword && !currentPassword.valid ? (
            <label className="label">
              <p className="text-xs text-error" role="alert" id="name-error">
                {currentPassword?.message}
              </p>
            </label>
          ) : null}

          <label className="label py-5">
            <span className="label-text font-bold">New Password</span>
          </label>
          <input
            type="password"
            className={`input input-bordered w-full ${
              newPassword && !newPassword?.valid ? "input-error" : ""
            }`}
            name="new_password"
          />
          {newPassword && !newPassword.valid ? (
            <label className="label">
              <p
                className="text-xs text-error"
                role="alert"
                id="newPassword-error"
              >
                {newPassword?.message}
              </p>
            </label>
          ) : null}

          <label className="label py-5">
            <span className="label-text font-bold">Confirm New Password</span>
          </label>
          <input
            type="password"
            className={`input input-bordered w-full ${
              confirmPassword && !confirmPassword?.valid ? "input-error" : ""
            }`}
            name="confirm_password"
          />
          {confirmPassword && !confirmPassword.valid ? (
            <label className="label">
              <p
                className="text-xs text-error"
                role="alert"
                id="confirmPassword-error"
              >
                {confirmPassword?.message}
              </p>
            </label>
          ) : null}

          <div className="py-5">
            <button className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>

      <div className="px-10">
        <label className="label py-5">
          <span className="label-text font-bold">Profile Picture</span>
        </label>
        <Avatar
          user={mutableUser}
          size="lg"
          indicator={
            <span
              className="indicator-item btn btn-xs btn-ghost no-animation"
              onClick={openUploadDialog}
            >
              edit
            </span>
          }
        />
      </div>

      <dialog ref={modal} className="modal">
        <form method="dialog" className="modal-box">
          <Uploader onChange={handleUploadChange} />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
