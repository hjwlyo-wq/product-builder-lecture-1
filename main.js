// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    themeToggle.textContent = body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// Lotto Generator
const generateBtn = document.getElementById('generate-btn');
const numberSpans = document.querySelectorAll('.number');
const previousDrawsList = document.getElementById('previous-draws');

generateBtn.addEventListener('click', () => {
    const numbers = [];
    while (numbers.length < 6) {
        const rand = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(rand)) {
            numbers.push(rand);
        }
    }
    numbers.sort((a, b) => a - b);

    numberSpans.forEach((span, index) => {
        span.textContent = numbers[index];
    });

    const li = document.createElement('li');
    li.textContent = numbers.join(', ');
    previousDrawsList.prepend(li);
});

// Animal Look Test (Teachable Machine)
const URL = "https://teachablemachine.withgoogle.com/models/1IuuXyyng/";
let model, maxPredictions;

const dropArea = document.getElementById('drop-area');
const imageUpload = document.getElementById('image-upload');
const uploadBtn = document.getElementById('upload-btn');
const imagePreview = document.getElementById('image-preview');
const imagePreviewContainer = document.getElementById('image-preview-container');
const resultContainer = document.getElementById('result-container');
const loadingText = document.getElementById('loading');
const animalHistoryList = document.getElementById('animal-history-list');
const recentAnimalResults = document.getElementById('recent-animal-results');

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Drag and Drop Logic
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
});

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

uploadBtn.addEventListener('click', () => imageUpload.click());
imageUpload.addEventListener('change', (e) => handleFiles(e.target.files));

function handleFiles(files) {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            imagePreview.src = e.target.result;
            imagePreviewContainer.style.display = 'block';
            dropArea.style.display = 'none';
            
            if (!model) {
                loadingText.style.display = 'block';
                await init();
            }
            
            predict();
        };
        reader.readAsDataURL(file);
    }
}

async function predict() {
    loadingText.style.display = 'block';
    resultContainer.innerHTML = '';
    
    const prediction = await model.predict(imagePreview);
    loadingText.style.display = 'none';
    
    prediction.sort((a, b) => b.probability - a.probability);
    
    const topResult = prediction[0];
    const percentage = (topResult.probability * 100).toFixed(0);
    
    // UI Upgrade: Show detailed bars
    let html = `<div class="result-header">
        <h2>You are ${percentage}% ${topResult.className}!</h2>
    </div>`;
    
    prediction.forEach(p => {
        const prob = (p.probability * 100).toFixed(0);
        html += `
            <div class="prediction-bar-container">
                <div class="prediction-label">
                    <span>${p.className === 'Dog' ? '🐶' : '🐱'} ${p.className}</span>
                    <span>${prob}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${prob}%; background-color: ${p.className === 'Dog' ? '#4CAF50' : '#2196F3'}"></div>
                </div>
            </div>
        `;
    });
    
    html += `<button onclick="resetTest()" class="btn-secondary" style="margin-top: 20px;">Try Another Photo</button>`;
    
    resultContainer.innerHTML = html;
    
    // Add to history
    addToHistory(topResult.className, percentage);
}

function addToHistory(type, percentage) {
    recentAnimalResults.style.display = 'block';
    const li = document.createElement('li');
    const now = new Date().toLocaleTimeString();
    li.innerHTML = `<span>${type === 'Dog' ? '🐶' : '🐱'} ${type} (${percentage}%)</span> <small>${now}</small>`;
    animalHistoryList.prepend(li);
}

function resetTest() {
    imagePreviewContainer.style.display = 'none';
    dropArea.style.display = 'block';
    resultContainer.innerHTML = '';
    imageUpload.value = '';
}

// Global exposure for reset
window.resetTest = resetTest;
