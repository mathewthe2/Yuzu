const textDirectionVerticalRadio = document.getElementById('text-direction-vertical-radio');
const textDirectionHorizontalRadio = document.getElementById('text-direction-horizontal-radio');
const textFontSizeInput = document.getElementById('text-font-size-input');
const textRotationInput = document.getElementById('text-rotation-input');


function setInputTextDirectionHorizontal() {
    currentInputIsVertical = false;
    if (currentInputElement) {
        if (currentInputElement.classList.contains('vertical-style')) {
            currentInputElement.classList.remove('vertical-style');
        }
    }
}

function setInputTextDirectionVertical() {
    currentInputIsVertical = true;
    if (currentInputElement) {
        if (!currentInputElement.classList.contains('vertical-style')) {
            currentInputElement.classList.add('vertical-style');
        }
    } 
}

function setTextDirectionRadio(input) {
    if (input) {
        if (input.classList.contains('vertical-style')) {
            textDirectionVerticalRadio.checked = true;
        } else {
            textDirectionHorizontalRadio.checked = true;
        }
    }
}

function setTextFontSize() {
    currentInputFontSize = textFontSizeInput.value;
    if (currentInputElement) {
        currentInputElement.style.fontSize = textFontSizeInput.value + 'px';
    } 
}

function setTextFontSizeInput(input) {
    if (input) {
        if (input.style.fontSize) {
            textFontSizeInput.value = parseInt(input.style.fontSize, 10);
        }
    }
}

function setTextRotation() {
    currentInputRotation = textRotationInput.value;
    if (currentInputElement) {
        currentInputElement.style.rotation = `rotate(${currentInputRotation}deg)`;
        currentInputElement.style.transform = `rotate(${currentInputRotation}deg)`;
        currentInputElement.style.webkitTransform = `rotate(${currentInputRotation}deg)`;
        currentInputElement.style.msTransform = `rotate(${currentInputRotation}deg)`;
        // addRotation(currentInputElement, currentInputRotation);
    } 
}

function setTextRotationInput(input) {
    if (input) {
        textRotationInput.value = getRotation(input);
    }
}