// Oregon Bird Song Challenge - Main Script
import birdsDatabase from './birds.js';

// ===== GAME STATE =====
const gameState = {
    currentCategory: null,
    birdsInRound: [],
    currentBirdIndex: 0,
    score: 0,
    timeSpent: 0,
    timer: null,
    audioContext: null,
    audioBuffer: null,
    audioSource: null,
    audioAnalyser: null,
    audioPlaying: false,
    replaysLeft: 3,
    results: [],
    settings: {
        volume: 80,
        difficulty: 'easy',
        optionCount: 5,
        timeLimit: 0,
        highContrast: false,
        largeText: false
    }
};

// ===== DOM ELEMENTS =====
// Screens
const titleScreen = document.getElementById('title-screen');
const readyScreen = document.getElementById('ready-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const guideScreen = document.getElementById('guide-screen');
const settingsModal = document.getElementById('settings-modal');

// Title Screen Elements
const categoryButtons = document.querySelectorAll('.category-btn');
const birdGuideBtn = document.getElementById('bird-guide-btn');
const settingsBtn = document.getElementById('settings-btn');

// Ready Screen Elements
const selectedCategory = document.getElementById('selected-category');
const countdown = document.querySelector('.countdown');

// Game Screen Elements
const currentBirdEl = document.getElementById('current-bird');
const totalBirdsEl = document.getElementById('total-birds');
const timeElapsedEl = document.getElementById('time-elapsed');
const currentScoreEl = document.getElementById('current-score');
const playBtn = document.getElementById('play-btn');
const replaysCountEl = document.getElementById('replays-count');
const optionsContainer = document.querySelector('.options-container');
const soundWave = document.querySelector('.sound-wave');

// End Screen Elements
const endCategoryEl = document.getElementById('end-category');
const endDateEl = document.getElementById('end-date');
const endScoreEl = document.getElementById('end-score');
const endAccuracyEl = document.getElementById('end-accuracy');
const endTimeEl = document.getElementById('end-time');
const birdResultsEl = document.querySelector('.bird-results');
const playAgainBtn = document.getElementById('play-again-btn');
const newCategoryBtn = document.getElementById('new-category-btn');
const shareResultsBtn = document.getElementById('share-results-btn');

// Guide Screen Elements
const guideCategoryFilter = document.getElementById('guide-category-filter');
const birdsGallery = document.querySelector('.birds-gallery');
const guideBackBtn = document.getElementById('guide-back-btn');

// Settings Modal Elements
const closeSettingsBtn = document.getElementById('close-settings');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const optionCountSelect = document.getElementById('option-count');
const timeLimitInput = document.getElementById('time-limit');
const highContrastCheckbox = document.getElementById('high-contrast');
const largeTextCheckbox = document.getElementById('large-text');
const saveSettingsBtn = document.getElementById('save-settings');
const resetSettingsBtn = document.getElementById('reset-settings');

// Add toggleTheme function
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Toggle cool theme class
    body.classList.toggle('cool-theme');
    
    // Update icon
    if (body.classList.contains('cool-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'cool');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

// Add theme loading on init
function init() {
    // Load saved settings from local storage
    loadSettings();
    
    // Load saved theme
    loadTheme();
    
    // Initialize Web Audio API
    initAudio();
    
    // Add event listeners
    addEventListeners();
    
    // Initial UI setup
    applyAccessibilitySettings();
}

// Add theme loading function
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        
        if (savedTheme === 'cool') {
            body.classList.add('cool-theme');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

// ===== EVENT LISTENERS =====
// Add theme toggling functionality
function addEventListeners() {
    // Title Screen
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => startGame(button.dataset.category));
    });
    
    birdGuideBtn.addEventListener('click', showBirdGuide);
    settingsBtn.addEventListener('click', showSettings);
    
    // Game Screen
    playBtn.addEventListener('click', playBirdCall);
    
    // End Screen
    playAgainBtn.addEventListener('click', () => startGame(gameState.currentCategory));
    newCategoryBtn.addEventListener('click', showTitleScreen);
    shareResultsBtn.addEventListener('click', shareResults);
    
    // Guide Screen
    guideCategoryFilter.addEventListener('change', filterBirdGuide);
    guideBackBtn.addEventListener('click', showTitleScreen);
    
    // Settings Modal
    closeSettingsBtn.addEventListener('click', hideSettings);
    volumeSlider.addEventListener('input', updateVolumeDisplay);
    difficultyBtns.forEach(button => {
        button.addEventListener('click', () => setDifficulty(button.dataset.difficulty));
    });
    saveSettingsBtn.addEventListener('click', saveSettings);
    resetSettingsBtn.addEventListener('click', resetSettings);
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// ===== AUDIO FUNCTIONS =====
function initAudio() {
    try {
        // Create audio context on user interaction to comply with autoplay policies
        const createAudioContext = () => {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            gameState.audioContext = new AudioContext();
            
            // Create analyzer for sound visualization
            gameState.audioAnalyser = gameState.audioContext.createAnalyser();
            gameState.audioAnalyser.fftSize = 256;
            
            // Remove event listeners once context is created
            document.removeEventListener('click', createAudioContext);
            document.removeEventListener('touchstart', createAudioContext);
        };
        
        // Add event listeners to create context on user interaction
        document.addEventListener('click', createAudioContext);
        document.addEventListener('touchstart', createAudioContext);
    } catch (e) {
        console.error('Web Audio API is not supported in this browser', e);
        alert('Sorry, your browser does not support the Web Audio API needed for this game.');
    }
}

// Also update the loadBirdCall function to use iframe approach
function loadBirdCall(url) {
    return new Promise((resolve, reject) => {
        // Extract Xeno-Canto ID 
        const xcId = extractXenoCantoId(url);
        
        if (!xcId) {
            showNotification('Could not extract audio ID from URL', 'error');
            reject(new Error('Invalid audio URL format'));
            return;
        }
        
        // Clear previous audio content
        gameState.xcPlayerId = xcId;
        
        // Show notification
        showNotification('Loading bird call...', 'info');
        
        // Create iframe temporarily to load the audio
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        
        const iframe = document.createElement('iframe');
        iframe.src = `https://xeno-canto.org/sounds/embed/${xcId}`;
        iframe.width = '340';
        iframe.height = '115';
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';
        
        // Set a timeout in case the iframe doesn't load
        const timeoutId = setTimeout(() => {
            document.body.removeChild(tempContainer);
            reject(new Error('Audio loading timed out'));
        }, 10000);
        
        iframe.onload = () => {
            clearTimeout(timeoutId);
            document.body.removeChild(tempContainer);
            
            // Mark as ready to play
            gameState.audioReady = true;
            showNotification('Bird call loaded! Click play to listen.', 'success');
            resolve();
        };
        
        iframe.onerror = () => {
            clearTimeout(timeoutId);
            document.body.removeChild(tempContainer);
            reject(new Error('Failed to load audio'));
        };
        
        tempContainer.appendChild(iframe);
        document.body.appendChild(tempContainer);
    });
}

// Add notification function to give better feedback
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    if (!notification || !notificationText) return;
    
    // Set icon based on type
    const icon = notification.querySelector('i');
    if (icon) {
        icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 
                         type === 'success' ? 'fas fa-check-circle' : 
                         'fas fa-info-circle';
    }
    
    // Set text
    notificationText.textContent = message;
    
    // Add appropriate class
    notification.className = 'notification';
    if (type === 'error') {
        notification.classList.add('error');
    } else if (type === 'success') {
        notification.classList.add('success');
    }
    
    // Show notification
    notification.classList.add('active');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

function playBirdCall() {
    if (gameState.audioPlaying) {
        stopBirdCall();
        return;
    }
    
    if (gameState.replaysLeft <= 0 && gameState.currentBirdIndex > 0) {
        // Don't allow replay if no more replays left (except for first play)
        showNotification('No replays left!', 'error');
        return;
    }
    
    if (!gameState.audioReady) {
        showNotification('Audio not loaded yet. Please wait.', 'info');
        return;
    }
    
    // Reduce replays count if not first play
    if (gameState.currentBirdIndex > 0 || gameState.audioPlaying) {
        gameState.replaysLeft--;
        replaysCountEl.textContent = gameState.replaysLeft;
    }
    
    // Create and embed the Xeno-Canto player iframe
    const soundWave = document.querySelector('.sound-wave');
    if (!soundWave) return;
    
    // Clear previous content
    soundWave.innerHTML = '';
    
    // Add iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://xeno-canto.org/sounds/embed/${gameState.xcPlayerId}`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.allow = 'autoplay';
    iframe.className = 'xc-player-iframe';
    
    soundWave.appendChild(iframe);
    
    // Mark as playing
    gameState.audioPlaying = true;
    
    // Update UI
    playBtn.innerHTML = '<i class="fas fa-stop"></i>';
    
    // Create fake visualization since we can't access the audio data directly
    createFakeVisualization();
    
    // Auto-stop after 10 seconds
    gameState.audioTimeout = setTimeout(() => {
        stopBirdCall();
    }, 15000);
}

function stopBirdCall() {
    if (!gameState.audioPlaying) return;
    
    // Clear the audio timeout
    if (gameState.audioTimeout) {
        clearTimeout(gameState.audioTimeout);
        gameState.audioTimeout = null;
    }
    
    // Get the sound wave container and clear it
    const soundWave = document.querySelector('.sound-wave');
    if (soundWave) {
        soundWave.innerHTML = '';
    }
    
    gameState.audioPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Stop visualization
    stopVisualization();
}

// Create a fake visualization since we can't access audio data from iframe
function createFakeVisualization() {
    const soundWave = document.querySelector('.sound-wave');
    if (!soundWave) return;
    
    // Add visualization bars in front of the iframe
    const visualizer = document.createElement('div');
    visualizer.className = 'fake-visualizer';
    visualizer.style.position = 'absolute';
    visualizer.style.top = '0';
    visualizer.style.left = '0';
    visualizer.style.width = '100%';
    visualizer.style.height = '100%';
    visualizer.style.pointerEvents = 'none';
    visualizer.style.zIndex = '5';
    visualizer.style.display = 'flex';
    visualizer.style.alignItems = 'flex-end';
    visualizer.style.justifyContent = 'space-around';
    
    // Add bars
    const barCount = 30;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = `${100 / barCount}%`;
        bar.style.height = '10%';
        bar.style.margin = '0 1px';
        bar.style.animationDelay = `${i * 0.05}s`;
        
        visualizer.appendChild(bar);
    }
    
    soundWave.appendChild(visualizer);
}

function stopBirdCall() {
    if (!gameState.audioPlaying) return;
    
    try {
        // Pause the audio element
        if (gameState.audioElement) {
            gameState.audioElement.pause();
            // Reset to beginning for next play
            gameState.audioElement.currentTime = 0;
        }
    } catch (e) {
        console.warn('Error stopping audio element:', e);
    }
    
    gameState.audioPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Stop visualization
    stopVisualization();
}

function startVisualization() {
    // Create visualization elements if they don't exist
    if (!document.querySelector('.sound-wave .bar')) {
        createVisualizationBars();
    }
    
    soundWave.classList.add('active');
    
    // Start animation loop
    updateVisualization();
}

function createVisualizationBars() {
    const barCount = 50;
    
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = `${100 / barCount}%`;
        bar.style.left = `${i * (100 / barCount)}%`;
        bar.style.animationDelay = `${i * 0.02}s`;
        bar.style.backgroundColor = `var(--sky-blue)`;
        bar.style.position = 'absolute';
        bar.style.bottom = '0';
        bar.style.height = '10%';
        
        soundWave.appendChild(bar);
    }
}

