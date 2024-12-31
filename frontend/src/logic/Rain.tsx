export const willItRain = (
  humidity: number,
  temperature: number,
  condition: string
) => {
  console.log(humidity, temperature, condition);

  const normalizedCondition = condition ? condition.toLowerCase() : "";

  if (humidity > 80 && normalizedCondition.includes("rain")) {
    return "Likely to rain";
  } else if (humidity > 70 && temperature > 20) {
    return "Unlikely to rain, but humid";
  } else if (humidity > 60 && temperature > 25) {
    return "Unlikely to rain, warm and dry";
  } else if (humidity <= 60) {
    return "Unlikely to rain, dry conditions";
  } else {
    return "Not enough data to predict rain";
  }
};
