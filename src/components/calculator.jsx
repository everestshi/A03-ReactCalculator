import React, { useState } from 'react';
import { calculatorButtons } from '../data/calculatorButtons';
import '../styles/calculator.css';

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [storedValue, setStoredValue] = useState('0');
  const [inputHistory, setInputHistory] = useState('');
  
  const handleButtonClick = (value, type) => {
    if (type === 'number' || type === 'operator') {
      setDisplayValue((prevDisplay) =>
        prevDisplay === '0' ? value.toString() : prevDisplay + value
      );
      setInputHistory((prevHistory) => prevHistory + value);
    } else if (type === 'enter') {
      calculateResult(inputHistory + displayValue);
    } else if (type === 'memory') {
      handleMemory(value);
    } else if (type === 'clear') {
      handleClear(value);
    }
  };

  const stringEval = (fn) => new Function('return ' + fn)();

  const calculateResult = () => {
    try {
      const result = stringEval(displayValue);
      setDisplayValue(result.toString());
      // setInputHistory((prevHistory) => prevHistory);
      setInputHistory(result.toString());
    } catch (error) {
      setDisplayValue('Error');
      setInputHistory('');
    }
  };

  const handleMemory = (value) => {
    switch (value) {
      case 'Memory Save':
        setStoredValue(displayValue);
        break;
      case 'Memory Clear':
        setStoredValue('0');
        break;
      case 'Memory Recall':
        setDisplayValue(storedValue);
        setInputHistory(storedValue);
        break;
        case 'Memory Subtract':
          setDisplayValue((displayValue) => stringEval(displayValue + '-' + storedValue));
          break;
        case 'Memory Addition':
          setDisplayValue((displayValue) => stringEval(displayValue + '+' + storedValue));
          break;
      default:
        break;
    }
  };

  const handleClear = (value) => {
    if (value === 'All Clear') {
      setDisplayValue('0');
      setInputHistory('');
      setStoredValue('0');

    } else if (value === 'Clear') {
      setDisplayValue('0');
      setInputHistory('');

    }
  };

  return (
    <div className="calculator">
      <div className="display">{displayValue}</div>
      <div className="memory-board">
        <div className="memory-store">{storedValue !== '0' ? storedValue : 'M'}</div>
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