function updateVisualization() {
    if (!gameState.audioPlaying) return;
    
    const bufferLength = gameState.audioAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    gameState.audioAnalyser.getByteFrequencyData(dataArray);
    
    const bars = document.querySelectorAll('.sound-wave .bar');
    const barCount = bars.length;
    
    for (let i = 0; i < barCount; i++) {
        const barIndex = Math.floor(i * (bufferLength / barCount));
        const barHeight = (dataArray[barIndex] / 255) * 100;
        
        bars[i].style.height = `${barHeight}%`;
    }
    
    requestAnimationFrame(updateVisualization);
}

function stopVisualization() {
    soundWave.classList.remove('active');
    const bars = document.querySelectorAll('.sound-wave .bar');
    bars.forEach(bar => {
        bar.style.height = '10%';
    });
}

// ===== GAME FLOW FUNCTIONS =====
function showTitleScreen() {
    hideAllScreens();
    titleScreen.classList.add('active');
    
    // Reset game state
    resetGameState();
}

function startGame(category) {
    gameState.currentCategory = category;
    selectedCategory.textContent = category;
    
    // Filter birds by category
    const categoryBirds = birdsDatabase.filter(bird => bird.category.includes(category));
    
    // Select random birds for this round (10 birds)
    gameState.birdsInRound = getRandomBirds(categoryBirds, 10);
    
    // Show ready screen with countdown
    hideAllScreens();
    readyScreen.classList.add('active');
    
    // Start countdown
    let count = 3;
    countdown.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        countdown.textContent = count;
        
        if (count <= 0) {
            clearInterval(countdownInterval);
            startRound();
        }
    }, 1000);
}

