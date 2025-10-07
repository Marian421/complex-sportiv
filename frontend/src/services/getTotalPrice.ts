
const getTotalPrice = (pricePerHour: string, duration: string = "1.5"): string => {
  const price: number = parseFloat(pricePerHour);
  const dur: number = parseFloat(duration);

  if (Number.isNaN(price) || Number.isNaN(dur)) {
    throw new Error("Invalid input: pricePerHour and duration must be valid numbers.");
  }

  return (price * dur).toFixed(2);
}

export default getTotalPrice;