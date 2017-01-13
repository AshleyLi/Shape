var mobileCanvasW = 280;
var mobileCanvasH = Math.floor(mobileCanvasW * 2.357);
var MCScreenW = Math.floor(mobileCanvasW * 0.8714);
var MCScreenH = Math.floor(MCScreenW * 1.7704);


var idtagX;
var idtagY;
var correctness = 0;
var shapeQty;
var errorQty  = 0 ;
var suggestedlist = "none";
var componentP = [5,4,3,2,1];
var totalScore = 0;

// Basic settings =============================================================================

$( document ).ready(function() {
  console.log("$( window ).width() = " + $( window ).width());
  console.log("MCScreenW = " +MCScreenW+ "，MCScreenH＝" + MCScreenH);
  // $(".testing").css({"display" : "initial","width":MCScreenW+ "px","height": MCScreenH + "px","left": $( window ).width()/2 - MCScreenW/2+"px", "bottom":mobileCanvasH*0.13+"px"});
});

// Get shape =============================================================================
window.Ashley = {
  responseCallback : function (responseObject){

    // Print shape object ===============DON'T TOUCH!!===============
    console.log(responseObject)

    // Get the length of shape segments[]
    var segmentsLength = responseObject.result.segments.length - 1 ;
    shapeQty = responseObject.result.segments.length;

    // Print basic shape information
    var shapeName = responseObject.result.segments[segmentsLength].candidates[0].label;
    var screenH = MCScreenH;
    var unitH = screenH/10;
    var pointsX = [];
    var pointsY = [];

    $(".js_shapeName").text(shapeName);
    $(".js_ShapeQty").text(shapeQty);

    // Get shape posX and posY array
    for ( i = 0 ; i < 4; i++){
        var pointX = Math.floor(responseObject.result.segments[segmentsLength].candidates[0].primitives[i].firstPoint.x);
        var pointY = Math.floor(responseObject.result.segments[segmentsLength].candidates[0].primitives[i].firstPoint.y);
        pointsX[i] = pointX;
        pointsY[i] = pointY;
    }

    // Sort PosX[] & PosY[]
    pointsX.sort(function (a, b) {return a - b});
    pointsY.sort(function (a, b) {return a - b});

    // remove tha same value from PosX & PosY array
    pointsX = pointsX.filter(function(element, index, arr){
      return arr.indexOf(element)=== index;
    });
    pointsY = pointsY.filter(function(element, index, arr){
      return arr.indexOf(element)=== index;
    });
    console.log('pointsY after filter = ' + pointsY);
    console.log('pointsX after filter = ' + pointsX);

    // Get shape size
    var rectW = pointsX[1]-pointsX[0] ;
    var rectH = pointsY[1]-pointsY[0] ;

    // Set component_label position X , Y
    var popSuggestionsX = pointsX[1] + 10;
    var popSuggestionsY ;

    // Recognizing the shape
    recognizing();
    function recognizing(){

      if(rectW >= rectH){
        if(rectH > unitH){
          $('.js_wildRectB').css({"display" : "initial"});
        } else {
          $('.js_wildRectS').css({"display" : "initial"});
        }
      }else {
        if(rectH > unitH){
          $('.js_tallRectB').css({"display" : "initial"});
        } else {
          $('.js_tallRectS').css({"display" : "initial"});
        }

      }
    }
    // reture & set suggestions pop positionX,Y
    popSuggestionsY = pointsY[1] - $(".js_suggestions").height()/2 - rectH/2;
    $(".js_suggestions").css({"display":"initial","left": popSuggestionsX + "px","top": popSuggestionsY + "px"});

    //show information
    $(".js_pointsX").text(pointsX);
    $(".js_pointsY").text(pointsY);
    $(".js_shapeW").text(rectW);
    $(".js_shapeH").text(rectH);
    idtagX = pointsX[0];
    idtagY = pointsY[0];
    // console.log('$(".js_suggestions").height()/2 = ' + $(".js_suggestions").height()/2 )

  },
  requestCallback : function (requestObject){
    console.log(requestObject)
  }
}


//====================== AFTER CONFIRM ==========================
$(document).on("click",".js_confirmType",function(){
    $(".js_showCount").css({"display":"initial"});

    // close suggestions
    $('.popover-content > div').css({"display" : "none"});
    $('.js_suggestions').css({"display":"none"});

    // Add a identification label to the shape
    var padding = 5;
    idtagX += padding;
    idtagY += padding -2;
    $(".identification").append("<span style='left:" + idtagX + "px;top:"+ idtagY +"px;'>" + $( "input:checked" ).val() + "</span>");
    idtagX = 0;
    idtagY = 0;


    console.log( $( "input:checked" ).val() + " is checked!" );

    // check the index of the checked checkbox
    var indexP = parseInt($( "input:checked" ).attr("indexP"));
    console.log( "indexP = " + indexP  );
    $(".score").append( "<li>#" + shapeQty + " —— " + indexP + "p</li>" )

    // clear checked attr
    $("input:checked").prop( "checked", false );

    // correctness
    correctness += indexP ;
    $(".js_correctness").text(correctness);
    $(".js_totalScore").text(shapeQty*5);
    var percentage = Math.floor(correctness /(shapeQty*5)*100) ;
    $(".js_percentage").text(percentage + "%");

});
