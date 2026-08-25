import { type Stats } from "./stats-calculator";

export function koppen(s: Stats): string {
  const pTh =
    20 * s.MAT +
    (s.pSummerShare >= 0.7 ? 280 : s.pSummerShare <= 0.3 ? 0 : 140);
  if (s.MAP < pTh)
    return (s.MAP < pTh / 2 ? "BW" : "BS") + (s.MAT >= 18 ? "h" : "k");
  if (s.tCold >= 18) {
    if (s.pDry >= 60) return "Af";
    if (s.pDry >= 100 - s.MAP / 25) return "Am";
    return s.pWdry < s.pSdry ? "Aw" : "As";
  }
  if (s.tHot < 10) return s.tHot > 0 ? "ET" : "EF";
  const group = s.tCold > 0 ? "C" : "D";
  const second =
    s.pSdry < 40 && s.pSdry < s.pWwet / 3
      ? "s"
      : s.pWdry < s.pSwet / 10
        ? "w"
        : "f";
  let third =
    s.tHot >= 22 ? "a" : s.tmon10 >= 4 ? "b" : s.tCold > -38 ? "c" : "d";
  if (group === "C" && third === "d") third = "c";
  return group + second + third;
}
