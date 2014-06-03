
//data
var stage;
var mainPlayer;
var moveSpeed = 3;

//keyboard key
var KEYCODE_UP = 38;        //usefull keycode
var KEYCODE_LEFT = 37;      //usefull keycode
var KEYCODE_RIGHT = 39;     //usefull keycode
var KEYCODE_DOWN = 40;      //usefull keycode
var KEYCODE_SPACE = 32;     //usefull keycode
var KEYCODE_X = 88;
var KEYCODE_ENTER = 13;
var KEYCODE_ESC = 27;

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
var player12SpriteSheet;




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
var UIBackContainer;

var UIContainer;
var DialogDistance = 20;
var isCompositioned = false;
var police;

var panorama;
var yuan;

var positionPoints = 
[{x:990,y:1300,lat:25.044014,lng:121.51925},
 {x:1541,y:1301,lat:25.043449,lng:121.519086},
 {x:1982,y:416,lat:25.043081,lng:121.519911},
];

function interpret(x,y,points)
{
    var lng = 121.519086*((y-416)/(1501-416)) + 121.519911*((1501-y)/(1501-416))
    var lat = 25.043449*((x-990)/(1541-990)) + 25.044014*((1541-x)/(1541-990));

    return {x:lat,y:lng};
}

function initGame(){

yuan = new google.maps.LatLng(25.044014,121.51925);

var panoramaOptions = {
  //position: fenway,
  pov: {
    heading: 90,
    pitch: 10,
    zoom: 1
  },
   linksControl: false,
   enableCloseButton: false,
  zoomControlOptions: {
    style: google.maps.ZoomControlStyle.SMALL
  }

};
panorama = new  google.maps.StreetViewPanorama(document.getElementById("map"), panoramaOptions);
panorama.setPosition(yuan);





    //resize canvas
 canvas = document.getElementById("gameStage");
 dialogButton = $("#dialogButton");
 dialogTextInput = $("#dialogContent");

 dialogTextInput.keyup(function(e){

    if(e.keyCode == 13 && !isCompositioned )
    {
     userSayEvent();
    }
}).on('compositionstart', function(){
    isCompositioned = true;
}).on('compositionend', function(){
    isCompositioned = false;
});

 dialogButton.click(userSayEvent);


    //stage
    stage = new createjs.Stage("gameStage");
    PlayerContainer= new createjs.Container(); 
    DialogContainer= new createjs.Container(); 
    UIContainer = new createjs.Container(); 
     UIBackContainer = new createjs.Container(); 
    

TMXMapLoader.loadJSON("map.json",true,function(layer)
    {
        stage.addChild(layer['Background']);
        stage.addChild(layer['Building']);

    stage.addChild(layer['Object']);

     stage.addChild(PlayerContainer);


    stage.addChild(layer['Decorate']);
    stage.addChild(layer['Decorate2']);


    stage.addChild(DialogContainer);
   
    stage.addChild(UIBackContainer);
    stage.addChild(UIContainer);
        // console.log(layer);
        TMXMapLoader.CreateCollisionMapByLayer(['Building','Object']);

    });

    //background
    //sceneBackground = new createjs.Bitmap("map.png"); 

    //stage.addChild(sceneBackground);


    
    initPlayerSpriteSheet();
   




    //add player
    mainPlayer = new createjs.Sprite(player1SpriteSheet);
    mainPlayer.playerSprite = defaultPlayerSprite;

    
    
    //position
    mainPlayer.x = 990;
    mainPlayer.y = 1300;

    
    //animation
    mainPlayer.gotoAndPlay("up_idle");
    mainPlayer.moveDirection = 'up';


    initDialog(mainPlayer);

    initSocket();

    //init NPC
    initNPC();
    
    //sound
    //createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSound("bgm.mp3","background");   
    createjs.Sound.addEventListener("fileload", loadSoundHandler);
    
    //register key functions
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;






  TopDialogBackground  = new createjs.Shape();
  TopDialogBackground.color = "#FFFFFF";
  TopDialogBackground.alpha = 0.7;
  TopDialogBackground.graphics.clear().beginFill("black").drawRoundRect(20,310,760,180,10);
  TopDialogBackground.alpha = 0;


  OptionBackground= new createjs.Shape();
  OptionBackground.color = "#FFFFFF";
  OptionBackground.graphics.clear().beginFill("black").drawRoundRect(220,110,560,180,10);
  OptionBackground.alpha = 0;
  UIContainer.addChild(OptionBackground);


  OptionSelected = new createjs.Shape();
  OptionSelected.color = "#FFFFFF";
  OptionSelected.alpha = 0
  OptionSelected.graphics.clear().beginFill("rgb(246,236,144)").drawRoundRect(0,0,520,40,10);

  UIContainer.addChild(OptionSelected);

 OptionTextArray =[];
for(var i=0;i<4;i++)
{
    console.log("?");
  var  optionText = new createjs.Text("Hello World", "24px Arial", "#ff7700");
  optionText.textAlign = "left";
  optionText.textBaseline = "top";
  optionText.text = "選項"+(i+1) ;
  optionText.color = "#FFFFFF";
  optionText.x = 250;
  optionText.y = 127+i*40;
  optionText.alpha = 0;

 
  OptionTextArray.push(optionText);


  UIContainer.addChild(optionText);
}


OptionSelected.x =OptionTextArray[0].x - 7;
OptionSelected.y =OptionTextArray[0].y - 7;

  TopDialogText = new createjs.Text("Hello World", "30px Arial", "#ff7700");
  TopDialogText.textAlign = "left";
  TopDialogText.textBaseline = "top";
  TopDialogText.text = "是超越憲法的男人。" ;
  TopDialogText.color = "#FFFFFF";
  TopDialogText.x = 270;
  TopDialogText.y = 330;
  TopDialogText.alpha = 0;

  EnterHint = new createjs.Bitmap("enter.png"); 
  EnterHint.scaleX=1;
  EnterHint.scaleY=1;
  EnterHint.x = 370;
  EnterHint.y = 150;
  EnterHint.alpha = 0;


 

   UIContainer.addChild(EnterHint);
   UIContainer.addChild(TopDialogBackground);
   UIContainer.addChild(TopDialogText);


$.getJSON("NPCS.json", function(json)
{


for(var key in json)
{
    var data = json[key];
    initNPCByData(data);
}
    
    PlayerContainer.addChild(mainPlayer);


});


    updateCamera();
    //ticker
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);       
}   

