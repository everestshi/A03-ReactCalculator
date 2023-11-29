import { useState } from 'react';
import { calculatorButtons } from '../data/calculatorButtons';
import '../styles/calculator.css';

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [storedValue, setStoredValue] = useState('0');
  const [inputHistory, setInputHistory] = useState('');
  
  const handleButtonClick = (value, type) => {
    const maxDisplayLength = 10; // Set your desired maximum display length
    const maxConsecutiveIntegers = 9; // Set the maximum consecutive integers allowed

    if (type === 'number' && /\d/.test(value)) {
      // Check if adding another integer would exceed the consecutive limit
      const currentDisplay = displayValue.endsWith('.') ? displayValue.slice(0, -1) : displayValue;
      const consecutiveIntegers = currentDisplay.replace(/\D/g, '');

      if (consecutiveIntegers.length >= maxConsecutiveIntegers) {
        // If the consecutive integer limit is reached, prevent further input
        return;
      }
    }

    if (displayValue.length >= maxDisplayLength) {
      // If the display value has reached the limit, prevent further input
      return;
    }

    const isOperator = (char) => {
      return char === '+' || char === '-' || char === '*' || char === '/';
    };
    
    if (type === 'number') {
      setDisplayValue((prevDisplay) => {
        if (isOperator(inputHistory[inputHistory.length - 1])) {
          return value.toString();
        } else {
          return prevDisplay === '0' ? value.toString() : prevDisplay + value;
        }
      });
      setInputHistory((prevHistory) => prevHistory + value);
    } else if (type === 'operator') {
      const lastInput = inputHistory[inputHistory.length - 1];
      if (isOperator(lastInput)) {
        setInputHistory((prevHistory) => prevHistory.slice(0, -1) + value);
      } else {
        setInputHistory((prevHistory) => prevHistory + value);
      }
    } else if (type === 'enter') {
      calculateResult(inputHistory);
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
      const result = stringEval(inputHistory);
      if (Math.abs(result) > 1000000000) {
        // Convert to exponential notation if the result is larger than 100,000,000
        setDisplayValue(result.toExponential());
      } else {
        setDisplayValue(result.toString());
      }
      setInputHistory(result.toString());
    } catch (error) {
      setDisplayValue('Error');
      setInputHistory('');
    }
  };

  const handleMemory = (value) => {
    const isInteger = /^\d+$/.test(displayValue);
    switch (value) {
      case 'Memory Save':
        if (isInteger){
          setStoredValue(displayValue);
        }
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
      // setDisplayValue('0');
      // setInputHistory('');
      setDisplayValue((prevDisplay) =>
      prevDisplay.length > 1 ? prevDisplay.slice(0, -1) : '0'
    );
    setInputHistory((prevHistory) =>
      prevHistory.length > 1 ? prevHistory.slice(0, -1) : ''
    );

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
    const operators = ['+', '-', '*', '/']; // List of operators
    const operatorIndexes = [];
    let oldHistory = "";
  
    try {
      operators.forEach((operator) => {
        let index = inputHistory.lastIndexOf(operator);
        if (index !== -1) {
          operatorIndexes.push({ index, operator });
        }
      });
  
      if (operatorIndexes.length > 0) {
        const lastOperatorIndex = operatorIndexes[operatorIndexes.length - 1].index;
        oldHistory = inputHistory.substring(0, lastOperatorIndex + 1); // Adjust to include the operator
      }
      const result = Math.sqrt(stringEval(displayValue));
      setDisplayValue(result.toString());
      if (inputHistory !== '') {
        setInputHistory(oldHistory + result.toString());
      }
    } catch (error) {
      setDisplayValue('Error');
      setInputHistory('');
    }
  };
  

  const handlePercent = () => {
    const operators = ['+', '-', '*', '/']; // List of operators
    const operatorIndexes = [];
    let oldHistory = "";
  
    try {
      operators.forEach((operator) => {
        let index = inputHistory.lastIndexOf(operator);
        if (index !== -1) {
          operatorIndexes.push({ index, operator });
        }
      });
  
      if (operatorIndexes.length > 0) {
        const lastOperatorIndex = operatorIndexes[operatorIndexes.length - 1].index;
        oldHistory = inputHistory.substring(0, lastOperatorIndex + 1); // Adjust to include the operator
      }
      const result = stringEval(displayValue + '/ 100');
      setDisplayValue(result.toString());
      if (inputHistory !== '') {
        setInputHistory(oldHistory + result.toString());
      }
    } catch (error) {
      setDisplayValue('Error');
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

