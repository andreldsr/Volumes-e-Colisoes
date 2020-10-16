var canvasSize = 600;
var points = []
var minX, maxX, minY, maxY;
var radius;
var center;
var showCircle = false;
var showAABB = false;
var showSecondSquare = false;
var showOBB = false;
var inp;
var squareInit = [0,0]
var squareWidth = 0, squareHeight = 0;
var circleCenter = [];
var circleRadius = 0;

function setup() {
  createCanvas(canvasSize, canvasSize);
  for (i = 0; i < 10; i++) {
    createPoint()
  }
  strokeWeight(5)
  createUI()
}

function createUI() {
  let button = createButton("Show Circle")
  button.position(10, 30)
  button.mousePressed(toggleShowCircle)
  button = createButton("Show AABB")
  button.position(10, 60)
  button.mousePressed(toggleShowAABB)
  //button = createButton("Show OBB")
  //button.position(10, 90)
  //button.mousePressed(toggleShowOBB)
  button = createButton("Show Other square")
  button.position(10, 90)
  button.mousePressed(toggleSecondSquare)
  inp = createInput("0")
  inp.position(10,canvasSize - 30)
  button = createButton("Set square X")
  button.mousePressed(setSquareX)
  button = createButton("Set square Y")
  button.mousePressed(setSquareY)
  button = createButton("Set square Width")
  button.mousePressed(setSquareWidth)
  button = createButton("Set square Height")
  button.mousePressed(setSquareHeight)
  //button = createButton("Set circle center X")
  //button = createButton("Set circle center Y")
  //button = createButton("Set circle radius")
}
function setSquareX(){
  squareInit[0] = inp.value()
}
function setSquareY(){
  squareInit[1] = inp.value()
}
function setSquareWidth(){
  squareWidth = inp.value()
}
function setSquareHeight(){
  squareHeight = inp.value()
}

function toggleShowCircle() {
  showCircle = !showCircle
}

function toggleShowAABB() {
  showAABB = !showAABB
}

function toggleShowOBB() {
  showOBB = !showOBB
}
function toggleSecondSquare() {
  showSecondSquare = !showSecondSquare
}

function draw() {
  background(220);
  drawCircle()
  drawAABB()
  drawSecondSquare()
  drawPoints()
}

function createPoint() {
  var max = canvasSize / 10 * 8;
  var min = canvasSize / 10 * 3;
  var index = points.length
  points[index] = [];
  points[index][0] = Math.random() * (max - min) + min
  points[index][1] = Math.random() * (max - min) + min
  calculateBoundaries(points[index]);
}

function calculateBoundaries(point) {
  let x = point[0]
  let y = point[1]
  if (x > maxX || maxX == null) {
    maxX = x
  }
  if (x < minX || minX == null) {
    minX = x
  }
  if (y > maxY || maxY == null) {
    maxY = y
  }
  if (y < minY || minY == null) {
    minY = y
  }
}

function calculateCenter() {
  let center = []
  center[0] = (minX + maxX) / 2
  center[1] = (minY + maxY) / 2
  return center
}

function calculateRadius() {
  for(i = 0; i < points.length; i++){
    let distX = points[i][0] - center[0]
    let distY = points[i][1] - center[1]
    let rad = dist(points[i][0], points[i][1], center[0], center[1]) * 2
    if(rad > radius || radius == null){
      radius = rad
    }
  }
  return radius
}

function drawPoints() {
  stroke(0)
  for (i = 0; i < points.length; i++) {
    point(points[i][0], points[i][1])
  }
}

function drawCircle() {
  if (!showCircle)
    return
  center = calculateCenter()
  stroke(255, 0, 0)
  if(dist(mouseX, mouseY, center[0], center[1]) < radius/2)
    stroke(0,0,255)
  calculateRadius()
  circle(center[0], center[1], radius)
  point(center[0], center[1])
}

function drawAABB() {
  if(!showAABB)
    return
  stroke(0,150,0)
  if(between(mouseX, minX, maxX) && between(mouseY, minY, maxY))
    stroke(0,0,255)
  rect(minX,minY, (maxX - minX), (maxY - minY))
}
function drawSecondSquare(){
  if(!showSecondSquare)
    return
  stroke(0,255,150)
  rect(squareInit[0], squareInit[1], squareWidth, squareHeight)  
  if(showAABB)
  if(squaresCollide()){
    text("The second Square collides with the first one", 100,30)
  }else{
    text("The second Square does not collide with the first one", 100,30)
  }
  if(showCircle)
  if(squareCollideCircle()){
   text("The second Square collides with the circle", 100,50)
  }else{
    text("The second Square does not collide with the circle", 100,50)
  }
}

function squareCollideCircle(){
  let squareMinX = int(squareInit[0]);
  let squareMaxX = int(squareInit[0]) + int(squareWidth);
  let squareMinY = int(squareInit[1]);
  let squareMaxY = int(squareInit[1]) + int(squareHeight);
  let a1 = dist(squareMinX, squareMinY, center[0], center[1]) < (radius/2)
  let a2 = dist(squareMinX, squareMaxY, center[0], center[1]) < (radius/2)
  let a3 = dist(squareMaxX, squareMinY, center[0], center[1]) < (radius/2)
  let a4 = dist(squareMaxX, squareMaxY, center[0], center[1]) < (radius/2)
  
  let a5 = a1 || a2 || a3 || a4;
  
  let b1 = squareMinX < center[0] - radius/2;
  let b2 = squareMaxX < center[0] - radius/2;
  
  let b3 = squareMinX > center[0] + radius/2;
  let b4 = squareMaxX > center[0] + radius/2;
  
  
  let c1 = squareMinY < center[1] - radius/2;
  let c2 = squareMaxY < center[1] - radius/2;

  let c3 = squareMinY > center[1] + radius/2;
  let c4 = squareMaxY > center[1] + radius/2;
  
  let b5 = (b1 && !b2) || (!b3 && b4)
  let c5 = (c1 && !c2) || (!c3 && c4)
  
  print("a5 > " + a5)
  print("b5 > " + b5)
  print("c5 > " + c5)
  print("b1 > " + b1)
  print("!b2 > " + !b2)
  print("b1 && !b2 > " + (b1 && !(b2)))
  return (a5 || ((b5 && c1 && c4) || (c5 && b1 && b4)))
  
}

function squaresCollide(){
  let b1 = between(squareInit[0], minX, maxX);
  let b2 = between(int(squareInit[0])+int(squareWidth), minX, maxX);
  let b3 = between(squareInit[1], minY, maxY);
  let b4 = between(int(squareInit[1]) + int(squareHeight), minY, maxY)
  
  let c1 = between(minX, squareInit[0], int(squareInit[0])+int(squareWidth));
  let c2 = between(maxX, squareInit[0], int(squareInit[0])+int(squareWidth));
  let c3 = between(minY, squareInit[1], int(squareInit[1]) + int(squareHeight));
  let c4 = between(maxY, squareInit[1], int(squareInit[1]) + int(squareHeight))
  return ((b1 || b2) && (b3 || b4)) || ((c1 || c2) && (c3 || c4))
}

function between(x, min, max){
  return x>= min && x <=max
}
