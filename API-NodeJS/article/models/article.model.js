/**
 * Article Model Class
 * This file contains schema/model and CURD operations using mongoose service.
 */

const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

/** article model */
const articleSchema = new Schema({
    title: String,
    authorUsername: String,
    description: String,
    tags: [{
        name: String,
        category: {
            type: String,
            enum: ['garbage', 'recyclable', 'unknown'],
            default: 'unknown'
        }
    }],
    image: String,
    createdAt: String,
    updatedAt: String
});

/**
 * converts type of @field _id of ObjectId to hex string and returns as a new virtual field @field 'id'
 * @param {any} id the article id
 * @returns {string} the hex string
 */
articleSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

/**
 * finds article by id
 * @param {any} cb the callback function for after the search
 * @returns {article} the article object
 */
articleSchema.findById = function (cb) {
    return this.model('Articles').find({ id: this.id }, cb);
};

const Article = mongoose.model('Articles', articleSchema);

/**
 * finds article by id
 * @param {any} id the article id
 * @returns {Promise} a promise that is executed by contoller or caller to get the article
 */
exports.findById = (id) => {
    return Article.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result.__v;
            return result;
        });
};

/**
 * saves article in the data store
 * @param {any} articleData the articleData the article object 
 * @returns {Promise} a promise that is executed by contoller or caller to create the article
 */
exports.createArticle = (articleData) => {
    const article = new Article(articleData);
    return article.save();
};


/**
 * filters articles by tags and/or author id
 * @param {any} query the object containing sort, filter, and tag data
 * @returns {Promise} a promise that is executed by contoller or caller to get the list of articles
 */
exports.filter = (query) => {
    return new Promise((resolve, reject) => {
        const filterQuery = [];
        // condition ? value if true
        // if query.sort is present then set query.sort.field = "udpateAt".  field is a column in table 
        // if query.sort is present then set query.sort.order = -1 which is descending
        const sort = { [query.sort ? query.sort.field : 'updatedAt']: query.sort ? query.sort.order : -1 };
        // if there is a query object and queryobject has at least one tag then add the tag to the filter 
        if (query && query.tags) {
            //loops through the array of tags and add them to filter
            filterQuery.push({ 'tags.name': { $in: query.tags.map((tag) => new RegExp(tag.name, "i")) } });
        }
        // if there is a query object and query has user id then we add the author criteria to limit articles to that user
        if (query && query.authorUsername) {
            filterQuery.push({ authorUsername: query.authorUsername });
        }
        Article
            .find(
                filterQuery.length ? { $or: filterQuery } : {}
            )
            // .sort(sort)
            .exec(function (err, articles) {
                if (err) {
                    //if there is any error exeucing query then return error
                    reject(err);
                } else {
                    //if there is no err then we have articles feteched from datastore
                    resolve(articles);
                }
            });
    });
}

/**
 * updates articles 
 * @param {int} id the id for the article
 * @param {article} articleData the articleData with data for the article object
 * @returns {Promise} a promise that is executed by contoller or caller to update article info
 */
exports.patchArticle = (id, articleData) => {
    return Article.findOneAndUpdate({
        _id: id
    }, articleData, { new: true, useFindAndModify: false });
};

/**
 * removes article
 * @param {int} articleId articleId for the article
 * @returns {Promise} a promise that is executed later by contoller or caller to delete article
 */
exports.removeById = (articleId) => {
    return new Promise((resolve, reject) => {
        Article.deleteOne({ _id: articleId }, (err) => {
            //if err object is null then mongoose was successful in deleting the article
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

