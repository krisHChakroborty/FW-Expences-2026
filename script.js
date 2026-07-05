// Master Security Configuration Password
const OWNER_PASSWORD = "FW8473"; 

// Pure Local Array Database
const itemNamesDatabase = [
    "French Fries", "Veg patty", "Paneer Patty", "Chilli Potato Bites", 
    "Cheesy Corn Triangle", "Chicken Breast Strips", "Batata Vada", 
    "Burger Bun (300gm or 280gm)", "Vada Pavs (Wao Pav) 200gm", 
    "Chocolate Buns (Cream Treat) (Rs.10)", "Salted Potato Chips (Rs.10)", 
    "Parotha", "Vanilla Ice Cream (lite)", "Butterscotch Ice Cream (lite)", 
    "Strawberry Ice Cream (lite)", "Mango Ice cream (lite)", 
    "Chocolate Ice cream (lite)", "Hide and seek (Biscuit)", "Oreo Biscuit", 
    "Paper Napkins", "Cooking Oil (Sunflower)", "Milk (Greeen)", 
    "Ice cubes (10kg)", "Cheese slice", "Lettcue (Iceberg)", "Tomato (Red)", 
    "Salt", "Carrot (Thik One)", "Cabbage", "Onion (Big)", 
    "Green Chilli (Thin one) (For Salsa)", "Green Chilli (Thick one) (For Vada Pavs)", 
    "Tutti Frutti", "Cashew Nuts (Roasted Unsalted)", "Sweet Dried Grapes", 
    "Sweet Dates (Seedless)", "Almond (Roasted Unsalted)", 
    "Ground Nuts (Roasted Unsalted)", "Lemon (Raw)", "Chilli Powder", 
    "Black Pepper (Powder)", "Chocolate Powder/Cocoa Powder (2kg)", 
    "Chat Masala", "Sprite (250ml)", "Coke (250ml)", "Coke (2.25 litre)", 
    "Sprite (2.25 litre)", "Garbage Bag (76cm*94cm)", "Chilli flakes", 
    "Crispy Onion Granules", "Dry Garlic Granules", "Choco Chips White", 
    "Double Chocolate Brownie", "Coffee powder (pouch)", "Water (500ml)", 
    "Gas Cylinder (Commercial)", "Sweet Chilli Hot Sauce", "Chiptole Style Dip", 
    "Cheese & Jalapeno Dip", "Veg Mayonnaise-Burger", "Creamy Cheese Blend", 
    "Sweet Onion Sauce", "BBQ Sauce (Barbeque)", "Sriracha Chilli Hot Sauce", 
    "Pasta & Pizza Sauce", "Veg Mayonnaise", "Garlic Mayonnaise", 
    "Tamarind Date Paste", "Szechwan Paste", "Garlic Chilli Paste", 
    "Tomato ketchup Pouch", "Veg Mayonnaise Pouch", "Chocolate (Syrup)", 
    "Vanilla (Syrup)", "Caramel (Syrup)", "Toffee (Syrup)", 
    "Lime and Mint (Syrup)", "Peach Ice Tea (Syrup)", "Icing sugar", 
    "Mango crush", "Strawberry crush", "Pizza Origeno", 
    "Morde Chocolate Bar (CO D-15)", "Tomato Ketchup (5kg)", 
    "Nachos (Tortilla Chips)", "Strawberry Jelly", "Ice tea powder", 
    "STRAW (White - 8MM)", "Salad Container (100ml)", "Ice Cream Cups (100ml)", 
    "Small Ice Cream Spoon", "Big Ice Cream Spoon", "Fork", "Paper Cups", 
    "Cheese Deep Container (25ml)", "Disposable Poly Gloves", 
    "Glass Bottle With Lid", "Snacks Tray", "Parcel Cover", "Sipper Lid", 
    "Sipper Glass", "Butterpaper", "Envelope", "Burger Box", "Tower", 
    "Meal Container with lid", "Fries Box", "Peri Peri", "Cheese", "Tangy"
];

// Browser LocalStorage Cache Array Engine Loader
let globalExpenseLedger = JSON.parse(localStorage.getItem('firstWaveExpenses')) || [];

