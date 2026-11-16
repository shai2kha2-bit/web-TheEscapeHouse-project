
const heroContent = document.querySelector(".intro-content");
const hero = document.querySelector(".intro-hero");

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function moveBackground() {
    if (reduceMotion || !heroContent || !hero) {
        return;
    }

    const scroll = window.scrollY;
    const limit = hero.offsetTop + hero.offsetHeight;

    if (scroll < limit) {
        heroContent.style.transform =
            "translateY(" + (scroll * 0.18) + "px)";
    }
}

window.addEventListener("scroll", moveBackground, {
    passive: true
});
