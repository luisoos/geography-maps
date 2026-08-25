import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";

export function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  await getDictionary(lang);

  return children;
}
