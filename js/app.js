

const buttons = document.querySelectorAll('.btn');
const display = document.querySelector('.display');
const equals = document.querySelector('.equals');
const clear = document.querySelector('.clear');
let buffer = '',
    isEvaluated;

function parseCalculationString(s) {
  var calculation = [],
      current = '';
  for (let i = 0, ch; ch = s.charAt(i); i++) {
    if ('x÷+-'.indexOf(ch) > -1) {
      if (current === '' && ch === '-') {
        current = '-';
      } else {
        calculation.push(new Decimal(current), ch);
        current = '';
      }
    } else if ('()'.indexOf(ch) > -1) {
      ')'.indexOf(ch) > -1 ? (calculation.push(new Decimal(current), ch), current = '') : calculation.push(ch);
    } else {
      current += s.charAt(i);
    }
  }
  if (current != '') {
    calculation.push(new Decimal(current));
  }
  console.log(calculation);
  return calculation;
}

function calculate(calc) {
  var ops = [{'^': (a, b) => a.pow(b)},
             {'x': (a, b) => a.mul(b), '÷': (a, b) => a.div(b)},
             {'+': (a, b) => a.add(b), '-': (a, b) => a.sub(b)}],
      newCalc = [],
      currentOp;
  for (let i = 0; i < ops.length; i++) {
    for (let j = 0; j < calc.length; j++) {
      if (calc[j] === '(') {
        newCalc.push(calculate(calc.slice(j+1, calc.lastIndexOf(')'))));
        j += calc.lastIndexOf(')') - j;
      } else if (ops[i][calc[j]]) {
        currentOp = ops[i][calc[j]];
      } else if (currentOp) {
        newCalc[newCalc.length - 1] = currentOp(newCalc[newCalc.length - 1], calc[j]);
        currentOp = null;
      } else {
        newCalc.push(calc[j]);
      }
    }
    calc = newCalc;
    newCalc = [];
  }
  if (calc.length > 1) {
    console.log('Error: unable to resolve calculation');
    return calc;
  } else {
    return calc[0].toDP(10);
  }
}

function handleClick() {
  const char = this.innerText;
  const ops = '%÷x-+';
  const numArr = buffer.split(/[()%÷x\-+]/);
  let output;
  
  if (char === '.') {
    if (numArr[numArr.length - 1].includes('.')) {
      return;
    } else if (isEvaluated) {
      clearDisplay();
      output = char;
    } else {
      output = char;
    }
  } else if (ops.indexOf(char) > -1) {
    if (buffer[buffer.length - 1].match(/[0-9)%]/) != null) {
      output = char;
    } else {
      if (char === '-') {
        if (ops.includes(buffer[buffer.length -2])) {
          output = '';
        } else {
          output = char;
        }
      } else {
        output = '';
      }
    }
  } else if ((char === '(') && (buffer[buffer.length - 1].match(/[0-9]/) != null)) {
    output = `x${char}`;
  } else if ((char.match(/[0-9]/) != null) && (buffer[buffer.length - 1] === '%')) {
    output = `x${char}`;
  } else if ((char.match(/[0-9]/) != null) && (isEvaluated)) {
    clearDisplay();
    output = char;
  } else {
    output = char;
  }
  
  buffer += output;
  display.innerText += output;
  
  isEvaluated = false;
}

function evaluate() {
  isEvaluated = true;
  display.innerText = calculate(parseCalculationString(buffer.replace('%','÷100')));
}

function clearDisplay() {
  buffer = '';
  display.innerText = buffer;
}



buttons.forEach(btn => btn.addEventListener('click', handleClick));
equals.removeEventListener('click', handleClick);
equals.addEventListener('click', evaluate);
clear.removeEventListener('click', handleClick);
clear.addEventListener('click', clearDisplay);