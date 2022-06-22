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
    await query_to_compare_image(req, res);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
    console.error(e);
  }
}

async function query_to_compare_image(req: any, res: ServerResponse) {
  // assert query has these properties:
  // const { name, title, party, score, image, debug } = req.query
  // console.log("req.body", req.body);
  // const { a, b, w, h } = req.body.data;
  // console.log("query_to_compare_image url", req.url);
  // console.log("width", w, "height", h, "a", a, "b", b);

  // const subjectA = JSON.parse(decodeURIComponent(a));
  // console.log("subjectA", subjectA);
  // const subjectB = JSON.parse(decodeURIComponent(b));
  // console.log("subjectB", subjectB);
  // const width = !!w ? Number(w) : 1080;
  // const height = !!h ? Number(h) : 1080;

  console.log("query_to_compare_image url", req.url);
  const {
    subjectA: subjectAJson,
    subjectB: subjectBJson,
    width: widthStr,
    height: heightStr,
    headline: headlineJson,
  } = req.method == "GET" ? req.query : req.body.data;
  const subjectA =
    typeof subjectAJson === "string" ? JSON.parse(subjectAJson) : subjectAJson;
  const subjectB =
    typeof subjectBJson === "string" ? JSON.parse(subjectBJson) : subjectBJson;
  console.log("subjectA", subjectA);
  console.log("subjectB", subjectB);
  const width = Number(widthStr);
  const height = Number(heightStr);
  console.log("width", width, typeof width, "height", height, typeof height);
  const headline =
    typeof headlineJson === "string" ? JSON.parse(headlineJson) : headlineJson;

  const html = oppscore_compare_html({
    subjectA,
    subjectB,
    width,
    height,
    headline,
  });
  // console.log("html", html);

  if (isHtmlDebug || req.query.debug) {
    res.setHeader("Content-Type", "text/html");
    res.end(
      `<div style="width:${width + 4}px; height:${
        height + 4
      }px; border: 2px solid green;">${html}</div>`
    );
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
