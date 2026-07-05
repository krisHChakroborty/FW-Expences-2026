// Master Security Configuration (Updated Password)
const OWNER_PASSWORD = "FW8473"; 

// Clean Array List containing pure text strings[cite: 1]
const itemNamesDatabase = [
    "French Fries", "Veg patty", "Paneer Patty", "Chilli Potato Bites", 
    "Cheesy Corn Triangle", "Chicken Breast Strips", "Batata Vada", 
    "Burger Bun (300gm or 280gm)", "Vada Pavs (Wao Pav) 200gm", 
    "Chocolate Buns (Cream Treat) (Rs.10)", "Salted Potato Chips (Rs.10)", 
    "Parotha", "Vanilla Ice Cream (lite)", "Butterscotch Ice Cream (lite)", 
    "Strawberry Ice Cream (lite)", "Mango Ice cream (lite)", 
    "Chocolate Ice cream (lite)", "Hide and seek (Biscuit)", "Oreo Biscuit", 
    "Paper Napkins", "Cooking Oil (Sunflower)", "Milk (Greeen)", 
    "Ice cubes (10kg)", "Cheese slice", "Lettuce (Iceberg)", "Tomato (Red)", 
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

// LocalStorage Engine Initialisation Array Load
let globalExpenseLedger = JSON.parse(localStorage.getItem('firstWaveExpenses')) || [];

// Set default fallback dates inside logging fields
document.getElementById('expenseDate').valueAsDate = new Date();

// Custom Search Dropdown Component Engine
function setupDropdown(inputId, arrowId, listId) {
    const inputEl = document.getElementById(inputId);
    const arrowEl = document.getElementById(arrowId);
    const listEl = document.getElementById(listId);

    function renderList(filteredArray) {
        listEl.innerHTML = '';
        if (filteredArray.length === 0) {
            listEl.style.display = 'none';
            return;
        }
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
        if (listEl.style.display === 'block') {
            listEl.style.display = 'none';
        } else {
            renderList(itemNamesDatabase);
        }
    });

    inputEl.addEventListener('blur', () => {
        setTimeout(() => listEl.style.display = 'none', 200);
    });
}

// Attach listeners
setupDropdown('searchItem', 'dropdownArrowBtn', 'dropdownList');
setupDropdown('analyticsItem', 'analyticsArrowBtn', 'analyticsDropdownList');

// LocalStorage Synchronization Wrapper
function syncWithLocalStorage() {
    localStorage.setItem('firstWaveExpenses', JSON.stringify(globalExpenseLedger));
}

// Add Expense Entry Submission Handler
document.getElementById('addExpenseBtn').addEventListener('click', () => {
    const name = document.getElementById('searchItem').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const qty = parseInt(document.getElementById('expenseQty').value);
    const unit = document.getElementById('expenseUnit').value;
    const dateStr = document.getElementById('expenseDate').value;

    if (!name || isNaN(amount) || amount <= 0 || isNaN(qty) || qty <= 0 || !dateStr) {
        alert('Please fill out all colorful input spaces accurately.');
        return;
    }

    const logEntry = {
        id: Date.now().toString(),
        name,
        amount,
        qty,
        unit,
        date: dateStr
    };
    
    globalExpenseLedger.push(logEntry);
    
    syncWithLocalStorage();
    renderLedgerTable();
    calculateFinancialOverview();

    // Reset Form Input Box entries
    document.getElementById('searchItem').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseQty').value = '1';
    document.getElementById('expenseUnit').selectedIndex = 0;
});

// Single Item Deletion Execution with Password Protection
function deleteExpense(id) {
    const firstConfirm = confirm("❌ Kya aap is entry ko delete karna chahte hain?");
    if (firstConfirm) {
        const enteredPassword = prompt("🔐 Authenticate: Delete karne ke liye Owner Password dalein:");
        
        if (enteredPassword === null) return; // Cancel handle

        if (enteredPassword === OWNER_PASSWORD) {
            globalExpenseLedger = globalExpenseLedger.filter(item => item.id !== id);
            syncWithLocalStorage();
            renderLedgerTable();
            calculateFinancialOverview();
            alert("✅ Entry successfully deleted.");
        } else {
            alert("❌ Access Denied! Galat Password. Data safe hai.");
        }
    }
}

