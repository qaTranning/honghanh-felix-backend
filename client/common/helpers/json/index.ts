export const jsonCheckAndParsed = <T = unknown>(json: string | null | undefined): T | null => {
  if (!json || json.trim() === '') return null;

  try {
    return JSON.parse(json) as T;
  } catch (error) {
    return null;
  }
};

export function jsonReturnStringArray(json: string | null | undefined): string[] {
  try {
    const jsonParse = jsonCheckAndParsed(json);

    if (Array.isArray(jsonParse)) {
      if (jsonParse.every((item) => typeof item === 'string')) {
        return jsonParse;
      }
    }

    return [];
  } catch (error) {
    return [];
  }
}
