var images = []



var scanRequest = {
    "use_asprise_dialog": true, // Whether to use Asprise Scanning Dialog
    "show_scanner_ui": false, // Whether scanner UI should be shown
    "twain_cap_setting": { // Optional scanning settings
        "ICAP_PIXELTYPE": "TWPT_RGB" // Color
    },
    "output_settings": [{
        "type": "return-base64",
        "format": "jpg"
    }]
};



function scan() {
    images = []
    $("#add_scan").fadeToggle(200)
    scanner.scan(displayImagesOnPage, scanRequest);
}

/** Processes the scan result */
function displayImagesOnPage(successful, mesg, response) {
    if (!successful) { // On error
        console.error('Failed: ' + mesg);
        return;
    }
    if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
        console.info('User cancelled');
        return;
    }
    var scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
    for (var i = 0;
        (scannedImages instanceof Array) && i < scannedImages.length; i++) {
        var scannedImage = scannedImages[i];
        images.push((scannedImage.src).toString().split("\n").join(""))


        var elementImg = scanner.createDomElementFromModel({
            'name': 'img',
            'attributes': {
                'class': 'scanned',
                'src': scannedImage.src
            }
        });
        (document.getElementById('images') ? document.getElementById('images') : document.body).appendChild(elementImg);
    }
}