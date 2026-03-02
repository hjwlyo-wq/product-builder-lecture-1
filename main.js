
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

const uploadBtn = document.getElementById('upload-btn');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const resultContainer = document.getElementById('result-container');
const loadingText = document.getElementById('loading');

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

uploadBtn.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            
            if (!model) {
                loadingText.style.display = 'block';
                await init();
            }
            
            predict();
        };
        reader.readAsDataURL(file);
    }
});

async function predict() {
    loadingText.style.display = 'block';
    resultContainer.innerHTML = '';
    
    // Prediction 1: run input through teachable machine model
    const prediction = await model.predict(imagePreview);
    
    loadingText.style.display = 'none';
    
    prediction.sort((a, b) => b.probability - a.probability);
    
    const topResult = prediction[0];
    const percentage = (topResult.probability * 100).toFixed(0);
    
    let animalType = topResult.className;
    let message = "";
    
    if (animalType === "Dog") {
        message = `🐶 You look like a Dog! (${percentage}%)`;
    } else if (animalType === "Cat") {
        message = `🐱 You look like a Cat! (${percentage}%)`;
    } else {
        message = `${animalType} look! (${percentage}%)`;
    }
    
    resultContainer.innerHTML = message;
}
