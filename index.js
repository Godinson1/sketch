//access actions
const finish = document.querySelector("#finish");
const draw = document.querySelector("#draw");
const mini = document.querySelector("#mini-brush");
const small = document.querySelector("#small-brush");
const big = document.querySelector("#big-brush");
const eraser = document.querySelector("#eraser");
const del = document.querySelector("#delete");
const text = document.querySelector("#text");
const closed = document.querySelector("#close");
//const body = document.querySelector("#body");

const red = document.querySelector("#red");
const blue = document.querySelector("#blue");
const green = document.querySelector("#green");
const white = document.querySelector("#white");
const violet = document.querySelector("#violet");
const gold = document.querySelector("#gold");
const yellow = document.querySelector("#yellow");
const pink = document.querySelector("#pink");
const black = document.querySelector("#black");
const indigo = document.querySelector("#indigo");

const preview = document.querySelector("#prev");

var stage = new Konva.Stage({
  container: "container",
  width: 540,
  height: 400,
});

var isPaint = false;
var mode = "brush";
var lastLine;
var strokeWidth = 5;
var drawColor = "black";
let currentText = "Add Text";
let isText = false;
let wishesImg;
let nameImg;
let rect;
let test;
let showTransformer = false;

var layer = new Konva.Layer();

rect = new Konva.Rect({
  x: 120,
  y: 20,
  stroke: "gray",
  strokeWidth: 0.7,
  fill: "#f0f0f0",
  width: 300,
  height: 370,
  shadowColor: "black",
  shadowBlur: 10,
  shadowOffsetX: 10,
  shadowOffsetY: 10,
  shadowOpacity: 0.2,
  cornerRadius: 10,
});

function loadImages(sources, callback) {
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  for (var src in sources) {
    numImages++;
  }
  for (var src in sources) {
    images[src] = new Image();
    images[src].onload = function () {
      if (++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}
function buildStage(images) {
  var name = new Konva.Image({
    image: images.header,
    x: 200,
    y: 60,
    width: 140,
    height: 16,
  });

  var wishes = new Konva.Image({
    image: images.wishes,
    x: 170,
    y: 350,
    width: 200,
    height: 35,
  });

  wishes.on("mousedown", () => {
    tr.hide();
    layer.draw();
  });

  name.on("mousedown", () => {
    tr.hide();
    layer.draw();
  });

  wishes.cache();
  wishes.drawHitFromCache();

  layer.add(name);
  layer.add(wishes);
}

var sources = {
  wishes: "exports/wishes.png",
  header: "exports/header.png",
};

loadImages(sources, buildStage);

// main API:
var imageObj = new Image();
imageObj.onload = function () {
  var myImage = new Konva.Image({
    x: 197,
    y: 90,
    image: imageObj,
    width: 150,
    height: 250,
  });

  myImage.on("mousedown touchstart", function (e) {
    isPaint = true;

    var pos = stage.getPointerPosition();
    lastLine = new Konva.Line({
      stroke: drawColor,
      strokeWidth,
      globalCompositeOperation:
        mode === "brush" ? "source-over" : "destination-out",
      points: [pos.x, pos.y],
    });
    layer.add(lastLine);
  });

  myImage.on("mouseup touchend", function () {
    isPaint = false;
  });

  // and core function - drawing
  myImage.on("mousemove touchmove", function () {
    if (!isPaint) {
      return;
    }

    window.addEventListener("touchend", function () {
      isPaint = false;
    });

    window.addEventListener("mousedown", () => {
      if (isText === true) {
        isPaint = false;
      } else {
        isPaint = true;
      }
    });

    window.addEventListener("mouseup", function () {
      isPaint = false;
    });

    const pos = stage.getPointerPosition();
    var newPoints = lastLine.points().concat([pos.x, pos.y]);
    lastLine.points(newPoints);
    layer.batchDraw();
  });

  myImage.cache();
  myImage.drawHitFromCache();

  // add the shape to the layer
  layer.add(myImage);
  layer.batchDraw();
};
imageObj.src = "exports/cc.png";

layer.add(rect);
//layer.add(textNode);
// add the layer to the stage
stage.add(layer);

var textNode = new Konva.Text({
  text: "Some text here",
  x: 180,
  y: 200,
  fontSize: 16,
  draggable: true,
  fill: drawColor,
  width: 200,
});

//layer.add(textNode);

var tr = new Konva.Transformer({
  node: textNode,
  enabledAnchors: ["middle-left", "middle-right"],
  // set minimum width of text
  boundBoxFunc: function (oldBox, newBox) {
    newBox.width = Math.max(30, newBox.width);
    return newBox;
  },
});

textNode.on("transform", function () {
  // reset scale, so only with is changing by transformer
  textNode.setAttrs({
    width: textNode.width() * textNode.scaleX(),
    scaleX: 1,
  });
});

//layer.add(tr);

textNode.on("dblclick", () => {
  // hide text node and transformer:
  textNode.hide();
  tr.hide();
  layer.draw();

  // create textarea over canvas with absolute position
  // first we need to find position for textarea
  // how to find it?

  // at first lets find position of text node relative to the stage:
  var textPosition = textNode.absolutePosition();

  // then lets find position of stage container on the page:
  var stageBox = stage.container().getBoundingClientRect();

  // so position of textarea will be the sum of positions above:
  var areaPosition = {
    x: stageBox.left + textPosition.x,
    y: stageBox.top + textPosition.y,
  };

  // create textarea and style it
  var textarea = document.createElement("textarea");
  document.body.appendChild(textarea);

  // apply many styles to match text on canvas as close as possible
  // remember that text rendering on canvas and on the textarea can be different
  // and sometimes it is hard to make it 100% the same. But we will try...
  textarea.value = textNode.text();
  textarea.style.position = "absolute";
  textarea.style.top = areaPosition.y + "px";
  textarea.style.left = areaPosition.x + "px";
  textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
  textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + "px";
  textarea.style.fontSize = textNode.fontSize() + "px";
  textarea.style.border = "none";
  textarea.style.padding = "0px";
  textarea.style.margin = "0px";
  textarea.style.overflow = "hidden";
  textarea.style.background = "none";
  textarea.style.outline = "none";
  textarea.style.resize = "none";
  textarea.style.lineHeight = textNode.lineHeight();
  textarea.style.fontFamily = textNode.fontFamily();
  textarea.style.transformOrigin = "left top";
  textarea.style.textAlign = textNode.align();
  textarea.style.color = textNode.fill();
  rotation = textNode.rotation();
  var transform = "";
  if (rotation) {
    transform += "rotateZ(" + rotation + "deg)";
  }

  var px = 0;
  // also we need to slightly move textarea on firefox
  // because it jumps a bit
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  if (isFirefox) {
    px += 2 + Math.round(textNode.fontSize() / 20);
  }
  transform += "translateY(-" + px + "px)";

  textarea.style.transform = transform;

  // reset height
  textarea.style.height = "auto";
  // after browsers resized it we can set actual value
  textarea.style.height = textarea.scrollHeight + 3 + "px";

  textarea.focus();

  function removeTextarea() {
    textarea.parentNode.removeChild(textarea);
    window.removeEventListener("click", handleOutsideClick);
    textNode.show();
    tr.show();
    tr.forceUpdate();
    layer.draw();
  }

  function setTextareaWidth(newWidth) {
    if (!newWidth) {
      // set width for placeholder
      newWidth = textNode.placeholder.length * textNode.fontSize();
    }
    // some extra fixes on different browsers
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isSafari || isFirefox) {
      newWidth = Math.ceil(newWidth);
    }

    var isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
    if (isEdge) {
      newWidth += 1;
    }
    textarea.style.width = newWidth + "px";
  }

  textarea.addEventListener("keydown", function (e) {
    // hide on enter
    // but don't hide on shift + enter
    if (e.keyCode === 13 && !e.shiftKey) {
      textNode.text(textarea.value);
      removeTextarea();
    }
    // on esc do not set value back to node
    if (e.keyCode === 27) {
      removeTextarea();
    }
  });

  textarea.addEventListener("keydown", function (e) {
    scale = textNode.getAbsoluteScale().x;
    setTextareaWidth(textNode.width() * scale);
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + textNode.fontSize() + "px";
  });

  function handleOutsideClick(e) {
    if (e.target !== textarea) {
      textNode.text(textarea.value);
      removeTextarea();
    }
  }
  setTimeout(() => {
    window.addEventListener("click", handleOutsideClick);
  });
});

/********* Action Events */
//fire event on finish
finish.addEventListener("click", () => {
  preview.src = stage.toDataURL({ pixelRatio: 4 });
  document.getElementById("myNav").style.width = "100%";
});

closed.addEventListener("click", () => {
  document.getElementById("myNav").style.width = "0";
});

//reload app to draw again
draw.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.reload();
});

