let currentProject = {};
let currentImage = '';
let currentInputElement;

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
        currentImage = element.getAttribute('image');
        switchWorkingImage(currentProject.images.find(image=>image.name === currentImage));
    }
}

function switchWorkingImage(image) {
    const projectImageCanvas = document.getElementById('project-image-canvas');
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
    addInput(e.clientX, e.clientY);
}

function addInput(x, y) {

    var input = document.createElement('div');

    // input.type = 'text';
    input.style.position = 'absolute';
    input.style.left = (x - 4) + 'px';
    input.style.top = (y - 4) + 'px';
    input.contentEditable = true;

    // orientation
    input.classList.add('vertical-style');


    // input.onkeydown = handleEnter;
    input.onblur = handleInputEnter;
    input.ondblclick = modifyInputValue;
    input.onclick = setCurrentInputElement;
    // input.onkeydown = handleInputDelete;

    document.body.appendChild(input);

    focusEditable(input);
}

function setCurrentInputElement() {
    currentInputElement = this;
}

function modifyInputValue() {
    focusEditable(this);
    this.style.cursor = 'initial';
}

function handleInputEnter() {
    //Make the DIV element draggagle:
    enableDrag(this);
    this.style.cursor = 'move';
    console.log(this.innerText);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
        if (currentInputElement) {
            const isFocused = (document.activeElement === currentInputElement);
            if (!isFocused) {
                removeCurrentInputElement();
            }
        }
    }
});

function removeCurrentInputElement() {
    if (currentInputElement) {
        document.body.removeChild(currentInputElement);
    }
}

function resetCurrentInputElement() {
    currentInputElement = null;
}