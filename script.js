const keys = [
  { label: '7', type: 'number' },
  { label: '8', type: 'number' },
  { label: '9', type: 'number' },

  {
    label: '÷',
    shiftLabel: '√',
    type: 'operation',
    opId: 'divide',
    func: (a, b) => {
      if (b === 0) throw 'Dijeljenje s nulom';
      return a / b;
    },
    shiftFunc: (a) => {
      if (a < 0) throw 'Negativan korijen';
      return Math.sqrt(a);
    }
  },

  { label: '4', type: 'number' },
  { label: '5', type: 'number' },
  { label: '6', type: 'number' },

  {
    label: '×',
    shiftLabel: '∛',
    type: 'operation',
    opId: 'multiply',
    func: (a, b) => a * b,
    shiftFunc: (a) => Math.cbrt(a)
  },

  { label: '1', type: 'number' },
  { label: '2', type: 'number' },
  { label: '3', type: 'number' },

  {
    label: '−',
    shiftLabel: 'log',
    type: 'operation',
    opId: 'subtract',
    func: (a, b) => a - b,
    shiftFunc: (a) => {
      if (a <= 0) throw 'Neispravan log';
      return Math.log10(a);
    }
  },

  { label: '0', type: 'number' },
  { label: '.', type: 'number' },
  { label: '=', type: 'action' },

  {
    label: '+',
    shiftLabel: 'x²',
    type: 'operation',
    opId: 'add',
    func: (a, b) => a + b,
    shiftFunc: (a) => a * a
  },

  {
    label: '!',
    shiftLabel: 'x³',
    type: 'operation',
    opId: 'factorial',
    func: (a) => {
      if (a < 0 || !Number.isInteger(a)) throw 'Neispravan faktorijel';
      let r = 1;
      for (let i = 1; i <= a; i++) r *= i;
      return r;
    },
    shiftFunc: (a) => a * a * a
  }
];

let shift = false;
let on = true;
let currentInput = '';
let firstValue = null;
let currentOp = null;
let currentOpId = null;
let history = [];

const display = document.getElementById('display');
const buttonsDiv = document.getElementById('buttons');
const historyPanel = document.getElementById('historyPanel');

function renderButtons() {
  buttonsDiv.innerHTML = '';

  keys.forEach(key => {
    const btn = document.createElement('button');
    btn.textContent = shift && key.shiftLabel ? key.shiftLabel : key.label;
    btn.disabled = !on;
    btn.addEventListener('click', () => handleKey(key));
    buttonsDiv.appendChild(btn);
  });
}

function handleKey(key) {
  if (!on) return;

  if (key.type === 'number') {
    currentInput += key.label;
    display.value = currentInput || '0';
    return;
  }

  if (key.type === 'operation') {
    if (currentInput === '' && !shift) return;

    firstValue = currentInput !== '' ? parseFloat(currentInput) : firstValue;
    currentInput = '';
    currentOp = shift && key.shiftFunc ? key.shiftFunc : key.func;
    currentOpId = shift && key.shiftLabel ? key.shiftLabel : key.label;
    display.value = '';
    return;
  }

  if (key.type === 'action') {
    if (!currentOp || firstValue === null) return;

    try {
      const secondValue = currentInput !== '' ? parseFloat(currentInput) : null;
      const result =
        currentOp.length === 1
          ? currentOp(firstValue)
          : currentOp(firstValue, secondValue);

      display.value = result;

      history.push({
        a: firstValue,
        b: secondValue,
        operation: currentOpId,
        result,
        time: new Date().toLocaleTimeString()
      });

    } catch (err) {
      display.value = err;
    }

    firstValue = null;
    currentInput = '';
    currentOp = null;
    currentOpId = null;
  }
}

document.getElementById('shiftBtn').addEventListener('click', () => {
  shift = !shift;
  renderButtons();
  document.getElementById('shiftBtn').classList.toggle('shift-active', shift);
});

document.getElementById('historyToggle').addEventListener('click', () => {
  historyPanel.style.display =
    historyPanel.style.display === 'block' ? 'none' : 'block';
  renderHistory(history);
});

function renderHistory(list) {
  historyPanel.innerHTML = '';

  if (list.length === 0) {
    historyPanel.textContent = 'Nema zapisa';
    return;
  }

  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.textContent =
      `${item.a} ${item.operation} ` +
      `${item.b ?? ''} = ${item.result} (${item.time})`;
    historyPanel.appendChild(div);
  });
}

const filterInput = document.createElement('input');
filterInput.placeholder = 'Filtriraj operaciju...';
filterInput.addEventListener('input', () => {
  const value = filterInput.value.toLowerCase();
  const filtered = history.filter(h =>
    h.operation.toLowerCase().includes(value)
  );
  renderHistory(filtered);
});
historyPanel.before(filterInput);

document.getElementById('onOffBtn').addEventListener('click', () => {
  on = !on;
  display.value = '';
  currentInput = '';
  firstValue = null;
  currentOp = null;
  history = [];
  historyPanel.innerHTML = '';
  historyPanel.style.display = 'none';
  renderButtons();
});

renderButtons();
