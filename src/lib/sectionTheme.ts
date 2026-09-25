export type SectionColor = "blue" | "pink";

// Maps a (site) route pathname to its section's background/accent color
export const getSectionBackgroundClass = (pathname: string): string => {
  if (/to-act/.test(pathname)) {
    return "green";
  } else if (/to-be-inspired/.test(pathname)) {
    return "yellow";
  } else if (/about/.test(pathname) || /calculator/.test(pathname)) {
    return "pink";
  } else {
    return "blue";
  }
};

export const getSectionColor = (pathname: string): SectionColor => {
  if (
    /to-act/.test(pathname) ||
    /to-be-inspired/.test(pathname) ||
    /about/.test(pathname) ||
    /calculator/.test(pathname)
  ) {
    return "blue";
  } else {
    return "pink";
  }
};
