export const projects = {
  title: "What I'm building",
  sub: "Built and maintained in public — the details come straight from GitHub.",
  // Shown on the first repo, the featured one.
  preview: "/docubook-home.png",
  // Only the names: description, language, stars, forks and last commit come from the GitHub API
  // (composables/useGithub.ts).
  repos: [
    "DocuBook/docubook",
    "DocuBook/editor",
    "rustasea/rustasea.github.io",
    "rustasea/framework",
  ],
} as const;
