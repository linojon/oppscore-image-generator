import { assets_host } from "./oppscore-utils";

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
  const leftGloveFile = "/static/icons/red-boxing-glove-left.png";
  const rightGloveFile = "/static/icons/blue-boxing-glove-right.png";
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
  const xGutter = 15;

  const subjectBoxA = `<div style="width: 512px; height: 430px; border: 1px solid black; display: inline-block; margin-right: ${xGutter}px;">${subjectA.name}</div>`;
  const subjectBoxB = `<div style="width: 512px; height: 430px; border: 1px solid black; display: inline-block; margin-left: ${xGutter}px;">${subjectB.name}</div>`;

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
