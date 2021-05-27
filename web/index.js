const customizeTextInput = document.getElementById('customize-text-input');
const projectImageCanvas = document.getElementById('project-image-canvas');
const projectTextContainer = document.getElementById('project-text-container');

let currentProject = {};
let currentImage = '';
let currentInputElement;
let currentProjectImageToTextDataMap = {};

// Input Text Attributes
let currentInputFontSize = 16;
let currentInputIsVertical = true;

let mouseOffsetX, mouseOffsetY;

init();

function init() {
    (async() => {
      showProjects();
    })();
}

async function showProjects() {
    const projects = await eel.get_projects()();
    if (projects) {
        const projectListContainer = document.getElementById('project-list');
        projectListContainer.innerHTML = `${projects.map(project=>{
            return(
                `<li>
                    <a onclick="showProjectDetails(this)">${project}</a>
                </li>`
            )
        }).join('')}`
    }
}

function returnToProjects() {
    const projectSelectContainer = document.getElementById('project-select-container');
    const projectDetailContainer = document.getElementById('project-detail-container');
    projectSelectContainer.hidden = false;
    projectDetailContainer.hidden = true;
}

async function showProjectDetails(projectElement) {
    const projectName = projectElement.innerText;
    const projectData = await eel.get_project(projectName)();
    if (projectData){
        currentProject = projectData;
        showProjectPage();
    }
}

function base64ImageDataToSrc(base64ImageData) {
    return `data:image/${base64ImageData.image_type};base64,${base64ImageData.data}`
}

function showProjectPage(){
    
    // Hide Select Page and Show Project 
    const projectSelectContainer = document.getElementById('project-select-container');
    const projectDetailContainer = document.getElementById('project-detail-container');
    projectSelectContainer.hidden = true;
    projectDetailContainer.hidden = false;

    // Project Title
    const projectTitle = document.getElementById('project-title');
    projectTitle.innerHTML = `<a
        id="back-to-projects-icon" 
        onclick="returnToProjects()"
        uk-icon="icon: chevron-left; ratio: 1.5"
        class="uk-icon-link">
        </a>` + currentProject.project;

    // Thumbnail
    currentImage = currentProject.images[0].name;
    const projectImageThumbnailContainer = document.getElementById('project-thumbnail-container');
    projectImageThumbnailContainer.innerHTML = `${currentProject.images.map(image=>{
        return (
            `<li 
                id="thumbnail_${image.name}"
                image="${image.name}"
                ${image.name === currentImage ? 'class="uk-active"' : ''}
                onclick="handleSelectThumbnail(this)">
                <a>
                    <img 
                    uk-thumbnav 
                    src="${base64ImageDataToSrc(image)}" 
                    width="100" 
                    alt="${image.name}">
                </a>
            </li>`
        )
    }).join('')}`;

    // Current Working Image
    switchWorkingImage(currentProject.images[0]);
}

function handleSelectThumbnail(element) {
    if (currentImage !== element.getAttribute('image')) {
        const previousSelectedThumbnailElement = document.getElementById(`thumbnail_${currentImage}`)
        previousSelectedThumbnailElement.classList.remove('uk-active');
        element.classList.add('uk-active');
        removeWorkingImageTextData(currentImage);
        currentImage = element.getAttribute('image');
        loadWorkingImageTextData(currentImage);
        switchWorkingImage(currentProject.images.find(image=>image.name === currentImage));
    }
}

function switchWorkingImage(image) {
    const ctx = projectImageCanvas.getContext("2d");
    const imageElement = new Image();
    imageElement.src = base64ImageDataToSrc(image);
    imageElement.onload = () => {
        projectImageCanvas.width = imageElement.width;
        projectImageCanvas.height = imageElement.height;
        ctx.drawImage(imageElement, 0, 0);
    };
}

function onClickImageCanvas(e) {
    const input = addInput(e.clientX, e.clientY);
    cacheTextData(input);
}

function addInput(mouseX, mouseY, defaultText='') {
    clearCurrentInputElement();
    var input = document.createElement('div');

    input.style.position = 'absolute';

    const rect = projectImageCanvas.getBoundingClientRect();
    const x = mouseX - rect.left; // x position within projectImageCanvas
    const y = mouseY - rect.top;  // y position within projectImageCanvas

    const CURSOR_OFFSET = 4; 
    input.style.left = (x - CURSOR_OFFSET) + 'px';
    input.style.top = (y - CURSOR_OFFSET) + 'px';
    input.style.fontSize = currentInputFontSize + 'px';

    if (currentInputIsVertical) {
        input.classList.add('vertical-style');
    }
    input.contentEditable = true;

    if (defaultText) {
        input.innerHTML = defaultText;
        setCustomizeTextInput(defaultText);
    }

    input.onblur = handleInputEnter;
    input.ondblclick = modifyInputValue;
    input.oninput = setCustomizeTextInput(this.innerHTML);

    projectTextContainer.appendChild(input);

    if (defaultText) {
        enableDrag(input, ()=>setCurrentInputElement(input));
        input.style.cursor = 'move';
    } else {
        focusEditable(input);
    }
    return input;
}

