export const getPinkbombsApiUrl = (path: string) => {
  const baseUrl = process.env.PINKBOMBS_API_BASE_URL;
  if (!baseUrl) return null;

  try {
    return new URL(path, `${baseUrl.replace(/\/+$/, "")}/`);
  } catch {
    return null;
  }
};

export const getSafeUpstreamError = (status: number) => {
  switch (status) {
    case 409:
      return "Submission conflict";
    case 422:
      return "Invalid submission";
    case 429:
      return "Too many submissions";
    default:
      return "Submission service unavailable";
  }
};
