export const VARIATION_COLORS = {
  control: "hsl(230, 15%, 50%)", // Gris pour le contrôle
  variation1: "hsl(243, 75%, 59%)", // Violet/bleu pour variation 1
  variation2: "hsl(201, 96%, 32%)", // Bleu pour variation 2
  variation3: "hsl(198, 100%, 34%)", // Bleu clair pour variation 3
  variation4: "hsl(190, 95%, 39%)", // Turquoise pour variation 4
} as const;

// Fonction utilitaire pour obtenir la couleur d'une variation
export const getVariationColor = (variation: string, control: string, index: number) => {
  if (variation === control) {
    return VARIATION_COLORS.control;
  }
  const colors = Object.values(VARIATION_COLORS).slice(1); // Exclure la couleur du contrôle
  return colors[index % colors.length];
}; 