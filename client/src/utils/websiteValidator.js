export default function (website) {
  if (!website || website.length == 0 || website == '') {
    return false;
  }
  const re = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;
  return re.test(String(website).toLowerCase());
}
