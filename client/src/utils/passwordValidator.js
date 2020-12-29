const PasswordValidator = require('password-validator');

export default function (password) {
  // validate password
  const passSchema = new PasswordValidator();
  passSchema
    .is()
    .min(8)
    .is()
    .max(50)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits(1)
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf(['`12345', 'Passw0rd', 'Password1234']);
  return passSchema.validate(password, { list: true });
}
