# Skylight 🌤️

A blogging platform built entirely on Workers Pages with Ghost-compatable themes.

Built With:

- [Remix](https://remix.run)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [DaisyUI](https://daisyui.com/)

## Installation

> NOTE: pre-release deployment steps intended for testing _ONLY_

- `npm run deploy`
  - chose the account and project (or create a new one)
- add a KV Namespace to the variable `KV`
  - [docs](https://developers.cloudflare.com/pages/platform/functions/bindings/#kv-namespaces)

## Development

You will be utilizing Wrangler for local development to emulate the Cloudflare runtime. This is already wired up in your package.json as the `dev` script:

```sh
# start the remix dev server and wrangler
npm run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready to go!

## TODO

Functionality:

- scheduled posts
- proper editor experience, maybe https://tiptap.dev/
- membership signup
- author signup
- author-via Cloudflare Access
- authors on posts
- tags on posts
- sending emails
- settings

Tech:

- proper indexing of posts/users
  - Durable Objects or D1

## License

Skylight is released under the MIT license.
