export type OppscoreText = {
  text: string;
  size?: string;
  color?: string;
};

export type OppscoreImageProps = {
  name: string;
  title: string;
  party: string;
  score: string;
  image: string;
  width: string;
  height: string;
  headline?: OppscoreText;
};

export type OppscoreImageInfo = {
  name: string;
  title: string;
  party: string;
  score: string;
  image: string;
  headline?: OppscoreText;
};

export type OppscoreCompareImageProps = {
  subjectA: OppscoreImageInfo;
  subjectB: OppscoreImageInfo;
  width: number;
  height: number;
  headline?: OppscoreText;
  footline?: OppscoreText;
};
