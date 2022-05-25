import { IncomingMessage, ServerResponse } from "http";
import { getScreenshot } from "./_lib/chromium";

import { oppscore_html } from "./_lib/oppscore-utils";

const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === "1";

// example:
//  /api/oppscore?name=John%20Doe&title=President&party=Libertarian&score=4.2&image=https://voteview.com/static/img/bios/099902.jpg

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    await query_to_image(req, res);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
    console.error(e);
  }
}

async function query_to_image(req: any, res: ServerResponse) {
  // assert query has these properties:
  // const { name, title, party, score, image, debug } = req.query
  const { width, height } = req.query;
  console.log("width", width, "height", height);
  const html = oppscore_html(req.query);
  // console.log("html", html);

  if (isHtmlDebug || req.query.debug) {
    res.setHeader("Content-Type", "text/html");
    res.end(html);
    return;
  }
  const fileType = "png";
  const file = await getScreenshot(
    Number(width),
    Number(height),
    html as string,
    fileType,
    isDev
  );
  res.statusCode = 200;
  res.setHeader("Content-Type", `image/${fileType}`);
  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );
  res.end(file);
}
