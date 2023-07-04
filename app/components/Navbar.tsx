import { useMatches } from "@remix-run/react";

export default function Navbar() {
  const matches = useMatches();
  const navbars = matches.filter((m) => m.handle?.navbar);
  return (
    <div className="w-full navbar bg-base-300">
      <div className="flex-none lg:hidden">
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
      <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal">
          {navbars.map((m) => m.handle?.navbar(m.data))}
        </ul>
      </div>
    </div>
  );
}
