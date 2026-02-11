export const colors = {
  // Shelf / wood tones (Deep Walnut / Oak)
  shelfBrown: '#5D4037', // Deep wood
  shelfDark: '#3E2723',  // Shadow
  shelfLight: '#8D6E63', // Highlight / Lighter wood
  shelfHighlight: '#A1887F', // Top edge highlight
  
  // Backgrounds (Parchment / Warm Paper)
  cream: '#F5F5DC',      // Main background (Beige)
  warmWhite: '#FAF3E0',  // Cards / content areas
  paper: '#FFF8E1',      // Book pages / notes
  
  // Text (Ink / Contrast)
  textPrimary: '#3E2723',   // Dark Brown Ink
  textSecondary: '#5D4037', // Medium Brown Ink
  textMuted: '#8D6E63',     // Faded Ink
  
  // Accents
  accentGreen: '#558B2F', // Forest Green
  accentGold: '#FFB300',  // Gold Foil

  // Book spine colors (Vintage / Muted)
  spineColors: [
    '#8D3B3B', // Vintage Red
    '#3B6E8D', // Muted Blue
    '#3B8D56', // Forest Green
    '#6D3B8D', // Plum
    '#8D5B3B', // Terracotta
    '#3B8D85', // Teal
    '#2F3E46', // Charcoal
    '#A63A3A', // Brick Red
    '#4A6FA5', // Slate Blue
    '#457B9D', // Steel Blue
    '#7D5BA6', // Muted Purple
    '#D4AF37', // Gold Foil
  ] as const,

  // Status
  error: '#B71C1C',
  success: '#2E7D32',
} as const;

export function getSpineColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.spineColors.length;
  return colors.spineColors[index];
}
