/**
 * Image Extractor Controller
 * It extracts objects or tags from images using google detect object API
 * ref: https://cloud.google.com/vision/docs/object-localizer
 */


const vision = require('@google-cloud/vision');
const fs = require('fs');


/**
 * extracts tags from image file
 * 
 * @param {Object} req the http request the brings image data
 * @param {Object} res the http response sends array of tags in body and returns success code 200 if successful.
 */
exports.extract = (req, res) => {
    const { file } = req.files;

    /**
     * Creates a client using vision.json file, vision.json contains credentials regarding google's object detection API
     */
    const client = new vision.ImageAnnotatorClient({
        //vision.json contains my keys for google's detect object api
        keyFile: 'vision.json',
    });

    /**
     * storring file path
     */
    const fileName = file.path;

    // fs.readFileSync Synchronously reads the entire contents of a file.
    const request = {
        image: { content: fs.readFileSync(fileName) },
    };


    // objectLocalization method returns the tags with its ocation in the image
    client
        .objectLocalization(request)
        .then((result1) => {
            //if the call is successful, the google api will return the object identified
            const result = result1[0];
            const objects = result.localizedObjectAnnotations;
            res.send({ data: objects });
        })
        .catch((err) => {
            //if the call is unsuccesfull, then the error will be sent back to the browser
            res.send({ err: err });
        });
};