var showDialog = false;

var TopDialogBackground;



var OptionBackground;
var OptionSelected;
var OptionTextArray;
var OptionCount;
var OptionIndex;

var TopDialogText;
var EnterHint;

var TalkCheck = [];


var isOption = false;

function showOption()
{
    OptionCount = EnterEvent.NPCData.option.length;
    if(OptionCount<=0)return;

    isOption = true;
    OptionIndex = 0;

    OptionSelected.x = OptionTextArray[0].x-7;
    OptionSelected.y = OptionTextArray[0].y-7;

    createjs.Tween.get(OptionBackground,{loop:false}).wait(1000).to({alpha:0.5},300,createjs.Ease.quadInOut);

    for(var i =0; i<OptionCount;i++)
    {

       OptionTextArray[i].text=EnterEvent.NPCData.option[i].talk;
       createjs.Tween.get(OptionTextArray[i],{loop:false}).wait(1000+200*i).to({alpha:1},300,createjs.Ease.quadInOut);
    }

    createjs.Tween.get(OptionSelected,{loop:false}).wait(1000).to({alpha:0.7},300,createjs.Ease.quadInOut);
}

function closeOption(choose)
{
    OptionCount = EnterEvent.NPCData.option.length;

    isOption = false;

    createjs.Tween.get(OptionBackground,{loop:false}).wait(200).to({alpha:0},300,createjs.Ease.quadInOut);

    for(var i =0; i<OptionCount;i++)
    {
         createjs.Tween.get(OptionTextArray[i],{loop:false}).to({alpha:0},300,createjs.Ease.quadInOut);
    }

    createjs.Tween.get(OptionSelected,{loop:false}).wait(200).to({alpha:0},300,createjs.Ease.quadInOut);


if(choose)
{
    createjs.Tween.get(TopDialogText).to({alpha:0}, 200).call(handleComplete);

    function handleComplete() {
        //Tween complete
        TopDialogText.text = EnterEvent.NPCData.option[OptionIndex].response;
        createjs.Tween.get(TopDialogText).to({alpha:1}, 200);
        
    }
}



}

