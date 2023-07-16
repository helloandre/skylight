import { useLoaderData } from "@remix-run/react";
import { list } from "~/lib/users.server";
import type { User } from "~/lib/users.server";
import Avatar from "~/components/Avatar";
import { useState } from "react";
import { toast } from "~/lib/toast";
import { adminLoaderWrap } from "~/lib/loader";

type LoaderData = {
  users: {
    results: User[];
    total: number;
  };
};

export const loader = adminLoaderWrap(async () => {
  return {
    // TODO pageination of users
    users: await list({ offset: 0, limit: 10 }),
  };
});

export default function SkylightIndex() {
  const { users } = useLoaderData() as LoaderData;
  const [signupLink, setSignupLink] = useState<string | null>();
  const [stateUsers, setUsers] = useState<User[]>(users.results || []);

  function makeNewUser() {
    setSignupLink(null);
    fetch("/skylight/users/new", { method: "POST" })
      .then(async (res) => {
        const { link } = await res.json<{ link?: string }>();
        if (link) {
          setSignupLink(link);
        } else {
          toast("an error occurred", { type: "error" });
        }
      })
      .catch(() => {
        toast("an error occurred", { type: "error" });
      });
  }

  function copySignupLink() {
    if (navigator && signupLink) {
      navigator.clipboard.writeText(signupLink);
    }
  }

  function setStatus(id: string, status: User["status"]) {
    fetch(`/skylight/users/status/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }).then((resp) => {
      if (resp.ok) {
        setUsers(stateUsers.map((u) => (u.id === id ? { ...u, status } : u)));
      } else {
        toast("an error occurred", { type: "error" });
      }
    });
  }

  return (
    <div className="p-5 w-full">
      <div className="p-5">
        <span className="text-2xl me-3">Users</span>
        <span
          className="btn btn-xs btn-secondary btn-outline"
          onClick={makeNewUser}
        >
          invite
        </span>
        {signupLink && (
          <div className="my-3 alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Signup Link: {signupLink} </span>
            <span
              className="btn btn-sm btn-outline btn-neutral"
              onClick={copySignupLink}
            >
              <svg
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <path
                  strokeWidth="1.3"
                  d="M5.50280381,4.62704038 L5.5,6.75 L5.5,17.2542087 C5.5,19.0491342 6.95507456,20.5042087 8.75,20.5042087 L17.3662868,20.5044622 C17.057338,21.3782241 16.2239751,22.0042087 15.2444057,22.0042087 L8.75,22.0042087 C6.12664744,22.0042087 4,19.8775613 4,17.2542087 L4,6.75 C4,5.76928848 4.62744523,4.93512464 5.50280381,4.62704038 Z M17.75,2 C18.9926407,2 20,3.00735931 20,4.25 L20,17.25 C20,18.4926407 18.9926407,19.5 17.75,19.5 L8.75,19.5 C7.50735931,19.5 6.5,18.4926407 6.5,17.25 L6.5,4.25 C6.5,3.00735931 7.50735931,2 8.75,2 L17.75,2 Z M17.75,3.5 L8.75,3.5 C8.33578644,3.5 8,3.83578644 8,4.25 L8,17.25 C8,17.6642136 8.33578644,18 8.75,18 L17.75,18 C18.1642136,18 18.5,17.6642136 18.5,17.25 L18.5,4.25 C18.5,3.83578644 18.1642136,3.5 17.75,3.5 Z"
                ></path>
              </svg>
            </span>
          </div>
        )}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stateUsers.map((user) => (
            <tr key={user.id} className="hover">
              <td>
                <div className="container">
                  <Avatar user={user} />
                  <span className="text-lg">{user.name}</span>
                  {user.status !== "active" ? (
                    <span className="text-sm text-neutral-content ms-3">
                      inactive
                    </span>
                  ) : null}
                </div>
              </td>
              <td>{user.email}</td>
              <td>
                {/** TODO: dropdown selector to change */}
                {user.role}
              </td>
              <td>
                <a href={`/skylight/posts/by/${user.id}`} className="link">
                  View Posts
                </a>
                {user.status === "active" ? (
                  <span
                    className="btn btn-xs btn-outline btn-error ms-3"
                    onClick={() => setStatus(user.id, "inactive")}
                  >
                    deactivate
                  </span>
                ) : (
                  <span
                    className="btn btn-xs btn-outline btn-secondary ms-3"
                    onClick={() => setStatus(user.id, "active")}
                  >
                    reactivate
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
