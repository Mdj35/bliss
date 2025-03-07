import { useState, useEffect } from 'react';

const useConsolePasscode = (correctPasscode, onPasscodeCorrect) => {
  const [isPasscodeCorrect, setIsPasscodeCorrect] = useState(false);

  useEffect(() => {
    const promptPasscode = () => {
      let input = '';
      let attempts = 0;
      const maxAttempts = 2;

      while (input !== correctPasscode && attempts < maxAttempts) {
        input = prompt('Enter passcode:');
        if (input === correctPasscode) {
          setIsPasscodeCorrect(true);
          onPasscodeCorrect();
          break;
        } else {
          console.log('Incorrect passcode');
          attempts++;
        }
      }

      if (attempts >= maxAttempts) {
        console.log('Maximum attempts exceeded');
      }
    };

    promptPasscode();
  }, [correctPasscode, onPasscodeCorrect]);

  return isPasscodeCorrect;
};

export default useConsolePasscode;