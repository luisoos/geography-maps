"use client";

import { useEffect, useState } from "react";
import type { City } from "@/app/hooks/get-coordinates-by-city";
import getClimateDiagram, {
  type ClimateDiagram,
} from "@/app/hooks/get-climate-diagram";
import { CityPicker } from "@/components/city-picker";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { ClimateDiagramChart, type StatsLabels } from "./climate-diagram-chart";
import { Checkbox } from "./ui/checkbox";
import ColorPickerPopover from "./ui/color-picker-popover";

export default function ClimateDiagramGenerator({
  lang,
  placeholder,
  emptyMessage,
  generateMessage,
  generateLoadingMessage,
  displayPrecipitationAsLineMessage,
  showMinMessage,
  showMaxMessage,
  showMeanMessage,
  colorLabel,
  colorDescription,
  chartLabels,
  statsLabels,
  errorMessage,
  displaySettingsHeading,
  colorsHeading,
  precipitationColorMessage,
}: {
  lang: string;
  placeholder: string;
  emptyMessage: string;
  generateMessage: string;
  generateLoadingMessage: string;
  displayPrecipitationAsLineMessage: string;
  showMinMessage: string;
  showMaxMessage: string;
  showMeanMessage: string;
  colorLabel: string;
  colorDescription: string;
  chartLabels: {
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
  errorMessage: string;
  displaySettingsHeading: string;
  colorsHeading: string;
  precipitationColorMessage: string;
}) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [generationLoading, setGenerationLoading] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationResult, setGenerationResult] =
    useState<ClimateDiagram | null>(null);
  const [precipitationAsLine, setPrecipitationAsLine] = useState(false);
  const [showMin, setShowMin] = useState(true);
  const [showMax, setShowMax] = useState(true);

  const [minColor, setMinColor] = useState("#3b82f6");
  const [meanColor, setMeanColor] = useState("#10b981");
  const [maxColor, setMaxColor] = useState("#f59e0b");
  const [precipitationColor, setPrecipitationColor] = useState("#3b82f6");
  const [cityStorageReady, setCityStorageReady] = useState(false);

  useEffect(() => {
    const storedCity = window.localStorage.getItem("climate-diagram-city");
    if (storedCity) {
      try {
        setSelectedCity(JSON.parse(storedCity) as City);
      } catch {
        window.localStorage.removeItem("climate-diagram-city");
      }
    }
    setCityStorageReady(true);
  }, []);

  useEffect(() => {
    if (!cityStorageReady) {
      return;
    }

    if (selectedCity) {
      window.localStorage.setItem(
        "climate-diagram-city",
        JSON.stringify(selectedCity),
      );
    } else {
      window.localStorage.removeItem("climate-diagram-city");
    }
  }, [cityStorageReady, selectedCity]);

  const cacheKey = selectedCity
    ? `climate-diagram:${selectedCity.latitude}:${selectedCity.longitude}`
    : null;

  useEffect(() => {
    setGenerationError(null);
    if (!cacheKey) {
      setGenerationResult(null);
      return;
    }

    const cachedResult = window.localStorage.getItem(cacheKey);
    if (!cachedResult) {
      setGenerationResult(null);
      return;
    }

    try {
      setGenerationResult(JSON.parse(cachedResult) as ClimateDiagram);
    } catch {
      window.localStorage.removeItem(cacheKey);
      setGenerationResult(null);
    }
  }, [cacheKey]);


  async function generateClimateDiagram() {
    if (!selectedCity) {
      return;
    }
    setGenerationLoading(true);
    setGenerationError(null);

    try {
      if (cacheKey) {
        const cachedResult = window.localStorage.getItem(cacheKey);
        if (cachedResult) {
          setGenerationResult(JSON.parse(cachedResult) as ClimateDiagram);
          return;
        }
      }

      const result = await getClimateDiagram(
        selectedCity.latitude,
        selectedCity.longitude,
      );
      setGenerationResult(result);
      if (cacheKey) {
        window.localStorage.setItem(cacheKey, JSON.stringify(result));
      }
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : errorMessage,
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

      <Button
        disabled={selectedCity === null || generationLoading}
        onClick={generateClimateDiagram}
      >
        {generationLoading ? (
          <div className="flex">
            <Loader className="my-auto mr-2" /> {generateLoadingMessage}
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
            language={lang}
            labels={{
              ...chartLabels,
            }}
            statsLabels={statsLabels}
            colors={{
              tMean: meanColor,
              tMin: minColor,
              tMax: maxColor,
              p: precipitationColor,
            }}
            precipitationAsLine={precipitationAsLine}
            showMinimum={showMin}
            showMaximum={showMax}
          />

          <div>
            <h2 className="mb-2 text-sm font-semibold">{displaySettingsHeading} & {colorsHeading}</h2>
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
              <ColorPickerPopover color={precipitationColor} setColor={setPrecipitationColor} label={colorLabel} description={colorDescription} />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    checked={showMin}
                    onCheckedChange={(checked) =>
                        setShowMin(checked === true)
                    }
                />
                <label htmlFor="show-min" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {showMinMessage}
                </label>
                    <ColorPickerPopover color={minColor} setColor={setMinColor} label={colorLabel} description={colorDescription} />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    disabled
                    checked={true}
                />
                <label htmlFor="show-min" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {showMeanMessage}
                </label>
                <ColorPickerPopover color={meanColor} setColor={setMeanColor} label={colorLabel} description={colorDescription} />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    checked={showMax}
                    onCheckedChange={(checked) =>
                        setShowMax(checked === true)
                    }
                />
                <label htmlFor="precipitation-as-line" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {showMaxMessage}
                </label>
                <ColorPickerPopover color={maxColor} setColor={setMaxColor} label={colorLabel} description={colorDescription} />
            </div>
          </div>
        </>
    )}
    </div>
  );
}
