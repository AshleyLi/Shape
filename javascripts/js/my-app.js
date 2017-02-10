// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
//
// // Callbacks to run specific code for specific pages, for example for About page:
// myApp.onPageInit('about', function (page) {
//     // run createContentPage func after link was clicked
//     $$('.create-page').on('click', function () {
//         createContentPage();
//     });
// });
//
// // Generate dynamic page
// var dynamicPageIndex = 0;
// function createContentPage() {
// 	mainView.router.loadContent(
//         '<!-- Top Navbar-->' +
//         '<div class="navbar">' +
//         '  <div class="navbar-inner">' +
//         '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
//         '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
//         '  </div>' +
//         '</div>' +
//         '<div class="pages">' +
//         '  <!-- Page, data-page contains page name-->' +
//         '  <div data-page="dynamic-pages" class="page">' +
//         '    <!-- Scrollable page content-->' +
//         '    <div class="page-content">' +
//         '      <div class="content-block">' +
//         '        <div class="content-block-inner">' +
//         '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
//         '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
//         '        </div>' +
//         '      </div>' +
//         '    </div>' +
//         '  </div>' +
//         '</div>'
//     );
// 	return;
// }

// add picker
var pickerCustomToolbar = myApp.picker({
    input: '#picker-custom-toolbar',
    rotateEffect: true,
    toolbarTemplate:
        '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
                '<div class="left">' +
                    '<a href="#" class="link toolbar-randomize-link">Randomize</a>' +
                '</div>' +
                '<div class="right">' +
                    '<a href="#" class="link close-picker">OK</a>' +
                '</div>' +
            '</div>' +
        '</div>',
    cols: [
        {
            values: ['Mr', 'Ms'],
        },
        {
            textAlign: 'left',
            values: ('Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot').split(' ')
        },
        {
            values: ('Man Luthor Woman Boy Girl Person Cutie Babe Raccoon').split(' ')
        },
    ],
    onOpen: function (picker) {
        picker.container.find('.toolbar-randomize-link').on('click', function () {
            var col0Values = picker.cols[0].values;
            var col0Random = col0Values[Math.floor(Math.random() * col0Values.length)];

            var col1Values = picker.cols[1].values;
            var col1Random = col1Values[Math.floor(Math.random() * col1Values.length)];

            var col2Values = picker.cols[2].values;
            var col2Random = col2Values[Math.floor(Math.random() * col2Values.length)];

            picker.setValue([col0Random, col1Random, col2Random]);
        });
    }
});