//erase drawing
eraser.addEventListener("click", () => {
  stage.container().style.cursor = "url(exports/surface1erase.svg), auto";
  strokeWidth = 10;
  mode = "destination-out";
});

//add text
text.addEventListener("click", () => {
  showTransformer = !showTransformer;
  isText = true;
  stage.container().style.cursor = "default";
  layer.add(textNode);
  layer.add(tr);
  layer.draw();
});

//small brush
big.addEventListener("click", () => {
  isText = false;
  stage.container().style.cursor = "url(exports/three.svg), auto";
  strokeWidth = 15;
  mode = "brush";
});

//small brush
small.addEventListener("click", () => {
  isText = false;
  stage.container().style.cursor = "url(exports/two.svg), auto";
  strokeWidth = 10;
  mode = "brush";
});

//big brush
mini.addEventListener("click", () => {
  isText = false;
  stage.container().style.cursor = "url(exports/one.svg), auto";
  strokeWidth = 5;
  mode = "brush";
});

del.addEventListener("click", () => {
  window.location.reload();
});

/*******End of Action Events */

/*** Add colors */
red.addEventListener("click", () => {
  drawColor = "#ffffff";
});

green.addEventListener("click", () => {
  drawColor = "#a81817";
});

white.addEventListener("click", () => {
  drawColor = " #596875";
});

black.addEventListener("click", () => {
  drawColor = "#4b77a8";
});

pink.addEventListener("click", () => {
  drawColor = "#28661c";
});

indigo.addEventListener("click", () => {
  drawColor = "#eec666";
});

blue.addEventListener("click", () => {
  drawColor = "#000000";
});

yellow.addEventListener("click", () => {
  drawColor = " #744607";
});

violet.addEventListener("click", () => {
  drawColor = "#db3b2f";
});

gold.addEventListener("click", () => {
  drawColor = "#ec736b";
});

/**End of add colors */

//Download function
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

document.getElementById("save").addEventListener(
  "click",
  function () {
    // Save to Server - Needs to be made into AJAX Call
    // const canvasForm = document.getElementById("canvas-form");
    // const canvasInput = document.getElementById("canvas-input");
    // const canvasSubmit = document.getElementById("canvas-submit");

    // canvasSubmit.value = stage.toDataURL({ pixelRatio: 3 });
    // canvasSubmit.click();

    fetch("http://localhost/sketch/img_upload.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        upload_image: stage.toDataURL({ pixelRatio: 3 }),
      }),
    });

    // Download
    var dataURL = stage.toDataURL({ pixelRatio: 3 });
    downloadURI(dataURL, "sketch.png");
  },
  false
);
