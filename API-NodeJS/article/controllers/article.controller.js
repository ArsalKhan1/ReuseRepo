/** The Article controller which serves as a controller between incoming requests via api and queries or updates the datastore */
const ArticleModel = require('../models/article.model');


/**
 * lists articles filtered by tags and / or author
 * 
 * @param {Object} req the http request the brings filter query 
 * @param {Object} res the http response that renders an array of articles
 */
exports.search = (req, res) => {

    // req.body.query=lists filter criteria coming from browser
    ArticleModel.filter(req.body.query)
        .then((articles) => {
            // send 200 to indicate to browser that call was successful and send the result which is list of articles
            res.status(200).send(articles);
        })
        .catch((err) => {
            console.log(err);
            res.satutus(400).send(err);
        });
};



/**
 * creates article
 * 
 * @param {Object} req the http request the brings article object in request body
 * @param {Object} res the http response that renders 200 response if successful
 */
exports.createArticle = (req, res) => {
    req.body.authorUsername = req.jwt.username;
    // req.body contains the article data that we need to save in the datastore
    ArticleModel.createArticle(req.body)
        .then((article) => {
            // returning a status code 200 which means call was successful
            // also sending results which is the newly created article object returned from mongoose along with the id field which was populated by mongoose
            res.status(200).send(article);
        });
};


/**
 * updates article
 * 
 * @param {Object} req the http request the brings article id via params and article object in body
 * @param {Object} res the http response that renders 200 is update is successful
 */
exports.updateArticle = (req, res) => {
    //pass the updated article info in the body to mogoose' patch function
    ArticleModel.patchArticle(req.params.articleId, req.body)
        .then((article) => {
            // returning a status code 200 which means call was successful
            // also sending results which is the updated article object returned from mongoose 
            res.status(200).send(article);
        });
};

/**
 * removes article by article id
 * 
 * @param {Object} req the http request the brings article id via params 
 * @param {Object} res the http response that renders 200 is delete is successful
 */
exports.removeById = (req, res) => {
    ArticleModel.removeById(req.params.articleId)
        .then((article) => {
            //if deleted, article object will be null here
            res.status(200).send(article);
        });
};

/**
 * gets articles filtered by tags and / or author
 * 
 * @param {Object} req the http request the brings article id via params
 * @param {Object} res the http response that renders an artile object if found.
 */
exports.getArticleById = (req, res) => {
    // req.params.id contains the article id that we need to find the article
    ArticleModel.findById(req.params.id)
        .then((article) => {
            res.status(200).send(article);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};