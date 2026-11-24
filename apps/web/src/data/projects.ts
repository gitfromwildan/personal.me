export const projects = {
  title: "What I'm building",
  sub: "Built and maintained in public — the details come straight from GitHub.",
  // Shown on the first repo, the featured one.
  preview: "/docubook-home.webp",
  // Only the names: description, language, stars, forks and last commit come from the GitHub API
  // (composables/useGithub.ts).
  repos: ["DocuBook/docubook", "lotype/lotype", "DocuBook/editor", "rustasea/framework"],
} as const;
