const balanceEl = document.querySelector('.balance .value');
const incomeTotalEl = document.querySelector('.income-total');
const outcomeTotalEl = document.querySelector('.outcome-total');
const incomeEl = document.querySelector('#income');
const expenseEl = document.querySelector('#expense');
const allEl = document.querySelector('#all');
const incomeList = document.querySelector('#income .list');
const expenseList = document.querySelector('#expense .list');
const allList = document.querySelector('#all .list');

const expenseBtn = document.querySelector('.tab1');
const incomeBtn = document.querySelector('.tab2');
const allBtn = document.querySelector('.tab3');

const addExpense = document.querySelector('.add-expense');
const expenseTitle = document.getElementById('expense-title-input');
const expenseAmount = document.getElementById('expense-amount-input');

const addIncome = document.querySelector('.add-income');
const incomeTitle = document.getElementById('income-title-input');
const incomeAmount = document.getElementById('income-amount-input');

let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = 'delete', EDIT = 'edit';

ENTRY_LIST = JSON.parse(localStorage.getItem('entry_list')) || [];
updateUI();

addExpense.addEventListener('click', (event) => {

    if (!expenseTitle.value || !expenseAmount.value) return;

    let expense = {
        type: 'expense',
        title: expenseTitle.value,
        amount: parseFloat(expenseAmount.value),
    };

    ENTRY_LIST.push(expense);

    updateUI();
    clearInput([expenseTitle, expenseAmount]);

    localStorage.setItem('entry_list', JSON.stringify(ENTRY_LIST));

});

addIncome.addEventListener('click', (event) => {

    if (!incomeTitle.value || !incomeAmount.value) return;

    let income = {
        type: 'income',
        title: incomeTitle.value,
        amount: parseFloat(incomeAmount.value),
    };

    ENTRY_LIST.push(income);

    updateUI();
    clearInput([incomeTitle, incomeAmount]);

    localStorage.setItem('entry_list', JSON.stringify(ENTRY_LIST));

});

expenseBtn.addEventListener('click', (event) => {
    show(expenseEl);
    hide([incomeEl, allEl]);
    active(expenseBtn);
    inactive([incomeBtn, allBtn]);
});

incomeBtn.addEventListener('click', (event) => {
    show(incomeEl);
    hide([expenseEl, allEl]);
    active(incomeBtn);
    inactive([expenseBtn, allBtn]);
});

allBtn.addEventListener('click', (event) => {
    show(allEl);
    hide([incomeEl, expenseEl]);
    active(allBtn);
    inactive([incomeBtn, expenseBtn]);
});

incomeList.addEventListener('click', deleteOrEdit);
expenseList.addEventListener('click', deleteOrEdit);
allList.addEventListener('click', deleteOrEdit);

function deleteOrEdit(event) {

    const targetBtn = event.target;
    const entry = targetBtn.parentNode;

    if (targetBtn.id == DELETE) {
        deleteEntry(entry);
    } else if (targetBtn.id == EDIT) {
        editEntry(entry);
    }
}

function deleteEntry(entry) {
    ENTRY_LIST.splice(entry.id, 1);
    updateUI();
    localStorage.setItem('entry_list', JSON.stringify(ENTRY_LIST));
}

function editEntry(entry) {

    let ENTRY = ENTRY_LIST[entry.id];
    console.log(ENTRY.type);
    
    if (ENTRY.type = 'income') {
        incomeTitle.value = ENTRY.title;
        incomeAmount.value = ENTRY.amount;
    }
    
    if (ENTRY.type = 'expense') {
        expenseTitle.value = ENTRY.title;
        expenseAmount.value = ENTRY.amount;
    }

    deleteEntry(entry);

    localStorage.setItem('entry_list', JSON.stringify(ENTRY_LIST));
}

function show(element) {
    element.classList.remove('hide');
}

function hide(elements) {
    elements.forEach(element => {
        element.classList.add('hide');
    });
}

function active(element) {
    element.classList.add('focus');
}

function inactive(elements) {
    elements.forEach(element => {
        element.classList.remove('focus');
    });
}

function updateUI() {
    income = calculateTotal('income', ENTRY_LIST);
    outcome = calculateTotal('expense', ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    let sign = income >= outcome ? '$' : '-$';

    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    incomeTotalEl.innerHTML = `<small>${sign}</small>${income}`;
    outcomeTotalEl.innerHTML = `<small>${sign}</small>${outcome}`;

    clearElement([expenseList, incomeList, allList]);

    ENTRY_LIST.forEach((element, index) => {
        if (element.type == 'expense') {
            showEntry(expenseList, element.type, element.title, element.amount, index);
        } else if (element.type == 'income') {
            showEntry(incomeList, element.type, element.title, element.amount, index);
        }
        showEntry(allList, element.type, element.title, element.amount, index);
    });

    updateChart(income, outcome);
}

function showEntry(list, type, title, amount, id) {
    const entry = `
        <li id="${id}" class="${type}">
            <div class="entry">${title}: $${amount}</div>
            <div id="edit"></div>
            <div id="delete"></div>
        </li>
    `;

    list.insertAdjacentHTML('afterbegin', entry);
}

function clearElement(elementsList) {
    elementsList.forEach(element => {
        element.innerHTML = '';
    });
}

function clearInput(elements) {
    elements.forEach(element => {
        element.value = '';
    });
}

function calculateTotal(type, list) {
    let sum = 0;
    
    list.forEach(entry => {
        if (entry.type == type) {
            sum += entry.amount;
        }
    });

    return sum;
}

function calculateBalance(income, outcome) {
    return income - outcome;
}