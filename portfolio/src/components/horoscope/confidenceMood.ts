/** Map 0–100 confidence to a simple mood for the glance UI (emoji + screen reader). */
export function moodFromConfidence(value: number): { emoji: string; label: string } {
  const n = Math.max(0, Math.min(100, Math.round(Number(value))));
  if (n >= 70) return { emoji: "😊", label: "Strong day" };
  if (n >= 45) return { emoji: "😐", label: "Mixed or mild" };
  return { emoji: "😔", label: "Challenging or low energy" };
}
