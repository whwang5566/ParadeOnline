
//data
var stage;
var mainPlayer;
var sceneBackground;
var moveSpeed = 3;

//keyboard key
var KEYCODE_UP = 38;		//usefull keycode
var KEYCODE_LEFT = 37;		//usefull keycode
var KEYCODE_RIGHT = 39;		//usefull keycode
var KEYCODE_DOWN = 40;		//usefull keycode
var KEYCODE_SPACE = 32;		//usefull keycode

//Predefined Variable
var DialogPaddingX = 10;
var DialogPaddingY = 10;
var DialogRoundSize = 10;
  var TextOffestY = 30;

//player spritesheet
var playerSpriteSheet;

//players
var playersList = [];

//player state
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var isMove = false;

//enemy
var enemy;

//sound
var backgroundSound;

//ui items
var uiMenu;

//socket
var socket;

var canvas;
var dialogButton;
var dialogText;

var PlayerContainer;
var DialogContainer;

function initGame(){
    //resize canvas
 canvas = document.getElementById("gameStage");
 dialogButton = $("#dialogButton");
 dialogTextInput = $("#dialogContent");

 dialogButton.click(function()
 {
    console.log("test");

 
    mainPlayer.dialog.text.text = dialogTextInput.val()+" ";

    sendDialogToServer(dialogTextInput.val()+" ");

    dialogTextInput.val("");

    updateTargetPlayerDialog(mainPlayer);

 });


    //stage
    stage = new createjs.Stage("gameStage");
    
    //background
    sceneBackground = new createjs.Bitmap("map.png"); 
    stage.addChild(sceneBackground);
    
    //player
    playerSpriteSheet = new createjs.SpriteSheet({
        "animations":{
			"down_walk": {"frames":[0,1,2,1],"speed":0.1},
			"left_walk": {"frames":[3,4,5,4],"speed":0.1},
			"right_walk": {"frames":[6,7,8,7],"speed":0.1},
			"up_walk":{"frames":[9,10,11,10],"speed":0.1},
			"down_idle":1,
			"left_idle":4,
			"right_idle":7,
			"up_idle":10
			},
			"images": ["player.png"],
			"frames":
				{
					"height": 32,
					"width":30,
					"regX": 16,
					"regY": 15,
					"count": 12
				}
    });
    
    //add player
    mainPlayer = new createjs.Sprite(playerSpriteSheet);
    
    stage.addChild(mainPlayer);
    
    //position
    mainPlayer.x = 500;
    mainPlayer.y = 500;

    
    //animation
    mainPlayer.gotoAndPlay("down_idle");


    initDialog(mainPlayer);

    initSocket();

    //sound
    //createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSound("bgm.mp3","background");   
    createjs.Sound.addEventListener("fileload", loadSoundHandler);
    
    //register key functions
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    updateCamera();
    //ticker
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);       
}   

function initDialog(player)
{
  var dialogText = new createjs.Text("Hello World", "20px Arial", "#ff7700");
  dialogText.textAlign = "center";
  dialogText.textBaseline = "bottom";
  dialogText.text = " " ;
  dialogText.color = "#FFFFFF";


 //console.log(dialogText.getBounds());
  var TextBackground  = new createjs.Shape();

  player.dialog={};
  player.dialog.background = TextBackground;
  player.dialog.text = dialogText;

  updateTargetPlayerDialog(player);

  //mainPlayer.dialog.background =  dialog;
  stage.addChild(TextBackground);
  stage.addChild(dialogText);
}


function updateTargetPlayerDialog(target)
{
  var dialogText = target.dialog.text;
  var TextBackground = target.dialog.background;

  dialogText.x = target.x ;
  dialogText.y = target.y - TextOffestY;

  var textWidth = dialogText.getBounds().width;
  var textHeight = dialogText.getBounds().height;

  if(dialogText.text == " ")
  {
    TextBackground.graphics.clear();
  }
  else
  {
    TextBackground.graphics.clear().beginFill("black").drawRoundRect(target.x-textWidth/2-DialogPaddingX/2 ,target.y-TextOffestY-textHeight-DialogPaddingX/2,textWidth+DialogPaddingX,textHeight+DialogPaddingY,DialogRoundSize);
  }

  TextBackground.alpha = 0.6;

}

