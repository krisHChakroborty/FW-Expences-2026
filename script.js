// Master Security Configuration
const OWNER_PASSWORD = "FW8473"; 

// TODO: Apna real Firebase Config code yahan par update karein!
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Full Database Array List[cite: 1]
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

let globalExpenseLedger = [];
document.getElementById('expenseDate').valueAsDate = new Date();

// 3 LINES HAMBURGER SIDE DRAWER INTERACTIVE TOGGLE SCRIPT
const sideDrawer = document.getElementById('sideDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');

document.getElementById('menuToggleBtn').addEventListener('click', () => {
    sideDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
});

function closeDrawer() {
    sideDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
}

document.getElementById('closeDrawerBtn').addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

// Custom Search Dropdown Component Engine
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

setupDropdown('searchItem', 'dropdownArrowBtn', 'dropdownList');
setupDropdown('analyticsItem', 'analyticsArrowBtn', 'analyticsDropdownList');

// REALTIME DATABASE CLOUD AUTO-SYNC
database.ref('expenses').on('value', (snapshot) => {
    const data = snapshot.val();
    globalExpenseLedger = [];
    if (data) {
        Object.keys(data).forEach(key => {
            globalExpenseLedger.push({ id: key, ...data[key] });
        });
    }
    renderLedgerTable();
    calculateFinancialOverview();
});

// Save Entry Function
document.getElementById('addExpenseBtn').addEventListener('click', () => {
    const name = document.getElementById('searchItem').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const qty = parseInt(document.getElementById('expenseQty').value);
    const unit = document.getElementById('expenseUnit').value;
    const dateStr = document.getElementById('expenseDate').value;

    if (!name || isNaN(amount) || amount <= 0 || isNaN(qty) || qty <= 0 || !dateStr) {
        alert('Please fill out all input spaces correctly.');
        return;
    }

    const logEntry = { name, amount, qty, unit, date: dateStr };
    
    database.ref('expenses').push(logEntry)
    .then(() => {
        document.getElementById('searchItem').value = '';
        document.getElementById('expenseAmount').value = '';
        document.getElementById('expenseQty').value = '1';
    })
    .catch(err => alert("Error: " + err.message));
});

// Secure Delete Single Entry Function
function deleteExpense(id) {
    if (confirm("❌ Delete entry?")) {
        const enteredPassword = prompt("🔐 Enter Owner Password to delete:");
        if (enteredPassword === OWNER_PASSWORD) {
            database.ref('expenses/' + id).remove()
            .then(() => alert("✅ Deleted."))
            .catch(err => alert("Error: " + err.message));
        } else if (enteredPassword !== null) {
            alert("❌ Galat Password.");
        }
    }
}

// Render Table Data inside Drawer
function renderLedgerTable() {
    const tbody = document.getElementById('expenseLogs');
    tbody.innerHTML = '';
    const sorted = [...globalExpenseLedger].sort((a, b) => new Date(b.date) - new Date(a.date));
    sorted.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(entry.date).toLocaleDateString('en-IN')}</td>
            <td><strong>${entry.name}</strong></td>
            <td>${entry.qty}${entry.unit}</td>
            <td style="color:#51cf66;">₹${entry.amount}</td>
            <td><button class="delete-btn" onclick="deleteExpense('${entry.id}')">×</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Stats Counter Setup
function calculateFinancialOverview() {
    const today = new Date();
    let dailySum = 0, monthlySum = 0;
    globalExpenseLedger.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate.toDateString() === today.toDateString()) dailySum += entry.amount;
        if (entryDate.getMonth() === today.getMonth() && entryDate.getFullYear() === today.getFullYear()) monthlySum += entry.amount;
    });
    document.getElementById('dailyExpense').textContent = `₹${dailySum.toFixed(2)}`;
    document.getElementById('monthlyExpense').textContent = `₹${monthlySum.toFixed(2)}`;
}

// Reports Range Helper
function getDateLimits() {
    return {
        start: document.getElementById('startDate').value ? new Date(document.getElementById('startDate').value) : null,
        end: document.getElementById('endDate').value ? new Date(document.getElementById('endDate').value) : null
    };
}

// Report 1: Calculate Range Total
document.getElementById('generateRangeTotalBtn').addEventListener('click', () => {
    const { start, end } = getDateLimits();
    if (!start || !end) { alert('Select Dates.'); return; }
    start.setHours(0,0,0,0); end.setHours(23,59,59,999);
    
    let total = 0;
    globalExpenseLedger.forEach(e => {
        const d = new Date(e.date);
        if (d >= start && d <= end) total += e.amount;
    });

    document.getElementById('reportTitleHeader').innerText = `📊 Total Report`;
    document.getElementById('reportMetricsOutput').innerHTML = `<p>Cost: <span class="metric-highlight">₹${total.toFixed(2)}</span></p>`;
    document.getElementById('analyticsResult').style.display = 'block';
});

// Report 2: Item Specific Deep Analysis
document.getElementById('generateReportBtn').addEventListener('click', () => {
    const target = document.getElementById('analyticsItem').value.trim();
    if (!target) { alert('Select Item.'); return; }
    const { start, end } = getDateLimits();
    if (start) start.setHours(0,0,0,0); if (end) end.setHours(23,59,59,999);

    let cost = 0, qty = 0, unt = '';
    globalExpenseLedger.forEach(e => {
        if (e.name.toLowerCase() === target.toLowerCase()) {
            const d = new Date(e.date);
            if ((!start || d >= start) && (!end || d <= end)) {
                cost += e.amount; qty += e.qty; unt = e.unit;
            }
        }
    });

    document.getElementById('reportTitleHeader').innerText = `🔍 Item Analysis`;
    document.getElementById('reportMetricsOutput').innerHTML = `
        <p>Spent: <span class="metric-highlight">₹${cost.toFixed(2)}</span></p>
        <p>Total Qty: <span class="metric-highlight">${qty} ${unt}</span></p>
    `;
    document.getElementById('analyticsResult').style.display = 'block';
});

// Master Password Reset
document.getElementById('masterResetBtn').addEventListener('click', () => {
    if (confirm("⚠️ WIPE EVERYTHING?")) {
        const pass = prompt("🔐 Enter Owner Password:");
        if (pass === OWNER_PASSWORD) {
            database.ref('expenses').remove()
            .then(() => {
                document.getElementById('analyticsResult').style.display = 'none';
                alert("✅ Cloud Reset Done.");
            });
        } else if (pass !== null) { alert("❌ Access Denied."); }
    }
});