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

var brokenCubes = [false, false, false, false];

var boxImg1 = document.getElementById('crate_b_1');
var boxImg2 = document.getElementById('crate_b_2');
var boxImg3 = document.getElementById('crate_b_3');
var boxImg4 = document.getElementById('crate_b_4');


var boxImg6 = document.getElementById('crate_r_1');
var boxImg7 = document.getElementById('crate_r_2');
var boxImg8 = document.getElementById('crate_r_3');
var boxImg9 = document.getElementById('crate_r_4');

var boxImg10 = document.getElementById('crate5');

var ringBlueImg = document.getElementById('blueRing');
var ringRedImg = document.getElementById('redRing');

let boxBlueImgsArr = [boxImg1, boxImg2, boxImg3, boxImg4, boxImg10];
let boxRedImgsArr = [boxImg6, boxImg7, boxImg8, boxImg9, boxImg10];

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
let boxA, boxB, theGround, wall1, wall2, roof, ringA, ringB;


// create runner
var runner = Runner.create();

let cursorX = 0; let cursorY = 0;

const myCss = `
canvas {
    border:1px solid #055500;
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
    drawCubes();
    drawRing();
    drawGround();
    drawHammer();

    animateRing();

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

    // start physics calculations:
    Runner.run(runner, engine);

    // start game rendering loop:
    requestAnimationFrame(frame);
}

function createBoxes() {
    let _x, _y, _width, _height;
    let scale = 0.55;

    _width = myCanvas.width * scale;
    _height = _width;
    _x = myCanvas.width * 0.2;
    _y = myCanvas.height * 0.48
    boxA = Bodies.rectangle(_x + (_width / 2), _y + (_height / 2), _width, _height, { width: _width, height: _height, broken: false, clickCount: 0 });
    boxA.collisionFilter.group = 1;

    scale = 0.43;
    _width = myCanvas.width * scale;
    _height = _width;
    _x = myCanvas.width * 0.45;
    _y = myCanvas.height * 0.10;
    boxB = Bodies.rectangle(_x + (_width / 2), _y + (_height / 2), _width, _height, { width: _width, height: _height, broken: false, clickCount: 0 });
    boxB.collisionFilter.group = 1;

    let div;

    div = groundImg.width / groundImg.height;

    _width = myCanvas.width;
    _height = myCanvas.width / div;
    _x = 0;
    _y = myCanvas.height - _height;
    theGround = Bodies.rectangle(_x + (_width / 2), _y + (_height / 2), _width, _height, { isStatic: true, width: _width, height: _height });

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

function addBoxesTotheWorld() {
    Composite.add(engine.world, [boxA, boxB, theGround, wall1, wall2, roof]);
}

function createRing(i) {

    let _x, _y, _width, _height;
    let scale;

    _x = myCanvas.width * 0.5;
    _y = myCanvas.height * 0.5;

    if (i == 0) {
        scale = 0.68;
        _width = myCanvas.width * scale;
        _height = _width;
        ringA = Bodies.rectangle(_x, _y, _width, _height);
        ringA.isSleeping = true;
    }
    else {
        scale = 0.68;
        _width = myCanvas.width * scale;
        _height = _width;
        ringB = Bodies.rectangle(_x, _y, _width, _height);
        ringB.isSleeping = true;
    }
    shouldAnimateRing = true;
}

var shouldAnimateRing = false;
var counter;
function animateRing() {
    if (shouldAnimateRing == false)
        return;

    if (ringA != null && ringA.position.y > 20) {
        Body.translate(ringA, { x: 1.15, y: -2 });
        Body.scale(ringA, 0.98, 0.98);
    }

    if (ringB != null && ringB.position.y > 20) {
        Body.translate(ringB, { x: 0.48, y: -2 });
        Body.scale(ringB, 0.98, 0.98);
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

    Body.applyForce(boxA, { x: box.position.x, y: box.position.y }, { x: -0.4, y: -0.4 });
    if (box.clickCount < boxBlueImgsArr.length - 1)
        box.clickCount++;
    if (box.clickCount == boxBlueImgsArr.length - 1) {
        boxA.collisionFilter.group = -1;
        boxB.collisionFilter.group = -1;
        Body.setAngle(box, 0);
        if (box.broken == false)
            createRing(i);
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
    if (backgroundImg != null)
        ctx.drawImage(backgroundImg, 0, 0, myCanvas.width, myCanvas.height);
}

function drawGround() {
    let _x, _y, _width, _height;

    _width = theGround.width;
    _height = theGround.height;
    _x = theGround.position.x - (_width / 2);
    _y = theGround.position.y - (_height / 2);
    ctx.drawImage(groundImg, _x, _y, _width, _height);
}

function drawCubes() {
    let _x, _y, _width, _height;
    let pivotX, pivotY;

    _width = boxA.width * 1.2;
    _height = boxA.height * 1.2;
    pivotX = boxA.position.x;
    pivotY = boxA.position.y;
    _x = pivotX - (_width / 2);
    _y = pivotY - (_height / 2);
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(boxA.angle);
    ctx.translate(-pivotX, -pivotY);
    if (brokenCubes[0] == false)
        ctx.drawImage(boxBlueImgsArr[boxA.clickCount], _x, _y, _width, _height);
    setClickArea(0, _x, _y, _width, _height);
    ctx.restore();

    ctx.save();
    _width = boxB.width * 1.2;
    _height = boxB.height * 1.2;
    pivotX = boxB.position.x;
    pivotY = boxB.position.y;
    _x = pivotX - (_width / 2);
    _y = pivotY - (_height / 2);
    ctx.translate(pivotX, pivotY);
    ctx.rotate(boxB.angle);
    ctx.translate(-pivotX, -pivotY);
    if (brokenCubes[1] == false)
        ctx.drawImage(boxRedImgsArr[boxB.clickCount], _x, _y, _width, _height);
    setClickArea(1, _x, _y, _width, _height);
    ctx.restore();
}

function drawRing() {
    if (ringBlueImg == null)
        return;

    let _x, _y, _width, _height;

    if (boxA.broken == true) {
        let { min, max } = ringA.bounds
        _width = max.x - min.x;
        _height = max.y - min.y;
        _x = ringA.position.x - (_width / 2);
        _y = ringA.position.y - (_height / 2);
        ctx.drawImage(ringBlueImg, _x, _y, _width, _height);
    }

    if (boxB.broken == true) {
        let { min, max } = ringB.bounds
        _width = max.x - min.x;
        _height = max.y - min.y;
        _x = ringB.position.x - (_width / 2);
        _y = ringB.position.y - (_height / 2);
        ctx.drawImage(ringRedImg, _x, _y, _width, _height);
    }

}


