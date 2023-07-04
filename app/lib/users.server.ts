import { getSession } from "~/lib/sessions";
import { hash, sha256, verify, randomHex } from "~/lib/crypto.server";
import { env } from "./env.server";

const USER_BASE = "v1.users";

type Role = "admin" | "author";

export type User = {
  id: string;
  email: string;
  role: Role;
  slug: string;
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
};

type GetParams = {
  id?: string;
  email?: string;
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
  return uo && (await verify(uo?.password, password)) ? uo.user : null;
}

export async function create({ email, password, role, name }: CreateParams) {
  if (!email.length || !password.length || (await getUserObject({ email }))) {
    return null;
  }

  const user: UserObject = {
    password: await hash(password),
    user: {
      id: randomHex(20),
      email,
      role,
      name,
      slug: name.toLowerCase().split(" ").pop() || name.toLowerCase(),
      bio: null,
      website: null,
      profile_image: null,
    },
  };

  const KV = env("KV") as KVNamespace;
  await KV.put(`${USER_BASE}.user.${user.user.id}`, JSON.stringify(user));
  const emailHash = await sha256(user.user.email);
  await KV.put(`${USER_BASE}.email_to_id.${emailHash}`, user.user.id);

  // await _db()
  //   .prepare(`INSERT INTO User(email,password,role) VALUES (?1,?2,?3)`)
  //   .bind(user.email, user.password, user.role)
  //   .run();

  return user.user;
}

async function getUserObject({ id, email }: GetParams) {
  const KV = env("KV") as KVNamespace;
  if (email) {
    const emailHash = await sha256(email);
    id = (await KV.get(`${USER_BASE}.email_to_id.${emailHash}`)) || undefined;
  }
  if (!id) {
    return null;
  }

  const uo = await KV.get<UserObject | null>(`${USER_BASE}.user.${id}`, "json");

  return uo ? uo : null;
}

export async function getUser(args: GetParams) {
  const uo = await getUserObject(args);
  return uo ? uo.user : null;
}