function changeOption(nextOrPrevious)
{
    console.log(nextOrPrevious);
    if(nextOrPrevious)
    {
        OptionIndex=(OptionIndex+1)%OptionCount;
    }
    else
    {
        OptionIndex=(OptionIndex-1)%OptionCount;
        if(OptionIndex<0)OptionIndex+=OptionCount;
    }

    createjs.Tween.get(OptionSelected,{loop:false}).to({x:OptionTextArray[OptionIndex].x-7,y:OptionTextArray[OptionIndex].y-7},100,createjs.Ease.quadInOut);
}

function initNPCByData(data)
{

     var avator;
     var bigPic;
        if(data.visible)
        {
        data.SpriteSheet = new createjs.SpriteSheet(data.animation);
 
        bigPic = new createjs.Bitmap(data.pic); 
        bigPic.scaleX=1;
        bigPic.scaleY=1;
        bigPic.x = data.picX;
        bigPic.y = data.picY;
        bigPic.alpha = 0;

        data.bigPic = bigPic;

        avator = new createjs.Sprite(data.SpriteSheet);
        avator.x = data.x;
        avator.y = data.y;
        avator.scaleX = 1;
        avator.scaleY = 1;
        avator.gotoAndPlay("down_idle");
        avator.NPCData = data;


        PlayerContainer.addChild(avator);

        }
        else
        {

 
        bigPic = new createjs.Bitmap(data.pic); 
        bigPic.scaleX=1;
        bigPic.scaleY=1;
        bigPic.x = data.picX;
        bigPic.y = data.picY;
        bigPic.alpha = 0;

        data.bigPic = bigPic;

        avator = {};
        avator.x = data.x;
        avator.y = data.y;
        avator.scaleX = 1;
        avator.scaleY = 1;
        avator.NPCData = data;   
        }

        if(data.back)
        {
            UIBackContainer.addChild(bigPic);
        }
        else
        {
        UIContainer.addChild(bigPic);
         }   

         bigPic.scaleX = data.scale;
          bigPic.scaleY = data.scale;

        TalkCheck.push(avator);
}

function userSayEvent()
{
    //if(dialogTextInput.val()=="")return;

    mainPlayer.dialog.text.text = dialogTextInput.val()+" ";

    sendDialogToServer(dialogTextInput.val()+" ");

    dialogTextInput.val("");

    updateTargetPlayerDialog(mainPlayer);
}

function switchDialog(target)
{
    if(!showDialog)
    {
        
        if(EnterEvent.NPCData.back)
        {
            TopDialogText.x = 40;
            TopDialogText.y = 330;
        }
        else
        {
            TopDialogText.x = 270;
            TopDialogText.y = 330;
        }

        createjs.Tween.get(EnterEvent.NPCData.bigPic,{loop:false}).to({alpha:1},300,createjs.Ease.quadInOut);
        createjs.Tween.get(TopDialogBackground,{loop:false}).to({alpha:0.7},700,createjs.Ease.quadInOut);
        TopDialogText.text = EnterEvent.NPCData.dialogText;
        createjs.Tween.get(TopDialogText,{loop:false}).to({alpha:1},700,createjs.Ease.quadInOut);
        showOption();
    }
    else
    {
    
       createjs.Tween.get(EnterEvent.NPCData.bigPic,{loop:false}).to({alpha:0},300,createjs.Ease.quadInOut);
       createjs.Tween.get(TopDialogBackground,{loop:false}).to({alpha:0},700,createjs.Ease.quadInOut);
       createjs.Tween.get(TopDialogText,{loop:false}).to({alpha:0},700,createjs.Ease.quadInOut);
       
    }

    showDialog = !showDialog;
}


