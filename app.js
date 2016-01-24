var can1;
var can2;

var ctx1;
var ctx2;

var canWidth;
var canHeight;

var lastTime;
var deltaTime;

var food;
var bug;

var moux;
var mouy;

var gamePaused=false;
var totalScore=0;
var numEaten=0;
var bugIndex=0;
var framecounter=0;
var targetFrame=0;
var id;
document.getElementById("canvas1").style.visibility="hidden";
document.getElementById("canvas2").style.visibility="hidden";
document.getElementById("info").style.visibility="hidden";
document.getElementById("gameover").style.visibility="hidden";
document.getElementById("result").innerHTML = localStorage.getItem("highScore1");

//document.body.onload = game;
function scorelevel1(){
  document.getElementById("result").innerHTML = localStorage.getItem("highScore1");
}

function scorelevel2(){
  document.getElementById("result").innerHTML = localStorage.getItem("highScore2");
}

function start(){
    //console.log(document.getElementById("level1").checked);
    document.getElementById("start").style.visibility="hidden";
    game();
}

function game(){
  document.getElementById("canvas1").style.visibility="visible";
  document.getElementById("canvas2").style.visibility="visible";
  document.getElementById("info").style.visibility="visible";
  lastTime= Date.now();
  deltaTime=0;
  init();
  gameloop();
  startTimer(60);
}

function init(){
  can1=document. getElementById("canvas1");
  ctx1=can1.getContext('2d');
  can2=document. getElementById("canvas2");
  ctx2=can2.getContext('2d');

	can1.addEventListener('mousemove',onMouseMove,false);

	canWidth=can1.width;
	canHeight=can1.height;

	food = new foodObj();
	food.init();

	bug=new bugObj();
	bug.init();

	moux =canWidth*0.5;
	mouy =canHeight*0.5;
}

function gameloop(){
  id= requestAnimationFrame(gameloop);//setInterval, setTimeout, frame per second(fps)

  var now= Date.now();
  deltaTime= now -lastTime;
  lastTime= now;

  ctx1.clearRect(0,0,can1.width,can1.height);
  ctx2.clearRect(0,0,can2.width,can2.height);

	food.draw();
	sendBug();
	bug.draw();

	foodBugCollision();
	document.onclick = bugMouseCollision;
}

function pause(){
  if (!gamePaused){
    cancelAnimationFrame(id);
    gamePaused=true;
    document.getElementById("btn").innerHTML ="Play";
    clearInterval(ticker);
  }
  else if(gamePaused){
    id= requestAnimationFrame(gameloop);
    gamePaused=false;
    document.getElementById("btn").innerHTML ="Pause";
    ticker = setInterval("tick()",1000);
  }
}

function gameOver(){
  document.getElementById("canvas1").style.visibility="hidden";
  document.getElementById("canvas2").style.visibility="hidden";
  document.getElementById("info").style.visibility="hidden";
  document.getElementById("gameover").style.visibility="visible";
  document.getElementById("final").innerHTML = totalScore;
  if(document.getElementById("level1").checked){
    storeScore1();
    document.getElementById("result").innerHTML = localStorage.getItem("highScore1");
  }
  else{
    storeScore2();
    document.getElementById("result").innerHTML = localStorage.getItem("highScore2");
  }
  cancelAnimationFrame(id);
  clearInterval(ticker);
  document.getElementById("countdown").innerHTML = 60;
  document.getElementById("number").innerHTML = 0;
  totalScore=0;
  numEaten=0;
  bugIndex=0;
  framecounter=0;
}


function exit(){
  document.getElementById("gameover").style.visibility="hidden";
  document.getElementById("start").style.visibility="visible";
}

function restart(){
  document.getElementById("gameover").style.visibility="hidden";
  document.getElementById("number").innerHTML = 0;
  game();
}

function storeScore1(){
  if (typeof(Storage) !== "undefined") {
    if (totalScore > localStorage.getItem("highScore1")){
      // Store
      localStorage.setItem("highScore1", totalScore);
      //Retrieve
      document.getElementById("result").innerHTML = localStorage.getItem("highScore1");
    }
  }
  else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage";
  }
}

