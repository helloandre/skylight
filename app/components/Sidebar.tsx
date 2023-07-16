import { useMatches } from "@remix-run/react";

export default function Sidebar() {
  const matches = useMatches();
  const { title } = matches[1].data; // root/skylight
  const sidebars = matches.filter((m) => m.handle?.sidebar);

  return (
    <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
      <li className="pb-5">
        <a href="/skylight">
          <span className="text-2xl">
            {title} <small className="text-xs">by Skylight 🌤️</small>
          </span>
        </a>
      </li>
      {sidebars.length > 0 &&
        sidebars.map((match, idx1) =>
          match.handle
            ?.sidebar(match)
            .map((s: any, idx2: number) => <li key={idx1 + idx2}>{s}</li>)
        )}
    </ul>
  );
}
