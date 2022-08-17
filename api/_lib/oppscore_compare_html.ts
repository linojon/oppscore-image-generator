import {
  assets_host,
  gousaBlue,
  gousaRed,
  scoreStarsImage,
  scoreTextLookup,
} from "./oppscore-utils";
import { corsProxy, imgCorsParams } from "./corsProxy";
import {
  OppscoreCompareImageProps,
  OppscoreImageInfo,
} from "../OppscoreImageTypes";

//=========================================

export function oppscore_compare_html(props: OppscoreCompareImageProps) {
  const { subjectA, subjectB, width, height, headline, footline } = props;

  const yPadding = 0; // 80; // 163;
  const xPadding = 0; // 30;
  const vSpacing = 0; // 15;

  const rootStyle = `
          width: ${width}px;
          height: ${height}px;
          font-family: Helvetica, Arial, Sans-Serif;
          font-weight: bold;
          font-size: 1.5em;
          text-align: center;
          padding: ${yPadding}px ${xPadding}px;
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
    `;

  //--------------------

  let headlineHtml = "";
  if (headline) {
    const color = headline.color || gousaBlue;
    const size = headline.size || "2.0em";
    const weight = "700";
    const style = `color: ${color}; font-size: ${size}; font-weight: ${weight}; white-space: nowrap; text-align: center; margin-bottom: 20px;`;
    headlineHtml = `<div style="${style}">
      ${headline.text}
    </div>`;
  }

  // if (!footline) {
  //   footline = {
  //     text: "Side by Side: YOU DECIDE",
  //     size: "2.8em",
  //     color: "#192b4d",
  //   };
  // }

  let footlineHtml = "";
  if (footline) {
    const color = footline.color || gousaBlue;
    const size = footline.size || "2.0em";
    const weight = "900";
    const style = `color: ${color}; font-size: ${size}; font-weight: ${weight}; font-style: italic; white-space: nowrap; text-align: center; margin-bottom: 20px;`;
    footlineHtml = `<div style="${style}">
      ${footline.text}
    </div>`;
  }

  //--------------------
  // width: ${width + 4}px;
  // height: ${height + 4}px;
  //    border: 2px solid green;

  // src -s 1173x294 wanth 120 so 480x120
  const oppscoreLogoW = !!headline ? 360 : 480;
  const oppscoreLogoH = !!headline ? 90 : 120;
  const oppscore_logo = `
  <img src="${assets_host}/static/brand/oppscore-logo.png" width="${oppscoreLogoW}px" height="${oppscoreLogoH}px" style="display: block; margin: 0 auto ${vSpacing}px auto" />
`;

  //--------------------

  // src is 800x240, want 100 h, so 333 x 100
  const gousaLogoW = 333;
  const gousaLogoH = 100;
  const gousa_logo = `
  <img src="${assets_host}/static/brand/GOUSA_Logo-800x240.png" width="${gousaLogoW}px" height="${gousaLogoH}px"  />
`;

  // src 875 x 600 want 100 h, so 146 x 100
  const leftGloveFile =
    Number(subjectA.score) < 0
      ? "/static/icons/red-boxing-glove-left-bw.png"
      : "/static/icons/blue-boxing-glove-left-bw.png";
  const rightGloveFile =
    Number(subjectB.score) < 0
      ? "/static/icons/red-boxing-glove-right-bw.png"
      : "/static/icons/blue-boxing-glove-right-bw.png";
  const gloveW = 146;
  const gloveH = 100;
  const gloveSpacing = 75;
  const leftGlove = `
  <img src="${assets_host}${leftGloveFile}" width="${gloveW}px" height="${gloveH}px" style="display: inline-block; margin-right: ${gloveSpacing}px;" />
  `;
  const rightGlove = `
  <img src="${assets_host}${rightGloveFile}" width="${gloveW}px" height="${gloveH}px" style="display: inline-block; margin-left: ${gloveSpacing}px;" />
  `;

  //--------------------

  const footerByline = `
    <div style="width: 100%; font-size: 1.25em; font-style: italic; font-weight: bold; text-align: center;">
      OppScore<sup>&reg;</sup> by GOUSA: The Unbiased Political Credit Rating<sup>&trade;</sup>
    </div>
    `;

  //--------------------

  // want 512 x 430
  const xGutter = 5;

  const subjectBoxA = subject_score_box(subjectA, xGutter);
  //`<div style="width: 512px; height: 430px; border: 1px solid black; display: inline-block; margin-right: ${xGutter}px;">${subjectA.name}</div>`;
  const subjectBoxB = subject_score_box(subjectB, 0);
  //`<div style="width: 512px; height: 430px; border: 1px solid black; display: inline-block; margin-left: ${xGutter}px;">${subjectB.name}</div>`;

  //
  const html = `
    <div style="${rootStyle}">
      ${oppscore_logo}
      ${headlineHtml}
      <div> 
        ${subjectBoxA}
        ${subjectBoxB}
      </div>
      ${footlineHtml}
      <div style="display: inline-block; margin: ${vSpacing}px auto;">
        ${leftGlove}
        ${gousa_logo}
        ${rightGlove}
      </div>
      ${footerByline}
    </div>
  `;
  return html;
}