function storeScore2(){
  if (typeof(Storage) !== "undefined") {
    if (totalScore > localStorage.getItem("highScore2")){
      // Store
      localStorage.setItem("highScore2", totalScore);
      //Retrieve
      document.getElementById("result").innerHTML = localStorage.getItem("highScore2");
    }
  }
  else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage";
  }
}

//section of food ============================================================
var foodObj =function (){
	  this.exist=[]; //bool
	  this.x=[];
		this.y=[];
}
foodObj.prototype.num=5;

foodObj.prototype.init=function(){
	for (var i=0; i<this.num; i++){
		this.exist[i]=true;
		this.x[i]= 10+76*i+Math.random()*76;
		this.y[i]= 120+Math.random()*470;
	}

}
foodObj.prototype.draw=function(){
	ctx2.save();
	for (var i=0; i<this.num; i++)
	{
		if(this.exist[i]){
			//draw the left food
			ctx2.beginPath();
			ctx2.arc(this.x[i],this.y[i],9,0,2*Math.PI);
			ctx2.fillStyle="Yellow";
			ctx2.fill();
			ctx2.lineWidth =2;
			ctx2.strokeStyle ="OrangeRed";
			ctx2.stroke();
		}
	}
	ctx2.restore();
}

foodObj.prototype.eaten =function(i){
	this.exist[i]=false;
  for(var i=0; i<bug.num; i++){
    bug.changeDirection[i]=true;
  }
}

//section of bugs==============================================================

var bugObj=function(){
	this.alive=[];  //bool
	this.x=[];
	this.y=[];
	this.speed=[];
  this.rotateAngle=[];
  this.changeDirection=[];
	this.bugType=[];
  this.score=[];
}

bugObj.prototype.num =60;
bugObj.prototype.init=function(){
	for (var i=0; i<this.num; i++){
		this.alive[i]=false;
		this.x[i]=0;
		this.y[i]=0;
		this.speed[i]=0.05;
    this.rotateAngle[i]=0;
    this.changeDirection[i]=false;
		this.bugType[i]="";
    this.score[i]=0;
	}
}

function sendBug(){
  framecounter++;
  if (framecounter > targetFrame){
        bug.born(bugIndex);
        bugIndex++;
        framecounter=0;
		// after generate bug
		var randomValue= 1+ (Math.random() * 2);
		targetFrame = 60 * randomValue ;
		frameCounter = 0;
    }
 }


bugObj.prototype.born= function (i){
	this.alive[i]=true;
	//x range from 10 to 390px
	this.x[i]= 10+ Math.random()*380;
	this.y[i]= 0;
	var ran = Math.random();
  if(document.getElementById("level1").checked){
	if(ran <0.4){
    this.bugType[i]="Orange";
		this.speed[i] = 1;
    this.score[i] = 1;

	}
	else if (ran>=0.4 && ran<0.7) {
		this.bugType[i]="Red";
		this.speed[i] = 1.25;
    this.score[i] = 3;
	}
	else {
    this.bugType[i]="Black";
		this.speed[i] = 2.5;        //60 frames/second, 150px/second, 2.5 px/frame
    this.score[i] = 5;
	}
}
else {
  if(ran <0.4){
    this.bugType[i]="Orange";
		this.speed[i] = (80/60);
    this.score[i] = 1;
	}
	else if (ran>=0.4 && ran<0.7) {
		this.bugType[i]="Red";
		this.speed[i] = (100/60);
    this.score[i] = 3;
	}
	else {
    this.bugType[i]="Black";
		this.speed[i] = (200/60);
    this.score[i] = 5;
	}
}
}

