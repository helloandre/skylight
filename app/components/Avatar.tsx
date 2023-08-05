import { type ReactElement } from "react";
import { type User } from "~/lib/users.server";

type AvatarSizes = "sm" | "md" | "lg";

const SIZE_WIDTHS: { [idx in AvatarSizes]: string } = {
  sm: "w-10",
  md: "w-16",
  lg: "w-24",
};

export default function Avatar({
  user,
  indicator,
  size = "sm",
}: {
  user: User;
  indicator?: ReactElement;
  size: AvatarSizes;
}) {
  return user.profile_image ? (
    <div className={`mx-3 avatar${indicator ? " indicator" : ""}`}>
      {indicator}
      <div className={`${SIZE_WIDTHS[size]} rounded-full`}>
        <img src={user.profile_image} alt={user.name} />
      </div>
    </div>
  ) : (
    <div className={`mx-3 avatar placeholder${indicator ? " indicator" : ""}`}>
      {indicator}
      <div
        className={`${SIZE_WIDTHS[size]} bg-neutral-focus text-neutral-content rounded-full`}
      >
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
