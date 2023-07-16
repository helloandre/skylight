const ERROR = `{{!< default }}
<center><h1>Error</h1><center>`;

export const THEME = {
  name: `default`,
  templates: {
    default: `<!DOCTYPE html>
  <html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Skylight Error</title>
        <meta name="HandheldFriendly" content="True" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>{{{ body }}}</body>
  </html>`,
    index: ERROR,
    page: ERROR,
    post: ERROR,
    error: ERROR,
    error404: `{{!< default }}
    <center><h1>404</h1><center>`,
  },
  assets: {},
  partials: {},
  config: {},
};
