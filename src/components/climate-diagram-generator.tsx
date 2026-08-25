"use client";

import { useState } from "react";
import type { City } from "@/app/hooks/get-coordinates-by-city";
import getClimateDiagram, {
  type ClimateDiagram,
} from "@/app/hooks/get-climate-diagram";
import { CityPicker } from "@/components/city-picker";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { ClimateDiagramChart } from "./climate-diagram-chart";
import { Checkbox } from "./ui/checkbox";

export default function ClimateDiagramGenerator({
  lang,
  placeholder,
  emptyMessage,
  generateMessage,
  generateLoadingMessage,
  displayPrecipitationAsLineMessage
}: {
  lang: string;
  placeholder: string;
  emptyMessage: string;
  generateMessage: string;
  generateLoadingMessage: string;
  displayPrecipitationAsLineMessage: string;
}) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [generationLoading, setGenerationLoading] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationResult, setGenerationResult] =
    useState<ClimateDiagram | null>(null);
  const [precipitationAsLine, setPrecipitationAsLine] = useState(false);

  async function generateClimateDiagram() {
    if (!selectedCity) {
      return;
    }
    setGenerationLoading(true);
    setGenerationError(null);

    try {
      const result = await getClimateDiagram(
        selectedCity.latitude,
        selectedCity.longitude,
      );
      setGenerationResult(result);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Failed to generate climate diagram",
      );
    } finally {
      setGenerationLoading(false);
    }
  }

  const cityName = selectedCity
    ? [selectedCity.admin4 ?? selectedCity.name, selectedCity.admin1, selectedCity.country]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <div className="space-y-6">
      <CityPicker
        className="mt-4"
        language={lang}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        value={selectedCity}
        onValueChange={setSelectedCity}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={precipitationAsLine}
          onCheckedChange={(checked) =>
            setPrecipitationAsLine(checked === true)
          }
        />
        <label htmlFor="precipitation-as-line" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {displayPrecipitationAsLineMessage}
        </label>
      </div>

      <Button
        disabled={selectedCity === null || generationLoading}
        onClick={generateClimateDiagram}
      >
        {generationLoading ? (
          <div className="flex">
            <Loader /> {generateLoadingMessage}
          </div>
        ) : (
          generateMessage
        )}
      </Button>

      {generationError && (
        <p className="mt-4 text-sm text-destructive">{generationError}</p>
      )}
      {generationResult && (
        <>
          <ClimateDiagramChart
            chartData={generationResult.monthlyData}
            stats={generationResult.stats}
            koppen={generationResult.code}
            cityName={cityName}
            precipitationAsLine={precipitationAsLine}
          />
        </>
      )}
    </div>
  );
}
