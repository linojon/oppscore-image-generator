import {
  gousaBlue,
  gousaRed,
  scoreStarsImage,
  scoreTextLookup,
} from "./oppscore-utils";

interface BadgeHtmlProps {
  score: string;
  width: string;
  height: string;
}

// designed for 1080 height
// scale eg 630h = 0.5833

export function badge_html(props: BadgeHtmlProps) {
  const { height } = props;

  const scale = Number(height) / 1080;
  return badge_html_scaled(props, scale);
}

//-----------------------

export function badge_html_scaled(props: BadgeHtmlProps, scale: number) {
  const { score: scoreStr, width, height } = props;

  // const public_host = process.env.NEXT_PUBLIC_HOST || "";
  const assets_host = "https://www.oppscore.org";

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
          align-items: center;

    `;

  // src -s 1172 x 294
  const oppscore_logo = `
      <img src="${assets_host}/static/brand/oppscore-logo.png" width="${
    scale * 1200
  }px" height="auto" />
    `;

  const subtitle = `
  <div style="font-size: ${
    scale * 72
  }px; font-style: italic; font-weight: bold;">The Unbiased Political Credit Rating<sup>&trade;</sup></div>
  `;

  const score = Number.parseFloat(scoreStr);
  const scoreColor = score <= 0 ? gousaRed : gousaBlue;
  const stars_image = scoreStarsImage(score);
  //
  const score_stars = `
        <img src="${assets_host}${stars_image}" height="${
    scale * 280
  }px width="auto" />`;

  const score_text = `
        <div style="font-size: ${scale * 72}px; padding-bottom: ${
    scale * 72
  }px">RATING:  <span style="color: ${scoreColor}; font-weight: 800;">${scoreTextLookup(
    score
  ).toUpperCase()}</span></div>
    `;

  const html = `
      <div style="${rootStyle}">
        <div>
          ${oppscore_logo}
          ${subtitle}
        </div>
        ${score_stars}
        ${score_text}
      </div>`;

  return html;
}