function handleCustomizeText(element) {
    if (currentInputElement) {
        currentInputElement.innerHTML = element.value;
    }
}

function setCurrentInputElement(input) {
    if (currentInputElement !== input) {
        deactivateTextbox(currentInputElement);
        currentInputElement = input;
        activateTextbox(input);
    }

    setCustomizeTextInput(input.innerHTML);
    setTextDirectionRadio(input);
    setTextFontSizeInput(input);
}

function modifyInputValue() {
    focusEditable(this);
    this.style.cursor = 'initial';
    deactivateTextbox(this);
}

function handleInputEnter() {
    if (this.innerText.trim().length === 0) {
        projectTextContainer.removeChild(this);
        return
    } else {
        enableDrag(this, ()=>setCurrentInputElement(this)); 
        this.style.cursor = 'move';
        deactivateTextbox(this);
    }
}

onmousemove = event => {
    mouseOffsetX = event.clientX;
    mouseOffsetY = event.clientY;
}

document.addEventListener('keydown', (event) => {
    //Copy Textbox
    if(event.metaKey && event.key.toLowerCase() == "c") {
        // TODO: copy styles of input element 
        if (currentInputElement) {
            eel.paste_to_clipboard(currentInputElement.innerText)();
        }
    }

    // Paste Textbox
    if(event.metaKey && event.key.toLowerCase() == "v") {
        if (!isCustomizeActive()) {
            eel.get_clipboard()((clipboardText) => {
                if (clipboardText) {
                    const input = addInput(mouseOffsetX, mouseOffsetY, clipboardText);
                    cacheTextData(input);
                }
            });
        }
    }

    // Remove Textbox
    if (event.key === 'Backspace' || event.key === 'Delete') {
        if (currentInputElement) {
            const isFocused = (document.activeElement === currentInputElement || isCustomizeActive());
            if (!isFocused) {
                removeCurrentInputElement();
            }
        }
    }
});

function isCustomizeActive() {
    return document.activeElement === customizeTextInput;
}

function setCustomizeTextInput(html) {
    if (html) {
        const customizeTextInput = document.getElementById('customize-text-input');
        customizeTextInput.value = html;
    }
}

function removeCurrentInputElement() {
    if (currentInputElement) {
        projectTextContainer.removeChild(currentInputElement);
        removeCachedTextData(currentInputElement);
    }
}

function clearCurrentInputElement() {
    if (currentInputElement) {
        deactivateTextbox(currentInputElement);
        currentInputElement = null;
    }
}

function activateTextbox(element) {
    if (element) {
        element.classList.add('active-textbox');
        customizeTextInput.disabled = false;
    }
}

function deactivateTextbox(element) {
    if (element) {
        element.classList.remove('active-textbox');
        customizeTextInput.disabled = true;
    }
}

function cacheTextData(inputElement) {
    if (!(currentImage in currentProjectImageToTextDataMap)) {
        currentProjectImageToTextDataMap[currentImage] = [];
    }
    const inputData = {
        element: inputElement
    }
    currentProjectImageToTextDataMap[currentImage].push(inputData);
}

function removeCachedTextData(inputElement) {
    if (currentImage in currentProjectImageToTextDataMap) {
        const updatedList = currentProjectImageToTextDataMap[currentImage].filter(inputData => inputData.element !== inputElement);
        currentProjectImageToTextDataMap[currentImage] = updatedList;
    }
}

function loadWorkingImageTextData(image) {
    if (image in currentProjectImageToTextDataMap) {
        const reloadedInputElements = [];
        currentProjectImageToTextDataMap[image].forEach(inputData=>{
            const x = parseInt(inputData.element.style.left, 10) + 4;
            const y = parseInt(inputData.element.style.top, 10) + 4;
            const input = addInput(x, y, inputData.element.innerHTML);
            const reloadInputData = {
                element: input,
            }
            reloadedInputElements.push(reloadInputData);
        })
        currentProjectImageToTextDataMap[image] = reloadedInputElements;
    }
}

function removeWorkingImageTextData(image) {
    if (image in currentProjectImageToTextDataMap) {
        currentProjectImageToTextDataMap[image].forEach(inputData=>{
            if (projectTextContainer.contains(inputData.element)){
                projectTextContainer.removeChild(inputData.element);
            }
        })
    }  
}
