import { useMatches } from "@remix-run/react";
import { type User } from "~/lib/users.server";
import Avatar from "./Avatar";

export default function Navbar() {
  const matches = useMatches();
  const { loggedInUser }: { loggedInUser: User } = matches[1].data;
  const navbars = matches.filter((m) => m.handle?.navbar);
  return (
    <div className="w-full navbar bg-base-300">
      <div className="flex-1 lg:hidden">
        <label htmlFor="dash-drawer" className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-6 h-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div className="flex-1 hidden lg:block">
        <ul className="ps-5 flex flex-row">
          {navbars.map((m, idx) =>
            m.handle?.navbar(m.data).map((im: any, iidx: number) => (
              <li
                key={idx + iidx}
                className="content-center inline-flex flex-wrap"
              >
                {im}
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="flex-none">
        <a href={`/skylight/users/edit/${loggedInUser.id}`}>
          <Avatar user={loggedInUser} />
        </a>
      </div>
    </div>
  );
}
