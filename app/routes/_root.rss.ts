import type { LoaderFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async () => {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" version="2.0"></rss>`,
    {
      headers: { "Content-Type": "application/xml" },
    }
  );
};
