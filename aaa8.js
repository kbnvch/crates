const stiliukas = document.createElement("style");
document.getElementsByTagName("head")[0].appendChild(stiliukas);
var myCanvas = document.createElement("canvas");
document.getElementsByTagName("body")[0].appendChild(myCanvas);

window.addEventListener("load", start);


const cX = 300;
const cY = 100;

myCanvas.style.position = "absolute";
myCanvas.style.left = cX + 'px';
myCanvas.style.top = cY + 'px';
myCanvas.style.zIndex = "100";

myCanvas.height = 300;
myCanvas.width = 231;
myCanvas.addEventListener("mousedown", mouseDown, false);
myCanvas.addEventListener('mousemove', onmousemove, false);

var ctx = myCanvas.getContext("2d");

var brokenCubes = [false, false];

var poleImg1 = document.getElementById('pole1');
var poleImg2 = document.getElementById('pole2');

var boxImg1 = document.getElementById('crate1');
var boxImg2 = document.getElementById('crate2');
var boxImg3 = document.getElementById('crate3');
var boxImg4 = document.getElementById('crate4');
var boxImg5 = document.getElementById('crate5');
var boxBrokenImg6 = document.getElementById('crate6');

// lets put all box images into array for animation
let boxBlueImgsArr = [boxImg1, boxImg2, boxImg3, boxImg4, boxImg5, boxBrokenImg6];

var fishHeapImg1 = document.getElementById('fishHeap1');
var fishHeapImg2 = document.getElementById('fishHeap2');

var catImg1_1 = document.getElementById('cat1_1');
var catImg1_2 = document.getElementById('cat1_2');
var catImg1_3 = document.getElementById('cat1_3');
var catImg1_4 = document.getElementById('cat1_4');

var catImg2_1 = document.getElementById('cat2_1');
var catImg2_2 = document.getElementById('cat2_2');
var catImg2_3 = document.getElementById('cat2_3');
var catImg2_4 = document.getElementById('cat2_4');

var catAnim1 = theAnimation();
var catAnim2 = theAnimation();

// here we insert images used as frames, and specify how long frame should last (1 unit here approx = 1/60 sec)
catAnim1.frames = [catImg1_1, catImg1_2, catImg1_3, catImg1_4, catImg1_2, catImg1_3, catImg1_4, catImg1_2, catImg1_3, catImg1_4];
catAnim1.frameDurations = [120, 6, 6, 6, 6, 6, 6, 6, 6, 20]; // should be same length as frame array

catAnim2.frames = [catImg2_1, catImg2_2, catImg2_3, catImg2_4, catImg2_3, catImg2_4, catImg2_3, catImg2_4, catImg2_3, catImg2_4];
catAnim2.frameDurations = [75, 34, 7, 7, 7, 7, 7, 7, 7, 7];

var groundImg = document.getElementById('ground');

var hammerImg = document.getElementById('HammerImage');
var backgroundImg = document.getElementById('BGImage');

// module aliases
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();
//engine.gravity.scale = 0.00025;

// create two boxes and a ground
let boxA, boxB, theGround, wall1, wall2, roof, fishHeap1, fishHeap2;

// create runner
var runner = Runner.create();

let cursorX = 0; let cursorY = 0;

const myCss = `
canvas {
    border: 0px solid #055500;
    display: block;
    margin: 0 auto;
    image-rendering: high-quality        ;
  }
`;

const addStyles = (stylesheet, cssRules) => {
    if (stylesheet.styleSheet) {
        stylesheet.styleSheet.cssText = cssRules;
    } else {
        stylesheet.appendChild(document.createTextNode(cssRules));
    }
};

addStyles(stiliukas, myCss);





////////// game loop:

var now,
    dt = 0,
    last = timestamp(),
    step = 1 / 60;

function frame() {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while (dt > step) {
        dt = dt - step;
        //update(step);
    }

    clearScreen();
    drawBackground();
    drawPole();
    drawCubes();
    drawFishHeap();
    drawCats();
    drawGround();
    drawHammer();

    last = now;

    requestAnimationFrame(frame);
}

/////////// Functions:


function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function start() {
    createBoxes();
    addBoxesTotheWorld();
    catAnim1.init();
    catAnim2.init();

    // start physics engine:
    Runner.run(runner, engine);

    // start game rendering loop:
    requestAnimationFrame(frame);
}