function initPlayerSpriteSheet()
{
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

    player12SpriteSheet = new createjs.SpriteSheet({
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
            "images": ["player12.png"],
            "frames":
                {
                    "height": 32,
                    "width":32,
                    "regX": 16,
                    "regY": 16,
                    "count": 12
                }
    });
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
  DialogContainer.addChild(TextBackground);
  DialogContainer.addChild(dialogText);
  
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
    var bgWidth = TMXMapLoader.width;//sceneBackground.image.width;
    var bgHeight =  TMXMapLoader.height;//sceneBackground.image.height;

    if(stage.x>0)stage.x = 0;
    if(stage.y>0)stage.y = 0;
    if(stage.x<-(bgWidth-canvas.width))stage.x = -(bgWidth-canvas.width);
    if(stage.y<-(bgHeight-canvas.height))stage. y= -(bgHeight-canvas.height);

    UIBackContainer.x = UIContainer.x = - stage.x;
    UIBackContainer.y = UIContainer.y = - stage.y;
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
    PlayerContainer.addChild(catNpc);
    //animation
    //createjs.Tween.get(catNpc,{loop:true}).to({y:enemy.y+20},700,createjs.Ease.quadInOut).to({y:enemy.y}, 700, createjs.Ease.quadInOut);

    npcList.push(catNpc);
}

