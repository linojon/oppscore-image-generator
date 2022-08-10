//-----------------------

// const public_host = process.env.NEXT_PUBLIC_HOST || "";
// export const assets_host = "http://localhost:3000";
export const assets_host = "https://www.oppscore.org";

export const gousaRed = "#c02529";
export const gousaBlue = "#275aa9";

//-----------------------

export function scoreStarsImage(
  score: number,
  fullstars: boolean = false
): string {
  const quarterScore = Math.round(score * 4) / 4;
  const prefix =
    score >= 0 || approxeq(score, 0) ? quarterScore : `minus-${-quarterScore}`;
  const name = `/static/star-graphics/${prefix}-stars.png`;
  if (fullstars) {
    return name.replace("stars.png", "stars-10.png");
  } else {
    return name;
  }
}

export function scoreTextLookup(score: number) {
  if (approxeq(score, 0, 0.1)) return "Zero Opportunity Score";
  else if (score < -2.0) return "Extreme Anti-Opportunity Score";
  else if (score < 0) return "Poor Anti-Opportunity Score";
  else if (score < 2.0) return "Weak Opportunity Score";
  else if (score < 3.5) return "Moderate Pro-Opportunity Score";
  else return "Strong Pro-Opportunity Score";
  // return `[Score error ${score}]`
}

export function approxeq(v1: number, v2: number, epsilon = 0.001) {
  return Math.abs(v1 - v2) <= epsilon;
}
