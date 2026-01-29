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
