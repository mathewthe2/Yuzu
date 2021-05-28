function focusEditable(element) {
    var range = document.createRange()
    var sel = window.getSelection()

    if (element.innerHTML) {
      var lastNode = element.childNodes[element.childNodes.length-1];
      var hasFurigana = lastNode.innerHTML !== undefined;
      if (hasFurigana) {
        var textNode = document.createTextNode("\u200B");
        element.append(textNode);  
        lastNode = element.childNodes[element.childNodes.length-1];
        range.setStart(lastNode, lastNode.length);
      } else {
        range.setStart(lastNode, lastNode.length);
      }
    } else {
      range.setStart(element,0);
    }

    range.collapse(false)

    sel.removeAllRanges()
    sel.addRange(range)
}

const delta = 6;
let startX;
let startY;

function enableDrag(elmnt, startDragFunction, clickFunction) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    startX = e.pageX;
    startY = e.pageY;
    if (startDragFunction) {
      startDragFunction();
    }
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement(e) {

    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function addRotation(element, degree) {
  element.style.transform = `rotate(${degree}deg)`;
  element.style.webkitTransform = `rotate(${degree}deg)`;
  element.style.msTransform = `rotate(${degree}deg)`;
}

function getRotation(element){
  var tm = element.style.transform ||
           element.style.webkitTransform ||
           element.style.mozTransform ||
           element.style.msTransform ||
           element.style.oTransform ||
           "none";
  if (tm !== "none") {
    // var values = tm.split('(')[1].split(')')[0].split(',');
    // var angle = Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI));
    var angle = parseInt(tm.split('(')[1].split(')')[0], 10)
    return (angle < 0 ? angle + 360 : angle); //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
  }
  return 0;
}