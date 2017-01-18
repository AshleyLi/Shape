

$( document ).ready(function() {

  //1. Show and close popview type list
  $( ".js_funcPop" ).mouseover(function() {
      // show a popview type list
      $('.js_popviewType').css({
        "opacity": 1 ,
        "width": 300,
        "height": 300,
        "overflow": "hidden",
        "display": "block",
        "left": 45,
        "top": -6
      });
    })
    // close popview type list
    $( ".js_popviewType" ).mouseleave(function() {
        $('.js_popviewType').css({"display": "none"});
    });

  // 2. Get the selected popview type.
  // 3. Open the popview.
  // 4. Bring the myScript canvas to top.
  // 5. Recognizing a strok and convert to a real element.
  // 6. Add a element to popview.
  // 7. Add a layer controler to open created popviews.




// end of this file
});


$(document).on("click",".js_funcPop",function(){

  // show the popview background
  // $(".popview").css({
  //   "display" : "initial",
  //   "width":MCScreenW+ "px",
  //   "height": MCScreenH + 2 +"px",
  //   "left": $(window).width()/2 - MCScreenW/2+"px",
  //   "top": $(".ooo-section").height()/2 - MCScreenH/2 -2 +"px"});

    // Recognizing the popview type ====================================================

    // switch (shapeName) {
    //   case 'rectangle':
    //     ARectangle();
    //     break;
    //   case 'square':
    //     ARectangle();
    //     break;
    //   case 'line':
    //     ALine();
    //     break;
    //   default:
    //     removeWrongShape();
    //
    // }
});
