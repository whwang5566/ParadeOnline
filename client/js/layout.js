// (function(){
var addMap = $('#addMap'),
    map = $('#map');
var temp = 0;
addMap.click(function(){
    console.log('addMap');
    if (temp %2==0)
        map.hide();
    else
        map.show();
    temp++;
    // $(inputMap).prependTo().addClass('is-editing').find('input').focus();
});


// }());


function clickMute(){

    console.log("hihi");
    if ($("#mutePhoto").attr("src")==="mute.png")
    {
        console.log("mute");
        $( "#mutePhoto" ).attr( "src", "unmute.png" );
        backgroundSound.setMute(false);
    }
    else
    {
        $( "#mutePhoto" ).attr( "src", "mute.png" );   
        backgroundSound.setMute(true);
    }
            
    
}

function clickMap(){
    console.log("clickMap");
}


function IgnoreAlpha(e)
{

        e.returnValue=false;
        e.cancel = true;
    
}

function clickChangeCharacter(){
    console.log("hihi");
}