bugObj.prototype.draw=function(){
	for (var i=0; i<this.num; i++){
		if (this.alive[i]){
			var foodIndex= this.findTarget(i);
			if(!food.exist[foodIndex]){
           //this.rotateAngle[i]= 0;
				var foodIndex= this.findTarget(i);
        //this.drawBug(i,this.bugType[i],foodIndex);
			}
		  else{
        this.drawBug(i,this.bugType[i],foodIndex);
			}
		}
	}
}

bugObj.prototype.drawBug=function(i,color,j){
  var deltaX = food.x[j]-this.x[i];
  var deltaY = food.y[j]-this.y[i];
  var toFoodLength= Math.sqrt(deltaX*deltaX+deltaY*deltaY);
  var unitX = deltaX/toFoodLength;
  var unitY = deltaY/toFoodLength;
  this.x[i] += unitX *this.speed[i];
  this.y[i] += unitY *this.speed[i];

  var unitX_abs = Math.abs(unitX);
  var unitY_abs = Math.abs(unitY);
  var deltaAngle = Math.atan2(unitX_abs,unitY_abs);
  var directionX = 1;
  var directionY = 1;
  if (unitX > 0){
    directionX=-1;
  }
  else{
    directionX=1;
  }
  if (unitY >0){
    directionY=-1;
  }
  else{
    directionY=1;
  }

  if(this.rotateAngle[i] < deltaAngle ){
    // save state
    ctx1.save();
    //draw first leg
    ctx1.beginPath();
    ctx1.moveTo((this.x[i]+directionX*25*Math.sin(this.rotateAngle[i])),(this.y[i]+directionY*25*Math.cos(this.rotateAngle[i])));
    ctx1.lineTo((this.x[i]+directionX*35*Math.sin(this.rotateAngle[i]-(Math.PI/18))),(this.y[i]+directionY*35*Math.cos(this.rotateAngle[i]-(Math.PI/18))));
    ctx1.strokeStyle = color; //'SaddleBrown';
    ctx1.stroke();
    //draw second leg
    ctx1.beginPath();
    ctx1.moveTo((this.x[i]+directionX*25*Math.sin(this.rotateAngle[i])),(this.y[i]+directionY*25*Math.cos(this.rotateAngle[i])));
    ctx1.lineTo((this.x[i]+directionX*35*Math.sin(this.rotateAngle[i]+(Math.PI/18))),(this.y[i]+directionY*35*Math.cos(this.rotateAngle[i]+(Math.PI/18))));
    ctx1.strokeStyle = color; //'SaddleBrown';
    ctx1.stroke();
    //draw bug body
    ctx1.beginPath();
    ctx1.moveTo(this.x[i],this.y[i]);
    ctx1.lineTo((this.x[i]+directionX*25*Math.sin(this.rotateAngle[i])),(this.y[i]+directionY*25*Math.cos(this.rotateAngle[i])));
    ctx1.strokeStyle =color;
    ctx1.lineWidth=5;
    ctx1.lineCap='round';
    ctx1.stroke();
    //draw bug head
    ctx1.beginPath();
    ctx1.arc(this.x[i], this.y[i], 4, 0, 2 * Math.PI);
    ctx1.fillStyle = color;
    ctx1.fill();
    ctx1.lineWidth = 1;
    ctx1.strokeStyle = color; //'SaddleBrown';
    ctx1.stroke();
    // restore to original state
    ctx1.restore();
    this.rotateAngle[i]+= (Math.PI/360);
  }

 else if (this.rotateAngle[i] >= deltaAngle){
    this.rotateAngle[i] = deltaAngle;
    // save state
    ctx1.save();
    //draw first leg
    ctx1.beginPath();
    ctx1.moveTo((this.x[i]+directionX*25*Math.sin(deltaAngle)),(this.y[i]+directionY*25*Math.cos(deltaAngle)));
    ctx1.lineTo((this.x[i]+directionX*35*Math.sin(deltaAngle-(Math.PI/18))),(this.y[i]+directionY*35*Math.cos(deltaAngle-(Math.PI/18))));
    ctx1.strokeStyle = color; //'SaddleBrown';
    ctx1.stroke();
    //draw second leg
    ctx1.beginPath();
    ctx1.moveTo((this.x[i]+directionX*25*Math.sin(deltaAngle)),(this.y[i]+directionY*25*Math.cos(deltaAngle)));
    ctx1.lineTo((this.x[i]+directionX*35*Math.sin(deltaAngle+(Math.PI/18))),(this.y[i]+directionY*35*Math.cos(deltaAngle+(Math.PI/18))));
    ctx1.strokeStyle = color; //'SaddleBrown';
    ctx1.stroke();
    //draw bug body
    ctx1.beginPath();
    ctx1.moveTo(this.x[i],this.y[i]);
    ctx1.lineTo((this.x[i]+directionX*25*Math.sin(deltaAngle)),(this.y[i]+directionY*25*Math.cos(deltaAngle)));
    ctx1.strokeStyle =color;
    ctx1.lineWidth=5;
    ctx1.lineCap='round';
    ctx1.stroke();
    //draw bug head
    ctx1.beginPath();
    ctx1.arc(this.x[i], this.y[i], 4, 0, 2 * Math.PI);
    ctx1.fillStyle = color;
    ctx1.fill();
    ctx1.lineWidth = 1;
    ctx1.strokeStyle = color; //'SaddleBrown';
    ctx1.stroke();
    // restore to original state
    ctx1.restore();
  }
}