//add shoes 
function addItemShoes(player){
    //shoes
    var shoesSpriteSheet = new createjs.SpriteSheet(
        {
            frames:{
                regX:128, regY:128,
                count:1,
                width:256, height:256
            }, images:["shoe.png"]
        }
    );
    
    //add shoes
    var shoesItem = new createjs.Sprite(shoesSpriteSheet);
    shoesItem.x = player.x;
    shoesItem.y = player.y;
    shoesItem.scaleX = 0.08;
    shoesItem.scaleY = 0.08;
    PlayerContainer.addChild(shoesItem);
    
    //throw animation
    var throwX = shoesItem.x;
    var throwY = shoesItem.y;
    //check direction
    var shoesOffset = 15;
    var throwDistance = 60+Math.random()*10;
    var throwDistanceXY = Math.random()*10;
    var throwRotation = 180+Math.random()*180;

    switch(player.moveDirection){
        case 'up':
            shoesItem.y -= (shoesOffset+5);
            throwY -= throwDistance;
            break;
        case 'down':
            shoesItem.y += shoesOffset;
            throwY += throwDistance;
            break;
        case 'right':
            shoesItem.x += shoesOffset;
            throwX += throwDistance;
            throwY -= throwDistanceXY;
            break;
        case 'left':
            shoesItem.x -= (shoesOffset+5);
            throwX -= throwDistance;
            throwY -= throwDistanceXY;
            break;
        default:
            shoesItem.y += shoesOffset;
            throwY += throwDistance;
            break;
    }

    //tween
    createjs.Tween.get(shoesItem,{loop:false}).to({x:throwX,y:throwY,rotation:throwRotation},500,createjs.Ease.quadInOut).call(function(){PlayerContainer.removeChild(this);});

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


//console.log(createjs.Ticker.getFPS());

    isMove = moveUp || moveDown || moveLeft || moveRight;

    //reset
    needSync = false;
    //if moving
    if(isMove) needSync = true;

    //move and set animation
    if(moveUp === true){
        if(mainPlayer.currentAnimation != "up_walk") mainPlayer.gotoAndPlay("up_walk");

        if(!TMXMapLoader.IsBlockWithOffset(mainPlayer.x,mainPlayer.y-moveSpeed,10,0))
        {
        mainPlayer.y -= moveSpeed;
        }

        mainPlayer.moveDirection = 'up';
    }
    else if(moveDown === true){
        if(mainPlayer.currentAnimation != "down_walk") mainPlayer.gotoAndPlay("down_walk");

        if(!TMXMapLoader.IsBlockWithOffset(mainPlayer.x,mainPlayer.y+moveSpeed+16,10,0))
        {
        mainPlayer.y += moveSpeed;
        }

        mainPlayer.moveDirection = 'down';
    }
    else if(moveLeft === true){
        if(mainPlayer.currentAnimation != "left_walk") mainPlayer.gotoAndPlay("left_walk");

        if(!(TMXMapLoader.IsBlock(mainPlayer.x-moveSpeed-14,mainPlayer.y)||TMXMapLoader.IsBlock(mainPlayer.x-moveSpeed-14,mainPlayer.y+16)))
        {
        mainPlayer.x -= moveSpeed;
        }

        mainPlayer.moveDirection = 'left';
    }
    else if(moveRight === true){
        if(mainPlayer.currentAnimation != "right_walk") mainPlayer.gotoAndPlay("right_walk");

         if(!(TMXMapLoader.IsBlock(mainPlayer.x+moveSpeed+10,mainPlayer.y)||TMXMapLoader.IsBlock(mainPlayer.x+moveSpeed+10,mainPlayer.y+16)))
        {
        mainPlayer.x += moveSpeed;
        }

        mainPlayer.moveDirection = 'right';
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

if(MapUpdateCoolDown>0)MapUpdateCoolDown--;

    //send to server
    if(needSync)
        { 

    var newView = interpret(mainPlayer.x,mainPlayer.y,positionPoints);
    
if(MapUpdateCoolDown<=0)
{
    MapUpdateCoolDown = 30;
    panorama.setPosition(new google.maps.LatLng(newView.x,newView.y));
}

            sendPlayerStateToServer();
        }


//show dialog


for(var key in TalkCheck)
{
    var talk = TalkCheck[key];

    var distance =getDistance(talk,mainPlayer);

   if(distance<DialogDistance&&!showEnter&&!showDialog)
   {
        showEnter = true;
        EnterEvent = talk;
        recheck();
   }

}


if(EnterEvent!=null)
{
    var distance =getDistance(EnterEvent,mainPlayer);
    if(distance>=DialogDistance&&showEnter)
   {
        showEnter = false;
   }
}

 

    //update
    updateCamera();
    updateTargetPlayerDialog(mainPlayer);
    stage.update(); 
}   

 var showEnter = false;
 var EnterEvent;
 var MapUpdateCoolDown = 0;

  function recheck() 
  {
            if(showEnter)
                createjs.Tween.get(EnterHint).to({alpha:1}, 500).to({alpha:0}, 500).call(recheck);

  }  

var backgroundSound;

function loadSoundHandler(event){
    backgroundSound = createjs.Sound.play("background",{loop:true});
    backgroundSound.volume = 1;
}

function handleKeyDown(event){

     if(dialogTextInput.is(":focus"))
        {
            return;
        }

        if(isOption)
        {
             switch(event.keyCode)
             {


            case KEYCODE_UP:
                changeOption(false);

                break;
            case KEYCODE_DOWN:
            changeOption(true);

                break;
            case KEYCODE_LEFT:
            changeOption(false);

                break;
            case KEYCODE_RIGHT:
            changeOption(true);

                break;
            case KEYCODE_SPACE:
            case KEYCODE_ENTER:
                 break;

            }
        }

    if(!showDialog)
    {
    switch(event.keyCode){
/*
        case KEYCODE_X:

            switchDialog();
       
            break;*/

        case KEYCODE_UP:
            moveUp = true
            panorama.setPov({
    heading: 90,
    zoom:1,
    pitch:0}
  );
            break;
        case KEYCODE_DOWN:
            moveDown = true;
            panorama.setPov({
    heading: 270,
    zoom:1,
    pitch:0}
  );
            break;
        case KEYCODE_LEFT:
            moveLeft = true;
            panorama.setPov({
    heading: 0,
    zoom:1,
    pitch:0}
  );
            break;
        case KEYCODE_RIGHT:
            moveRight = true;
            panorama.setPov({
    heading: 180,
    zoom:1,
    pitch:0}
  );
            break;
        case KEYCODE_SPACE:
            addItemShoes(mainPlayer);
            //send to server
            sendPlayerInstructionToServer('keySpace');
            break;
    }
    }
}

function handleKeyUp(event){

    
     if(dialogTextInput.is(":focus"))
        {
            return;
        }
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
        case KEYCODE_ENTER:
        case KEYCODE_SPACE:
            if(showEnter)
            {
                switchDialog();
                showEnter = false;
            }
            else if(isOption&&OptionTextArray[OptionCount-1].alpha>=0.9)
            {
                closeOption(true);
            }
            else if(showDialog&&!isOption)
            {
                 switchDialog(); 
            }

            break;
        case KEYCODE_ESC:
            if(showDialog)
            {
                switchDialog(); 
            }

            if(isOption)
            {
                closeOption(false);
            }
    }
}

