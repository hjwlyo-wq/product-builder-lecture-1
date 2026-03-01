const generateBtn = document.getElementById('generate-btn');
const lottoNumbers = document.querySelectorAll('.number');
const previousDrawsList = document.getElementById('previous-draws');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Theme Toggle Logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = 'Light Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    let theme = 'light';
    if (body.classList.contains('dark-mode')) {
        theme = 'dark';
        themeToggle.textContent = 'Light Mode';
    } else {
        themeToggle.textContent = 'Dark Mode';
    }
    localStorage.setItem('theme', theme);
});

// Lotto Generation Logic
generateBtn.addEventListener('click', () => {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    lottoNumbers.forEach((numberEl, index) => {
        numberEl.textContent = sortedNumbers[index];
        numberEl.style.backgroundColor = getNumberColor(sortedNumbers[index]);
        numberEl.style.color = 'white';
    });

    addPreviousDraw(sortedNumbers);
});

function getNumberColor(number) {
    if (number <= 10) return '#f39c12'; // Yellow
    if (number <= 20) return '#3498db'; // Blue
    if (number <= 30) return '#e74c3c'; // Red
    if (number <= 40) return '#2ecc71'; // Green
    return '#9b59b6'; // Purple
}

function addPreviousDraw(numbers) {
    const li = document.createElement('li');
    li.textContent = numbers.join(', ');
    previousDrawsList.prepend(li);
}