// Save Helper Engine
function syncLocalStorage() {
    localStorage.setItem('firstWaveExpenses', JSON.stringify(globalExpenseLedger));
}

// Global scope functions so buttons can find them
function closeDrawer() {
    document.getElementById('sideDrawer').classList.remove('open');
    document.getElementById('drawerOverlay').classList.remove('open');
}

function deleteExpense(id) {
    if (confirm("❌ Entry Delete karni hai?")) {
        const enteredPassword = prompt("🔐 Enter Owner Password to delete:");
        if (enteredPassword === OWNER_PASSWORD) {
            globalExpenseLedger = globalExpenseLedger.filter(item => item.id !== id);
            syncLocalStorage();
            renderLedgerTable();
            calculateFinancialOverview();
            alert("✅ Entry Successfully Deleted.");
        } else if (enteredPassword !== null) {
            alert("❌ Galat Password.");
        }
    }
}

// Main Window Initializer Engine
window.onload = function() {
    // Current date filter loader
    document.getElementById('expenseDate').valueAsDate = new Date();
    
    // Setup Custom Search Filters
    setupDropdown('searchItem', 'dropdownArrowBtn', 'dropdownList');
    setupDropdown('analyticsItem', 'analyticsArrowBtn', 'analyticsDropdownList');

    // Drawer Core Controls
    document.getElementById('menuToggleBtn').onclick = function() {
        document.getElementById('sideDrawer').classList.add('open');
        document.getElementById('drawerOverlay').classList.add('open');
    };
    document.getElementById('closeDrawerBtn').onclick = closeDrawer;
    document.getElementById('drawerOverlay').onclick = closeDrawer;

    // LOCAL STORAGE WRITE: SAVE EXPENSE ACTION KEY
    document.getElementById('addExpenseBtn').onclick = function() {
        const name = document.getElementById('searchItem').value.trim();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const qty = parseInt(document.getElementById('expenseQty').value);
        const unit = document.getElementById('expenseUnit').value;
        const dateStr = document.getElementById('expenseDate').value;

        if (!name || isNaN(amount) || amount <= 0 || isNaN(qty) || qty <= 0 || !dateStr) {
            alert('Please fill all parameters correctly before saving.');
            return;
        }

        const logEntry = {
            id: "ID_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            name: name,
            amount: amount,
            qty: qty,
            unit: unit,
            date: dateStr
        };
        
        globalExpenseLedger.push(logEntry);
        syncLocalStorage();
        
        // Refresh UI Views immediately
        renderLedgerTable();
        calculateFinancialOverview();

        // Flush form inputs
        document.getElementById('searchItem').value = '';
        document.getElementById('expenseAmount').value = '';
        document.getElementById('expenseQty').value = '1';
        
        alert("✅ Expense Saved Locally!");
    };

    // Range report script logic - TOTAL EXPENSES (Uses Total Date Inputs)
    document.getElementById('generateRangeTotalBtn').onclick = function() {
        const startVal = document.getElementById('startDateTotal').value;
        const endVal = document.getElementById('endDateTotal').value;
        if (!startVal || !endVal) { alert('Select Dates for Total Expenses.'); return; }
        
        const start = new Date(startVal).setHours(0,0,0,0);
        const end = new Date(endVal).setHours(23,59,59,999);
        
        let total = 0;
        globalExpenseLedger.forEach(e => {
            const d = new Date(e.date).getTime();
            if (d >= start && d <= end) total += e.amount;
        });

        document.getElementById('reportTitleHeader').innerText = `📊 Total Report`;
        document.getElementById('reportMetricsOutput').innerHTML = `<p>Cost: <span class="metric-highlight">₹${total.toFixed(2)}</span></p>`;
        document.getElementById('analyticsResult').style.display = 'block';
    };

    // Item specific summary filter analytics - SPECIFIC ITEM'S TOTAL EXPENSE (Uses Item Date Inputs)
    document.getElementById('generateReportBtn').onclick = function() {
        const target = document.getElementById('analyticsItem').value.trim();
        if (!target) { alert('Select Item.'); return; }
        
        const startVal = document.getElementById('startDateItem').value;
        const endVal = document.getElementById('endDateItem').value;
        const start = startVal ? new Date(startVal).setHours(0,0,0,0) : null;
        const end = endVal ? new Date(endVal).setHours(23,59,59,999) : null;

        let cost = 0, qty = 0, unt = '';
        globalExpenseLedger.forEach(e => {
            if (e.name.toLowerCase() === target.toLowerCase()) {
                const d = new Date(e.date).getTime();
                if ((!start || d >= start) && (!end || d <= end)) {
                    cost += e.amount; qty += e.qty; unt = e.unit;
                }
            }
        });

        document.getElementById('reportTitleHeader').innerText = `🔍 Item Analysis`;
        document.getElementById('reportMetricsOutput').innerHTML = `
            <p>Spent: <span class="metric-highlight">₹${cost.toFixed(2)}</span></p>
            <p>Total Qty: <span class="metric-highlight">${qty} ${unt || 'units'}</span></p>
        `;
        document.getElementById('analyticsResult').style.display = 'block';
    };

    // Complete System Data Reset Wipe
    document.getElementById('masterResetBtn').onclick = function() {
        if (confirm("⚠️ WIPE EVERYTHING? All offline data will be deleted.")) {
            const pass = prompt("🔐 Enter Owner Password:");
            if (pass === OWNER_PASSWORD) {
                globalExpenseLedger = [];
                syncLocalStorage();
                renderLedgerTable();
                calculateFinancialOverview();
                document.getElementById('analyticsResult').style.display = 'none';
                alert("✅ Terminal Reset Successful.");
            } else if (pass !== null) { alert("❌ Wrong Password."); }
        }
    };

    // Load initial parameters on render
    renderLedgerTable();
    calculateFinancialOverview();
};