//add new player
function addNewPlayer(id,x,y){

    //create new player
    var player = new createjs.Sprite(player1SpriteSheet);
    player.playerSprite = defaultPlayerSprite;

    PlayerContainer.addChild(player);
    

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
    var dialogText = player.dialog.text;
    var TextBackground = player.dialog.background;
        
        PlayerContainer.removeChild(player);

        DialogContainer.removeChild(dialogText);
        DialogContainer.removeChild(TextBackground);
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
       player.moveDirection = stateData.moveDirection;
       if(player.currentAnimation != stateData.animation) player.gotoAndPlay(stateData.animation);

       //import! need update
        stage.update();

        updateTargetPlayerDialog(player);

    }
}

//update player state

function otherPlayerSendInstruction(id,stateData){

    //add to list
    var player = playersList[id];

    //if don't hve player , need create
    if(!player){
        addNewPlayer(id,stateData.x,stateData.y);
        player = playersList[id];
    }

    if(stateData)
    {
        //console.log(stateData.instruction);
        if(stateData.instruction == 'keySpace'){
            addItemShoes(player);
        }
        //import! need update
        stage.update();

        updateTargetPlayerDialog(player);

    }
}

//init socket
function initSocket(){
    //socket = io.connect('http://localhost');

    var url = document.URL;
    var split = url.split(':')[1];
    console.log('url:'+split);
    socket = io.connect('http:'+split);
    
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

    socket.on('otherClientSendInstruction',function(data){
        //console.log(data);
        otherPlayerSendInstruction(data.id,data.state);
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
        moveDirection : mainPlayer.moveDirection,
        animation : mainPlayer.currentAnimation
    };

    if(socket) socket.emit('clientStateChange', playerData);
}

//send to server
function sendPlayerInstructionToServer(instruction){
    var playerData = {
        'instruction':instruction
    };

    if(socket) socket.emit('clientSendInstruction', playerData);
}


function getDistance(object1,object2)
{
    var distX = object1.x - object2.x;
    var distY = object1.y - object2.y;

    var distX2 = distX*distX;
    var distY2 = distY*distY;

    var dist2 = distX2+distY2;

    var result = Math.sqrt(dist2);

    return result;
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
        case 12:
            newSprite = player12SpriteSheet;
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
    PlayerContainer.removeChild(player);

    //add player
    player = new createjs.Sprite(newSprite);
    player.playerSprite = parseInt(playerSpriteId);
    player.dialog = tempDialog;

    //animation
    //player.gotoAndPlay("down_idle");

    PlayerContainer.addChild(player);
    
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
        //console.log('spriteId:'+playerSpriteId +' id:'+id);
        playersList[id] = player;
    }

    //update
    stage.update(); 
}

