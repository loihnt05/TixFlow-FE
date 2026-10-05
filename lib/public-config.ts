function normalizedHttpUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

export function apiBaseUrl(): string | undefined {
  return normalizedHttpUrl(process.env.NEXT_PUBLIC_API_URL);
}
