// sound.js
const MUSIC = {
    title: new Audio('rpgchip01.mid'),
    options: new Audio('rpgchip06.mid'),
    quiz: new Audio('rpgchip08.mid'),
    review: new Audio('rpgchip10.mid')
};

const SFX = {
    win: new Audio('win.mp3'),
    lose: new Audio('lose.mp3'),
    button: new Audio('button.mp3')
};

// Configure all music tracks to loop
Object.values(MUSIC).forEach(track => {
    track.loop = true;
});

export const AudioManager = {
    stopAllMusic: () => {
        Object.values(MUSIC).forEach(track => {
            track.pause();
            track.currentTime = 0;
        });
    },

    playMusic: (trackName) => {
        AudioManager.stopAllMusic();
        if (MUSIC[trackName]) {
            MUSIC[trackName].play().catch(e => console.warn('Audio playback failed:', e));
        }
    },

    playSound: (soundName) => {
        if (SFX[soundName]) {
            SFX[soundName].currentTime = 0;
            SFX[soundName].play().catch(e => console.warn('Audio playback failed:', e));
        }
    }
};

// For legacy support
window.AudioManager = AudioManager;