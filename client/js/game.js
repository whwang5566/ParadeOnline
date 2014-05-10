
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
var player1SpriteSheet;
var player2SpriteSheet;
var player3SpriteSheet;
var player4SpriteSheet;
var player5SpriteSheet;
var player6SpriteSheet;
var player7SpriteSheet;
var player8SpriteSheet;
var player9SpriteSheet;
var player10SpriteSheet;
var player11SpriteSheet;

//players
var playersList = [];

//player state
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var isMove = false;
var defaultPlayerSprite = 1;

//npc
var npcList = [];

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
    
    //players
    player1SpriteSheet = new createjs.SpriteSheet({
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
			"images": ["player1.png"],
			"frames":
				{
					"height": 32,
					"width":30,
					"regX": 16,
					"regY": 15,
					"count": 12
				}
    });

    player2SpriteSheet = new createjs.SpriteSheet({
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
            "images": ["player2.png"],
            "frames":
                {
                    "height": 48,
                    "width":32,
                    "regX": 16,
                    "regY": 24,
                    "count": 12
                }
    });

    player3SpriteSheet = new createjs.SpriteSheet({
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
            "images": ["player3.png"],
            "frames":
                {
                    "height": 65,
                    "width":65,
                    "regX": 32.5,
                    "regY": 32.5,
                    "count": 12
                }
    });

    player4SpriteSheet = new createjs.SpriteSheet({
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
            "images": ["player4.png"],
            "frames":
                {
                    "height": 32,
                    "width":32,
                    "regX": 16,
                    "regY": 16,
                    "count": 12
                }
    });

    player5SpriteSheet = new createjs.SpriteSheet({
        "animations":{
            "down_walk": {"frames":[0,1,2,3,1],"speed":0.1},
            "left_walk": {"frames":[4,5,6,7,4],"speed":0.1},
            "right_walk": {"frames":[8,9,10,11,8],"speed":0.1},
            "up_walk":{"frames":[12,13,14,15,12],"speed":0.1},
            "down_idle":1,
            "left_idle":5,
            "right_idle":9,
            "up_idle":13
            },
            "images": ["player5.png"],
            "frames":
                {
                    "height": 40,
                    "width":33,
                    "regX": 16.5,
                    "regY": 20,
                    "count": 16
                }
    });

    player6SpriteSheet = new createjs.SpriteSheet({
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
            "images": ["player6.png"],
            "frames":
                {
                    "height": 32,
                    "width":32,
                    "regX": 16,
                    "regY": 16,
                    "count": 12
                }
    });

    player7SpriteSheet = new createjs.SpriteSheet({
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
            "images": ["player7.png"],
            "frames":
                {
                    "height": 32,
                    "width":32,
                    "regX": 16,
                    "regY": 16,
                    "count": 12
                }
    });
    
    player8SpriteSheet = new createjs.SpriteSheet({
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
            "images": ["player8.png"],
            "frames":
                {
                    "height": 80,
                    "width":80,
                    "regX": 40,
                    "regY": 40,
                    "count": 12
                }
    });

    player9SpriteSheet = new createjs.SpriteSheet({
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
            "images": ["player9.png"],
            "frames":
                {
                    "height": 32,
                    "width":32,
                    "regX": 16,
                    "regY": 16,
                    "count": 12
                }
    });

    player10SpriteSheet = new createjs.SpriteSheet({
        "animations":{
            "down_walk": {"frames":[0,1,2,3,1],"speed":0.1},
            "left_walk": {"frames":[4,5,6,7,4],"speed":0.1},
            "right_walk": {"frames":[8,9,10,11,8],"speed":0.1},
            "up_walk":{"frames":[12,13,14,15,12],"speed":0.1},
            "down_idle":1,
            "left_idle":5,
            "right_idle":9,
            "up_idle":13
            },
            "images": ["player10.png"],
            "frames":
                {
                    "height": 64,
                    "width":64,
                    "regX": 32,
                    "regY": 32,
                    "count": 16
                }
    });

    player11SpriteSheet = new createjs.SpriteSheet({
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
            "images": ["player11.png"],
            "frames":
                {
                    "height": 32,
                    "width":32,
                    "regX": 16,
                    "regY": 16,
                    "count": 12
                }
    });


    //add player
    mainPlayer = new createjs.Sprite(player1SpriteSheet);
    mainPlayer.playerSprite = defaultPlayerSprite;

    stage.addChild(mainPlayer);
    
    //position
    mainPlayer.x = 500;
    mainPlayer.y = 500;

    
    //animation
    mainPlayer.gotoAndPlay("down_idle");


    initDialog(mainPlayer);

    initSocket();

    //init npc
    initNPC();

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
function initNPC(){
    //npc
    var catSpriteSheet = new createjs.SpriteSheet({
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
            "images": ["cat2.png"],
            "frames":
                {
                    "height": 32,
                    "width":31.5,
                    "regX": 16,
                    "regY": 16,
                    "count": 12
                }
    });
    
    //add npc
    var catNpc = new createjs.Sprite(catSpriteSheet);
    catNpc.x = 300;
    catNpc.y = 150;
    //catNpc.scaleX = 0.5;
    //catNpc.scaleY = 0.5;
    stage.addChild(catNpc);
    //animation
    //createjs.Tween.get(catNpc,{loop:true}).to({y:enemy.y+20},700,createjs.Ease.quadInOut).to({y:enemy.y}, 700, createjs.Ease.quadInOut);

    npcList.push(catNpc);
}

