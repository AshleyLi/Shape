
    function load() {
        document.body.querySelector('#content').removeAttribute('hidden');
        document.body.querySelector('.overlay').style.display = "none";
    }

    function loading() {
        document.body.querySelector('#content').setAttribute('hidden', true);
        document.body.querySelector('.overlay').style.display = "flex";
    }

    (function (document) {
        'use strict';

        // FIXME hack to make pepjs working
        // See https://github.com/Polymer/polymer/issues/1381
        window.addEventListener('WebComponentsReady', function () {
            document.querySelector('body').removeAttribute('unresolved');

            // Initialize dynamically the WebComponent
            var shapeInput = document.getElementById('shape-input');
            shapeInput.host = configuration.host;
            shapeInput.ssl = configuration.ssl;
            shapeInput.applicationkey = configuration.shape.applicationKey;
            shapeInput.hmackey = configuration.shape.hmacKey;
            shapeInput.shapeparameters = new MyScript.ShapeParameter({
                doBeautification: true,
                rejectDetectionSensitivity: 0
            });

            // Small piece of code to hide the write here message
            shapeInput.addEventListener('pointerdown', function () {
                var writeHere = document.querySelector('.write-here');
                if (writeHere) {
                    writeHere.remove();
                }
            });
        });
    })(document);
