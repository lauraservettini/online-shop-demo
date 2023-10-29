function isEmpty(value) {
  return (!value || value.trim() === "");
}

function userCredentialAreValid(email, password) {
  return (
    email && email.includes("@") && 
    password && password.trim().length >= 6
  );
}

function userDetailIsValid(
  email,
  password,
  fullName,
  street,
  postalCode,
  city
) {
  return (
    userCredentialAreValid(email, password) ||
    !isEmpty(fullName) ||
    !isEmpty(street) ||
    !isEmpty(postalCode) ||
    !isEmpty(city)
  );
}

function emailIsConfirmed(email, confirmEmail) {
  console.log(email===confirmEmail);
  return (email === confirmEmail);
}

module.exports = {
    userDetailIsValid: userDetailIsValid,
    emailIsConfirmed: emailIsConfirmed
}
