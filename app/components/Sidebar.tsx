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
      {sidebars.length ? (
        sidebars.map((match) =>
          match.handle
            ?.sidebar(match, matches)
            .map((s: any, idx: number) => <li key={idx}>{s}</li>)
        )
      ) : (
        <>
          <li>
            <a className="text-secondary" href="/skylight/posts/new">
              Create Post
            </a>
          </li>
          <li>
            <a href="/skylight/settings">Settings</a>
          </li>
          <li>
            <a href="/skylight/themes">Themes</a>
          </li>
        </>
      )}
    </ul>
  );
}