function startRound() {
    hideAllScreens();
    gameScreen.classList.add('active');
    
    // Reset game state for new round
    gameState.currentBirdIndex = 0;
    gameState.score = 0;
    gameState.timeSpent = 0;
    gameState.results = [];
    
    // Update UI
    currentScoreEl.textContent = gameState.score;
    totalBirdsEl.textContent = gameState.birdsInRound.length;
    
    // Start round
    loadNextBird();
    
    // Start timer
    startTimer();
}

function loadNextBird() {
    // Stop any playing audio
    stopBirdCall();
    
    // Reset replays count
    gameState.replaysLeft = 3;
    replaysCountEl.textContent = gameState.replaysLeft;
    
    // Update progress indicator
    currentBirdEl.textContent = `Bird ${gameState.currentBirdIndex + 1}`;
    
    // Get current bird
    const currentBird = gameState.birdsInRound[gameState.currentBirdIndex];
    
    // Load bird call audio
    loadBirdCall(currentBird.soundUrl)
        .then(() => {
            // Generate options
            generateOptions(currentBird);
            
            // Play the bird call automatically
            setTimeout(() => {
                playBirdCall();
            }, 500);
        })
        .catch(error => {
            console.error('Failed to load bird call:', error);
            alert('Failed to load audio. Proceeding to next bird.');
            gameState.currentBirdIndex++;
            checkRoundEnd();
        });
}

