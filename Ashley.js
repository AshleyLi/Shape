var mobileCanvasW = 280;
var mobileCanvasH = Math.floor(mobileCanvasW * 2.357);
var MCScreenW = Math.floor(mobileCanvasW * 0.8714);
var MCScreenH = Math.floor(MCScreenW * 1.7704);
var shapeName;
var screenH ;
var unitH ;
var segmentsLength;
var shapeQty;
var pointsX = []; // all x points of any kind of shape
var pointsY = []; // all y points of any kind of shape
var rectW ;
var rectH ;

var suggestedlist = "none";
var idPadding = 5; // a value of identification labels
var idtagX;
var idtagY;

var correctness = 0;

var errorQty  = 0 ;
var componentP = [5,4,3,2,1];
var totalScore = 0;
var popSuggestionsX ;
var popSuggestionsY ;
var xkId;




// Basic settings =============================================================================

$( document ).ready(function() {
  screenH = MCScreenH;
  unitH = screenH/10;

  // console.log("$( window ).width() = " + $( window ).width());
  // console.log("MCScreenW = " +MCScreenW+ "，MCScreenH＝" + MCScreenH);
  // $(".testing").css({"display" : "initial","width":MCScreenW+ "px","height": MCScreenH + "px","left": $( window ).width()/2 - MCScreenW/2+"px", "bottom":mobileCanvasH*0.13+"px"});
});

// Get shape =============================================================================
window.Ashley = {
  responseCallback : function (responseObject){

    // Print shape object ===============DON'T TOUCH!!===============
    console.log(responseObject)

    // Get the length of shape segments[]
    segmentsLength = responseObject.result.segments.length - 1 ;
    shapeQty = responseObject.result.segments.length;

    // Print basic shape information
    shapeName = responseObject.result.segments[segmentsLength].candidates[0].label;


    $(".js_shapeName").text(shapeName);
    $(".js_ShapeQty").text(shapeQty);


    // Recognizing the shape====================================================
    switch (shapeName) {
      case 'rectangle':
        ARectangle();
        break;

      case 'line':
        ALine();
        break;

      default:

    }


    // Rectangle ===============================================================
    function ARectangle() {
      // rectangle:  Get shape posX and posY array
      for ( i = 0 ; i < 4; i++){
          var pointX = Math.floor(responseObject.result.segments[segmentsLength].candidates[0].primitives[i].firstPoint.x);
          var pointY = Math.floor(responseObject.result.segments[segmentsLength].candidates[0].primitives[i].firstPoint.y);
          pointsX[i] = pointX;
          pointsY[i] = pointY;
      }
      // remove tha same value from PosX & PosY array
      pointsX = pointsX.filter(function(element, index, arr){
        return arr.indexOf(element)=== index;
      });
      pointsY = pointsY.filter(function(element, index, arr){
        return arr.indexOf(element)=== index;
      });
      // Sort PosX[] & PosY[]
      pointsX.sort(function (a, b) {return a - b});
      pointsY.sort(function (a, b) {return a - b});
      // rectangle: Get shape size for rectangle
      rectW = pointsX[1]-pointsX[0] ;
      rectH = pointsY[1]-pointsY[0] ;

      showRectSuggestions();
      function showRectSuggestions(){
        if(rectW >= rectH){
          if(rectH > unitH){
            // add an image & set a current elementID
            // └→ here
            $('.js_wildRectB').css({"display" : "initial"});
          } else {
            // add a button & set a current elementID
            // └→ here
            $('.js_wildRectS').css({"display" : "initial"});
          }
        }else {
          if(rectH > unitH){
            // add an image & set a current elementID
            // └→ here
            $('.js_tallRectB').css({"display" : "initial"});
          } else {
            // add an image & set a current elementID
            // └→ here
            $('.js_tallRectS').css({"display" : "initial"});
          }
        }
      }

      // reture & set suggestions pop positionX,Y
      popSuggestionsX = pointsX[1] + 10
      popSuggestionsY = pointsY[1] - $(".js_suggestions").height()/2 - rectH/2;
      $(".js_suggestions").css({"display":"initial","left": popSuggestionsX + "px","top": popSuggestionsY + "px"});

      //show information
      $(".js_shapeW").text(rectW);
      $(".js_shapeH").text(rectH);

      idtagX = pointsX[0];
      idtagY = pointsY[0];
      console.log("pointsX[] ＝"+ pointsX);
    }


    // Line ====================================================================
    function ALine() {
      // Get PosX[] & PosY[]
      pointsX[0] = Math.floor(responseObject.result.segments[segmentsLength].candidates[0].primitives[0].firstPoint.x);
      pointsY[0] = Math.floor(responseObject.result.segments[segmentsLength].candidates[0].primitives[0].firstPoint.y);
      pointsX[1] = Math.floor(responseObject.result.segments[segmentsLength].candidates[0].primitives[0].lastPoint.x);
      pointsY[1] = Math.floor(responseObject.result.segments[segmentsLength].candidates[0].primitives[0].lastPoint.y);
      // Sort PosX[] & PosY[]
      pointsX.sort(function (a, b) {return a - b});
      pointsY.sort(function (a, b) {return a - b});

      // Get line width
      function getLineWidth(){
        var calX = pointsX[1]-pointsX[0];
        var calY = pointsY[1]-pointsY[0];
        var width = Math.floor( Math.pow((calX *calX + calY * calY), 0.5));
        console.log("width = " + width);
        return width;
      }
      var lineW = getLineWidth();
      var lineH = 1 ;

      // open & set suggestions pop positionX,Y
      $('.js_line').css({"display" : "initial"});
      $(".js_suggestions").css({"display":"initial","left": pointsX[1]+10 + "px","top": pointsY[0]-$(".js_suggestions").height()/2 + "px"});
      // show the shape basic information
      $(".js_shapeW").text(lineW);
      $(".js_shapeH").text(lineH);

    }



    $(".js_pointsX").text(pointsX);
    $(".js_pointsY").text(pointsY);


  },
  requestCallback : function (requestObject){
    console.log(requestObject)
  }
}


