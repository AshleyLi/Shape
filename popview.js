

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
    $(".popview > div.modal.modal-in").css( "display", "none" );
    selectedType = $(this).children("img").attr("alt");
    console.log("popEditor = open, " + "you choosed [" + selectedType+ "]");
    // 2-2. Open the popview.

    openPopview();

    // 3. Open the popview. +
    // 4. Bring the myScript canvas to top.
    function openPopview(){
      $(".write-here").css("display","none");
      $(".popview > div").css("display","none");
      $(".popview").css({
        "display" : "initial",
        "width":MCScreenW+ "px",
        "height": MCScreenH + 2 +"px",
        "left": $(window).width()/2 - MCScreenW/2+"px",
        "top": $(".ooo-section").height()/2 - MCScreenH/2 -2 +"px"});
      $(".closePopviewEdior").css("display","initial");

      // Bring the drawing canvas to top layer.
      $("#shape-input").css("z-index",400);

      // Set popCanvas position
      if(selectedType == "Alert"){
        $("#pop-alert").css({
          "display":"block",
          "left": $(".popview").width()/2 - $("#pop-alert").width()/2 ,
          "top": $(".popview").height()/2 - $("#pop-alert").height()/2
        });
      }
      else if (selectedType == "Action sheet") {
        $("#pop-actionSheet").css({
          "display":"block",
          "top":0,
          "width":MCScreenW+ "px",
          "height": MCScreenH+"px",
        })
      }
      else if (selectedType == "Custom pop view") {
        $("#pop-customPopView").css( "width", $(".popview").width()*0.8);
        $("#pop-customPopView").css({
          "display":"block",
          "left": ($(".popview").width()- $("#pop-customPopView").width() )/2 ,
          "top": $(".popview").height()/2 - $("#pop-customPopView").height()/2
        })
      }
      else {
        // Picker
        $("#pop-picker").css({
          "display":"block",
          "height": MCScreenH
        })
      }

    }

  });

  // 5. Recognizing a strok and convert to a real element.
  // see the Ashley.js Popview editor



  // 6. Add a element to popview.
  // 7-1. Close the popview editor.


  // 7-2. Add a layer controler to open created popviews.
  $(".closePopviewEdior").mousedown(function() {
    $(".popview").css("display","none");
    $(this).css("display","none");
    popEditor = false;
  });

  // Reset the position of CustomPopview



// end of this file
});
