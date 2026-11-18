/* THE ESCAPE HOUSE — LEVEL 2: HAUNTED LIBRARY
   Load this file on game.html?level=2 instead of game.js.
*/

const libraryTimeLimit = 360; // 6 minutes
let libraryTimeLeft = libraryTimeLimit;
let libraryXP = 0;
let libraryHints = 3;
let libraryFinished = false;
let booksSolved = false;
let clockFound = false;
let cipherSolved = false;
let bookOrder = [];
let libraryTimerId;

const libraryTimer = document.getElementById('timer');
const libraryXPLabel = document.getElementById('xp');
const libraryHintButton = document.getElementById('hint-button');
const libraryInventory = document.getElementById('inventory');
const libraryModal = document.getElementById('puzzle-modal');
const libraryTitle = document.getElementById('puzzle-title');
const libraryDescription = document.getElementById('puzzle-description');
const libraryPuzzleArea = document.getElementById('puzzle-area');
const libraryMessage = document.getElementById('puzzle-message');
const libraryClose = document.getElementById('close-modal');
const allHotspots = document.querySelectorAll('.hotspot');

// Change level title and room background.
document.getElementById('level-number').textContent = 'LEVEL 02';
document.getElementById('level-title').textContent = 'HAUNTED LIBRARY';
const libraryImage = document.getElementById('room-image');
libraryImage.src = 'images/library1.png';
libraryImage.alt = 'Haunted Library escape room';

// Show library objects only.
allHotspots.forEach(function (button) {
    button.hidden = !button.classList.contains('library-object');
});

function showLibraryTime() {
    const minutes = Math.floor(libraryTimeLeft / 60);
    const seconds = libraryTimeLeft % 60;
    libraryTimer.textContent = String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
}

function showLibraryInventory() {
    const clues = [];
    if (booksSolved) clues.push('📚 Book order solved — 3 books');
    if (clockFound) clues.push('🕰️ Clock stopped at 9:15');
    if (cipherSolved) clues.push('📜 Cipher decoded: OWL');
    libraryInventory.textContent = clues.length ? clues.join('  |  ') : 'No clues collected yet.';
    libraryXPLabel.textContent = libraryXP;
}

function showLibraryModal(title, description) {
    libraryTitle.textContent = title;
    libraryDescription.textContent = description;
    libraryPuzzleArea.replaceChildren();
    libraryMessage.textContent = '';
    libraryModal.hidden = false;
}

function hideLibraryModal() {
    libraryModal.hidden = true;
}

function showLibraryMessage(message, success) {
    libraryMessage.textContent = message;
    libraryMessage.style.color = success ? '#78e6aa' : '#ff727a';
}

