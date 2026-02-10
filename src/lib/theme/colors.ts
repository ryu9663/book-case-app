export const colors = {
  // Shelf / wood tones
  shelfBrown: '#8B6914',
  shelfDark: '#6B4F12',
  shelfLight: '#A67C2E',
  shelfHighlight: '#C4A55A',

  // Backgrounds
  cream: '#F5F0E8',
  warmWhite: '#FDF8F0',
  paper: '#FFFDF7',

  // Text
  textPrimary: '#2C1810',
  textSecondary: '#5C4033',
  textMuted: '#8B7355',

  // Book spine colors
  spineColors: [
    '#C0392B', // red
    '#2980B9', // blue
    '#27AE60', // green
    '#8E44AD', // purple
    '#D35400', // orange
    '#16A085', // teal
    '#2C3E50', // navy
    '#E74C3C', // bright red
    '#3498DB', // light blue
    '#1ABC9C', // aqua
    '#9B59B6', // violet
    '#F39C12', // gold
  ] as const,

  // Status
  error: '#C0392B',
  success: '#27AE60',
} as const;

export function getSpineColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.spineColors.length;
  return colors.spineColors[index];
}