bugObj.prototype.findTarget=function(i){
	var closestX= 400;
	var closestY= 600;
	var closestd= 520000;
	var d;
	var index=0;
	for (var j=0; j<food.num; j++){
		if (food.exist[j]){
      d = calLengthsquare(this.x[i],this.y[i],food.x[j],food.y[j]);
			if(d < closestd){
				closestX= food.x[j];
				closestY= food.y[j];
				closestd= d;
				index= j;
			}
		}
	}
	return index;

}

bugObj.prototype.dead=function(i){
	this.alive[i]=false;
}

//section of mouse===========================================================
function onMouseMove(e)
{
	if (e.offSetX || e.layerX){
		moux =e.offSetX ==undefined ? e.layerX:e.offSetX;
		mouy =e.offSetY ==undefined ? e.layerY:e.offSetY;
	}
}

//section of collision=======================================================
function foodBugCollision(){
	for(var i=0; i<bug.num; i++){
		for(var j=0; j<food.num; j++){
			if(food.exist[j]){
				var l=calLengthsquare(bug.x[i],bug.y[i],food.x[j],food.y[j]);
				if(l < 196){
					food.eaten(j);
          numEaten++;
          if(numEaten==food.num){
            gameOver();
          }
				}
			}
		}
	}
}

function bugMouseCollision(){
	for(var i=0; i<bug.num; i++){
		if(bug.alive[i]){
			var L=calLengthsquare(moux,mouy,bug.x[i],bug.y[i]);
			if (L < 900 && gamePaused == false){
				bug.dead(i);
        totalScore+=bug.score[i];
        document.getElementById("number").innerHTML =totalScore;
			}
		}
	}
}

//section of timer=========================================================
var timeInSecs;
var ticker;

function startTimer(secs){
	timeInSecs = parseInt(secs)-1;
	ticker = setInterval("tick()",1000);
}

function tick() {
	var secs = timeInSecs;
	if (secs>0) {
		timeInSecs--;
	}
	else {
		// stop counting at zero
		clearInterval(ticker);
    if(document.getElementById("level1").checked){
      cancelAnimationFrame(id);
      storeScore1();
      document.getElementById("level1").checked = false;
      document.getElementById("level2").checked = true;
      document.getElementById("countdown").innerHTML = 60;
      document.getElementById("number").innerHTML = 0;
      totalScore=0;
      numEaten=0;
      bugIndex=0;
      framecounter=0;
      game();
    }
    else{
      gameOver();
    }
	}
	document.getElementById("countdown").innerHTML = secs;
}


//help functions=====================================================
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);

        };
}());

function calLengthsquare(x1, y1, x2, y2) {
	return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}