//add shoes 
function addItemShoes(){
    //enemy
    var shoesSpriteSheet = new createjs.SpriteSheet(
        {
            frames:{
                regX:128, regY:128,
                count:1,
                width:256, height:256
            }, images:["shoe.png"]
        }
    );
    
    //add enemy
    var shoesItem = new createjs.Sprite(shoesSpriteSheet);
    shoesItem.x = 200;
    shoesItem.y = 150;
    shoesItem.scaleX = 0.5;
    shoesItem.scaleY = 0.5;
    stage.addChild(shoesItem);
    
    //animation
    createjs.Tween.get(shoesItem,{loop:true}).to({y:shoesItem.y+20},700,createjs.Ease.quadInOut).to({y:shoesItem.y}, 700, createjs.Ease.quadInOut);
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
    var backgroundSound = createjs.Sound.play("background",{loop:true});
    backgroundSound.volume = 1;
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
    var player = new createjs.Sprite(player1SpriteSheet);
    player.playerSprite = defaultPlayerSprite;

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
       changePlayer(player,stateData.playerSprite,false,id);
       if(player.currentAnimation != stateData.animation) player.gotoAndPlay(stateData.animation);

       //import! need update
        stage.update();

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
        addNewPlayer(data.id,500,500);
        //send self player data to new client
        sendPlayerStateToServer();
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
        playerSprite : mainPlayer.playerSprite,
        animation : mainPlayer.currentAnimation
    };

    if(socket) socket.emit('clientStateChange', playerData);
}

//change player sprite
function changePlayer(player,playerSpriteId,isMainPlayer,id){
    //console.log('id:'+playerSpriteId);
    
    var newSprite;

    //parse int
    playerSpriteId = parseInt(playerSpriteId);

    //check already or not
    if(player.playerSprite == parseInt(playerSpriteId)) return;
    
    switch(playerSpriteId){
        case 1:
            newSprite = player1SpriteSheet;
            break;
        case 2:
            newSprite = player2SpriteSheet;
            break;
        case 3:
            newSprite = player3SpriteSheet;
            break;
        case 4:
            newSprite = player4SpriteSheet;
            break;
        case 5:
            newSprite = player5SpriteSheet;
            break;
        case 6:
            newSprite = player6SpriteSheet;
            break;
        case 7:
            newSprite = player7SpriteSheet;
            break;
        case 8:
            newSprite = player8SpriteSheet;
            break;
        case 9:
            newSprite = player9SpriteSheet;
            break;
        case 10:
            newSprite = player10SpriteSheet;
            break;
        case 11:
            newSprite = player11SpriteSheet;
            break;
        default:
            newSprite = player1SpriteSheet;
            break;
    }

    //save position
    var tempX = player.x;
    var tempY = player.y;
    var tempDialog = player.dialog;

    //remove player
    stage.removeChild(player);

    //add player
    player = new createjs.Sprite(newSprite);
    player.playerSprite = parseInt(playerSpriteId);
    player.dialog = tempDialog;

    //animation
    //player.gotoAndPlay("down_idle");

    stage.addChild(player);
    
    //position
    player.x = tempX;
    player.y = tempY;

    if(isMainPlayer == true)
    {
        player.gotoAndPlay("down_idle");
        mainPlayer = player;

        //send data
        sendPlayerStateToServer();
    } 
    //set player
    if(id != undefined ) 
    {
        console.log('spriteId:'+playerSpriteId +' id:'+id);
        playersList[id] = player;
    }

    //update
    stage.update(); 
}

