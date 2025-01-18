// sound-utils.js
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

const stopAllMusic = () => {
    Object.values(MUSIC).forEach(track => {
        track.pause();
        track.currentTime = 0;
    });
};

const playMusic = (trackName) => {
    stopAllMusic();
    MUSIC[trackName].play();
};

const playSound = (soundName) => {
    const sound = SFX[soundName];
    sound.currentTime = 0;
    sound.play();
};

export { playMusic, playSound, stopAllMusic };