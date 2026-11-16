
/* ESCAPEVERSE - LEVEL 1: SECRET LABORATORY */

// Game settings
const GAME_TIME = 300; // 5 minutes
let timeLeft = GAME_TIME;
let xp = 0;
let hintsLeft = 3;
let gameOver = false;

let foundDNA = false;
let computerSolved = false;
let flasksSolved = false;

// HTML elements
const timerElement = document.getElementById("timer");
const xpElement = document.getElementById("xp");
const hintButton = document.getElementById("hint-button");
const inventoryElement = document.getElementById("inventory");

const modal = document.getElementById("puzzle-modal");
const modalTitle = document.getElementById("puzzle-title");
const modalDescription = document.getElementById("puzzle-description");
const puzzleArea = document.getElementById("puzzle-area");
const puzzleMessage = document.getElementById("puzzle-message");
const closeButton = document.getElementById("close-modal");

const hotspots = document.querySelectorAll(".hotspot");

// Countdown Timer
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerElement.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

function endGame() {
    gameOver = true;
    clearInterval(timerInterval);
    closeModal();
    hotspots.forEach(function(button) {
        button.disabled = true;
    });
    hintButton.disabled = true;
    alert("TIME IS UP! GAME OVER! Try again.");
}

const timerInterval = setInterval(function() {
    if (gameOver) return;

    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
        timeLeft = 0;
        updateTimer();
        endGame();
    }
}, 1000);

updateTimer();

// XP Points
function addXP(points) {
    xp += points;
    xpElement.textContent = xp;
}

// Inventory
function updateInventory() {
    const items = [];

    if (foundDNA) items.push("🧬 DNA Code: 7");
    if (computerSolved) items.push("💻 Computer Code: 4");
    if (flasksSolved) items.push("🧪 Flask Code: 2");

    if (items.length === 0) {
        inventoryElement.textContent = "No clues collected yet.";
    } else {
        inventoryElement.textContent = items.join(" | ");
    }
}

// Popup
function openModal(title, description) {
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    puzzleArea.innerHTML = "";
    puzzleMessage.textContent = "";
    modal.hidden = false;
}

function closeModal() {
    modal.hidden = true;
}

closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Puzzle 1: DNA Chamber
function inspectDNA() {
    openModal(
        "DNA CHAMBER",
        "A mysterious number is glowing inside the DNA chamber."
    );

    if (!foundDNA) {
        foundDNA = true;
        addXP(50);
        updateInventory();
    }

    puzzleArea.textContent = "You discovered the first digit: 7";
}

// Puzzle 2: Computer
function inspectComputer() {
    openModal(
        "SECURITY COMPUTER",
        "Solve the equation to unlock the computer: 2 + 2 = ?"
    );

    if (computerSolved) {
        puzzleArea.textContent = "Already solved! The second digit is 4.";
        return;
    }

    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Enter answer";

    const button = document.createElement("button");
    button.textContent = "UNLOCK COMPUTER";

    button.addEventListener("click", function() {
        if (gameOver) return;

        if (input.value.trim() === "4") {
            computerSolved = true;
            addXP(100);
            updateInventory();

            puzzleMessage.textContent =
                "ACCESS GRANTED! Second digit: 4";
            puzzleArea.replaceChildren();
        } else {
            puzzleMessage.textContent =
                "ACCESS DENIED! Try again.";
        }
    });

    puzzleArea.append(input, button);
}

// Puzzle 3: Chemical Flasks
function inspectFlasks() {
    openModal(
        "CHEMICAL FLASKS",
        "There are 6 flasks. 4 are empty. How many remain?"
    );

    if (flasksSolved) {
        puzzleArea.textContent = "Already solved! The third digit is 2.";
        return;
    }

    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Enter answer";

    const button = document.createElement("button");
    button.textContent = "CHECK ANSWER";

    button.addEventListener("click", function() {
        if (gameOver) return;

        if (input.value.trim() === "2") {
            flasksSolved = true;
            addXP(100);
            updateInventory();

            puzzleMessage.textContent =
                "CORRECT! Third digit: 2";
            puzzleArea.replaceChildren();
        } else {
            puzzleMessage.textContent =
                "WRONG ANSWER! Try again.";
        }
    });

    puzzleArea.append(input, button);
}

// Final Door
function inspectDoor() {
    openModal(
        "EMERGENCY EXIT",
        "Enter the three-digit security code to escape."
    );

    if (!foundDNA || !computerSolved || !flasksSolved) {
        puzzleMessage.textContent =
            "You must discover all three clues first!";
        return;
    }

    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "numeric";
    input.maxLength = 3;
    input.placeholder = "Enter 3-digit code";

    const button = document.createElement("button");
    button.textContent = "UNLOCK DOOR";

    button.addEventListener("click", function() {
        if (gameOver) return;

        if (input.value.trim() === "742") {
            winGame();
        } else {
            puzzleMessage.textContent =
                "INCORRECT CODE! Try again.";
        }
    });

    puzzleArea.append(input, button);
}

// Winning
function winGame() {
    gameOver = true;
    clearInterval(timerInterval);

    addXP(200);
    localStorage.setItem("escapeverseUnlockedLevel", "2");

    closeModal();

    alert(
        "YOU ESCAPED THE LABORATORY!\n" +
        "XP Earned: " + xp + "\n" +
        "Level 2 is now unlocked!"
    );

    window.location.href = "rooms.html";
}

// Hint System
hintButton.addEventListener("click", function() {
    if (gameOver) return;

    if (hintsLeft <= 0) {
        alert("You have no hints left!");
        return;
    }

    hintsLeft--;
    hintButton.textContent = "💡 HINT (" + hintsLeft + ")";

    if (!foundDNA) {
        alert("Hint: Look inside the glowing DNA chamber.");
    } else if (!computerSolved) {
        alert("Hint: The computer answer is a simple addition.");
    } else if (!flasksSolved) {
        alert("Hint: Subtract the empty flasks from the total.");
    } else {
        alert("Hint: Combine the three digits in discovery order.");
    }
});

// Clickable Objects
hotspots.forEach(function(button) {
    button.addEventListener("click", function() {
        if (gameOver) return;

        const object = button.dataset.object;

        if (object === "dna") inspectDNA();
        if (object === "computer") inspectComputer();
        if (object === "flasks") inspectFlasks();
        if (object === "door") inspectDoor();
    });
});

