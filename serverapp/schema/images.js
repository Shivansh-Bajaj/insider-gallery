
const mongoose = require('mongoose'),
    schema = mongoose.Schema;

var imageSchema = new schema({
    imageHorizontalSmall: String,
    imageGallery: String,
    imageHorizontal: String,
    imageVertical: String


}, {
    timestamps: true
});

module.exports = mongoose.model('imageModel', imageSchema);
