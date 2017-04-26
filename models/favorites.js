var mongoose = require('mongoose')
var Schema = mongoose.Schema

var favoriteSchema = new Schema({
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    works: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Work' }]
})

module.exports = mongoose.model('Favorites', favoriteSchema)