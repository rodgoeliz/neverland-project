export default function formatPrice(priceCents) {
  const priceDollars = priceCents / 100;
  const rounded = priceDollars.toFixed(2) ;

  return `$ ${rounded}`;
}