//====================== AFTER CONFIRM =========================================
$(document).on("click",".js_confirmType",function(){
    $(".js_showCount").css({"display":"initial"});
    xkId = Date.now();

    // Get the current elementID and remove it and add a new selected element
    var elementType = $( "input:checked" ).val();
    switch (elementType) {
        case 'Image':
          addImage();
          break;
        case 'Button':
          addButton();
          break;
        case 'Shape':
          addShape();
          break;
        case 'TextView':
          addTextView();
          break;
        case 'TextField':
          addTextField();
          break;

      default:

    }

    function addImage(){
      $(".identification").append("<img src='https://goo.gl/hSqM8y' xkId="+ xkId + "style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
    }
    function addButton(){

    }
    function addShape(){

    }
    function addTextView(){

    }
    function addTextField(){

    }


    //Add a identification label to the shape===================================
    idtagX = pointsX[0];
    idtagY = pointsY[0] - idPadding*2 -12;
    $(".identification").append("<span style='left:" + idtagX + "px;top:"+ idtagY +"px;'>" + $( "input:checked" ).val() + "</span>");
    idtagX = 0;
    idtagY = 0;


    // close suggestions
    $('.popover-content > div').css({"display" : "none"});
    $('.js_suggestions').css({"display":"none"});


    // check the index of the checked checkbox
    var indexP = parseInt($( "input:checked" ).attr("indexP"));
    $(".score").append( "<li>#" + shapeQty + " —— " + indexP + "p</li>" )

    // Clear checked attr
    $("input:checked").prop( "checked", false );

    // Count points
    correctness += indexP ;
    $(".js_correctness").text(correctness);
    $(".js_totalScore").text(shapeQty*5);
    var percentage = Math.floor(correctness /(shapeQty*5)*100) ;
    $(".js_percentage").text(percentage + "%");

});
