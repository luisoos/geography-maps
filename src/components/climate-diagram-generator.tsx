"use client";

import { useState } from "react";
import { City } from "@/app/hooks/get-coordinates-by-city";
import { CityPicker } from "@/components/city-picker";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

export default function ClimateDiagramGenerator({
  lang,
  placeholder,
  emptyMessage,
  generateMessage,
  generateLoadingMessage,
}: {
  lang: string;
  placeholder: string;
  emptyMessage: string;
  generateMessage: string;
  generateLoadingMessage: string;
}) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [generationLoading, setGenerationLoading] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationResult, setGenerationResult] = useState<{ latitude: number; longitude: number; stats: any; code: string } | null>(null);

  async function generateClimateDiagram() {
    if (!selectedCity) {
      return;
    }
    setGenerationLoading(true);
    setGenerationError(null);

    try {
      const response = await fetch(
        `/api/climate-diagrams?longitude=${selectedCity.longitude}&latitude=${selectedCity.latitude}&lang=${lang}`,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to generate climate diagram: ${response.statusText}`,
        );
      }

      const result = await response.json();
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

  return (
    <div>
      <CityPicker
        className="mt-4"
        language={lang}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        value={selectedCity}
        onValueChange={setSelectedCity}
      />

      <Button
        onClick={async () => {
          await generateClimateDiagram();
        }}
      >
        {generationLoading ? (
          <div className="flex">
            <Loader /> {generateLoadingMessage}
          </div>
        ) : (
          generateMessage
        )}
      </Button>

      {JSON.stringify(generationResult, null, 2)}
    </div>
  );
}
