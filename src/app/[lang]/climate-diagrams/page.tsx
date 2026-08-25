import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import ClimateDiagramGenerator from "@/components/climate-diagram-generator";

export default async function ClimateDiagrams({
  params,
}: PageProps<"/[lang]/climate-diagrams">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <div>
      <h1 className="text-xl">{dictionary.climateDiagrams.title}</h1>
      <ClimateDiagramGenerator
        lang={lang}
        placeholder={dictionary.climateDiagrams.searchPlaceholder}
        emptyMessage={dictionary.climateDiagrams.noCities}
        generateMessage={dictionary.climateDiagrams.generate}
        generateLoadingMessage={dictionary.climateDiagrams.generateLoading}
        displayPrecipitationAsLineMessage={dictionary.climateDiagrams.displayPrecipitationAsLineMessage}
      />
    </div>
  );
}
