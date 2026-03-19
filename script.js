const tabs = document.querySelectorAll('footer [role="tab"]');
const fab = document.getElementById('fab');
const containers = {
    home: document.getElementById('expenseContainer'),
    calendar: document.getElementById('calendarContainer'),
    charts: document.getElementById('chartsContainer'),
    settings: document.getElementById('settingsContainer'),
};

const header = document.querySelector('header');
const footer = document.querySelector('footer');
const main = document.querySelector('main');

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
    const expenses = JSON.parse(localStorage.getItem('expenses')) || ['No Expenses Found'];
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

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
                        <div class="text-xs text-gray-600 flex justify-between">
                            <span>${exp.category}</span>
                            <span><i class="fa-solid fa-clock"></i> ${exp.time}</span>
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
    addEntry.showModal();
}

function renderCalendar() {
    const calendar = containers.calendar;
    calendar.innerHTML = `
        <div class="p-4">
            <h2 class="text-lg font-semibold">Calendar</h2>
            <p class="text-sm text-gray-600">This is a placeholder for a calendar view.</p>
        </div>
    `;
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
        fab.classList.remove('hidden');
        updatePadding();
    } else {
        fab.classList.add('hidden');
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
    const buttonRect = fab.getBoundingClientRect();

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
setActiveTab('home');

// Set main height on load and resize
window.addEventListener('load', setMainHeight);
window.addEventListener('resize', setMainHeight);

// Add scroll listener to main for dynamic padding
main.addEventListener('scroll', updatePadding);




const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');

const now = new Date();

// Format: YYYY-MM-DD (required for date input)
const date = now.toISOString().split('T')[0];

// Format: HH:MM (24-hour)
const time = now.toTimeString().slice(0, 5);

dateInput.value = date;
timeInput.value = time;