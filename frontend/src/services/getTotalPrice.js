
const getTotalPrice = (pricePerHour, duration = 1.5) => {
  const price = parseFloat(pricePerHour);
  const dur = parseFloat(duration);

  if (Number.isNaN(price) || Number.isNaN(dur)) {
    throw new Error("Invalid input: pricePerHour and duration must be valid numbers.");
  }

  return (price * dur).toFixed(2);
}

export default getTotalPrice;