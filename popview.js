var popEditor = false;
var selectedType;

$( document ).ready(function() {
  //1-1. Show and close popview type list
  $( ".js_funcPop" ).mouseover(function() {
    // show a popview type list
    $(".func.js_funcPop").addClass("focus");
    $("#js_popviewType").css({
      "display": "block",
      "width" : 375,
      "height": 400
      });
  });

  // 1-2. close popview type list
  $("div#js_popviewType").mouseleave(function(){
    $(".func.js_funcPop").removeClass("focus");
    $("#js_popviewType").css( "display", "none" );
  });

  // 2-1. Get the selected popview type.
  $(".popviewTypeList > li").mousedown(function(){
    popEditor = true ;
    console.log("popEditor = " + popEditor);
    $(".popview > div.modal.modal-in").css( "display", "none" );
    selectedType = $(this).children("img").attr("alt");

    // 2-2. Open the popview.
    switch (selectedType) {
      case "Custom pop view":
        popCustomPopview();
        break;
      case "Action sheet":
        popActionSheet();
        break;
      case "Alert":
        popAlert();
        break;
      case "Picker":
        popPicker();
        break;
      default:
    }
    openPopview();

    // 3. Open the popview. +
    // 4. Bring the myScript canvas to top.
    function openPopview(){
      $(".popview").css({
        "display" : "initial",
        "width":MCScreenW+ "px",
        "height": MCScreenH + 2 +"px",
        "left": $(window).width()/2 - MCScreenW/2+"px",
        "top": $(".ooo-section").height()/2 - MCScreenH/2 -2 +"px"});
      $(".closePopviewEdior").css("display","initial");


      $("#shape-input").css("z-index",400);
    }
    function popCustomPopview(){
      $("#pop-customPopView").css("display", "block");
    }
    function popActionSheet(){
      $("#pop-actionSheet").css("display", "block");
    }
    function popAlert(){
      $("#pop-alert").css("display", "block");
      console.log("shapeName = " + shapeName);
    }
    function popPicker(){
      $("#pop-picker").css("display", "block");
    }
  });

  // 5. Recognizing a strok and convert to a real element.
  // see the Ashley.js Popview editor
  // Draw popview editor elements  ====================================================================
  function APopRectangle(){
    console.log("APopRectangle, selectedType =" + selectedType);
  }
  function APopLine(){
    console.log("APopLine, selectedType =" + selectedType);
  }


  // 6. Add a element to popview.
  // 7-1. Close the popview editor.


  // 7-2. Add a layer controler to open created popviews.
  $(".closePopviewEdior").mousedown(function() {
    $(".popview").css("display","none");
    $(this).css("display","none");
    popEditor = false;
  });



// end of this file
});