function generateOptions(correctBird) {
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Get birds in the same category for incorrect options
    const sameCategoryBirds = birdsDatabase.filter(bird => 
        bird.category.includes(gameState.currentCategory) && bird.id !== correctBird.id
    );
    
    // Determine number of options based on difficulty
    const optionCount = parseInt(gameState.settings.optionCount);
    
    // Get random incorrect birds for options
    const incorrectBirds = getRandomBirds(sameCategoryBirds, optionCount - 1);
    
    // Combine correct and incorrect birds and shuffle
    const allOptions = [correctBird, ...incorrectBirds];
    shuffleArray(allOptions);
    
    // Create option elements
    allOptions.forEach(bird => {
        const option = document.createElement('div');
        option.className = 'bird-option';
        option.innerHTML = `
            <div class="bird-option-name">${bird.commonName}</div>
            <div class="bird-option-scientific">${bird.scientificName}</div>
        `;
        
        // Add click event
        option.addEventListener('click', () => selectOption(option, bird, correctBird));
        
        optionsContainer.appendChild(option);
    });
}

function selectOption(optionElement, selectedBird, correctBird) {
    // Prevent selecting again if already selected
    if (optionElement.classList.contains('correct') || optionElement.classList.contains('incorrect')) {
        return;
    }
    
    // Stop any playing audio
    stopBirdCall();
    
    // Get all option elements
    const options = document.querySelectorAll('.bird-option');
    
    // Highlight correct and incorrect options
    options.forEach(option => {
        const birdName = option.querySelector('.bird-option-name').textContent;
        
        if (birdName === correctBird.commonName) {
            option.classList.add('correct');
        } else if (birdName === selectedBird.commonName) {
            option.classList.add('incorrect');
        }
    });
    
    // Check if correct
    const isCorrect = selectedBird.id === correctBird.id;
    
    // Calculate score
    let pointsEarned = 0;
    
    if (isCorrect) {
        // Base points + speed bonus
        const timeBonus = Math.max(0, 10 - Math.floor(gameState.timeSpent / 5));
        pointsEarned = 10 + timeBonus;
        
        gameState.score += pointsEarned;
        currentScoreEl.textContent = gameState.score;
    }
    
    // Record result
    gameState.results.push({
        bird: correctBird,
        correct: isCorrect,
        pointsEarned: pointsEarned,
        timeSpent: gameState.timeSpent
    });
    
    // Delay before loading next bird
    setTimeout(() => {
        gameState.currentBirdIndex++;
        checkRoundEnd();
    }, 1500);
}

function checkRoundEnd() {
    if (gameState.currentBirdIndex >= gameState.birdsInRound.length) {
        // End of round
        endRound();
    } else {
        // Load next bird
        loadNextBird();
    }
}

