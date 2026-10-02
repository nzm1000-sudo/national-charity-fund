import { Frank_Ruhl_Libre, Heebo, Noto_Serif_Hebrew } from "next/font/google";

export const fontFrank = Frank_Ruhl_Libre({
  subsets: ["hebrew"],
  weight: ["900"],
  variable: "--font-frank",
  display: "swap",
});

export const fontNotoSerif = Noto_Serif_Hebrew({
  subsets: ["hebrew"],
  weight: ["300"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const fontHeebo = Heebo({
  subsets: ["hebrew"],
  weight: ["400", "500"],
  variable: "--font-heebo",
  display: "swap",
});

export const fontVariables = `${fontFrank.variable} ${fontNotoSerif.variable} ${fontHeebo.variable}`;
