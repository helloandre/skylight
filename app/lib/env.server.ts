let GLOBAL_ENV: Env;

export type Env = {
  KV: KVNamespace;
  // POSTS_LIST: DurableObjectNamespace;
  // DB: D1Database;
};

export function init(env: Env) {
  GLOBAL_ENV = { ...env };
}

export function get() {
  return GLOBAL_ENV;
}

export function env(prop?: keyof Env) {
  return prop ? GLOBAL_ENV[prop] : GLOBAL_ENV;
}
