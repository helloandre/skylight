import { getSession } from "~/lib/sessions";
import { hash, sha256, verify, randomHex } from "~/lib/crypto.server";
import { env } from "./env.server";

const USERS_BASE = "v1.users";
const USERS_LIST = `${USERS_BASE}.list`;

type Role = "admin" | "author";

export type User = {
  id: string;
  email: string;
  role: Role;
  name: string;
  profile_image: null | string;
  bio: null | string;
  website: null | string;
  location?: string;
  facebook?: string;
  twitter?: string;
  cover_image?: string;
  visibility?: "public";
  locale?: string;
  meta_title?: string;
  meta_description?: string;
  signup_code?: string;
  status: "active" | "inactive";
};

type UserObject = {
  password: string;
  user: User;
};

type LoginParams = {
  email: string;
  password: string;
};
type CreateParams = {
  email: string;
  password: string;
  role: Role;
  name: string;
  withSignup?: boolean;
};
type SignupParams = {
  email: string;
  password: string;
  name: string;
  code: string;
};

type GetParams = {
  id?: string;
  email?: string;
  signup_code?: string;
};
type ListParams = {
  limit: number;
  offset: number;
};

export async function getFromSession(request: Request) {
  const session = await getSession(request);

  if (!session.has("id")) {
    return null;
  }

  return getUser({ id: session.get("id") });
}

export async function login({ email, password }: LoginParams) {
  const uo = await getUserObject({ email });
  return uo &&
    uo.user.status === "active" &&
    (await verify(uo?.password, password))
    ? uo.user
    : null;
}

export async function create({
  email,
  password,
  role,
  name,
  withSignup = true,
}: CreateParams) {
  if (await getUserObject({ email })) {
    return null;
  }

  const user: UserObject = {
    password: await hash(password),
    user: {
      id: randomHex(20),
      email,
      role,
      name,
      bio: null,
      website: null,
      profile_image: null,
      status: "active",
    },
  };

  if (withSignup) {
    user.user.signup_code = randomHex(40);
  }

  const KV = env("KV");
  await KV.put(`${USERS_BASE}.user.${user.user.id}`, JSON.stringify(user));
  const emailHash = await sha256(user.user.email);
  await KV.put(`${USERS_BASE}.email_to_id.${emailHash}`, user.user.id);
  if (user.user.signup_code) {
    await KV.put(
      `${USERS_BASE}.signup_code_to_id.${user.user.signup_code}`,
      user.user.id
    );
  }

  const existing =
    (await env("KV").get<User["id"][]>(USERS_LIST, "json")) || [];
  await KV.put(USERS_LIST, JSON.stringify(existing.concat(user.user.id)));

  return user.user;
}

export async function signup({ email, name, code, password }: SignupParams) {
  const exists = await getUserObject({ email });
  if (exists) {
    return null;
  }

  let user = await getUserObject({ signup_code: code });
  if (!user) {
    return null;
  }

  user = {
    password: await hash(password),
    user: {
      ...user.user,
      email,
      name,
    },
  };
  delete user.user.signup_code;

  const KV = env("KV");
  await KV.put(`${USERS_BASE}.user.${user.user.id}`, JSON.stringify(user));
  const emailHash = await sha256(user.user.email);
  await KV.put(`${USERS_BASE}.email_to_id.${emailHash}`, user.user.id);
  await KV.delete(`${USERS_BASE}.signup_code_to_id.${code}`);

  return user.user;
}

export async function setStatus(id: string, status: User["status"]) {
  const user = await getUserObject({ id });
  if (user) {
    user.user.status = status;
    await env("KV").put(`${USERS_BASE}.user.${id}`, JSON.stringify(user));
  }
}

async function getUserObject({ id, email, signup_code }: GetParams) {
  const KV = env("KV");
  if (email) {
    const emailHash = await sha256(email);
    id = (await KV.get(`${USERS_BASE}.email_to_id.${emailHash}`)) || undefined;
  }
  if (signup_code) {
    id =
      (await KV.get(`${USERS_BASE}.signup_code_to_id.${signup_code}`)) ||
      undefined;
  }
  if (!id) {
    return null;
  }

  const uo = await KV.get<UserObject | null>(
    `${USERS_BASE}.user.${id}`,
    "json"
  );

  return uo ? uo : null;
}

export async function getUser(args: GetParams) {
  const uo = await getUserObject(args);
  return uo ? uo.user : null;
}

export async function list({
  limit,
  offset,
}: ListParams): Promise<{ total: number; results: User[] }> {
  const ids = (await env("KV").get<User["id"][]>(USERS_LIST, "json")) || [];
  return {
    total: ids.length,
    results: await Promise.all(
      ids
        .slice(offset * limit, (offset + 1) * limit)
        .map((id) => getUser({ id }))
    ).then((users) => users.filter((u) => !!u && !u.signup_code) as User[]),
  };
}
