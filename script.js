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


const operationNames = {
  '+': 'zbrajanje',
  '−': 'oduzimanje',
  '×': 'mnozenje',
  '÷': 'dijeljenje',
  '!': 'faktorijel',
  'x²': 'kvadrat',
  'x³': 'kub',
  'log': 'logaritam',
  '√': 'korijen',
  '∛': 'kubni korijen'
};


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

/* ---------- TIPKE ---------- */

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

/* ---------- LOGIKA KALKULATORA ---------- */

function handleKey(key) {
  if (!on) return;

  if (key.type === 'number') {
    if (key.label === '.' && currentInput.includes('.')) return;
    currentInput += key.label;
    display.value = currentInput || '0';
    return;
  }

  if (key.type === 'operation') {
    if (currentInput === '' && firstValue === null) return;

    if (currentInput !== '') {
      firstValue = parseFloat(currentInput);
    }

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
        opName: operationNames[currentOpId],
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

/* ---------- SHIFT ---------- */

document.getElementById('shiftBtn').addEventListener('click', () => {
  shift = !shift;
  renderButtons();
  document.getElementById('shiftBtn').classList.toggle('shift-active', shift);
});

/* ---------- POVIJEST I FILTRI ---------- */

const textFilter = document.createElement('input');
textFilter.placeholder = 'Filtriraj po nazivu operacije...';
textFilter.style.display = 'none';

const opFilter = document.createElement('select');
opFilter.style.display = 'none';

['Sve', '+', '−', '×', '÷', '!', 'x²', 'x³', 'log', '√', '∛'].forEach(op => {
  const option = document.createElement('option');
  option.value = op;
  option.textContent = op;
  opFilter.appendChild(option);
});

function applyFilters() {
  let filtered = [...history];

  if (opFilter.value !== 'Sve') {
    filtered = filtered.filter(h => h.operation === opFilter.value);
  }

  const text = textFilter.value.toLowerCase();
  if (text) {
    filtered = filtered.filter(h =>
      h.opName && h.opName.includes(text)
    );
  }

  renderHistory(filtered);
}

textFilter.addEventListener('input', applyFilters);
opFilter.addEventListener('change', applyFilters);

historyPanel.before(opFilter);
historyPanel.before(textFilter);

document.getElementById('historyToggle').addEventListener('click', () => {
  const visible = historyPanel.style.display === 'block';

  historyPanel.style.display = visible ? 'none' : 'block';
  textFilter.style.display = visible ? 'none' : 'block';
  opFilter.style.display = visible ? 'none' : 'block';

  textFilter.value = '';
  opFilter.value = 'Sve';

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
      `${item.a} ${item.operation} ${item.b ?? ''} = ${item.result} (${item.time})`;
    historyPanel.appendChild(div);
  });
}


document.getElementById('onOffBtn').addEventListener('click', () => {
  on = !on;

  display.value = '';
  currentInput = '';
  firstValue = null;
  currentOp = null;
  history = [];

  historyPanel.innerHTML = '';
  historyPanel.style.display = 'none';
  textFilter.style.display = 'none';
  opFilter.style.display = 'none';

  renderButtons();
});


renderButtons();
