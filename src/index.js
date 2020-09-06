//Select Elements
const incomeTotalElem = document.querySelector('.income-total');
const outcomeTotalElem = document.querySelector('.outcome-total');
const balanceElem = document.querySelector('.balance .value');
const chartElem = document.querySelector('.chart');

const expenseElem = document.getElementById('expense')
const incomeElem = document.getElementById('income');
const allElem = document.getElementById('all');

const incomeList = document.querySelector('#income .list');
const expenseList = document.querySelector('#expense .list');
const allList = document.querySelector('#all .list');

//Select Buttons
const expenseBtn = document.querySelector('.tab1');
const incomeBtn = document.querySelector('.tab2');
const allBtn = document.querySelector('.tab3');

//Select Inputs
const incomeTitle = document.querySelector('#income-title-input');
const incomeAmount = document.querySelector('#income-amount-input');
const addIncome = document.querySelector('.add-income');

const addExpense = document.querySelector('.add-expense');
const expenseTitle = document.getElementById('expense-title-input');
const expenseAmount = document.getElementById('expense-amount-input');

//variables
let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = 'delete', EDIT = 'edit';

//DOM Event Listeners
expenseBtn.addEventListener('click', () => {
    active(expenseBtn);
    inactive([incomeBtn, allBtn]);
    show(expenseElem);
    hide([incomeElem, allElem])
});
incomeBtn.addEventListener('click', () => {
    active(incomeBtn);
    inactive([expenseBtn, allBtn]);
    show(incomeElem);
    hide([expenseElem, allElem]);
});
allBtn.addEventListener('click', () => {
    active(allBtn);
    inactive([incomeBtn, expenseBtn]);
    show(allElem);
    hide([expenseElem, incomeElem]);
});

addIncome.addEventListener('click', () => {

    if (!incomeAmount.value || !incomeTitle.value) return;

    const income = {
        type: 'income',
        title: incomeTitle.value,
        amount: parseFloat(incomeAmount.value)
    };

    ENTRY_LIST.push(income);
    updateUI();
    clearInput([incomeTitle, incomeAmount]);
});

addExpense.addEventListener('click', () => {

    if (!expenseTitle || !expenseAmount) return;

    const expense = {
        type: 'expense',
        title: expenseTitle.value,
        amount: parseFloat(expenseAmount.value)
    };

    ENTRY_LIST.push(expense);
    updateUI();
    clearInput([expenseTitle, expenseAmount]);
});

incomeList.addEventListener('click', deleteOrEditItem);
expenseList.addEventListener('click', deleteOrEditItem);
allList.addEventListener('click', deleteOrEditItem);

//Helpers

const active = (elemRef) => {
    elemRef.classList.add('active');
}
const inactive = (elemRefArray) => {
    elemRefArray.forEach(elemRef => elemRef.classList.remove('active'));
}

const show = (elemRef) => {
    elemRef.classList.remove('hide');
}

const hide = (elemRefArray) => {
    elemRefArray.forEach((elemRef => elemRef.classList.add('hide')));
}

const updateUI = () => {
    income = calculateTotal('income', ENTRY_LIST);
    outcome = calculateTotal('expense', ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    let sign = (income >= outcome) ? "$" : "-$";

    balanceElem.innerHTML = `<small>${sign}</small>${balance}`;
    incomeTotalElem.innerHTML = `<small>${sign}</small>${income}`;
    outcome.innerHTML = `<small>${sign}</small>${outcome}`;

    //UPDATE UI
    clearElement([incomeList, expenseList, allList]);

    ENTRY_LIST.forEach((entry, index) => {
        if (entry.type === 'income') {
            showEntry(incomeList, entry.type, entry.title, entry.amount, index);
        } else if (entry.type === 'expense') {
            showEntry(expenseList, entry.type, entry.title, entry.amount, index);
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index);
    });

    updateChart(income, outcome);

    localStorage.setItem('entry_list', JSON.stringify(ENTRY_LIST));

};

const calculateTotal = (type, list) => {
    const items = list.filter(entry => entry.type === type);
    return items.reduce((acc, cur) => acc + cur.amount, 0);
}

const clearInput = (inputsArray) => {
    inputsArray.forEach(inputRef => inputRef.value = '');
}

const calculateBalance = () => {
    console.log({ income, outcome })
    return income - outcome
};

const clearElement = (listArray) => {
    listArray.forEach(list => list.innerHTML = '');
}

const showEntry = (list, type, title, amount, id) => {
    const entry = `
        <li id="${id}" class="${type}">
            <div class="entry">${title}: ${amount}</div>
            <div id="edit"></div>
            <div id="delete"></div>
        </li>
    `;
    list.insertAdjacentHTML('afterbegin', entry);
}

function deleteOrEditItem(ev) {
    const targetBtn = ev.target;

    const entry = targetBtn.parentNode;

    if (targetBtn.id === DELETE) {
        deleteEntry(entry)
    } else if (targetBtn.id === EDIT) {
        editEntry(entry);
    }
};

const editEntry = (entry) => {
    let ENTRY = ENTRY_LIST[entry.id];

    if(ENTRY.type === 'income') {
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title
    } else {
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }

    deleteEntry(entry)

};

const deleteEntry = (entry) => {
    ENTRY_LIST.splice(entry.id, 1);
    updateUI();
}

//Look if there is a data and update
ENTRY_LIST = JSON.parse(localStorage.getItem('entry_list')) || [];
updateUI();