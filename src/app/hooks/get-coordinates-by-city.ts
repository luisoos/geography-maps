export type City = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
};

type GeocodingResponse = {
  results?: City[];
};

export default async function getCoordinatesByCity(
  cityName: string,
  count = 8,
  language = "de",
): Promise<City[]> {
  const params = new URLSearchParams({
    name: cityName,
    count: String(count),
    language,
    format: "json",
  });
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("City search failed");
  }

  const data = (await response.json()) as GeocodingResponse;
  return data.results ?? [];
}
