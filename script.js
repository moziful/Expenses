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

// Store expenses in localStorage
const now = new Date();
const expensesData = [
    { name: 'Meal', amount: 1730, category: 'Food', date: '05.03.2026', time: '08:23' },
    { name: 'Rent', amount: 1300, category: 'Housing', date: '01.03.2026', time: '11:15' },
    { name: 'Khala bill', amount: 300, category: 'Utilities', date: '07.03.2026', time: '14:48' },
    { name: 'Wifi + Electricity', amount: 200, category: 'Utilities', date: '03.03.2026', time: '17:12' },
    { name: 'Nur', amount: 1200, category: 'Personal', date: '10.03.2026', time: '09:40' },
    { name: 'M vai', amount: 305, category: 'Personal', date: '12.03.2026', time: '18:25' },
    { name: 'Maruf', amount: 105, category: 'Personal', date: '15.03.2026', time: '13:35' },
    { name: 'Arf', amount: 500, category: 'Personal', date: '08.03.2026', time: '07:50' },
    { name: 'Nanike dichi', amount: 5000, category: 'Personal', date: '14.03.2026', time: '10:22' },
    { name: 'Bari asa', amount: 200, category: 'Personal', date: '16.03.2026', time: '15:15' },
    { name: 'Jawa', amount: 160, category: 'Transportation', date: '02.03.2026', time: '08:10' },
    { name: 'Riksha', amount: 500, category: 'Transportation', date: '06.03.2026', time: '12:42' },
    { name: 'ASF', amount: 60, category: 'Personal', date: '09.03.2026', time: '16:30' },
    { name: 'P', amount: 850, category: 'Personal', date: '11.03.2026', time: '09:05' },
    { name: 'P', amount: 669, category: 'Personal', date: '13.03.2026', time: '14:50' },
    { name: 'P', amount: 300, category: 'Personal', date: '17.03.2026', time: '19:15' }
];
localStorage.setItem('expenses', JSON.stringify(expensesData));

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
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Update the total button in nav
    const totalButton = document.querySelector('nav button');
    totalButton.textContent = `$${total}`;

    const home = containers.home;

    expenses.forEach((exp, index) => {
        const expenseList = document.createElement('ul');
        expenseList.classList.add('list', 'bg-green-200');
        expenseList.innerHTML = `
                <li class="list-row">
                    <div class="flex items-center justify-center">
                        <i class="fa-solid fa-bicycle text-2xl"></i>
                    </div>
                    <div class="list-col-grow">
                        <div class="font-semibold text-base">${exp.name}</div>
                        <div class="text-xs text-gray-600">${exp.category} - ${exp.date} ${exp.time}</div>
                    </div>
                    <div class="flex justify-center items-center font-bold text-lg">
                        $${exp.amount}
                    </div>
                </li>
                <hr class="mx-4 border-green-300">
            `;
        home.appendChild(expenseList);
    });
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