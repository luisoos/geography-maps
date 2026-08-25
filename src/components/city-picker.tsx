"use client";

import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import getCoordinatesByCity, {
  type City,
} from "@/app/hooks/get-coordinates-by-city";

type CityPickerProps = {
  language: string;
  placeholder: string;
  emptyMessage: string;
  className?: string;
  value: City | null;
  onValueChange: (city: City | null) => void;
};

function cityLabel(city: City) {
  const location = city.admin4
    ? `${city.admin4}, ${city.admin1 ?? city.name}`
    : city.name;

  return `${location}${city.country ? `, ${city.country}` : ""}`;
}

export function CityPicker({
  language,
  placeholder,
  emptyMessage,
  className,
  value,
  onValueChange,
}: CityPickerProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.trim().length < 2) {
      setCities([]);
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      try {
        const results = await getCoordinatesByCity(query.trim(), 8, language);
        if (!cancelled) {
          setCities(results);
        }
      } catch {
        if (!cancelled) {
          setCities([]);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [language, query]);

  return (
    <Combobox
      items={cities}
      value={value}
      onValueChange={(city) => onValueChange(city as City | null)}
      itemToStringLabel={(city) => cityLabel(city as City)}
      itemToStringValue={(city) => (city as City).name}
      onInputValueChange={(value) => setQuery(value)}
    >
      <ComboboxInput className={className} placeholder={placeholder} />
      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(city: City) => (
            <ComboboxItem key={city.id} value={city}>
              {cityLabel(city)}
              {city.country_code && (
                <img
                  src={`https://flagsapi.com/${city.country_code}/flat/16.png`}
                  alt={city.country ?? ""}
                  className="h-4 w-4"
                />
              )}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
