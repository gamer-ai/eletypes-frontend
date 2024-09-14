export const adjustColorBrightness = (hex, percent) => {
  hex = hex.replace(/^#/, "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.min(255, Math.max(0, r + (r * percent) / 100));
  g = Math.min(255, Math.max(0, g + (g * percent) / 100));
  b = Math.min(255, Math.max(0, b + (b * percent) / 100));

  const toHex = (c) => c.toString(16).padStart(2, "0");

  return `#${toHex(Math.round(r))}${toHex(Math.round(g))}${toHex(Math.round(b))}`;
};
