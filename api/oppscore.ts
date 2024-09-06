import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url"; // Import URL parser
import { getScreenshot } from "./_lib/chromium";
import { oppscore_html } from "./_lib/oppscore_html";

const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === "1";

// example:
//  https://oppscore-image-generator-parkerhill.vercel.app/api/oppscore?name=John%20Doe&title=President&party=Libertarian&score=4.2&image=https://voteview.com/static/img/bios/099902.jpg&width=1200&height=630
// /api/oppscore?name=JOHN%20KENNEDY&title=President%2C%20%20USA%20(1961%26%238209%3B1963)&party=Democrat&score=4&image=https%253A%252F%252Fvoteview.com%252Fstatic%252Fimg%252Fbios%252F099902.jpg&width=1200&height=630
//
// no photo 
//  http://localhost:3001/api/oppscore?name=First%20Last&title=Some%20Title&party=Political&score=3.5&width=1000&height=1000

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
  const queryObject = parse(req.url || "", true).query; // Use parse to get query parameters

  const { width, height } = queryObject;
  console.log("query_to_image url", req.url);
  console.log(req.query.name, "width", width, "height", height);
  const html = oppscore_html(req.query);
  // console.log("html", html);

  if (isHtmlDebug || req.query.debug) {
    res.setHeader("Content-Type", "text/html");
    // res.end(html);
    res.end(`<body style='background-color: #aaa'>${html}</body>`)
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
