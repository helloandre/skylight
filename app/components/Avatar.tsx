import { type User } from "~/lib/users.server";

export default function Avatar({ user }: { user: User }) {
  return user.profile_image ? (
    <div className="mx-3 avatar">
      <div className="w-10 rounded-full">
        <img src={user.profile_image} alt={user.name} />
      </div>
    </div>
  ) : (
    <div className="mx-3 avatar placeholder">
      <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
        <span>
          {user.name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toLocaleUpperCase()}
        </span>
      </div>
    </div>
  );
}
