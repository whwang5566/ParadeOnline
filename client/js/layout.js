
// var tmpl = '<li><input type="text"><span></span></li>',

function clickMute(){

    // console.log("hihi");
    if ($("#mutePhoto").attr("src")==="mute.png")
    {
        // console.log("mute");
        $( "#mutePhoto" ).attr( "src", "unmute.png" );
        backgroundSound.setMute(false);
    }
    else
    {
        $( "#mutePhoto" ).attr( "src", "mute.png" );   
        backgroundSound.setMute(true);
    }
            
    
}

function clickChangeCharacter(){
    console.log("hihi");
}