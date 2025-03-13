export const validateName = name => {
  if (!name) {
    return 'Name is required';
  }
  if (name.length < 4) {
    return 'Name is at least 4 characters long';
  }
  return '';
};

export const validateEmail = email => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = password => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 4) {
    return 'Password must be at least 4 characters long';
  }
  return '';
};

export const validateContactNumber = contactNumber => {
  const contactNumberPattern = /^[0-9]{11}$/;
  if (!contactNumber) {
    return 'Contact number is required';
  }
  if (!contactNumberPattern.test(contactNumber)) {
    return 'Contact number must be 11 digits';
  }
  return '';
};

export const validateFields = fields => {
  const validationFunctions = {
    email: validateEmail,
    password: validatePassword,
    fullName: validateName,
    contactNumber: validateContactNumber,
  };

  const errors = {};

  Object.keys(fields).forEach(field => {
    if (validationFunctions[field]) {
      const error = validationFunctions[field](fields[field]);
      if (error) {
        errors[field] = error;
      }
    }
  });

  return errors;
};

export const isValidInput = fields => {
  const errors = validateFields(fields);

  return Object.values(errors).every(error => error === '');
};
