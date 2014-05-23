
var MapRender ={};
module.exports = MapRender;
var fs = require('fs');

var Canvas = require('canvas');
var Image = Canvas.Image;


MapRender.PreRenderWithJSON = function (jsonFile,resourceDir,output) {


fs.readFile(jsonFile, 'utf8', function (err, data) {
    var map = {};
	json = JSON.parse(data);


	MapRender.width = json.width * json.tilewidth;
	MapRender.height = json.height * json.tileheight;
	MapRender.tileWidth = json.tilewidth;
	MapRender.tileHeight = json.tileheight;

    MapRender.origin = json;
    MapRender.SpriteSheets = [];

    var tilesets = json.tilesets;


	for(var key in tilesets)
	{ 
			var currentSet = tilesets[key];
			//console.log(currentSet.name);

			var sizeX = currentSet.imagewidth/currentSet.tilewidth;
			var sizeY = currentSet.imageheight/currentSet.tileheight;
			var size = sizeX*sizeY;
			var name = currentSet.name+".png";


			var squid = fs.readFileSync(resourceDir+'/'+name);


			var img = new Image;
			img.src = squid;
			MapRender.SpriteSheets.push(img);
	}

	var layers = json.layers;

	for(var key in layers)
	{
		var currentLayer = layers[key];

		MapRender.RenderLayer(output,currentLayer);
		
	}

});


  };

MapRender.RenderLayer = function(output,layer)
{
	var width = layer.width;
	var height = layer.height;
	var tileWidth = MapRender.tileWidth;
	var tileHeight = MapRender.tileHeight;

	var data = layer.data;

  	var canvas = new Canvas(width*tileWidth,height*tileHeight);
  	var ctx = canvas.getContext('2d');


for (var i = 0; i < data.length; i++) {
		var originIndex = data[i];

		var remapIndex = MapRender.IndexRemap(originIndex);

		if(remapIndex.spriteSheetIndex == -1)continue;

		var indexX = i%width;
		var indexY = (i-indexX)/width;
		var positionX = indexX * tileWidth;
		var positionY = indexY * tileHeight;


		var rec = MapRender.ResourceRectangleRemap(remapIndex);


		ctx.drawImage(MapRender.SpriteSheets[remapIndex.spriteSheetIndex], rec.x, rec.y, rec.width, rec.height, positionX, positionY, rec.width, rec.height);

	}


	var out = fs.createWriteStream(output + '/'+layer.name+'.png')
	  , stream = canvas.createPNGStream();


	  console.log(output + '/'+layer.name+'.png');

	stream.on('data', function(chunk){
	  out.write(chunk);
	});




};



MapRender.ResourceRectangleRemap = function(remapedIndex)
{


	var rectangle = {};


	var width = MapRender.origin.tilesets[remapedIndex.spriteSheetIndex].imagewidth;
	var Xcount = width/MapRender.tileWidth;

	var XIndex = remapedIndex.index%Xcount;
	var YIndex = (remapedIndex.index-XIndex)/Xcount;

	rectangle.x = XIndex*MapRender.tileWidth;
	rectangle.y = YIndex*MapRender.tileHeight;
	rectangle.width = MapRender.tileWidth;
	rectangle.height = MapRender.tileHeight;

	return rectangle;
}

MapRender.IndexRemap = function(index)
{
	var result = {};

	if(index==0)
	{
		result.spriteSheetIndex=-1;
		result.index = -1;
		return result;
	}

	var tilesets = MapRender.origin.tilesets;

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

