/** Image-Extractor Router Config
 * This file containes route for image-extract API 
 * */

const ImageController = require('./controllers/image.controller');
/** 
* Config routes for Search, Create, Update, Find and Delete APIs
* @param {express} the express app 
*/
exports.routesConfig = function (app) {
    app.post('/image-extract', [
        ImageController.extract
    ]);
};
