export default function (zipCode) {
  const re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  return re.test(String(zipCode).toLowerCase());
}