//=====================================================

function subject_score_box(props: OppscoreImageInfo, rightMargin: number) {
  const { name, title, party, score: scoreStr, image, headline } = props;
  // console.log(
  //   "subject_score_box",
  //   "name",
  //   name,
  //   "title",
  //   title,
  //   "party",
  //   party,
  //   "score",
  //   scoreStr,
  //   "image",
  //   image
  // );
  const fontSize = 0.75;
  //width: 512px; height: 430px;

  const rootStyle = `width: 512px; display: inline-block; margin: 0 ${rightMargin} 0 0;`;

  const boxStyle = `width: 512px; height: 512px; border: 1px solid black; display: inline-block; padding: 20px 0 0 0`;

  let headlineHtml = "";
  if (headline) {
    const color = headline.color || gousaRed;
    const size = headline.size || "2.0em";
    const weight = "900";
    const style = `color: ${color}; font-size: ${size}; font-weight: ${weight}; white-space: nowrap; text-align: center; margin-bottom: 20px;`;
    headlineHtml = `<div style="${style}">
        ${headline.text}
      </div>`;
  }

  const partyStr = party ? `${party} Party` : "";

  let score, scoreNumberString, scoreColor, score_arrow_image, scoreText;

  if (!!scoreStr) {
    score = Number(scoreStr);
    scoreNumberString = (score > 0 ? "+" : "") + score.toFixed(2);
    scoreColor = score <= 0 ? gousaRed : gousaBlue;

    score_arrow_image =
      score <= 0 ? "/static/RedDownArrow128.png" : "/static/BlueUpArrow128.png";
    scoreText = scoreTextLookup(score).toUpperCase();
  } else {
    scoreNumberString = "??";
    scoreColor = gousaBlue;
    score_arrow_image = "/static/questionArrow128.png";
    scoreText = "---";
  }
  //
  const subject_info = `
    <h3 style="margin: 0;">Politician:</h3>
    <h2 style="margin: 0; ">${name.toUpperCase()}</h2>
    <p style="margin-top: 0;">${title}<br/>
    ${partyStr}</p>
 `;

  const headshot_image = corsProxy(decodeURIComponent(image));

  // 150 x 150 circle
  const imgW = 150;
  const subject_photo = `
   <div style="max-width: ${imgW}px; height: ${imgW}px; display: inline-block">
     <img
     ${imgCorsParams}
     src="${headshot_image}"
     height="${imgW}px" />
   </div>
   `;

  // score_with_arrow 200w x 240h : score: 200x120 arrow (src 128x128): 115x115

  //score with arrow 125 x 150h :  score:  125 x 75 (src 128 x 128):
  // scale 0.625
  const swaW = 125;
  const swaH = 150;
  const swaMargin = 38;
  const scoreW = 125;
  const scoreH = 75;
  const scoreFont = 19;
  const arrowW = 72;
  const score_with_arrow = `
  <div style="width: ${swaW}px; height: ${swaH}px; display: inline-block; vertical-align: text-bottom; margin-left: ${swaMargin}px">
    <div style="width: ${scoreW}px; height: ${scoreH}px; border: 2px solid black; text-align: center; font-size: ${scoreFont}px;">
      <p style="margin-top: 10px">SCORE:<br />
      <span style="color: ${scoreColor}; font-weight: 800; ">${scoreNumberString}</span> / 5</p>
    </div>
    <img src="${assets_host}${score_arrow_image}" width="${arrowW}px"  style="display: block; margin: auto" />
  </div>
`;

  console.log("score", typeof score, score, assets_host);
  const stars_image =
    score == undefined
      ? "/static/star-graphics/blank-stars-bw-5.png"
      : scoreStarsImage(score);
  //
  const starsH = 70;
  const opportunity_score = `
    <div style="font-size: ${fontSize}em">
      <p>Opportunity Score&trade; (scale -5.0 to +5.0):
      <span style="color: ${scoreColor}; font-weight: 800; font-size: 1em;">${scoreNumberString}</span></p>

      <img src="${assets_host}${stars_image}" height="${starsH}px"  style="display: block; margin: auto" />
      <p>RATING:  <span style="color: ${scoreColor}; font-weight: 800; font-size: 1em;">${scoreText}</span></p>
    </div>
  `;

  const html = `
  <div style="${rootStyle}">
    ${headlineHtml}
    <div style="${boxStyle}">
      ${subject_info}
      <div>
        ${subject_photo}
        ${score_with_arrow}
      </div>
      ${opportunity_score}
    </div>
  </div>
  `;

  return html;
}
