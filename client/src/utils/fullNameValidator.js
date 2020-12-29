export default function (fullName) {
  if (!fullName || fullName.length === 0 || fullName === '') {
    return false;
  }
  const reName = /(^[A-Za-z]{2,32})([ ]{0,1})([A-Za-z\'-]{2,32})?([ ]{0,1})?([A-Za-z\'-]{2,32})?([ ]{0,1})?([A-Za-z\'-]{2,32})/;
  return reName.test(String(fullName).toLowerCase());
}
