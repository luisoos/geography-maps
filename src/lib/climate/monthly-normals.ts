export default function getMonthlyNormals(daily: {
  time: string[];
  temperature_2m_mean: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}): MonthlyData[] {
  const tAcc = Array.from({ length: 12 }, () => ({
    mean: 0,
    max: 0,
    min: 0,
    n: 0,
  }));
  const pMonth = new Map<string, number>(); // "jahr-monat" -> Summe
  const years = new Set<number>();

  daily.time.forEach((date: string, i: number) => {
    if (
      daily.temperature_2m_mean[i] == null ||
      daily.precipitation_sum[i] == null
    )
      return;
    const y = Number(date.slice(0, 4));
    const m = Number(date.slice(5, 7)) - 1; // 0..11
    years.add(y);
    const a = tAcc[m];
    a.mean += daily.temperature_2m_mean[i];
    a.max += daily.temperature_2m_max[i];
    a.min += daily.temperature_2m_min[i];
    a.n++;
    const key = `${y}-${m}`;
    pMonth.set(key, (pMonth.get(key) ?? 0) + daily.precipitation_sum[i]);
  });

  return tAcc.map((a, m) => {
    let pTotal = 0;
    for (const y of years) pTotal += pMonth.get(`${y}-${m}`) ?? 0;
    return {
      month: new Date(2000, m, 1).toLocaleString("en", { month: "long" }),
      tMean: a.mean / a.n,
      tMax: a.max / a.n,
      tMin: a.min / a.n,
      p: pTotal / years.size,
    };
  });
}
