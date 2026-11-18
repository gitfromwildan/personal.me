// The page shown at an address that has no page: a sonar ping into deep water, unanswered.
export const notFound = {
  title: "Page not found",
  status: "Signal lost",
  headline: ["This page sank out of reach.", "Nothing answers at this depth."],
  body: "The address you followed has no page behind it: it may have moved, or it never existed. Head back up to the surface.",
  cta: "Back to the surface",
  // Followed by the address that was asked for.
  echo: "No echo from",
} as const;
