const tabs = document.querySelectorAll('footer [role="tab"]');
const plusButton = document.getElementById('plusButton');
const containers = {
    home: document.getElementById('expenseContainer'),
    calendar: document.getElementById('calendarContainer'),
    charts: document.getElementById('chartsContainer'),
    settings: document.getElementById('settingsContainer'),
};

const header = document.querySelector('header');
const footer = document.querySelector('footer');
const main = document.querySelector('main');

// Calendar state
const now = new Date();
let calendarYear = now.getFullYear();
let calendarMonth = now.getMonth(); // 0-indexed (0=Jan)

function formatMonthYear(year, month) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[month]} ${year}`;
}

function formatStorageDate(year, month, day) {
    // Matches stored format like 3/10/2026
    return `${month + 1}/${day}/${year}`;
}

function parseDate(value) {
    if (!value) return null;

    // Accept Date objects directly
    if (value instanceof Date) {
        return isNaN(value) ? null : value;
    }

    // Normalize common separators (slash/dot)
    const normalized = String(value).trim();

    // DD/MM/YYYY or MM/DD/YYYY or DD.MM.YYYY or MM.DD.YYYY with optional time
    const m = normalized.match(/^(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{4})(?:[ T](\d{1,2}):(\d{2}))?/);
    if (m) {
        const a = Number(m[1]);
        const b = Number(m[2]);
        const y = Number(m[3]);
        const hh = m[4] ? Number(m[4]) : 0;
        const mm = m[5] ? Number(m[5]) : 0;

        // Try DD/MM/YYYY first (common outside US), then fallback to MM/DD/YYYY
        const tryDdMm = new Date(y, b - 1, a, hh, mm);
        if (!isNaN(tryDdMm)) return tryDdMm;

        const tryMmDd = new Date(y, a - 1, b, hh, mm);
        if (!isNaN(tryMmDd)) return tryMmDd;

        return null;
    }

    // YYYY-MM-DD (ISO) with optional time
    const iso = normalized.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
    if (iso) {
        const y = Number(iso[1]);
        const mo = Number(iso[2]) - 1;
        const d = Number(iso[3]);
        const hh = iso[4] ? Number(iso[4]) : 0;
        const mm = iso[5] ? Number(iso[5]) : 0;
        const date = new Date(y, mo, d, hh, mm);
        if (!isNaN(date)) return date;
    }

    // Last resort: let JS try parsing
    const date = new Date(normalized);
    return isNaN(date) ? null : date;
}

function formatKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function changeCalendarMonth(delta) {
    calendarMonth += delta;
    if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear -= 1;
    } else if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear += 1;
    }
    renderCalendar();
}

function onMonthPickerChange(value) {
    if (!value) return;
    const [year, month] = value.split('-').map(Number);
    calendarYear = year;
    calendarMonth = month - 1;
    renderCalendar();
}


function getCategoryIcon(category) {
    const icons = {
        'Food': 'fa-utensils',
        'Housing': 'fa-house-chimney',
        'Utilities': 'fa-lightbulb',
        'Income': 'fa-money-check-dollar',
        'Personal': 'fa-user',
        'Transportation': 'fa-car-side',
        'Tea': 'fa-mug-hot',
    };
    return icons[category] || 'fa-file-circle-question';
}

function setMainHeight() {
    const headerHeight = header.offsetHeight;
    const footerHeight = footer.offsetHeight;
    main.style.height = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
}

function clearContainers() {
    Object.values(containers).forEach((container) => {
        container.classList.add('hidden');
        container.innerHTML = '';
    });
}

function renderHome() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const total = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    // Update the total button in nav
    const totalButton = document.querySelector('nav button');
    totalButton.textContent = `$${total}`;

    const home = containers.home;

    expenses.forEach((exp, index) => {
        const expenseList = document.createElement('ul');
        expenseList.classList.add('list', 'bg-green-200');

        const li = document.createElement('li');
        li.classList.add('list-row');
        li.innerHTML = `
                    <div class="flex items-center justify-center">
                        <i class="fa-solid ${getCategoryIcon(exp.category)} text-2xl"></i>
                    </div>
                    <div class="list-col-grow">
                        <div class="font-semibold text-base">${exp.name}</div>
                        <div class="text-xs text-gray-600">
                            <span>${exp.category}</span>
                            •
                            <span>${exp.time}</span>
                        </div>
                    </div>
                    <div class="flex justify-center items-center font-bold text-lg ${exp.category === 'Income' ? 'text-green-500' : 'text-red-500'}">
                        ${exp.amount}
                    </div>
                `;
        expenseList.appendChild(li);
        home.appendChild(expenseList);

        const hr = document.createElement('hr');
        hr.classList.add('border-b-1', 'mx-4', 'border-green-300');
        home.appendChild(hr);
    });
    // addEntry.showModal();
}

function renderCalendar() {
    const calendar = containers.calendar;
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    const expensesByDate = {};
    expenses.forEach(exp => {
        const dateObj = parseDate(exp.date);
        if (!dateObj) return;
        const key = formatKey(dateObj);
        if (!expensesByDate[key]) {
            expensesByDate[key] = [];
        }
        expensesByDate[key].push(exp);
    });

    // Create calendar
    let calendarHTML = '<div class="p-4">';
    calendarHTML += `
        <div class="flex items-center justify-around mb-4 w-full">
            <div class="flex gap-2">
                <button class="btn btn-sm bg-green-200" onclick="changeCalendarMonth(-1)">Prev</button>
                <button class="btn btn-sm bg-green-200" onclick="changeCalendarMonth(1)">Next</button>
            </div>
            <div class="font-bold text-center text-xl w-full">${formatMonthYear(calendarYear, calendarMonth)}</div>
            <div class="flex items-center">
                
                <input id="calendarMonthPicker" type="month" class="input input-sm bg-green-200" value="${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}" onchange="onMonthPickerChange(this.value)" />
            </div>
        </div>
    `;

    // Days of week header
    calendarHTML += '<div class="grid grid-cols-7 gap-2 mb-4">';
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        calendarHTML += `<div class="text-center shadow-sm bg-blue-300 rounded-sm font-bold text-sm p-2">${day}</div>`;
    });
    calendarHTML += '</div>';

    // Calendar days
    calendarHTML += '<div class="grid grid-cols-7 gap-2">';

    // Calculate first day and number of days of selected month
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div></div>';
    }

    const today = new Date();

    // Days of month
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(calendarYear, calendarMonth, day);
        const key = formatKey(date);
        const dayExpenses = expensesByDate[key] || [];
        const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const hasExpenses = dayExpenses.length > 0;

        const isToday =
            calendarYear === today.getFullYear() &&
            calendarMonth === today.getMonth() &&
            day === today.getDate();

        const isPastOrToday = date.getTime() <= todayMidnight;

        const bgColor = 'bg-green-300';
        const todayBg = isToday ? 'bg-blue-300' : '';

        const displayTotal = hasExpenses || isPastOrToday;
        const totalText = hasExpenses ? `$${dayTotal}` : '$0';

        calendarHTML += `
            <div class="p-3 shadow-sm h-16 flex flex-col justify-center rounded ${todayBg || bgColor}">
                <div class="font-bold flex justify-center items-center">${day}</div>
                ${displayTotal ? `<div class="text-xs text-${hasExpenses ? 'green' : 'gray'}-700 font-semibold">${totalText}</div>` : ''}
            </div>
        `;
    }

    calendarHTML += '</div>';
    calendarHTML += '</div>';

    calendar.innerHTML = calendarHTML;
}

function renderCharts() {
    const charts = containers.charts;
    charts.innerHTML = `
        <div class="p-4">
            <h2 class="text-lg font-semibold">Charts</h2>
            <p class="text-sm text-gray-600">This is a placeholder for charts.</p>
        </div>
    `;
}

function renderSettings() {
    const settings = containers.settings;
    settings.innerHTML = `
        <div class="p-4">
            <h2 class="text-lg font-semibold">Settings</h2>
            <p class="text-sm text-gray-600">Settings will go here.</p>
        </div>
    `;
}

function setActiveTab(tabName) {
    tabs.forEach((tab) => {
        const isActive = tab.dataset.tab === tabName;
        tab.classList.toggle('tab-active', isActive);
    });

    clearContainers();

    if (tabName === 'home') {
        renderHome();
        plusButton.classList.remove('hidden');
        updatePadding();
    } else {
        plusButton.classList.add('hidden');
    }

    switch (tabName) {
        case 'calendar':
            containers.calendar.classList.remove('hidden');
            renderCalendar();
            break;
        case 'charts':
            containers.charts.classList.remove('hidden');
            renderCharts();
            break;
        case 'settings':
            containers.settings.classList.remove('hidden');
            renderSettings();
            break;
        default:
            containers.home.classList.remove('hidden');
            break;
    }
}

function updatePadding() {
    const listItems = containers.home.querySelectorAll('li');
    const buttonRect = plusButton.getBoundingClientRect();

    listItems.forEach((li) => {
        const liRect = li.getBoundingClientRect();
        const overlaps = liRect.bottom > buttonRect.top && liRect.top < buttonRect.bottom;
        li.classList.toggle('pr-20', overlaps);

        // Make the HR shorter when the item is under the button
        const hr = li.nextElementSibling;
        if (hr && hr.tagName === 'HR') {
            hr.style.width = overlaps ? `${Math.max(0, buttonRect.left - 16)}px` : '';
        }
    });
}

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        setActiveTab(tab.dataset.tab);
    });
});

window.addEventListener('resize', updatePadding);

// Initialize SPA on load
setActiveTab('calendar');

// Set main height on load and resize
window.addEventListener('load', setMainHeight);
window.addEventListener('resize', setMainHeight);

// Add scroll listener to main for dynamic padding
main.addEventListener('scroll', updatePadding);

// Tab switching functions for modal
function setExpenseMode() {
    const tabs = document.querySelectorAll('.modal .tabs a[role="tab"]');
    tabs[0].classList.add('tab-active', 'bg-green-300');
    tabs[0].classList.remove('bg-green-200');
    tabs[1].classList.remove('tab-active', 'bg-green-300');
    tabs[1].classList.add('bg-green-200');
    const select = document.querySelector('.modal select');
    select.innerHTML = `
        <option value="" disabled selected>Select Category</option>
        <option value="Food">Food</option>
        <option value="Housing">Housing</option>
        <option value="Utilities">Utilities</option>
        <option value="Personal">Personal</option>
        <option value="Transportation">Transportation</option>
        <option value="Other">Other</option>
    `;
}

function setIncomeMode() {
    const tabs = document.querySelectorAll('.modal .tabs a[role="tab"]');
    tabs[1].classList.add('tab-active', 'bg-green-300');
    tabs[1].classList.remove('bg-green-200');
    tabs[0].classList.remove('tab-active', 'bg-green-300');
    tabs[0].classList.add('bg-green-200');
    const select = document.querySelector('.modal select');
    select.innerHTML = `
        <option value="" disabled selected>Select Type</option>
        <option value="Salary">Salary</option>
        <option value="Freelance">Freelance</option>
        <option value="Investment">Investment</option>
        <option value="Other">Other</option>
    `;
}




const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');

// Format: YYYY-MM-DD (required for date input)
const date = now.toISOString().split('T')[0];

// Format: HH:MM (24-hour)
const time = now.toTimeString().slice(0, 5);

dateInput.value = date;
timeInput.value = time;