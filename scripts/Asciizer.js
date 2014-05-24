function Asciizer(imgObj, gridWidth) {
    "use strict";

    var canvas = $('#atelier')[0],
        context = canvas.getContext('2d'),
        CHAR_RATIO = 7 / 13,
        CHAR_W = 8,
        CHAR_H = 16,
        img = imgObj,
        gridHeight = null,
        min = Infinity,
        max = 0,
        sum = 0,
        range = null,
        step = null,
        charw = null,
        charh = null,
        chars = " .-:*+=%#@".split("").reverse().join("");

    this.image = imgObj;
    this.valueArray = [];
    this.pixelLightness = [];
    this.grid_w = gridWidth;
    this.grid_h;

    this.loadImage = function (i) {
        this.image = i || imgObj;
    }

    this.setCanvasSize = function (w, h) {
        var ratio = this.image.width / w;
        
        this.grid_w = w;
        this.grid_h = h || (this.image.height / ratio);

        canvas.width = w;
        canvas.height = this.grid_h * 2;
    }

    this.draw = function (image2draw) {
        image2draw = image2draw || this.image;
        context.drawImage(image2draw, 0, 0, canvas.width, canvas.height);
    }

    this.readCanvas = function () {
        this.valueArray = context.getImageData(0, 0, canvas.width, canvas.height).data;
    }

    this.calculate = function () {
        for (var i = 0, ii = this.valueArray.length/4; i < ii; i++) {
            var va = this.valueArray;
            this.pixelLightness.push(
                (
                    va[4*i] + va[4*i + 1] + va[4*i + 2])
                    * 
                    (256 / (va[4*i+3] + 1)
                )
            );
        }
    }
    /*this.calculate = function(w) {
        w = w || gridWidth;
        this.setGridDimensions(w);
        
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

        getValues();
        analyze();
        printValues();

        // cleanup for recalc
        min = Infinity;
        max = 0;
        sum = 0;
        range = null;
        step = null;
        valueArray = [];
    };*/
    //this.setGridDimensions(gridWidth);


    //this.calculate();

    //window.val = [charw, charh, gridWidth, gridHeight, canvas];


    function getValues() {
        valueArray = [];

        function sum_4(arr) {
            var sum = 0,
                arl = arr.length;

            for (var i = 0; i < arl; i += 4) {
                sum += arr[i];
                sum += arr[i + 1];
                sum += arr[i + 2];
            }

            return sum /* - alpha_values*/ ;
        }

        function getRectangle(coords) {

            return context.getImageData(coords[0], coords[1], charw, charh).data;
        }

        for (var i = 0; i < gridHeight; i++) {
            var line = [];

            for (var j = 0; j < gridWidth; j++) {
                var coords = [j * charw, i * charh];
                try {
                    line.push(sum_4(getRectangle(coords)));
                } catch (e) {
                    console.log(e, coords);
                }
            }
            //console.log(line);
            valueArray.push(line);
        }
    }

    function analyze() {

        for (var i = 0, mx = valueArray.length; i < mx; i++) {
            for (var j = 0, mxj = valueArray[0].length; j < mxj; j++) {
                try {
                    var cur = valueArray[i][j];

                    if (cur > max) {
                        max = cur;
                    } else if (cur < min) {
                        min = cur;
                    }
                } catch (e) {
                    console.log(i, j, e);
                }
            }
        }

        range = max - min;
        step = (range - min) / chars.length;
    }


    function printValues() {
        var text = '';

        $('pre').text(text);

        for (var i = 0; i < gridHeight; i++) {
            for (var j = 0; j < gridWidth; j++) {
                try {
                    //var c = valueArray[i][j] >= 500000 ? 'o' : '.';
                    var charNumber = Math.floor(valueArray[i][j] / step),
                        c = 'x';

                    if (charNumber >= chars.length) {
                        charNumber = chars.length - 1;
                    } else if (charNumber < 0) {
                        charNumber = 0;
                    }

                    c = chars[charNumber];

                    if (c === undefined) {
                        //console.log(valueArray[i][j], valueArray[i][j] / step);
                    }

                    text += c;

                } catch (e) {
                    console.log(e);
                }
            }
            text += "\n";
        }

        $('pre').text(text);
    }


    (function startup () {
        this.loadImage();
    });
}