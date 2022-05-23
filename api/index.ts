import { IncomingMessage, ServerResponse } from "http";
// import { parseRequest } from "./_lib/parser";
import { getScreenshot } from "./_lib/chromium";
// import { getHtml } from "./_lib/template";

import { parse } from "url";

const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === "1";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    if (req.method === "GET") {
      //   await original_vercel_og_image(req, res);
      await html_to_image(req, res);
    } else if (req.method === "POST") {
      // for my internal usage, pass raw html
    }
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
    console.error(e);
  }
}

// async function original_vercel_og_image(
//   req: IncomingMessage,
//   res: ServerResponse
// ) {
//   // original vercel/og-image get
//   const parsedReq = parseRequest(req);
//   const html = getHtml(parsedReq);
//   if (isHtmlDebug) {
//     res.setHeader("Content-Type", "text/html");
//     res.end(html);
//     return;
//   }
//   const { fileType } = parsedReq;
//   const file = await getScreenshot(html, fileType, isDev);
//   res.statusCode = 200;
//   res.setHeader("Content-Type", `image/${fileType}`);
//   res.setHeader(
//     "Cache-Control",
//     `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
//   );
//   res.end(file);
// }

async function html_to_image(req: any, res: ServerResponse) {
  //   const html = req.body.html;
  const { query } = parse(req.url || "/", true);
  const { html } = query || {};
  console.log("html", html);
  if (isHtmlDebug) {
    res.setHeader("Content-Type", "text/html");
    res.end(html);
    return;
  }
  const fileType = "png";
  const file = await getScreenshot(html as string, fileType, isDev);
  res.statusCode = 200;
  res.setHeader("Content-Type", `image/${fileType}`);
  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );
  res.end(file);
}
