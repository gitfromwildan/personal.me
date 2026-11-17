// The theme is the data-theme attribute on <html>, "light" or "dark". A script in index.html
// sets it before the page is first painted, from the saved choice or else the system's.

export function toggleTheme() {
  const root = document.documentElement;
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch {
    // The choice still holds for this page view.
  }
}
