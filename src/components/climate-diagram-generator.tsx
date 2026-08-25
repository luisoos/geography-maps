"use client";

import { useState } from "react";
import type { City } from "@/app/hooks/get-coordinates-by-city";
import getClimateDiagram, {
  type ClimateDiagram,
} from "@/app/hooks/get-climate-diagram";
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
  const [generationResult, setGenerationResult] =
    useState<ClimateDiagram | null>(null);

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
        className="mt-4"
        disabled={!selectedCity || generationLoading}
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
        <pre className="mt-4 overflow-auto text-sm">
          {JSON.stringify(generationResult, null, 2)}
        </pre>
      )}
    </div>
  );
}
