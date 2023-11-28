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
      calculateResult();
    } else if (type === 'memory') {
      handleMemory(value);
    } else if (type === 'clear') {
      handleClear(value);
    } else {
      switch (type) {
        case 'sign':
          handleSign();
          break;
        case 'percent':
          handlePercent();
          break;
        case 'sqrt':
          handleSqrt();
          break;
        default:
          break;
      }
    }
  };

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
        setStoredValue((prevStored) => stringEval(prevStored + '-' + displayValue));
        break;
      case 'Memory Addition':
        setStoredValue((prevStored) => stringEval(prevStored + '+' + displayValue));
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

  const handleSign = () => {
    try {
      const result = stringEval(displayValue + '*(-1)');
      setDisplayValue(result.toString());
      if (inputHistory.substring(0, 2) == '-('
          && inputHistory.charAt(inputHistory.length-1) == ')') {
            setInputHistory((prevHistory) => prevHistory.substring(2, inputHistory.length-1));
      } else if (inputHistory != '') { 
          setInputHistory((prevHistory) => '-(' + prevHistory + ')');
      }
    } catch (error) {
      setDisplayValue('Error');
      setInputHistory('');
    }
  }

  const handleSqrt = () => {
    try {
      const result = Math.sqrt(stringEval(displayValue));
      setDisplayValue(result.toString());
      if (inputHistory != '') { 
          setInputHistory((prevHistory) => '√(' + prevHistory + ')');
      }
    } catch (error) {
      setDisplayValue('Error');
      setInputHistory('');
    }
  }

  const handlePercent = () => {
    try {
      const result = stringEval(displayValue + '/ 100');
      setDisplayValue(result.toString());
      if (inputHistory != '') { 
          setInputHistory((prevHistory) => '(' + prevHistory + ')%');
      }
    } catch (error) {
      setDisplayValue('Error');
      setInputHistory('');
    }
  }

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

