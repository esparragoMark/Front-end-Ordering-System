document.addEventListener("DOMContentLoaded", () => {
    const textElement = document.getElementById("dynamic-text");
    const content = document.getElementById("content");

    // Text to display
    const text = "Mang Inasal Ordering System 🍗";
    let index = 0;

    const revealText = () => {
        if (index < text.length) {
        textElement.textContent += text[index];
        index++;
        setTimeout(revealText, 100);
        } else {
        setTimeout(() => {
            document.getElementById("preloader").style.display = "none";
            content.classList.remove("hidden");
        }, 1500);
        }
    };

    revealText();
});