import { IncomingMessage, ServerResponse } from "http";
import { getScreenshot } from "./_lib/chromium";
import { oppscore_compare_html } from "./_lib/oppscore_compare_html";

const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === "1";

// example:
// http://localhost:3001/api/compare?subjectA={"name":"BARACK OBAMA","title":"President, USA (2009-2017)","party":"Democrat","score":"-2.4","image":"https://voteview.com/static/img/bios/099911.jpg"}&subjectB={"name":"LIZ CHENEY","title":"Rep. WY (WY-01) (2017-present)","party":"Republican","score":"2.6","image":"https://voteview.com/static/img/bios/021710.jpg"}&width=1080&height=1080

// http://localhost:3001/api/compare?subjectA=%7B%22name%22%3A%22RONALD%20REAGAN%22%2C%22title%22%3A%22President%2C%20%20USA%20(1981-1989)%22%2C%22party%22%3A%22Republican%22%2C%22score%22%3A%224.4%22%2C%22image%22%3A%22https%253A%252F%252Fvoteview.com%252Fstatic%252Fimg%252Fbios%252F099907.jpg%22%2C%22headline%22%3A%7B%22text%22%3A%22WORKING%20FOR%20YOU%22%2C%22size%22%3A%221.5em%22%2C%22color%22%3A%22green%22%7D%7D&subjectB=%7B%22name%22%3A%22LORING%20BARNES%22%2C%22title%22%3A%22Candidate%20for%20%20StateHouse%2C%20%20MA%202023%22%2C%22party%22%3A%22Republican%22%2C%22score%22%3A%223.25%22%2C%22image%22%3A%22https%253A%252F%252Fmedia-exp2.licdn.com%252Fdms%252Fimage%252FC5603AQGHCn3sPs6qHA%252Fprofile-displayphoto-shrink_800_800%252F0%252F1653447160762%253Fe%253D1662595200%2526v%253Dbeta%2526t%253DlVckrAsbYLKPWEaJiT-ojgD02DpRkqmVenxk4Q8vBz8%22%2C%22headline%22%3A%7B%22text%22%3A%22WORKING%20AGAINST%20YOU%22%2C%22size%22%3A%221.5em%22%7D%7D&width=1080&height=1080

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

  console.log("!!!! query_to_compare_image url", req.url);
  const {
    subjectA: subjectAJson,
    subjectB: subjectBJson,
    width: widthStr,
    height: heightStr,
    headline: headlineJson,
    footline: footlineJson,
  } = req.method == "GET" ? req.query : req.body.data;

  // hack to coerce hash character in urls
  const fixHash = (s: string) => s.replace(/%23/g, "#");

  const subjectA =
    typeof subjectAJson === "string"
      ? JSON.parse(fixHash(subjectAJson))
      : subjectAJson;
  const subjectB =
    typeof subjectBJson === "string"
      ? JSON.parse(fixHash(subjectBJson))
      : subjectBJson;
  console.log("subjectA", subjectA);
  console.log("subjectB", subjectB);
  const width = Number(widthStr);
  const height = Number(heightStr);
  console.log("width", width, typeof width, "height", height, typeof height);
  const headline =
    typeof headlineJson === "string"
      ? JSON.parse(fixHash(headlineJson))
      : headlineJson;
  const footline =
    typeof footlineJson === "string"
      ? JSON.parse(fixHash(footlineJson))
      : footlineJson;
  console.log("headline", headline);
  console.log("footline", footline);

  const html = oppscore_compare_html({
    subjectA,
    subjectB,
    width,
    height,
    headline,
    footline,
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
