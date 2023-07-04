import { Outlet } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { config } from "../lib/config.server";
import { userLoaderWrap } from "~/lib/loader";
import Sidebar from "~/components/Sidebar";
import Navbar from "~/components/Navbar";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Skylight Dashboard" }];
};

export const loader = userLoaderWrap(async () => ({
  title: await config("site.title"),
}));

export default function Index() {
  return (
    <div className="container min-w-full">
      <div className="drawer lg:drawer-open">
        <input id="dash-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <Navbar />

          <div className="flex flex-col  items-center justify-center">
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
