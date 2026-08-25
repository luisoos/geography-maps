import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <div>
      <h1 className="text-xl">{dictionary.home.title}</h1>
      <ul className="list-disc list-inside">
        <li>
          <a
            href={`/${lang}/climate-diagrams`}
            className={buttonVariants({ variant: "link", size: "default" })}
          >
            {dictionary.home.climateDiagrams}
          </a>
        </li>
      </ul>
    </div>
  );
}
