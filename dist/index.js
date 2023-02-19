let budgetInput = document.getElementById("budgetInput");
let budgetBtn = document.getElementById("budgetBtn");
let budgetBal = document.getElementById("budgetBal");
let expBal = document.getElementById("expbal");
let expTitle = document.getElementById("expTitle");
let expAmt = document.getElementById("expAmt");
let expBtn = document.getElementById("expBtn");
let bal = document.getElementById("bal");
let tableBody = document.getElementById("table-body");

budgetBtn.addEventListener("click", () => {
    if (budgetInput.value != "") {
        let budgetObj = {
            id: crypto.randomUUID(),
            budgetAmt: budgetInput.value
        }

        let data = localStorage.getItem("budget");

        if (data) {
            let budgetArray = JSON.parse(data);
            budgetArray.push(budgetObj);
            localStorage.setItem("budget", JSON.stringify(budgetArray));
        }else{
            let budgetArray = [];
            budgetArray.push(budgetObj);
            localStorage.setItem("budget", JSON.stringify(budgetArray));
        }

        budgetInput.value = "";
        setBalance();
    }
});

expBtn.addEventListener("click", () => {
    if (expAmt.value != "" && expTitle.value != "") {
        let expObj = {
            id: crypto.randomUUID(),
            expAmt: expAmt.value,
            expTitle: expTitle.value
        }

        let data = localStorage.getItem("expense");

        if (data) {
            expArray = JSON.parse(data);
            expArray.push(expObj);
            localStorage.setItem("expense", JSON.stringify(expArray));
        }else{
            let expArray = [];
            expArray.push(expObj);
            localStorage.setItem("expense", JSON.stringify(expArray));
        }

        expTitle.value = "";
        expAmt.value = "";
        setBalance();
    }
});

function setBalance(){
    bal.textContent = setBudget() - setExpense();
}

function setBudget(){
    let total = 0;

    const budgetArray = JSON.parse(localStorage.getItem("budget"));

    if (budgetArray === null) {
        return total;
    }

    let budgetValue = budgetArray.reduce((arr, cur) => arr + parseInt(cur.budgetAmt), 0);

    budgetBal.textContent = budgetValue;

    return budgetValue;
}

function setExpense(){
    let total = 0;

    const expArray = JSON.parse(localStorage.getItem("expense"));
    
    if (expArray === null) {
        return total;
    }
    
    let expValue = expArray.reduce((arr, cur) => arr + parseInt(cur.expAmt), 0);
    
    expBal.textContent = expValue;

    displayExpense();
    
    return expValue;
}

function displayExpense() {
    const expArray = JSON.parse(localStorage.getItem("expense"));

    if (expArray === null){
        return;
    }

    tableBody.innerHTML = "";

    expArray.forEach(exp => {
        const {expTitle, expAmt, id} = exp;

        tableBody.innerHTML += `<tr id="${id}" class="border-info" style="border-left-width: 5px; padding: 20px;">
                                    <td class="p-2">${expTitle}</td>
                                    <td class="p-2">${expAmt}</td>
                                    <td class="p-2 d-flex">
                                        <div class="text-info" style="margin-right: 10px;cursor: pointer"><i class="fa-sharp edit fa-solid fa-pen-to-square"></i></div>
                                        <div class="text-info" style="cursor: pointer"><i class="fa-solid delete fa-trash"></i></div>
                                    </td>
                                </tr>`;
    });
}

function editItem(element){
    let elementParent = element.parentElement.parentElement.parentElement;
    let elementId = elementParent.attributes.id.value;
    
    elementParent.parentElement.removeChild(elementParent);
    
    let expenseArray = JSON.parse(localStorage.getItem("expense"));

    if (expenseArray === null) {
        return;
    }

    filteredItem = expenseArray.filter(expense => expense.id === elementId);

    expTitle.value = filteredItem[0].expTitle;
    expAmt.value = filteredItem[0].expAmt;

    expenseArray = expenseArray.filter(expense => expense.id != elementId);

    localStorage.setItem("expense", JSON.stringify(expenseArray));

    displayExpense();
}

function deleteItem(element){
    let elementParent = element.parentElement.parentElement.parentElement;
    let elementId = elementParent.attributes.id.value;

    elementParent.parentElement.removeChild(elementParent);
    
    let expenseArray = JSON.parse(localStorage.getItem("expense"));

    if (expenseArray === null) {
        return;
    }

    expenseArray = expenseArray.filter(expense => expense.id != elementId);

    localStorage.setItem("expense", JSON.stringify(expenseArray));

    displayExpense();
}

tableBody.addEventListener("click", (e) => {
    let element = e.target;
    
    if (element.classList.contains("edit")) {
        editItem(element);
    }else if (element.classList.contains("delete")){
        deleteItem(element);
    }
});

setBalance();
displayExpense();