import { Outlet } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { config } from "../lib/config.server";
import { userLoaderWrap } from "~/lib/loader";
import Sidebar from "~/components/Sidebar";
import Navbar from "~/components/Navbar";
import Toast from "~/components/Toast";

export const handle = {
  sidebar: () => [
    <a
      key="nav-create-post"
      className="text-secondary"
      href="/skylight/posts/new"
    >
      Create Post
    </a>,
    <a key="nav-settings" href="/skylight/settings">
      Settings
    </a>,
    <a key="nav-themes" href="/skylight/themes">
      Themes
    </a>,
    <a key="nav-users" href="/skylight/users">
      Users
    </a>,
  ],
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "Skylight Dashboard" }];
};

export const loader = userLoaderWrap(async () => ({
  title: (await config("site")).title,
}));

export default function Skylight() {
  return (
    <div className="container min-w-full">
      <div className="drawer lg:drawer-open">
        <input id="dash-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <Navbar />

          <div className="flex flex-col items-center justify-center">
            <Toast />
            <Outlet />
          </div>
        </div>

        <div className="drawer-side">
          <label htmlFor="dash-drawer" className="drawer-overlay"></label>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
