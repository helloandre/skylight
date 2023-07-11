import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { adminLoaderWrap } from "~/lib/loader";
import type { ThemeListFormat } from "~/lib/themes.server";
import { list, active } from "~/lib/themes.server";

export const handle = {
  navbar: () => (
    <h1 key="title" className="text-2xl">
      Themes
    </h1>
  ),
};

export const loader = adminLoaderWrap(async () => {
  return json({ themes: await list(), active: await active() });
});

export default function SkylightThemes() {
  const { themes, active } = useLoaderData<{
    themes: ThemeListFormat;
    active: string;
  }>();
  const uploadRef = useRef<HTMLInputElement>(null);
  const [themesRef, setThemes] = useState<ThemeListFormat>(themes);
  const [activeRef, setActive] = useState<string>(active);

  async function upload() {
    const file = uploadRef.current?.files ? uploadRef.current.files[0] : null;

    if (!file || !file?.name.endsWith(".zip")) {
      // TODO toast
      console.log("not a zip");
      return;
    }

    if (file) {
      fetch(`/skylight/themes/new`, {
        method: "POST",
        body: file,
      }).then(async (resp) => {
        const { id, name, uploaded_at } = await resp.json<{
          id?: string;
          name: string;
          uploaded_at: string;
        }>();
        if (id && name && uploaded_at) {
          setThemes(
            themesRef.concat({ id, name, uploaded_at, uploaded_by: "" })
          );
        } else {
          console.log("error", await resp.json());
        }
      });
    }
  }

  function activate(id: string) {
    fetch(`/skylight/themes/${id}`, { method: "PUT" }).then(async (resp) => {
      if (resp.status === 200) {
        setActive(id);
      } else {
        console.log(await resp.json());
      }
    });
  }

  function del(id: string) {
    fetch(`/skylight/themes/${id}`, { method: "DELETE" }).then(async (resp) => {
      if (resp.status === 200) {
        setThemes(themesRef.filter((t: { id: string }) => t.id !== id));
      } else {
        // TODO toast
        console.log(await resp.json());
      }
    });
  }

  return (
    <div className="p-5 w-full">
      <div className="form-control">
        <input
          type="file"
          ref={uploadRef}
          className="file-input file-input-bordered max-w-xs"
        />
        <button onClick={upload} className="btn btn-primary max-w-sm">
          Upload
        </button>
      </div>

      <div className="py-5">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Uploaded At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {themesRef.map(({ id, name, uploaded_at }) => (
              <tr key={id} className="hover">
                <td>{name}</td>
                <td>{DateTime.fromISO(uploaded_at).toFormat("ff")}</td>
                <td>
                  {activeRef !== id && (
                    <button
                      onClick={() => activate(id)}
                      className="btn btn-success btn-outline btn-xs me-3"
                    >
                      activate
                    </button>
                  )}
                  {activeRef !== id && (
                    <button
                      onClick={() => del(id)}
                      className="btn btn-error btn-outline btn-xs me-3"
                    >
                      delete
                    </button>
                  )}
                  <a href={`/skylight/themes/${id}/settings`}>
                    <button className="btn btn-secondary btn-outline btn-xs me-3">
                      edit
                    </button>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