// Search Suggestion Engine core dropdown compiler
function setupDropdown(inputId, arrowId, listId) {
    const inputEl = document.getElementById(inputId);
    const arrowEl = document.getElementById(arrowId);
    const listEl = document.getElementById(listId);

    function renderList(filteredArray) {
        listEl.innerHTML = '';
        if (filteredArray.length === 0) { listEl.style.display = 'none'; return; }
        filteredArray.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item;
            div.addEventListener('mousedown', () => {
                inputEl.value = item;
                listEl.style.display = 'none';
            });
            listEl.appendChild(div);
        });
        listEl.style.display = 'block';
    }

    inputEl.addEventListener('input', () => {
        const query = inputEl.value.toLowerCase().trim();
        if (!query) { listEl.style.display = 'none'; return; }
        const matched = itemNamesDatabase.filter(name => name.toLowerCase().includes(query));
        renderList(matched);
    });

    arrowEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (listEl.style.display === 'block') { listEl.style.display = 'none'; } 
        else { renderList(itemNamesDatabase); }
    });

    inputEl.addEventListener('blur', () => { setTimeout(() => listEl.style.display = 'none', 200); });
}

// Render dynamic log tables in drawer menu
function renderLedgerTable() {
    const tbody = document.getElementById('expenseLogs');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const sorted = [...globalExpenseLedger].sort((a, b) => new Date(b.date) - new Date(a.date));
    sorted.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(entry.date).toLocaleDateString('en-IN')}</td>
            <td><strong>${entry.name}</strong></td>
            <td>${entry.qty} ${entry.unit}</td>
            <td style="color:#51cf66;">₹${entry.amount.toFixed(2)}</td>
            <td><button class="delete-btn" onclick="deleteExpense('${entry.id}')">×</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Financial Counters calculation scripts for cards
function calculateFinancialOverview() {
    const today = new Date();
    let dailySum = 0, monthlySum = 0;
    
    globalExpenseLedger.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate.toDateString() === today.toDateString()) dailySum += entry.amount;
        if (entryDate.getMonth() === today.getMonth() && entryDate.getFullYear() === today.getFullYear()) monthlySum += entry.amount;
    });
    
    const dEl = document.getElementById('dailyExpense');
    const mEl = document.getElementById('monthlyExpense');
    if (dEl) dEl.textContent = `₹${dailySum.toFixed(2)}`;
    if (mEl) mEl.textContent = `₹${monthlySum.toFixed(2)}`;
}