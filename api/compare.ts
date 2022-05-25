import { IncomingMessage, ServerResponse } from "http";
import { getScreenshot } from "./_lib/chromium";
import { oppscore_compare_html } from "./_lib/oppscore_compare_html";

const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === "1";

// example:
//

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
  const { a, b, w, h } = req.query;
  console.log("query_to_image url", req.url);
  console.log(req.query.name, "width", w, "height", h, "a", a, "b", b);

  const subjectA = JSON.parse(decodeURIComponent(a));
  console.log("subjectA", subjectA);
  const subjectB = JSON.parse(decodeURIComponent(b));
  console.log("subjectB", subjectB);
  const width = !!w ? Number(w) : 1080;
  const height = !!h ? Number(h) : 1080;

  const html = oppscore_compare_html({ subjectA, subjectB, width, height });
  // console.log("html", html);

  if (isHtmlDebug || req.query.debug) {
    res.setHeader("Content-Type", "text/html");
    res.end(html);
    return;
  }
  const fileType = "png";
  const file = await getScreenshot(
    width,
    height,
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
