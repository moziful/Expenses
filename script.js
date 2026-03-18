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

function makeExpenseList() {
    const wrapper = document.createElement('div');


    for (let c = 1; c <= 20; c++) {
        const expenseList = document.createElement('ul');
        expenseList.classList.add('list', 'bg-green-200');
        expenseList.innerHTML = `
                <!-- Each expense -->
                <li class="list-row">
                    <!-- the icon -->
                    <div class="flex items-center justify-center">
                        <i class="fa-solid fa-bicycle text-2xl"></i>
                    </div>
                    <!-- details -->
                    <div class="list-col-grow">
                        <div>Dio Lupa ${c}</div>
                        <div>Remaining Reason</div>
                    </div>
                    <!-- amount -->
                    <div class="flex justify-center items-center">
                        $12000000000
                    </div>
                </li>
                <hr class="mx-4 border-green-300">
            `;
        wrapper.appendChild(expenseList);
    }

    return wrapper;
}

function renderHome() {
    const home = containers.home;
    home.appendChild(makeExpenseList());
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