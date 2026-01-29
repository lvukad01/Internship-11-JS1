const keys = [
  {label: '7', type: 'number'}, {label: '8', type: 'number'}, {label: '9', type: 'number'}, {label: '÷', type: 'operation', func: (a,b) => a/b, shiftFunc: (a) => Math.sqrt(a)},
  {label: '4', type: 'number'}, {label: '5', type: 'number'}, {label: '6', type: 'number'}, {label: '×', type: 'operation', func: (a,b) => a*b, shiftFunc: (a) => Math.cbrt(a)},
  {label: '1', type: 'number'}, {label: '2', type: 'number'}, {label: '3', type: 'number'}, {label: '-', type: 'operation', func: (a,b) => a-b, shiftFunc: (a) => Math.log10(a)},
  {label: '0', type: 'number'}, {label: '.', type: 'number'}, {label: '=', type: 'action'}, {label: '+', type: 'operation', func: (a,b) => a+b, shiftFunc: (a) => a*a},
  {label: 'x²', type: 'operation', func: (a) => a*a, shiftFunc: (a) => a*a*a}
];

let shift = false;
let on = true;
let currentInput = '';
let currentOp = null;
let firstValue = null;
let history = [];

const buttonsDiv = document.getElementById('buttons');

function renderButtons() {
  buttonsDiv.innerHTML = '';
  keys.forEach((key, index) => {
    const btn = document.createElement('button');
    btn.textContent = shift && key.shiftFunc ? key.shiftFunc.name : key.label;
    btn.disabled = !on;
    btn.addEventListener('click', () => handleKey(key));
    buttonsDiv.appendChild(btn);
  });
}

function handleKey(key) {
  const display = document.getElementById('display');
  
  if(key.type === 'number') {
    currentInput += key.label;
    display.value = currentInput;
  } 
  else if(key.type === 'operation') {
    if(firstValue === null) {
      firstValue = parseFloat(currentInput);
      currentInput = '';
      currentOp = shift && key.shiftFunc ? key.shiftFunc : key.func;
      display.value = '';
    }
  } 
  else if(key.label === '=') {
    if(currentOp && firstValue !== null) {
      let secondValue = parseFloat(currentInput);
      let result;
      try {
        result = currentOp.length === 1 ? currentOp(firstValue) : currentOp(firstValue, secondValue);
      } catch(e) {
        result = 'Error';
      }
      display.value = result;
      history.push({input1: firstValue, input2: secondValue, operation: currentOp.name || key.label, result, time: new Date()});
      firstValue = null;
      currentInput = '';
      currentOp = null;
    }
  }
}

document.getElementById('shiftBtn').addEventListener('click', () => {
  shift = !shift;
  renderButtons();
  document.getElementById('shiftBtn').classList.toggle('shift-active', shift);
});

document.getElementById('historyToggle').addEventListener('click', () => {
  const panel = document.getElementById('historyPanel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  renderHistory();
});

function renderHistory() {
  const panel = document.getElementById('historyPanel');
  panel.innerHTML = '';
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.textContent = `${item.input1} ${item.operation} ${item.input2} = ${item.result}`;
    panel.appendChild(div);
  });
}

document.getElementById('onOffBtn').addEventListener('click', () => {
  on = !on;
  renderButtons();
  document.getElementById('display').value = '';
  if(!on) history = [];
  document.getElementById('historyPanel').style.display = 'none';
});

renderButtons();