function endRound() {
    // Stop timer
    stopTimer();
    
    // Stop any playing audio
    stopBirdCall();
    
    // Show end screen
    hideAllScreens();
    endScreen.classList.add('active');
    
    // Calculate stats
    const correctAnswers = gameState.results.filter(result => result.correct).length;
    const accuracy = (correctAnswers / gameState.results.length) * 100;
    const totalTime = gameState.results.reduce((sum, result) => sum + result.timeSpent, 0);
    
    // Format time
    const formattedTime = formatTime(totalTime);
    
    // Update UI
    endCategoryEl.textContent = `Category: ${gameState.currentCategory}`;
    endDateEl.textContent = new Date().toLocaleDateString();
    endScoreEl.textContent = gameState.score;
    endAccuracyEl.textContent = `${Math.round(accuracy)}%`;
    endTimeEl.textContent = formattedTime;
    
    // Generate results list
    birdResultsEl.innerHTML = '';
    
    gameState.results.forEach((result, index) => {
        const resultElement = document.createElement('div');
        resultElement.className = `bird-result ${result.correct ? 'correct' : 'incorrect'}`;
        resultElement.innerHTML = `
            <span>${index + 1}. ${result.bird.commonName}</span>
            <span>${result.correct ? `+${result.pointsEarned}` : 'X'}</span>
        `;
        
        birdResultsEl.appendChild(resultElement);
    });
    
    // Save high score to local storage
    saveHighScore();
}

