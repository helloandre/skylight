let GLOBAL_ENV: Env;

export type Env = {
  KV: KVNamespace;
  UPLOADS: R2Bucket;
};

export function init(env: Env) {
  GLOBAL_ENV = { ...env };
}

export function get() {
  return GLOBAL_ENV;
}

export function env(prop: "KV"): KVNamespace;
export function env(prop: "UPLOADS"): R2Bucket;
export function env(prop?: keyof Env) {
  return prop ? GLOBAL_ENV[prop] : GLOBAL_ENV;
}
