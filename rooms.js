
// ESCAPEVERSE - LEVEL UNLOCK SYSTEM

// Read progress saved in the browser
let unlockedLevel = Number(
    localStorage.getItem("escapeverseUnlockedLevel")
);

if (!Number.isInteger(unlockedLevel) ||
    unlockedLevel < 1 ||
    unlockedLevel > 5) {
    unlockedLevel = 1;
}

// Update each level card
const levelCards = document.querySelectorAll(".level-card");

levelCards.forEach(function(card) {

    const level = Number(card.dataset.level);
    const playButton = card.querySelector(".play-button");

    if (level <= unlockedLevel) {

        card.classList.remove("locked");
        playButton.textContent = "ENTER ROOM";
        playButton.removeAttribute("aria-disabled");

    } else {

        card.classList.add("locked");
        playButton.textContent = "🔒 LOCKED";
        playButton.setAttribute("aria-disabled", "true");

        playButton.addEventListener("click", function(event) {
            event.preventDefault();
            alert("Complete the previous level to unlock this room!");
        });

    }

});