function createBoxes() {
    let _x, _y, _width, _height;
    let scale = 0.64;
    let collisionWidth, collisionHeight;

    _width = boxImg1.width * scale;
    _height = boxImg1.height * scale;

    /// collision width and height are a bit smaller because
    // because box image has protruding bits like fish tails etc. we want only collide with box:
    collisionWidth = _width / 1.33;
    collisionHeight = _height / 1.13;
    _x = myCanvas.width * 0.28;
    _y = myCanvas.height * 0.48
    boxA = Bodies.rectangle(_x + (_width / 2), _y + (_height / 2), collisionWidth, collisionHeight, { width: _width, height: _height, broken: false, clickCount: 0, collisionWidth: collisionWidth });
    boxA.collisionFilter.group = 1;
    Body.setAngle(boxA, 90 * (Math.PI / 180));

    scale = 0.47;
    _width = boxImg1.width * scale;
    _height = boxImg1.height * scale;
    // we shrink collision just to colide with box itself:
    collisionWidth = _width / 1.33 * 0.99;
    collisionHeight = _height / 1.13 * 0.99;
    _x = myCanvas.width * 0.53;
    _y = myCanvas.height * 0.10;
    boxB = Bodies.rectangle(_x + (_width / 2), _y + (_height / 2), collisionWidth, collisionHeight, { width: _width, height: _height, broken: false, clickCount: 0, collisionWidth: collisionWidth });
    boxB.collisionFilter.group = 1;
    Body.setAngle(boxB, 180 * (Math.PI / 180));

    // walls for boxes to colide with:
    _width = myCanvas.width;
    _height = 10;
    _x = myCanvas.width / 2;
    _y = myCanvas.height;
    theGround = Bodies.rectangle(_x, _y, _width, _height, { isStatic: true });

    _width = 10;
    _height = myCanvas.height;
    _x = -5;
    _y = myCanvas.height / 2;
    wall1 = Bodies.rectangle(_x, _y, _width, _height, { isStatic: true });

    _width = 10;
    _height = myCanvas.height;
    _x = myCanvas.width + 5;
    _y = myCanvas.height / 2;
    wall2 = Bodies.rectangle(_x, _y, _width, _height, { isStatic: true });

    _width = myCanvas.width;
    _height = 10;
    _x = myCanvas.width / 2;
    _y = -5;
    roof = Bodies.rectangle(_x, _y, _width, _height, { isStatic: true });
}

function updateBoxColliderForBrokenBox(box) {
    let divH;
  
    divH = boxBrokenImg6.height / boxImg1.height;

    Body.scale(box, 1, divH);
    box.height = box.height * divH;

}

function addBoxesTotheWorld() {
    Composite.add(engine.world, [boxA, boxB, theGround, wall1, wall2, roof]);
}

function createFishHeap(box, i) {

    let _x, _y, _width, _height;
    let div;

    _x = box.position.x;
    _y = box.position.y;

    if (i == 0) {
        div = fishHeapImg1.height / fishHeapImg1.width;
        _width = box.collisionWidth;
        _height = box.collisionWidth * div;
        fishHeap1 = Bodies.rectangle(_x, _y, _width, _height, { width: _width, height: _height });
        fishHeap1.collisionFilter.group = -1;
        Composite.add(engine.world, fishHeap1);
    } else if (i == 1) {
        div = fishHeapImg2.height / fishHeapImg2.width;
        _width = box.collisionWidth;
        _height = box.collisionWidth * div;
        fishHeap2 = Bodies.rectangle(_x, _y, _width, _height, { width: _width, height: _height });
        fishHeap2.collisionFilter.group = -1;
        Composite.add(engine.world, fishHeap2);
    }

}

// mouse callback functions:

function onmousemove(event) {
    cursorX = event.pageX - cX;
    cursorY = event.pageY - cY;
}

function mouseDown(event) {
    let clickX = event.pageX - cX;
    let clickY = event.pageY - cY;


    if (didWeClickOnObject(1, clickX, clickY)) { objectWasClicked(boxB, 1); }
    else if (didWeClickOnObject(0, clickX, clickY)) { objectWasClicked(boxA, 0); }
}

function didWeClickOnObject(i, clickX, clickY) {
    let _x1, _y1, _x2, _y2;
    _x1 = getTopLeft(i)[0];
    _y1 = getTopLeft(i)[1];

    _x2 = getBottomRight(i)[0];
    _y2 = getBottomRight(i)[1];

    if (brokenCubes[i] == false && clickX > _x1 && clickY > _y1 && clickX < _x2 && clickY < _y2) { return true; }
    return false;
}

///// identify clicked area functions:

let clickAreas = [[], []];
function setClickArea(i, _x, _y, _width, _height) {
    clickAreas[i] = [_x, _y, _x + _width, _y + _height]
}

function getTopLeft(i) {
    let topLeft = [clickAreas[i][0], clickAreas[i][1]];
    return topLeft;
}
function getBottomRight(i) {
    let topRight = [clickAreas[i][2], clickAreas[i][3]];
    return topRight;
}

