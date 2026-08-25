import { koppen } from "@/lib/climate/koeppen-geiger";
import getMonthlyNormals from "@/lib/climate/monthly-normals";
import climateStats from "@/lib/climate/stats-calculator";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "latitude and longitude are required" },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    latitude,
    longitude,
    start_date: "1991-01-01",
    end_date: "2020-12-31",
    daily:
      "temperature_2m_mean,temperature_2m_max,temperature_2m_min,precipitation_sum",
    timezone: "UTC",
  });

  const weatherResponse = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`,
  );

  if (!weatherResponse.ok) {
    return NextResponse.json(
      { error: "Unable to fetch climate data" },
      { status: weatherResponse.status },
    );
  }

  const weatherData = await weatherResponse.json();

  const monthlyNormals = getMonthlyNormals(weatherData.daily);
  const stats = climateStats(monthlyNormals, latitude ? parseFloat(latitude) : 0);
  const code = koppen(stats);

  return NextResponse.json({ latitude, longitude, stats, code });
}
