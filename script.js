var generate = function(event) {
    // Canvas size (Scratch)
    var w = 480;
    var h = 360;

    // Canvas element
    var canvas = document.getElementById("canvas");

    // Context
    var ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w;
    canvas.style.height = h;

    // Fill white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    // Create image
    var image = document.getElementById("source");

    // Change image to download
    var fr = new FileReader();
    fr.readAsDataURL(event.target.files[0]);

    fr.onload = function() {
        image.src = fr.result;
    }

    image.onload = function() {
        // Center image
        var multiplier = 1;

        if(image.width > image.height) {
            multiplier = w / image.width;
        } else {
            multiplier = h / image.height;
        }

        var imageW = image.width * multiplier;
        var imageH = image.height * multiplier;
        var offsetX = 0;
        var offsetY = 0;

        if(h > w) {
            offsetX = (w - imageW) / 2;
        } else if(w > h) {
            offsetY = (h - imageH) / 2;
        }

        // Draw image to canvas
        ctx.drawImage(image, offsetX, offsetY, imageW, imageH);

        // Get image data
        var imageData = ctx.getImageData(0, 0, w, h).data;

        var rgb = [];
        for(let i = 0; i < imageData.length; i += 4) { // 4 is for RGBA
            let red = imageData[i];
            let green = imageData[i + 1];
            let blue = imageData[i + 2];

            rgb.push([red, blue, green]);
        }

        // Convert to scratch arrays
        var colorArray = [];

        for(let i = 0; i < rgb.length; i++) {
            let color = rgb[i];
            let scratchColor = 65536 * color[0] + 256 * color[2] + color[1];
            colorArray.push(scratchColor);
        }

        var colorText = colorArray.toString().replaceAll(",", "\n");

        // Create text file URL
        var url = null;
        var data = new Blob([colorText], {type: 'text/plain'});

        url = window.URL.createObjectURL(data);

        // Make downloadable
        var result = document.getElementById("result");
        result.href = url;
        result.download = "color_array.txt";
    }
}