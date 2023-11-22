import { useState } from 'react';
import { calculatorButtons } from '../data/calculatorButtons';
import '../styles/calculator.css';

const Calculator = () => {
    const [displayValue, setDisplayValue] = useState('0');
    const [storedValue, setStoredValue] = useState('0');
  
    const handleButtonClick = (value, type) => {
      // Implement functionality based on button type
      if (type === 'number' || type === 'operator') {
        setDisplayValue((prevDisplay) =>
          prevDisplay === '0' ? value.toString() : prevDisplay + value
        );
      } else if (type === 'enter') {
        calculateResult();
      }

      if (type === 'clear' && value === 'All Clear'){
        setDisplayValue((prevDisplay) =>
            prevDisplay = '0'
        );
      } 
      //(handle other types)
    };
  
    // Custom function using Function constructor
    const stringEval = (fn) => new Function('return ' + fn)();

    const calculateResult = () => {
      try {
        const result = stringEval(displayValue);
        setDisplayValue(result.toString());
      } catch (error) {
        setDisplayValue('Error');
      }
    };


  return (
    <div className="calculator">
      <div className="display">{displayValue}</div>
      <div className="buttons">
        {calculatorButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(button.value, button.type)}
            className={button.className}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
