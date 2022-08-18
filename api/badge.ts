import { IncomingMessage, ServerResponse } from "http";
import { badge_html } from "./_lib/badge_html";
import { getScreenshot } from "./_lib/chromium";

const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === "1";

// example:
// /api/badge?score=4.2&width=480&height=270

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    await query_to_badge_image(req, res);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
    console.error(e);
  }
}

const defaultProps = {
  width: "480", // 1920/4
  height: "270", // 1080/4
};

async function query_to_badge_image(req: any, res: ServerResponse) {
  const { score, width, height } = req.query;

  console.log("query_to_badge_image url", req.url);
  console.log("score", score, "width", width, "height", height);
  const html = badge_html({
    score,
    width: width || defaultProps.width,
    height: height || defaultProps.height,
  });
  // console.log("html", html);

  if (isHtmlDebug || req.query.debug) {
    res.setHeader("Content-Type", "text/html");
    // res.end(html);
    res.end(
      `<div style="width: ${Number(width) + 2}; height: ${
        Number(height) + 2
      }; border: 1px solid red; overflow: hidden;">${html}</div>`
    );
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
