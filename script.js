// -------------------- QUOTE FETCHING --------------------
fetch('https://api.allorigins.win/raw?url=https://zenquotes.io/api/random')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('quote').textContent = `"${data[0].q}" — ${data[0].a}`;
    })
    .catch(error => {
        console.error("API fetch failed:", error);

        const backupQuotes = [
            `"The only way to do great work is to love what you do." – Steve Jobs`,
            `"If you really look closely, most overnight successes took a long time." – Steve Jobs`,
            `"In the middle of difficulty lies opportunity." — Albert Einstein`,
            `"Do what you can, with what you have, where you are." — Theodore Roosevelt`,
            `"Success is not final, failure is not fatal: It is the courage to continue that counts." — Winston Churchill`
        ];
        const randomQuote = backupQuotes[Math.floor(Math.random() * backupQuotes.length)];
        document.getElementById('quote').textContent = randomQuote;
    });

// -------------------- HABIT TRACKING WITH STREAKS + RESET --------------------
const habitList = document.getElementById('habit-list');
const addHabitBtn = document.getElementById('add-habit');
const newHabitInput = document.getElementById('new-habit');

// Load saved habits and last reset date
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let lastResetDate = localStorage.getItem('lastResetDate');

// Get today's date as a string
const today = new Date().toISOString().split("T")[0]; // "2025-09-06"
let lastResetDate = localStorage.getItem('lastResetDate');

// Daily reset logic
if (lastResetDate !== today) {
    habits.forEach(habit => {
        if (habit.completedToday) {
            habit.lastCompleted = today;
        }
        habit.completedToday = false;
    });
    localStorage.setItem('lastResetDate', today);
    saveHabits();
}

// Render habits
function renderHabits() {
    habitList.innerHTML = '';
    habits.forEach((habit, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <label>
                <input type="checkbox" ${habit.completedToday ? 'checked' : ''}>
                ${habit.name}
            </label>
            <span class="streak">${habit.streak}-day streak</span>
        `;

        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', () => toggleHabit(index));

        habitList.appendChild(li);
    });
}

// Toggle habit completion and update streak
function toggleHabit(index) {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (habits[index].completedToday) {
        habits[index].completedToday = false;
        habits[index].streak = Math.max(0, habits[index].streak - 1);
    } else {
        if (habits[index].lastCompleted === yesterdayStr) {
            habits[index].streak += 1;
        } else {
            habits[index].streak = 1;
        }
        habits[index].completedToday = true;
        habits[index].lastCompleted = today;
    }

    saveHabits();
    renderHabits();
}

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Add new habit
addHabitBtn.addEventListener('click', () => {
    const habitName = newHabitInput.value.trim();
    if (habitName) {
        habits.push({ name: habitName, streak: 0, completedToday: false, lastCompleted: null });
        newHabitInput.value = '';
        saveHabits();
        renderHabits();
    }
});

// Initialize with defaults if empty
if (habits.length === 0) {
    habits = [
        { name: 'Read 10 pages', streak: 0, completedToday: false, lastCompleted: null },
        { name: 'Drink water', streak: 0, completedToday: false, lastCompleted: null },
        { name: 'Code for 30 mins', streak: 0, completedToday: false, lastCompleted: null }
    ];
    saveHabits();
}

document.getElementById('reset-day').addEventListener('click', () => {
    habits.forEach(habit => habit.completedToday = false);
    saveHabits();
    renderHabits();
});

renderHabits();
