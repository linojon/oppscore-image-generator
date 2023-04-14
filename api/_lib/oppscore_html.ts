import { corsProxy, imgCorsParams } from "./corsProxy";
import {
  // assets_host,
  // gousaBlue,
  // gousaRed,
  scoreStarsImage,
  scoreTextLookup,
} from "./oppscore-utils";

interface OppscoreHtmlProps {
  name: string;
  title: string;
  party: string;
  score: string;
  image: string;
  unverified?: boolean;
  width: string;
  height: string;
}

// designed for 10080 height
// scale eg 630h = 0.5833

export function oppscore_html(props: OppscoreHtmlProps) {
  const { height } = props;

  const scale = Number(height) / 1080;
  return oppscore_html_scaled(props, scale);
}

//-----------------------

export function oppscore_html_scaled(props: OppscoreHtmlProps, scale: number) {
  const { name, title, party, score: scoreStr, image, unverified, width, height } = props;

  // const public_host = process.env.NEXT_PUBLIC_HOST || "";
  const assets_host = "https://www.oppscore.org";

  const gousaRed = "#c02529";
  const gousaBlue = "#275aa9";

  const rootStyle = `
          width: ${width}px;
          height: ${height}px;
          font-family: Helvetica, Arial, Sans-Serif;
          font-weight: bold;
          font-size: ${scale * 1.5}em;
          text-align: center;
          background-color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
    `;

  // src is 800x240, want 80 h, so 266x80
  const gousa_logo = `
      <img src="${assets_host}/static/brand/GOUSA_Logo-800x240.png" width="${scale * 266
    }px" height="${scale * 80}px" style="display: block; margin: auto;" />
    `;

  // src -s 1173x294 want w 600px so 600x150
  const oppscore_logo = `
      <img src="${assets_host}/static/brand/oppscore-logo.png" width="${scale * 600
    }px" height="${scale * 150}px" style="display: block; margin: auto" />
    `;

  //
  const partyStr = party ? `${party} Party` : "";

  const score = Number.parseFloat(scoreStr);
  const scoreNumberString = (score > 0 ? "+" : "") + score.toFixed(2);
  const scoreColor = score <= 0 ? gousaRed : gousaBlue;

  const score_arrow_image =
    score <= 0 ? "/static/RedDownArrow128.png" : "/static/BlueUpArrow128.png";

  //
  // const subject_info = `
  //     <h2 style="margin: 0;">Politician:</h2>
  //     <h1 style="margin: 0; ">${name.toUpperCase()}</h1>
  //     <p style="margin-top: 0;">${title}<br/>
  //     ${partyStr}</p>
  //   `;
  const subject_info = `
  <h2></h2>
  <h1 style="margin: 0; ">${name.toUpperCase()}</h1>
  <p style="margin-top: 0;">${title}<br/>
  ${partyStr}</p>
`;

  let subject_photo = ''

  if (image) {
    const headshot_image = corsProxy(decodeURIComponent(image));

    // const subject_photo = `
    //   <div style="max-width: ${scale * 275}px; height: ${
    //   scale * 275
    // }px; display: inline-block">
    //     <img
    //     ${imgCorsParams}
    //     src="${headshot_image}"
    //     height="${scale * 275}px" />
    //   </div>
    //   `;
    subject_photo = `
    <div style="width: ${scale * 240}px; height: ${scale * 240
      }px; display: inline-block; border-radius: 50%; overflow: hidden; vertical-align: top;">
      <img
      ${imgCorsParams}
      src="${headshot_image}"
      width="100%"
      height="auto" />
    </div>
    `;
  }

  // score_with_arrow 200w x 240h : score: 200x120 arrow (src 128x128): 115x115
  const score_with_arrow_left_margin = image ? '60px' : '0'
  const score_with_arrow = `
      <div style="width: ${scale * 200}px; height: ${scale * 240
    }px; display: inline-block; vertical-align: text-bottom; margin-left: ${score_with_arrow_left_margin}">
        <div style="width: ${scale * 200}px; height: ${scale * 120
    }px; border: 2px solid black; text-align: center; font-size: ${scale * 30
    }px;">
          <p style="margin-top: ${scale * 10}px">SCORE:<br />
          <span style="color: ${scoreColor}; font-weight: 800; ">${scoreNumberString}</span> / 5</p>
        </div>
        <img src="${assets_host}${score_arrow_image}" width="${scale * 115
    }px"  style="display: block; margin: auto" />
      </div>
    `;

  const stars_image = scoreStarsImage(score);
  //
  const opportunity_score = `
      <div>
        <p>Opportunity Score&trade; (scale -5.0 to +5.0):
        <span style="color: ${scoreColor}; font-weight: 800; font-size: ${scale * 1.5
    }em;">${scoreNumberString}</span></p>
  
        <img src="${assets_host}${stars_image}" height="${scale * 112
    }px"  style="display: block; margin: auto" />
      </div>
      <div>
        <p>RATING:  <span style="color: ${scoreColor}; font-weight: 800; font-size: ${scale * 1.5
    }em;">${scoreTextLookup(score).toUpperCase()}</span></p>
      </div>
    `;


  const unverifiedDivStyle = `
    position: absolute;
    display: block;
    background: #ddd;
    color: #666;
    text-decoration: none;
    padding: 5px;
    text-align: center;
    width: 300;
    z-index: 100;
    right: -60px;
    bottom: 75px;
    transform: rotate(-45deg);
    `;

  const unverifiedSpanStyle = `
    `;

  const unverified_html = unverified
    ? `<div style="${unverifiedDivStyle}">
    <span style="${unverifiedSpanStyle}">
      Unverified
    </span>
  </div>`
    : '';

  //--------------------------
  const html = `
        <div style="${rootStyle}">
          <div>
            ${gousa_logo}
            ${oppscore_logo}
          </div>
          <div>
            ${subject_info}
          </div>
          <div>
            ${subject_photo}
            ${score_with_arrow}
          </div>
          ${opportunity_score}
          ${unverified_html}
        </div>`;

  console.log(html)
  return html;
}
