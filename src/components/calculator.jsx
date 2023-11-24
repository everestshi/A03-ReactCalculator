import { useState } from 'react';
import { calculatorButtons } from '../data/calculatorButtons';
import '../styles/calculator.css';

const Calculator = () => {
    const [displayValue, setDisplayValue] = useState('0');
    const [storedValue, setStoredValue] = useState('0');
    const [inputHistory, setInputHistory] = useState('');
  
    const handleButtonClick = (value, type) => {
      // Implement functionality based on button type
      if (type === 'number' || type === 'operator') {
        setDisplayValue((prevDisplay) =>
          prevDisplay === '0' ? value.toString() : prevDisplay + value
        );
        setInputHistory((prevHistory) => prevHistory + value);
      } else if (type === 'enter') {
        calculateResult();
      }

    if (type === 'clear' && value === 'All Clear') {
      setDisplayValue('0');
      setInputHistory('');
    }
      //(handle other types)
    };
  
    // Custom function using Function constructor
    const stringEval = (fn) => new Function('return ' + fn)();

    const calculateResult = () => {
      try {
        const result = stringEval(displayValue);
        setDisplayValue(result.toString());
        setInputHistory((prevHistory) => prevHistory);
      } catch (error) {
        setDisplayValue('Error');
        setInputHistory('');
      }
    };


  return (
    <div className="calculator">
      <div className="display">{displayValue}</div>
      <div className="memory-board">
        <div className="memory-store">M</div>
        <div className="memory-input">{inputHistory}</div>
      </div>
      <div className ="buttons-board">
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
    </div>
  );
};

export default Calculator;
