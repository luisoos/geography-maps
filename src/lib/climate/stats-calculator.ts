import { avg, sum } from "../helper/math";

export default function climateStats(m: Month[], latitude: number) {
  const northern = latitude >= 0;
  const sumIdx = northern ? [3, 4, 5, 6, 7, 8] : [0, 1, 2, 9, 10, 11]; // Apr–Sep bzw. Okt–Mär
  const winIdx = northern ? [0, 1, 2, 9, 10, 11] : [3, 4, 5, 6, 7, 8];

  return {
    MAT: avg(m.map((x) => x.tMean)), // Jahresmittel
    MAP: sum(m.map((x) => x.p)), // Jahressumme Niederschlag
    tCold: Math.min(...m.map((x) => x.tMean)), // kältester Monat
    tHot: Math.max(...m.map((x) => x.tMean)), // wärmster Monat
    tmon10: m.filter((x) => x.tMean > 10).length, // Monate > 10 °C
    pDry: Math.min(...m.map((x) => x.p)), // trockenster Monat
    pSdry: Math.min(...sumIdx.map((i) => m[i].p)), // trockenster Sommermonat
    pSwet: Math.max(...sumIdx.map((i) => m[i].p)), // feuchtester Sommermonat
    pWdry: Math.min(...winIdx.map((i) => m[i].p)), // trockenster Wintermonat
    pWwet: Math.max(...winIdx.map((i) => m[i].p)), // feuchtester Wintermonat
    pSummerShare: sum(sumIdx.map((i) => m[i].p)) / sum(m.map((x) => x.p)),
    northern,
  };
}

export type Stats = ReturnType<typeof climateStats>;
