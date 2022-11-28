const buttons = Array.from(document.querySelectorAll("[data-button]"));
const menuBtn = buttons[0];
const colorBtns = buttons.slice(1);
colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        clrClicked(btn);
    });
});
menuBtn.addEventListener("click", () => {
    menuClicked();
});
menuBtn.addEventListener("mouseover", () => {
    if (gameActive)
        menuBtn.innerText = "Reset";
});
menuBtn.addEventListener("mouseout", () => {
    if (gameActive)
        menuBtn.innerText = sequence.length - colorBtns.length;
});
const menuClicked = () => {
    startGame();
};
const random = () => {
    return Math.floor(Math.random() * 4) + 1;
};

const blink = (btn, right = true, quick = false) => {
    return new Promise((resolve, reject) => {
        btn.classList.add("blink");
        setTimeout(() => {
            btn.classList.remove("blink");
            if (quick)
                resolve();
            setTimeout(() => {
                resolve();
            }, 200);
        }, 400);
    });
};

const sleep = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

let canClick = false;
const clrClicked = (btn) => {
    if (!canClick)
        return;
    let pressed = parseInt(btn.dataset.button);
    let clr = sequenceToGuess.shift();
    console.log(clr, pressed);
    if (clr === pressed) {
        console.log("correct");
        blink(btn);
        if (sequenceToGuess.length === 0)
            wonRound();
    }
    else
        endGame();
};

let sequence = new Array();
let sequenceToGuess = new Array();
let gameActive = false;
const startGame = () => {
    gameActive = true;
    sequence = [];
    colorBtns.forEach((btn) => sequence.push(random()));
    gameLoop();
};
const endGame = () => {
    console.log("endGame");
    canClick = false;
    gameActive = false;
    menuBtn.innerHTML = "X";
    sleep(800).then(() => {
        menuBtn.innerHTML = "Start";
    });
};
const wonRound = () => {
    sequence.push(random());
    gameLoop();
};
const gameLoop = async () => {
    await sleep(800);
    sequenceToGuess = [...sequence];
    canClick = false;
    let score = sequence.length - colorBtns.length;
    menuBtn.innerText = score;
    for (const btn of sequence)
        await blink(colorBtns[btn - 1]);
    canClick = true;
};
