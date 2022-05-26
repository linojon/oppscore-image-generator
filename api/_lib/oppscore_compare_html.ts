import {
  assets_host,
  gousaBlue,
  gousaRed,
  scoreStarsImage,
  scoreTextLookup,
} from "./oppscore-utils";
import { corsProxy, imgCorsParams } from "./corsProxy";

export type OppscoreHtmlProps = {
  name: string;
  title: string;
  party: string;
  score: string;
  image: string;
};

interface OppscoreCompareHtmlProps {
  subjectA: OppscoreHtmlProps;
  subjectB: OppscoreHtmlProps;
  width: number;
  height: number;
}

//-------------------------

export function oppscore_compare_html(props: OppscoreCompareHtmlProps) {
  const { subjectA, subjectB, width, height } = props;

  const yPadding = 163;
  const xPadding = 30;
  const spacing = 30;

  const rootStyle = `
          width: ${width + 4}px;
          height: ${height + 4}px;
          font-family: Helvetica, Arial, Sans-Serif;
          font-weight: bold;
          font-size: 1.5em;
          text-align: center;
          padding: ${yPadding}px ${xPadding}px;
          background-color: white;
          border: 2px solid green;
    `;

  // src -s 1173x294 wanth 120 so 480x120
  const oppscoreLogoW = 480;
  const oppscoreLogoH = 120;
  const oppscore_logo = `
  <img src="${assets_host}/static/brand/oppscore-logo.png" width="${oppscoreLogoW}px" height="${oppscoreLogoH}px" style="display: block; margin: ${spacing}px auto" />
`;

  // src is 800x240, want 100 h, so 333 x 100
  const gousaLogoW = 333;
  const gousaLogoH = 100;
  const gousa_logo = `
  <img src="${assets_host}/static/brand/GOUSA_Logo-800x240.png" width="${gousaLogoW}px" height="${gousaLogoH}px"  />
`;

  // src 875 x 600 want 100 h, so 146 x 100
  const leftGloveFile =
    Number(subjectA.score) < 0
      ? "/static/icons/red-boxing-glove-left.png"
      : "/static/icons/blue-boxing-glove-left.png";
  const rightGloveFile =
    Number(subjectB.score) < 0
      ? "/static/icons/red-boxing-glove-right.png"
      : "/static/icons/blue-boxing-glove-right.png";
  const gloveW = 146;
  const gloveH = 100;
  const gloveSpacing = 75;
  const leftGlove = `
  <img src="${assets_host}${leftGloveFile}" width="${gloveW}px" height="${gloveH}px" style="display: inline-block; margin-right: ${gloveSpacing}px;" />
  `;
  const rightGlove = `
  <img src="${assets_host}${rightGloveFile}" width="${gloveW}px" height="${gloveH}px" style="display: inline-block; margin-left: ${gloveSpacing}px;" />
  `;

  // want 512 x 430
  // const xGutter = 15;

  const subjectBoxA = subject_score_box(subjectA);
  //`<div style="width: 512px; height: 430px; border: 1px solid black; display: inline-block; margin-right: ${xGutter}px;">${subjectA.name}</div>`;
  const subjectBoxB = subject_score_box(subjectB);
  //`<div style="width: 512px; height: 430px; border: 1px solid black; display: inline-block; margin-left: ${xGutter}px;">${subjectB.name}</div>`;

  //
  const html = `
    <div style="${rootStyle}">
      ${oppscore_logo}
      <div> 
        ${subjectBoxA}
        ${subjectBoxB}
      </div>
      <div style="display: inline-block; margin: ${spacing}px auto;">
        ${leftGlove}
        ${gousa_logo}
        ${rightGlove}
      </div>
    </div>
  `;
  return html;
}

//--------------

function subject_score_box(props: OppscoreHtmlProps) {
  const { name, title, party, score: scoreStr, image } = props;

  const fontSize = 0.75;
  //width: 512px; height: 430px;
  const rootStyle = `width: 512px; height: 512px; border: 1px solid black; display: inline-block; margin: 0 10px; padding-top: 20px`;

  const partyStr = party ? `${party} Party` : "";

  const score = Number.parseFloat(scoreStr);
  const scoreNumberString = (score > 0 ? "+" : "") + score.toFixed(2);
  const scoreColor = score <= 0 ? gousaRed : gousaBlue;

  const score_arrow_image =
    score <= 0 ? "/static/RedDownArrow128.png" : "/static/BlueUpArrow128.png";

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

  const stars_image = scoreStarsImage(score);
  //
  const starsH = 70;

  const opportunity_score = `
    <div style="font-size: ${fontSize}em">
      <p>Opportunity Score&trade; (scale -5.0 to +5.0):
      <span style="color: ${scoreColor}; font-weight: 800; font-size: 1em;">${scoreNumberString}</span></p>

      <img src="${assets_host}${stars_image}" height="${starsH}px"  style="display: block; margin: auto" />
      <p>RATING:  <span style="color: ${scoreColor}; font-weight: 800; font-size: 1em;">${scoreTextLookup(
    score
  ).toUpperCase()}</span></p>
    </div>
  `;

  const html = `
 <div style="${rootStyle}">
   ${subject_info}
   <div>
     ${subject_photo}
     ${score_with_arrow}
   </div>
   ${opportunity_score}
 </div>`;

  return html;
}
