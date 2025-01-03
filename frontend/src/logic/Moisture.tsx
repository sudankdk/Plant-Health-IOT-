export const MoistureLevel = (value: number): string => {
  const newValue = value / 100;
  if (newValue >= 0.5 && newValue < 0.8) {
    return "Hydrated";
  } else if (newValue >= 0.8) {
    return "Over Hydrated";
  } else {
    return "Need Hydratation";
  }
};
