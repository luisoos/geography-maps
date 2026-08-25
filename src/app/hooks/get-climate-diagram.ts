import getMonthlyNormals from "@/lib/climate/monthly-normals";
import climateStats, { type Stats } from "@/lib/climate/stats-calculator";
import { koppen } from "@/lib/climate/koeppen-geiger";

type DailyWeather = Parameters<typeof getMonthlyNormals>[0];

type ArchiveResponse = {
  daily?: DailyWeather;
};

export type ClimateDiagram = {
  latitude: number;
  longitude: number;
  monthlyData: MonthlyData[];
  stats: Stats;
  code: string;
};

export default async function getClimateDiagram(
  latitude: number,
  longitude: number,
): Promise<ClimateDiagram> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    start_date: "1991-01-01",
    end_date: "2020-12-31",
    daily:
      "temperature_2m_mean,temperature_2m_max,temperature_2m_min,precipitation_sum",
    timezone: "UTC",
  });

  const response = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Unable to fetch climate data");
  }

  const data = (await response.json()) as ArchiveResponse;
  if (!data.daily) {
    throw new Error("Climate data is unavailable for this location");
  }

  const monthlyNormals = getMonthlyNormals(data.daily);
  const stats = climateStats(monthlyNormals, latitude);

  return {
    latitude,
    longitude,
    monthlyData: monthlyNormals,
    stats,
    code: koppen(stats),
  };
}
