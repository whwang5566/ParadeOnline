
var TMXMapLoader = {};

TMXMapLoader.Layers ={};

TMXMapLoader.loadJSON = function(filePath,callbackFunction)
{

//TMXMapLoader.callbackFunction =callbackFunction;
$.getJSON(filePath, function(json)
{
	TMXMapLoader.width = json.width * json.tilewidth;
	TMXMapLoader.height = json.height * json.tileheight;
	TMXMapLoader.tileWidth = json.tilewidth;
	TMXMapLoader.tileHeight = json.tileheight;

    TMXMapLoader.origin = json;
    TMXMapLoader.SpriteSheets = [];
 	var tilesets = json.tilesets;

	for(var key in tilesets)
	{ 
			var currentSet = tilesets[key];
			console.log(currentSet.name);

			var sizeX = currentSet.imagewidth/currentSet.tilewidth;
			var sizeY = currentSet.imageheight/currentSet.tileheight;
			var size = sizeX*sizeY;
			var name = currentSet.name+".png";

			TMXMapLoader.SpriteSheets.push(

			new createjs.SpriteSheet({
		            "images": [name],
		            "frames":
		                {
		                    "height": currentSet.tileheight,
		                    "width":currentSet.tilewidth,
		                    "count": size
		                }
		    })
		);
	}


	var layers = json.layers;

	//var container =  TMXMapLoader.InitLayer(layers[0]);

	//callbackFunction(layers);


for(var key in layers)
{
	var currentLayer = layers[key];
	TMXMapLoader.Layers[currentLayer.name] = TMXMapLoader.InitLayer(layers[key],true);
	
}

callbackFunction(TMXMapLoader.Layers);
//
	//console.log(TMXMapLoader.IndexRemap(3));
	//console.log(TMXMapLoader.IndexRemap(962));
	//console.log(TMXMapLoader.IndexRemap(9089));
	//console.log(TMXMapLoader.IndexRemap(0));

});
}


TMXMapLoader.InitLayer = function(layer,isPrerender)
{
	var container = new createjs.Container();

	if(isPrerender)
	{
		var prerenderPic = new createjs.Bitmap(layer.name+".png"); 
		
		container.addChild(prerenderPic);
		return container;
	}
	else
	{

	var width = layer.width;
	var height = layer.height;
	var tileWidth = TMXMapLoader.tileWidth;
	var tileHeight = TMXMapLoader.tileHeight;

	var data = layer.data;
	


	for (var i = 0; i < data.length; i++) {
		var originIndex = data[i];

		var remapIndex = TMXMapLoader.IndexRemap(originIndex);

		if(remapIndex.spriteSheetIndex == -1)continue;

		var indexX = i%width;
		var indexY = (i-indexX)/width;
		var positionX = indexX * tileWidth;
		var positionY = indexY * tileHeight;

		var cellBitmap = new createjs.Sprite(TMXMapLoader.SpriteSheets[remapIndex.spriteSheetIndex]);
		cellBitmap.gotoAndStop(remapIndex.index);

		cellBitmap.x = positionX;
		cellBitmap.y = positionY;
		container.addChild(cellBitmap);
	}
	return container;
	}
}


TMXMapLoader.IndexRemap = function(index)
{
	var result = {};

	if(index==0)
	{
		result.spriteSheetIndex=-1;
		result.index = -1;
		return result;
	}

	var tilesets = TMXMapLoader.origin.tilesets;

	for(var key in tilesets)
	{ 

		if(index<tilesets[key].firstgid)
		{
			result.spriteSheetIndex = key-1;
			result.index = index-tilesets[key-1].firstgid;

			return result;
		}
	}

	result.spriteSheetIndex = tilesets.length-1;
	result.index = index-tilesets[tilesets.length-1].firstgid;

	return result;
}