function startTimer() {
    // Reset time
    gameState.timeSpent = 0;
    timeElapsedEl.textContent = gameState.timeSpent;
    
    // Start timer
    gameState.timer = setInterval(() => {
        gameState.timeSpent++;
        timeElapsedEl.textContent = gameState.timeSpent;
        
        // Check time limit if set
        if (gameState.settings.timeLimit > 0 && gameState.timeSpent >= gameState.settings.timeLimit) {
            // Time's up - consider as incorrect
            selectOption(
                document.querySelector('.bird-option'), 
                { id: -1 }, // Dummy bird for incorrect answer
                gameState.birdsInRound[gameState.currentBirdIndex]
            );
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(gameState.timer);
}

// ===== BIRD GUIDE FUNCTIONS =====
function showBirdGuide() {
    hideAllScreens();
    guideScreen.classList.add('active');
    
    // Generate bird gallery
    generateBirdGallery();
}

function generateBirdGallery(category = 'all') {
    // Clear gallery
    birdsGallery.innerHTML = '';
    
    // Filter birds if category selected
    let birds = birdsDatabase;
    if (category !== 'all') {
        birds = birdsDatabase.filter(bird => bird.category.includes(category));
    }
    
    // Create bird cards
    birds.forEach(bird => {
        // Extract Xeno-Canto ID from URL
        const xcId = extractXenoCantoId(bird.soundUrl);
        
        const birdCard = document.createElement('div');
        birdCard.className = 'bird-card';
        birdCard.innerHTML = `
            <div class="bird-info">
                <h3 class="bird-name">${bird.commonName}</h3>
                <div class="bird-scientific">${bird.scientificName}</div>
                <div class="bird-category">${bird.category.join(', ')}</div>
                <p class="bird-description">${bird.description}</p>
                
                <div class="xc-player-container">
                    <iframe class="audio-iframe" src="https://xeno-canto.org/sounds/embed/${xcId}" scrolling="no" frameborder="0"></iframe>
                    <div class="audio-error-msg">
                        <a href="${bird.soundUrl}" target="_blank">Listen on Xeno-Canto</a>
                    </div>
                </div>
            </div>
        `;
        
        birdsGallery.appendChild(birdCard);
    });
}

// Helper function to extract Xeno-Canto ID from URL
function extractXenoCantoId(url) {
    // Example URL: https://xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC583183-191231_1248_EVGR.mp3
    // Extract the XC ID pattern like "XC583183"
    const match = url.match(/XC\d+/i);
    
    if (match) {
        return match[0];
    }
    
    // Alternative extraction method if the first one fails
    const segments = url.split('/');
    for (const segment of segments) {
        if (segment.includes('XC')) {
            return segment.split('-')[0];
        }
    }
    
    return '';
}

function filterBirdGuide() {
    const category = guideCategoryFilter.value;
    generateBirdGallery(category);
}

// ===== SETTINGS FUNCTIONS =====
function showSettings() {
    settingsModal.classList.add('active');
    
    // Update settings UI
    volumeSlider.value = gameState.settings.volume;
    volumeValue.textContent = `${gameState.settings.volume}%`;
    
    // Update difficulty buttons
    difficultyBtns.forEach(button => {
        if (button.dataset.difficulty === gameState.settings.difficulty) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update options
    optionCountSelect.value = gameState.settings.optionCount;
    timeLimitInput.value = gameState.settings.timeLimit;
    highContrastCheckbox.checked = gameState.settings.highContrast;
    largeTextCheckbox.checked = gameState.settings.largeText;
}

function hideSettings() {
    settingsModal.classList.remove('active');
}

function updateVolumeDisplay() {
    const volume = volumeSlider.value;
    volumeValue.textContent = `${volume}%`;
    gameState.settings.volume = parseInt(volume);
}

function setDifficulty(difficulty) {
    // Update difficulty setting
    gameState.settings.difficulty = difficulty;
    
    // Update UI
    difficultyBtns.forEach(button => {
        if (button.dataset.difficulty === difficulty) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Adjust game settings based on difficulty
    switch (difficulty) {
        case 'easy':
            optionCountSelect.value = '3';
            timeLimitInput.value = '0';
            break;
        case 'medium':
            optionCountSelect.value = '5';
            timeLimitInput.value = '15';
            break;
        case 'hard':
            optionCountSelect.value = '7';
            timeLimitInput.value = '10';
            break;
    }
}

function saveSettings() {
    // Get values from UI
    gameState.settings.volume = parseInt(volumeSlider.value);
    gameState.settings.optionCount = optionCountSelect.value;
    gameState.settings.timeLimit = parseInt(timeLimitInput.value);
    gameState.settings.highContrast = highContrastCheckbox.checked;
    gameState.settings.largeText = largeTextCheckbox.checked;
    
    // Save to local storage
    localStorage.setItem('birdGameSettings', JSON.stringify(gameState.settings));
    
    // Apply accessibility settings
    applyAccessibilitySettings();
    
    // Hide settings modal
    hideSettings();
}

function resetSettings() {
    // Reset to defaults
    gameState.settings = {
        volume: 80,
        difficulty: 'easy',
        optionCount: 5,
        timeLimit: 0,
        highContrast: false,
        largeText: false
    };
    
    // Update UI
    showSettings();
    
    // Apply settings
    applyAccessibilitySettings();
}

function loadSettings() {
    // Load from local storage
    const savedSettings = localStorage.getItem('birdGameSettings');
    
    if (savedSettings) {
        gameState.settings = JSON.parse(savedSettings);
    }
}

function applyAccessibilitySettings() {
    // Apply high contrast if enabled
    if (gameState.settings.highContrast) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
    
    // Apply large text if enabled
    if (gameState.settings.largeText) {
        document.body.classList.add('large-text');
    } else {
        document.body.classList.remove('large-text');
    }
}

// ===== STORAGE FUNCTIONS =====
function saveHighScore() {
    // Get existing high scores
    let highScores = localStorage.getItem('birdGameHighScores');
    
    if (highScores) {
        highScores = JSON.parse(highScores);
    } else {
        highScores = {};
    }
    
    // Create category entry if not exists
    if (!highScores[gameState.currentCategory]) {
        highScores[gameState.currentCategory] = [];
    }
    
    // Add new score
    highScores[gameState.currentCategory].push({
        score: gameState.score,
        date: new Date().toLocaleDateString(),
        accuracy: Math.round((gameState.results.filter(r => r.correct).length / gameState.results.length) * 100)
    });
    
    // Sort and keep top 5
    highScores[gameState.currentCategory].sort((a, b) => b.score - a.score);
    highScores[gameState.currentCategory] = highScores[gameState.currentCategory].slice(0, 5);
    
    // Save back to local storage
    localStorage.setItem('birdGameHighScores', JSON.stringify(highScores));
}

// ===== UTILITY FUNCTIONS =====
function hideAllScreens() {
    titleScreen.classList.remove('active');
    readyScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    endScreen.classList.remove('active');
    guideScreen.classList.remove('active');
}

function getRandomBirds(birds, count) {
    const shuffled = [...birds];
    shuffleArray(shuffled);
    return shuffled.slice(0, count);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resetGameState() {
    gameState.currentCategory = null;
    gameState.birdsInRound = [];
    gameState.currentBirdIndex = 0;
    gameState.score = 0;
    gameState.timeSpent = 0;
    gameState.replaysLeft = 3;
    gameState.results = [];
    
    // Clear timer if active
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    // Stop any playing audio
    stopBirdCall();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function shareResults() {
    // Create a canvas for the stats card
    const statsCard = document.querySelector('.stats-card');
    
    // Use html2canvas library if available or alert a message
    if (typeof html2canvas === 'undefined') {
        alert('Please take a screenshot of your results to share.');
        return;
    }
    
    html2canvas(statsCard).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `bird-challenge-results-${Date.now()}.png`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);