// Render Data to Table Dom
function renderLedgerTable() {
    const tbody = document.getElementById('expenseLogs');
    tbody.innerHTML = '';
    
    const sorted = [...globalExpenseLedger].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sorted.forEach(entry => {
        const tr = document.createElement('tr');
        const formattedDate = new Date(entry.date).toLocaleDateString('en-IN');
        tr.innerHTML = `
            <td>${formattedDate}</td>
            <td><strong>${entry.name}</strong></td>
            <td>${entry.qty} ${entry.unit}</td>
            <td>₹${entry.amount.toFixed(2)}</td>
            <td style="text-align: center;">
                <button class="delete-btn" onclick="deleteExpense('${entry.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Home Counter Interface Calculations (Daily and Monthly sums)
function calculateFinancialOverview() {
    const today = new Date();
    let dailySum = 0;
    let monthlySum = 0;

    globalExpenseLedger.forEach(entry => {
        const entryDate = new Date(entry.date);
        
        if (entryDate.getDate() === today.getDate() && 
            entryDate.getMonth() === today.getMonth() && 
            entryDate.getFullYear() === today.getFullYear()) {
            dailySum += entry.amount;
        }

        if (entryDate.getMonth() === today.getMonth() && 
            entryDate.getFullYear() === today.getFullYear()) {
            monthlySum += entry.amount;
        }
    });

    document.getElementById('dailyExpense').textContent = `₹${dailySum.toFixed(2)}`;
    document.getElementById('monthlyExpense').textContent = `₹${monthlySum.toFixed(2)}`;
}

// Utility Helper to calculate normalized date range constraints safely
function getDateRangeLimits() {
    const startVal = document.getElementById('startDate').value;
    const endVal = document.getElementById('endDate').value;
    
    const startLimit = startVal ? new Date(startVal) : null;
    const endLimit = endVal ? new Date(endVal) : null;
    
    if (startLimit) startLimit.setHours(0, 0, 0, 0);
    if (endLimit) endLimit.setHours(23, 59, 59, 999);
    
    return { startLimit, endLimit, startVal, endVal };
}

// REPORT GENERATOR TYPE 1: Date-Range Total Business Expense Calculator Engine
document.getElementById('generateRangeTotalBtn').addEventListener('click', () => {
    const { startLimit, endLimit, startVal, endVal } = getDateRangeLimits();
    
    if (!startVal || !endVal) {
        alert('Please specify both Start and End Dates to calculate range overview expenses.');
        return;
    }

    let overallRangeTotal = 0;

    globalExpenseLedger.forEach(entry => {
        const entryDate = new Date(entry.date);
        let passDate = true;
        if (startLimit && entryDate < startLimit) passDate = false;
        if (endLimit && entryDate > endLimit) passDate = false;

        if (passDate) {
            overallRangeTotal += entry.amount;
        }
    });

    // Populate Report view elements
    document.getElementById('reportTitleHeader').innerText = `📊 Overall Total Expense Report`;
    const container = document.getElementById('reportMetricsOutput');
    container.innerHTML = `
        <p>Selected Range: <strong>${new Date(startVal).toLocaleDateString('en-IN')}</strong> to <strong>${new Date(endVal).toLocaleDateString('en-IN')}</strong></p>
        <p style="margin-top:10px; font-size:18px;">Total Combined Kharcha: <span class="metric-highlight">₹${overallRangeTotal.toFixed(2)}</span></p>
    `;
    document.getElementById('analyticsResult').style.display = 'block';
});

// REPORT GENERATOR TYPE 2: Specific Single Item Analysis Filter
document.getElementById('generateReportBtn').addEventListener('click', () => {
    const targetItem = document.getElementById('analyticsItem').value.trim();
    const { startLimit, endLimit, startVal, endVal } = getDateRangeLimits();

    if (!targetItem) {
        alert('Please select or search a Target Item for deep breakdown analysis.');
        return;
    }

    let evaluatedCost = 0;
    let unitSummaries = {};

    globalExpenseLedger.forEach(entry => {
        if (entry.name.toLowerCase() === targetItem.toLowerCase()) {
            const entryDate = new Date(entry.date);
            let passDate = true;
            if (startLimit && entryDate < startLimit) passDate = false;
            if (endLimit && entryDate > endLimit) passDate = false;

            if (passDate) {
                evaluatedCost += entry.amount;
                if (!unitSummaries[entry.unit]) {
                    unitSummaries[entry.unit] = 0;
                }
                unitSummaries[entry.unit] += entry.qty;
            }
        }
    });

    let qtyString = Object.keys(unitSummaries).length > 0 
        ? Object.entries(unitSummaries).map(([unit, val]) => `${val} ${unit}`).join(', ')
        : "0 Units";

    // Build the dynamic specific view presentation
    document.getElementById('reportTitleHeader').innerText = `🔍 Specific Item Analytical Output: "${targetItem}"`;
    const container = document.getElementById('reportMetricsOutput');
    
    let dateRangeText = (startVal && endVal) 
        ? `${new Date(startVal).toLocaleDateString('en-IN')} to ${new Date(endVal).toLocaleDateString('en-IN')}`
        : "Lifetime History Logs";

    container.innerHTML = `
        <p>Target Timeline Scope: <strong>${dateRangeText}</strong></p>
        <p style="margin-top:10px;">Total Spent on Item: <span class="metric-highlight">₹${evaluatedCost.toFixed(2)}</span></p>
        <p style="margin-top:8px;">Total Quantity Dispatched: <span class="metric-highlight">${qtyString}</span></p>
    `;
    
    document.getElementById('analyticsResult').style.display = 'block';
});

// Master Reset Event Handler with Password Protection
document.getElementById('masterResetBtn').addEventListener('click', () => {
    const firstConfirm = confirm("⚠️ WARNING: Kya aap sach me poora data delete karna chahte hain? Yeh wapas nahi aayega!");
    
    if (firstConfirm) {
        const enteredPassword = prompt("🔐 Authenticate: Kirpa karke Owner Password enter karein:");
        
        if (enteredPassword === null) return;
        
        if (enteredPassword === OWNER_PASSWORD) {
            globalExpenseLedger = [];
            syncWithLocalStorage();
            renderLedgerTable();
            calculateFinancialOverview();
            
            document.getElementById('analyticsResult').style.display = 'none';
            document.getElementById('analyticsItem').value = '';
            
            alert("✅ Terminal successfully reset! Saara data delete ho gaya hai.");
        } else {
            alert("❌ Access Denied! Galat Password. Data safe hai.");
        }
    }
});

// Initialize Cold Boot
renderLedgerTable();
calculateFinancialOverview();
