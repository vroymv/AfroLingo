export function getLanguageFlag(language: string): string {
  const flags: Record<string, string> = {
    Zulu: "🇿🇦",
    Swahili: "🇰🇪",
    Yoruba: "🇳🇬",
    Akan: "🇬🇭",
    Wolof: "🇸🇳",
    English: "🇺🇸",
  };

  return flags[language] ?? "🌍";
}
