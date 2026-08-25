import { Bar, CartesianGrid, ComposedChart, Line, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Stats } from "@/lib/climate/stats-calculator"

const chartConfig = {
  tMean: {
    label: "Temperature (°C)",
    color: "red",
  },
  tMin: {
    label: "Minimum temperature (°C)",
    color: "blue",
  },
  tMax: {
    label: "Maximum temperature (°C)",
    color: "green",
  },
  p: {
    label: "Precipitation (mm)",
    color: "blue",
  },
} satisfies ChartConfig

export function ClimateDiagramChart({
  chartData,
  stats,
  koppen,
  cityName,
  precipitationAsLine = false,
}: {
  chartData: MonthlyData[];
  stats: Stats;
  koppen: string;
  cityName: string;
  precipitationAsLine?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cityName}</CardTitle>
        <CardDescription>Köppen-Geiger: {koppen}</CardDescription>
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="tMean"
              type="linear"
              stroke="red"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="tMin"
              type="linear"
              stroke="blue"
              strokeWidth={1}
              dot={false}
            />
            <Line
              dataKey="tMax"
              type="linear"
              stroke="green"
              strokeWidth={1}
              dot={false}
            />
            {precipitationAsLine ? (
              <Line
                dataKey="p"
                type="linear"
                stroke="var(--color-p)"
                strokeWidth={1}
                dot={false}
              />
            ) : (
              <Bar
                dataKey="p"
                fill="var(--color-p)"
              />
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Climate diagram
        </div>
        <div className="leading-none text-muted-foreground">
          Monthly climate normals
        </div>
      </CardFooter>
    </Card>
  )
}