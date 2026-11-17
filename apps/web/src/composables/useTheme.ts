function saved() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null; // storage can be blocked
  }
}

// Always resolved to "light" or "dark" on load, so CSS can key on the attribute alone.
const root = document.documentElement;
root.dataset.theme =
  saved() ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export function toggleTheme() {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch {
    // The choice still holds for this page view.
  }
}