function updateCamera()
{
    stage.x = -mainPlayer.x + canvas.width/2;
    stage.y = -mainPlayer.y + canvas.height/2;
    var bgWidth = sceneBackground.image.width;
    var bgHeight =  sceneBackground.image.height;

    if(stage.x>0)stage.x = 0;
    if(stage.y>0)stage.y = 0;
    if(stage.x<-(bgWidth-canvas.width))stage.x = -(bgWidth-canvas.width);
    if(stage.y<-(bgHeight-canvas.height))stage. y= -(bgHeight-canvas.height);
}

//init enemy
function initEnemy(){
    //enemy
    var enemySpriteSheet = new createjs.SpriteSheet(
		{
			frames:{
				regX:0, regY:0,
				count:2,
				width:103, height:81
			}, images:["http://www.htmlgoodies.com/img/assets/yar.png"]
		}
	);
    
    //add enemy
    enemy = new createjs.Sprite(enemySpriteSheet);
    enemy.x = 200;
    enemy.y = 150;
    enemy.scaleX = 0.5;
    enemy.scaleY = 0.5;
    stage.addChild(enemy);
    
    //animation
    createjs.Tween.get(enemy,{loop:true}).to({y:enemy.y+20},700,createjs.Ease.quadInOut).to({y:enemy.y}, 700, createjs.Ease.quadInOut);
}

//add event
function initUIEvents(){
    //data
    uiMenu.active = false;
    uiMenu.initPosition = {x:uiMenu.x,y:uiMenu.y};
    
    //event
    uiMenu.on("click",function(){
        if(uiMenu.active === false){
            uiMenu.active = !uiMenu.active;
            createjs.Tween.get(uiMenu,{loop:false}).to({y:300},1000,createjs.Ease.backInOut);
        }
        else{
            uiMenu.active = !uiMenu.active;
            createjs.Tween.get(uiMenu,{loop:false}).to({y:uiMenu.initPosition.y},1000,createjs.Ease.backInOut);
        }
    });
}


var needSync = false;
//tick
function handleTick() {

    isMove = moveUp || moveDown || moveLeft || moveRight;

    //reset
    needSync = false;
    //if moving
    if(isMove) needSync = true;

    //move and set animation
    if(moveUp === true){
        if(mainPlayer.currentAnimation != "up_walk") mainPlayer.gotoAndPlay("up_walk");
        mainPlayer.y -= moveSpeed;
    }
    else if(moveDown === true){
        if(mainPlayer.currentAnimation != "down_walk") mainPlayer.gotoAndPlay("down_walk");
        mainPlayer.y += moveSpeed;
    }
    else if(moveLeft === true){
        if(mainPlayer.currentAnimation != "left_walk") mainPlayer.gotoAndPlay("left_walk");
        mainPlayer.x -= moveSpeed;
    }
    else if(moveRight === true){
        if(mainPlayer.currentAnimation != "right_walk") mainPlayer.gotoAndPlay("right_walk");
        mainPlayer.x += moveSpeed;
    }
    
    //set idel animation
    if(isMove === false){
        if((mainPlayer.currentAnimation == "up_walk") && (mainPlayer.currentAnimation != "up_idle"))
        {
            mainPlayer.gotoAndPlay("up_idle");

            needSync = true;
        } 
        else if((mainPlayer.currentAnimation == "down_walk") && (mainPlayer.currentAnimation != "down_idle"))
        {
            mainPlayer.gotoAndPlay("down_idle");

            needSync = true;
        } 
        else if((mainPlayer.currentAnimation == "left_walk") && (mainPlayer.currentAnimation != "left_idle"))
        {
            mainPlayer.gotoAndPlay("left_idle");

            needSync = true;
        } 
        else if((mainPlayer.currentAnimation == "right_walk") && (mainPlayer.currentAnimation != "right_idle"))
        {
            mainPlayer.gotoAndPlay("right_idle");

            needSync = true;
        } 
        else mainPlayer.stop();
    }

    //send to server
    if(needSync) sendPlayerStateToServer();

    //update
    updateCamera();
    updateTargetPlayerDialog(mainPlayer);
    stage.update(); 
}     

