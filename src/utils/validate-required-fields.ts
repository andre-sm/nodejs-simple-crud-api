export const validateRequiredFields = (username: string, age: number, hobbies: string[]) => {
  try {
    const messages = [];
    if (username !== null && (!username || username === '')) {
      messages.push('User name is required');
    } else if (typeof username !== 'string') {
      messages.push('User name must be a string');
    }

    if (!age && age !== null && age !== 0) {
      messages.push('User age is required');
    } else if (typeof age !== 'number') {
      messages.push('User age must be a number');
    } else if (age === 0) {
      messages.push('User age shouldn\'t be 0');
    }

    const isEveryIsString = Array.isArray(hobbies)
    && hobbies.every((hobby) => typeof hobby === 'string' && hobby !== '');

    if (!hobbies) {
      messages.push('User hobbies are required');
    } else if (!Array.isArray(hobbies)) {
      messages.push('User hobbies must be an array');
    } else if (!isEveryIsString) {
      messages.push('User hobbies must contain non-empty strings');
    }

    const validationResult: { isValid: boolean; message: string } = { isValid: true, message: '' };

    if (messages.length !== 0) {
      validationResult.isValid = false;

      if (messages.length !== 1) {
        const message = `Errors: ${messages.join(', ')}`;
        validationResult.message = message;
      } else {
        validationResult.message = `Error: ${messages}`;
      }
    }

    return validationResult;
  } catch (error) {
    throw Error('An Error occurred while required fields validation');
  }
};
