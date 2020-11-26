import parsePhoneNumberFromString from 'libphonenumber-js';

export default function (phoneNumber) {
  const validatedPhoneNumber = parsePhoneNumberFromString(phoneNumber, 'US');
  if (validatedPhoneNumber) {
    return validatedPhoneNumber.isValid();
  }
  return false;
}
