const retrieveRootVariables = (element, variable) => {
    if (!element || !variable) return;

    return window
        .getComputedStyle(element)
        .getPropertyValue(variable);
};

const textToSpanLetters = (text) => {
    const content = text.textContent

    const arrayLetters = [...content]
    text.innerHTML = ''

    arrayLetters.map((letter, index) => {
        console.log('l', letter)
        // text.innerHTML += `<span class="letter" style="--transition-letter: ${index / 100}">${letter}</span>`
        const span = document.createElement('span');
        span.classList.add('letter');
        span.style.setProperty('--transition-letter', index / 100);

        if (letter === ' ') {
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = letter;
        }

        text.appendChild(span);
    })
}

const retrieveHeight = (element) => {
    if (!element) return;

    return element.offsetHeight
}

const retrieveWidth = (element) => {
    if (!element) return;

    return element.offsetWidth
}

export { retrieveRootVariables, textToSpanLetters, retrieveHeight, retrieveWidth };