////// when object is clicked functions:

function objectWasClicked(box, i) {
    let neg = Math.sign(Math.random() - 0.5);
    Body.applyForce(box, { x: box.position.x, y: box.position.y }, { x: -0.26 * neg, y: -0.49 });
    if (box.clickCount < boxBlueImgsArr.length - 1)
        box.clickCount++;
    if (box.clickCount == boxBlueImgsArr.length - 1) {
        boxA.collisionFilter.group = -1;
        boxB.collisionFilter.group = -1;
        Body.setAngle(box, 0);
        if (box.broken == false) {
            createFishHeap(box, i);
            updateBoxColliderForBrokenBox(box);
        }
        box.broken = true;
    }

}


/////// Draw functions:

function clearScreen() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
}

function drawHammer() {
    if (hammerImg != null)
        ctx.drawImage(hammerImg, cursorX, cursorY);
}

function drawBackground() {
    //  if (backgroundImg != null)
    // ctx.drawImage(backgroundImg, 0, 0, myCanvas.width, myCanvas.height);
}

function drawPole() {
    let _x, _y, _width, _height;
    let scale = 0.64;

    _x = 0;
    _y = 0;
    _width = poleImg1.width * scale;
    _height = poleImg1.height * scale;

    if (boxA.clickCount == 0 && boxB.clickCount == 0)
        ctx.drawImage(poleImg1, _x, _y, _width, _height);
    else
        ctx.drawImage(poleImg2, _x, _y, _width, _height);
}

function drawGround() {
    let _x, _y, _width, _height;
    let div;

    div = groundImg.width / groundImg.height;

    _width = myCanvas.width;
    _height = myCanvas.width / div;
    _x = 0;
    _y = myCanvas.height - _height;
    ctx.drawImage(groundImg, _x, _y, _width, _height);
}

function drawCubes() {
    let _x, _y, _width, _height;
    let pivotX, pivotY;

    ctx.save();
    _width = boxB.width;
    _height = boxB.height;
    pivotX = boxB.position.x;
    pivotY = boxB.position.y;
    _x = pivotX - (_width / 2);
    _y = pivotY - (_height / 2);
    ctx.translate(pivotX, pivotY);
    ctx.rotate(boxB.angle);
    ctx.translate(-pivotX, -pivotY);
    if (brokenCubes[1] == false)
        ctx.drawImage(boxBlueImgsArr[boxB.clickCount], _x, _y, _width, _height);
    setClickArea(1, _x, _y, _width, _height);
    ctx.restore();

    ctx.save();
    _width = boxA.width;
    _height = boxA.height;
    pivotX = boxA.position.x;
    pivotY = boxA.position.y;
    _x = pivotX - (_width / 2);
    _y = pivotY - (_height / 2);
    ctx.translate(pivotX, pivotY);
    ctx.rotate(boxA.angle);
    ctx.translate(-pivotX, -pivotY);
    if (brokenCubes[0] == false)
        ctx.drawImage(boxBlueImgsArr[boxA.clickCount], _x, _y, _width, _height);
    setClickArea(0, _x, _y, _width, _height);
    ctx.restore();
}

function drawFishHeap() {
    let _x, _y, _width, _height;


    if (boxA.broken == true) {
        let pivotX, pivotY;
        pivotX = fishHeap1.position.x;
        pivotY = fishHeap1.position.y;
        _width = fishHeap1.width;
        _height = fishHeap1.height;
        _x = pivotX - (_width / 2);
        _y = pivotY - (_height / 2);
        ctx.drawImage(fishHeapImg1, _x, _y, _width, _height);
    }

    if (boxB.broken == true) {
        let pivotX, pivotY;
        pivotX = fishHeap2.position.x;
        pivotY = fishHeap2.position.y;
        _width = fishHeap2.width;
        _height = fishHeap2.height;
        _x = pivotX - (_width / 2);
        _y = pivotY - (_height / 2);
        ctx.drawImage(fishHeapImg2, _x, _y, _width, _height);
    }

}

function drawCats() {

    if (boxA.clickCount > 0 || boxB.clickCount > 0)
        return;

    let _x, _y, _width, _height;
    let scale = 0.28;

    _width = catAnim2.width * scale;
    _height = catAnim2.height * scale;
    _x = myCanvas.width * 0.12;
    _y = myCanvas.height * 0.28;
    ctx.drawImage(catAnim2.image, _x, _y, _width, _height);
    catAnim2.update();

    scale = 0.45;
    _width = catAnim1.width * scale;
    _height = catAnim1.height * scale;
    _x = 0;
    _y = myCanvas.height * 0.58;
    ctx.drawImage(catAnim1.image, _x, _y, _width, _height);
    catAnim1.update();
}