function makeLibraryButton(text, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function stopLibraryGame(won) {
    libraryFinished = true;
    clearInterval(libraryTimerId);
    allHotspots.forEach(function (button) { button.disabled = true; });
    libraryHintButton.disabled = true;

    if (won) {
        libraryXP += 200 + Math.floor(libraryTimeLeft / 10);
        showLibraryInventory();
        const savedLevel = Number(localStorage.getItem('escapeverseUnlockedLevel')) || 1;
        localStorage.setItem('escapeverseUnlockedLevel', String(Math.max(savedLevel, 3)));
        const savedXP = Number(localStorage.getItem('escapeverseLibraryXP')) || 0;
        localStorage.setItem('escapeverseLibraryXP', String(Math.max(savedXP, libraryXP)));
        alert('YOU ESCAPED THE HAUNTED LIBRARY!\nXP: ' + libraryXP + '\nLevel 3 is unlocked!');
        window.location.href = 'rooms.html';
    } else {
        hideLibraryModal();
        showLibraryModal('TIME IS UP', 'The library doors are sealed. Your attempt has ended.');
        libraryPuzzleArea.appendChild(makeLibraryButton('TRY AGAIN', function () {
            window.location.reload();
        }));
    }
}

function inspectBookshelf() {
    showLibraryModal('THE BOOKSHELF', 'Arrange the books in this order: the night sky, then the black bird, then the wise bird.');

    if (booksSolved) {
        libraryPuzzleArea.textContent = 'Books arranged! The shelf reveals a note: “Count the three books.”';
        return;
    }

    const progress = document.createElement('p');
    progress.textContent = 'Selected: none';
    libraryPuzzleArea.appendChild(progress);
    ['OWL', 'MOON', 'RAVEN'].forEach(function (name) {
        libraryPuzzleArea.appendChild(makeLibraryButton(name, function () {
            if (libraryFinished) return;
            bookOrder.push(name);
            progress.textContent = 'Selected: ' + bookOrder.join(' → ');
            if (bookOrder.length === 3) {
                if (bookOrder.join(',') === 'MOON,RAVEN,OWL') {
                    booksSolved = true;
                    libraryXP += 100;
                    showLibraryInventory();
                    showLibraryMessage('Correct! You arranged 3 books. Remember the number 3.', true);
                } else {
                    showLibraryMessage('Wrong order! Try again.', false);
                }
                bookOrder = [];
                libraryPuzzleArea.querySelectorAll('button').forEach(function (button) {
                    button.disabled = booksSolved;
                });
            }
        }));
    });
    libraryPuzzleArea.appendChild(makeLibraryButton('RESET ORDER', function () {
        bookOrder = [];
        progress.textContent = 'Selected: none';
        libraryMessage.textContent = '';
    }));
}

function inspectClock() {
    showLibraryModal('THE ANCIENT CLOCK', 'The clock is frozen. Its hands point to 9:15. Remember 915.');
    if (!clockFound) {
        clockFound = true;
        libraryXP += 50;
        showLibraryInventory();
    }
    libraryPuzzleArea.textContent = '🕰️ 09:15';
}

function inspectManuscript() {
    showLibraryModal('THE SECRET MANUSCRIPT', 'The manuscript shows RZO. Each letter has been shifted 3 places forward in the alphabet. Shift back 3 places to discover the word.');
    if (!booksSolved) {
        showLibraryMessage('First arrange the books to reveal the manuscript!', false);
        return;
    }
    if (cipherSolved) {
        libraryPuzzleArea.textContent = 'Decoded word: OWL';
        return;
    }
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 10;
    input.placeholder = 'Enter decoded word';
    input.setAttribute('aria-label', 'Decoded manuscript word');
    libraryPuzzleArea.appendChild(input);
    libraryPuzzleArea.appendChild(makeLibraryButton('DECODE', function () {
        if (libraryFinished) return;
        if (input.value.trim().toUpperCase() === 'OWL') {
            cipherSolved = true;
            libraryXP += 100;
            showLibraryInventory();
            showLibraryMessage('Correct! You decoded OWL.', true);
            input.disabled = true;
        } else {
            showLibraryMessage('Not quite. Shift each letter backwards by three.', false);
        }
    }));
}

function inspectLibraryDoor() {
    showLibraryModal('THE LOCKED EXIT', 'Combine the clock digits (915) and the number of arranged books to create a 4-digit code.');
    if (!booksSolved || !clockFound || !cipherSolved) {
        showLibraryMessage('You must solve the bookshelf, clock and manuscript first.', false);
        return;
    }
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.maxLength = 4;
    input.placeholder = '4-digit code';
    input.setAttribute('aria-label', 'Final four digit exit code');
    libraryPuzzleArea.appendChild(input);
    libraryPuzzleArea.appendChild(makeLibraryButton('UNLOCK DOOR', function () {
        if (libraryFinished) return;
        if (input.value.trim() === '9153') {
            stopLibraryGame(true);
        } else {
            libraryTimeLeft = Math.max(0, libraryTimeLeft - 10);
            showLibraryTime();
            showLibraryMessage('Wrong code! You lost 10 seconds.', false);
            if (libraryTimeLeft === 0) stopLibraryGame(false);
        }
    }));
}

libraryClose.addEventListener('click', function () {
    if (!libraryFinished) hideLibraryModal();
});
libraryModal.addEventListener('click', function (event) {
    if (event.target === libraryModal && !libraryFinished) hideLibraryModal();
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !libraryFinished) hideLibraryModal();
});

allHotspots.forEach(function (button) {
    if (!button.classList.contains('library-object')) return;
    button.addEventListener('click', function () {
        if (libraryFinished) return;
        const object = button.dataset.object;
        if (object === 'bookshelf') inspectBookshelf();
        if (object === 'clock') inspectClock();
        if (object === 'manuscript') inspectManuscript();
        if (object === 'library-door') inspectLibraryDoor();
    });
});

libraryHintButton.addEventListener('click', function () {
    if (libraryFinished) return;
    if (libraryHints === 0) {
        alert('No hints left!');
        return;
    }
    libraryHints--;
    libraryHintButton.textContent = '💡 HINT (' + libraryHints + ')';
    libraryXP = Math.max(0, libraryXP - 10);
    showLibraryInventory();
    if (!booksSolved) alert('Hint: Night sky = MOON, black bird = RAVEN, wise bird = OWL.');
    else if (!clockFound) alert('Hint: Check the old clock.');
    else if (!cipherSolved) alert('Hint: R becomes O when shifted back 3.');
    else alert('Hint: 915 from the clock, followed by 3 books.');
});

showLibraryInventory();
showLibraryTime();
libraryTimerId = setInterval(function () {
    if (libraryFinished) return;
    libraryTimeLeft = Math.max(0, libraryTimeLeft - 1);
    showLibraryTime();
    if (libraryTimeLeft === 0) stopLibraryGame(false);
}, 1000);
