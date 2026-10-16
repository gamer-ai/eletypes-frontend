import { themesOptions, defaultTheme } from "./theme.js";

export const CUSTOM_THEMES_KEY = "custom-themes";
export const CUSTOM_THEME_PREFIX = "custom__";

export const loadCustomThemes = () => {
  try {
    const raw = window.localStorage.getItem(CUSTOM_THEMES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
};

export const saveCustomThemes = (themes) => {
  window.localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(themes));
};

const genId = () =>
  CUSTOM_THEME_PREFIX +
  Date.now().toString(36) +
  Math.random().toString(36).slice(2, 8);

export const isCustomTheme = (theme) =>
  !!theme &&
  typeof theme.id === "string" &&
  theme.id.startsWith(CUSTOM_THEME_PREFIX);

export const newThemeFrom = (baseTheme, name) => ({
  id: genId(),
  label: name,
  background: baseTheme.background,
  text: baseTheme.text,
  gradient: baseTheme.gradient,
  title: baseTheme.title,
  textTypeBox: baseTheme.textTypeBox,
  stats: baseTheme.stats,
  fontFamily: baseTheme.fontFamily,
  textShadow: baseTheme.textShadow || "",
});

// Resolve a persisted "theme" object against built-in + custom union.
// Custom: look up by id. If deleted, fall back to the stored snapshot so the
// page doesn't suddenly re-style itself before the user picks a new theme.
// Built-in: look up by label so changes to built-ins propagate on reload.
export const resolveTheme = (saved, customThemes) => {
  if (!saved) return defaultTheme;
  if (saved.id && typeof saved.id === "string" && saved.id.startsWith(CUSTOM_THEME_PREFIX)) {
    const found = (customThemes || []).find((t) => t.id === saved.id);
    return found || saved;
  }
  const builtin = themesOptions.find((e) => e.value.label === saved.label);
  if (builtin) return builtin.value;
  return saved;
};

// react-select supports grouped options natively via {label, options: [...]}.
// Themes flagged `isNew` get their own group pinned above Built-in so new
// arrivals are discoverable; the flag lives on the option (not the theme
// object) so it never leaks into persisted user data.
export const buildGroupedOptions = (customThemes, t) => {
  const fresh = themesOptions.filter((o) => o.isNew);
  const rest = themesOptions.filter((o) => !o.isNew);
  const groups = [];
  if (fresh.length > 0) {
    groups.push({
      label: t ? t("theme_group_new") : "New",
      options: fresh,
    });
  }
  groups.push({
    label: t ? t("theme_group_builtin") : "Built-in",
    options: rest,
  });
  if (customThemes && customThemes.length > 0) {
    groups.push({
      label: t ? t("theme_group_mine") : "My Themes",
      options: customThemes.map((th) => ({ value: th, label: th.label })),
    });
  }
  return groups;
};

export const findOptionForTheme = (groupedOptions, theme) => {
  if (!theme) return null;
  for (const grp of groupedOptions) {
    for (const opt of grp.options) {
      if (theme.id && opt.value.id === theme.id) return opt;
      if (!theme.id && !opt.value.id && opt.value.label === theme.label) return opt;
    }
  }
  return null;
};
