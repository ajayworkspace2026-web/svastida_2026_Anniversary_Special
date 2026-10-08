export function recommendSize(bust: number) {
  if (!Number.isFinite(bust) || bust <= 0) return "Custom";
  if (bust <= 84) return "S";
  if (bust <= 92) return "M";
  if (bust <= 100) return "L";
  if (bust <= 108) return "XL";
  return "XXL";
}