function loadSoundHandler(event){
    //var backgroundSound = createjs.Sound.play("background",{loop:true});
   // backgroundSound.volume = 1;
}

function handleKeyDown(event){
    switch(event.keyCode){
        case KEYCODE_UP:
            moveUp = true
            break;
        case KEYCODE_DOWN:
            moveDown = true;
            break;
        case KEYCODE_LEFT:
            moveLeft = true;
            break;
        case KEYCODE_RIGHT:
            moveRight = true;
            break;
    }
}

function handleKeyUp(event){
    switch(event.keyCode){
        case KEYCODE_UP:
            moveUp = false
            break;
        case KEYCODE_DOWN:
            moveDown = false;
            break;
        case KEYCODE_LEFT:
            moveLeft = false;
            break;
        case KEYCODE_RIGHT:
            moveRight = false;
            break;
    }
}

//add new player
function addNewPlayer(id,x,y){
    //create new player
    var player = new createjs.Sprite(playerSpriteSheet);

    stage.addChild(player);
    

    initDialog(player);
    //position
    player.x = x;
    player.y = y;
    
    //animation
    player.gotoAndPlay("down_idle");

    //add to list
    playersList[id] = player;
}

//remove player
function removePlayer(id){

    //add to list
    var player = playersList[id];

    if(player)
    {
        stage.removeChild(player);
        delete playersList[id];
    }
}



//update player state
function updatePlayer(id,stateData){

    //add to list
    var player = playersList[id];

    //if don't hve player , need create
    if(!player){
        addNewPlayer(id,stateData.x,stateData.y);
        player = playersList[id];

        updateTargetPlayerDialog(player);
    }

    if(stateData)
    {
       player.x = stateData.x;
       player.y = stateData.y;
       if(player.currentAnimation != stateData.animation) player.gotoAndPlay(stateData.animation);

       updateTargetPlayerDialog(player);
    }
}

//init socket
function initSocket(){
    socket = io.connect('http://localhost');

    
    //self connect success and get all players data
    socket.on('clientConnect', function (data){
        console.log(data);
    });

    //other player connect
    socket.on('newClientConnect',function(data){
        console.log(data);
        //add new player
        addNewPlayer(data.id,512/2,250);
    });

    //other player connect
    socket.on('newClientDisconnect',function(data){
        console.log(data);
        //remove player
        removePlayer(data.id);
    });

    //other player connect
    socket.on('otherClientStateChange',function(data){
        //console.log(data);
        updatePlayer(data.id,data.state)
    });

    socket.on('otherClientDialogChange',function(data){
        //console.log(data);
        otherPlayerSay(data.id,data.state);
    });



}

function otherPlayerSay(id,dialogData)
{
    var player = playersList[id];
    player.dialog.text.text = dialogData;
    updateTargetPlayerDialog(player);

    if(socket) socket.emit('clientDialogChange', playerData);


}

function sendDialogToServer(dialogData)
{
    if(socket) socket.emit('clientDialogChange', dialogData);
}

//send to server
function sendPlayerStateToServer(){
    var playerData = {
        x : mainPlayer.x,
        y : mainPlayer.y,
        animation : mainPlayer.currentAnimation
    };

    if(socket) socket.emit('clientStateChange', playerData);
}



