// Now accepts rate and currency code
export const formatCurrency = (
  value: string | number, 
  rate: number = 1, 
  currency: string = 'USD'
) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  const convertedValue = num * rate;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency, // e.g., 'INR'
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedValue);
};

export const formatPct = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
};
