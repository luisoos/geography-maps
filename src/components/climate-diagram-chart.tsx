import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Stats } from "@/lib/climate/stats-calculator";

export type StatKey = keyof Stats;
export type StatsLabels = Record<
  StatKey,
  { label: string; description: string; unit: string }
>;

export function ClimateDiagramChart({
  chartData,
  colors = {
    tMean: "red",
    tMin: "blue",
    tMax: "green",
    p: "blue",
  },
  stats,
  koppen,
  cityName,
  language,
  labels,
  statsLabels,
  precipitationAsLine = false,
  showMinimum = true,
  showMaximum = true,
}: {
  chartData: MonthlyData[];
  colors?: {
    tMean: string;
    tMin: string;
    tMax: string;
    p: string;
  };
  stats: Stats;
  koppen: string;
  cityName: string;
  language: string;
  labels: {
    meanTemperature: string;
    minimumTemperature: string;
    maximumTemperature: string;
    precipitation: string;
    diagram: string;
    monthlyNormals: string;
    koppenGeiger: string;
    stats: string;
    temperatureCategory: string;
    precipitationCategory: string;
    locationCategory: string;
    northernHemisphere: string;
    southernHemisphere: string;
  };
  statsLabels: StatsLabels;
  precipitationAsLine?: boolean;
  showMinimum?: boolean;
  showMaximum?: boolean;
}) {
  const locale = language === "de" ? "de-DE" : "en-US";
  const monthName = (month: number) =>
    new Intl.DateTimeFormat(locale, { month: "short" }).format(
      new Date(2000, month, 1),
    );

  const monthFor = (key: StatKey) => {
    const values = chartData.map((item) => item[key === "tCold" || key === "tHot" ? "tMean" : "p"]);
    const indexes =
      key === "pSdry"
        ? stats.northern ? [3, 4, 5, 6, 7, 8] : [0, 1, 2, 9, 10, 11]
        : key === "pSwet"
          ? stats.northern ? [3, 4, 5, 6, 7, 8] : [0, 1, 2, 9, 10, 11]
          : key === "pWdry" || key === "pWwet"
            ? stats.northern ? [0, 1, 2, 9, 10, 11] : [3, 4, 5, 6, 7, 8]
            : values.map((_, index) => index);
    const selected = indexes.reduce((result, index) => {
      if (key === "tCold" || key === "pDry" || key === "pSdry" || key === "pWdry") {
        return values[index] < values[result] ? index : result;
      }
      return values[index] > values[result] ? index : result;
    }, indexes[0]);
    return monthName(selected);
  };

  function formatStat(key: StatKey) {
    const value = stats[key];
    if (key === "northern") {
      return value
        ? language === "de" ? "Nordhalbkugel" : "Northern"
        : language === "de" ? "Südhalbkugel" : "Southern";
    }
    if (key === "pSummerShare") return `${Math.round((value as number) * 100)} %`;
    if (key === "tmon10") return String(Math.round(value as number));

    const digits = ["MAT", "tCold", "tHot"].includes(key) ? 1 : 0;
    const formatted = (value as number).toLocaleString(
      language === "de" ? "de-DE" : "en-US",
      { maximumFractionDigits: digits },
    );
    const unit = statsLabels[key].unit;
    const result = unit ? `${formatted} ${unit}` : formatted;
    const monthlyKey = ["tCold", "tHot", "pDry", "pSdry", "pSwet", "pWdry", "pWwet"].includes(key);
    return monthlyKey ? `${result} (${monthFor(key)})` : result;
  }
  const chartConfig = {
    tMean: {
      label: labels.meanTemperature,
      color: colors.tMean,
    },
    tMin: {
      label: labels.minimumTemperature,
      color: colors.tMin,
    },
    tMax: {
      label: labels.maximumTemperature,
      color: colors.tMax,
    },
    p: {
      label: labels.precipitation,
      color: colors.p,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cityName}</CardTitle>
        <CardDescription>
          {stats.northern ? labels.northernHemisphere : labels.southernHemisphere}, {labels.koppenGeiger}: {koppen}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: number) =>
                new Intl.DateTimeFormat(language, { month: "short" }).format(
                  new Date(2000, value, 1),
                )
              }
            />

            {/* Left axis for degreees */}
            <YAxis
              yAxisId="left"
              orientation="left"
              tick={{ className: "font-mono" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v} °C`}
            />

            {/* Right axis for precipitation */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ className: "font-mono" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v} mm`}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Line
              dataKey="tMean"
              type="linear"
              stroke={colors.tMean}
              yAxisId="left"
              strokeWidth={2}
              dot={false}
            />
            {showMinimum && (
              <Line
                dataKey="tMin"
                type="linear"
                stroke={colors.tMin}
                yAxisId="left"
                strokeWidth={1}
                dot={false}
              />
            )}
            {showMaximum && (
              <Line
                dataKey="tMax"
                type="linear"
                stroke={colors.tMax}
                yAxisId="left"
                strokeWidth={1}
                dot={false}
              />
            )}
            {precipitationAsLine ? (
              <Line
                dataKey="p"
                type="linear"
                stroke="var(--color-p)"
                yAxisId="right"
                strokeWidth={1}
                dot={false}
              />
            ) : (
              <Bar dataKey="p" yAxisId="right" fill="var(--color-p)" />
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="grid w-full min-w-0 gap-x-6 gap-y-3 text-xs sm:grid-cols-2">
          {[
            { title: labels.temperatureCategory, keys: ["MAT", "tCold", "tHot", "tmon10"] as StatKey[] },
            { title: labels.precipitationCategory, keys: ["MAP", "pDry", "pSdry", "pSwet", "pWdry", "pWwet", "pSummerShare"] as StatKey[] },
          ].map((category) => (
              <section key={category.title} className="min-w-0">
                <h4 className="mb-1 font-semibold">{category.title}</h4>
                <dl className="space-y-0.5">
                  {category.keys.map((key) => (
                    <div
                      key={key}
                      title={statsLabels[key].description}
                      className="grid min-w-0 grid-cols-[minmax(0,1fr)_max-content] items-baseline gap-x-2 leading-tight"
                    >
                      <dt className="min-w-0 truncate font-normal tracking-tight">
                        {statsLabels[key].label}
                      </dt>
                      <dd className="whitespace-nowrap text-right font-mono text-[0.7rem]">
                        {formatStat(key)}
                      </dd>
                    </div>
                  ))}
                </dl>
            </section>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
