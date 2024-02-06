export const validateRequiredFields = (username: string, age: number, hobbies: string[]) => {
  try {
    const messages = [];
    if (!username || username === '' || (typeof username !== 'string')) {
      messages.push('User name is required');
    }

    if (!age || typeof age !== 'number') {
      messages.push('User age is required');
    }

    const isEveryIsString = Array.isArray(hobbies)
    && hobbies.every((hobby) => typeof hobby === 'string' && hobby !== '');

    if (!Array.isArray(hobbies) || (Array.isArray(hobbies) && !isEveryIsString)) {
      messages.push('User hobbies are required');
    }

    const validationResult: { isValid: boolean; message: string } = { isValid: true, message: '' };

    if (messages.length !== 0) {
      validationResult.isValid = false;

      if (messages.length !== 1) {
        const requiredFieldNames = messages.map((field) => field.split(' ')[1]);
        const message = `Error: User ${requiredFieldNames.join(', ')} are required`;
        validationResult.message = message;
      } else {
        validationResult.message = `Error: ${messages.toString()}`;
      }
    }

    return validationResult;
  } catch (error) {
    throw Error('An Error occurred while required fields validation');
  }
};
