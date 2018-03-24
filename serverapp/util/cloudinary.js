'use strict';

const cloudinary = require('cloudinary'),
    config     = require('../../config.js').cloudinary,
    async      = require('async');

function configure() {
    cloudinary.config({
        cloud_name: config.cloud_name,
        api_key: config.api_key,
        api_secret: config.api_secret
    });
}

module.exports = {
    uploadMultiple: function (images) {
        configure();
        return new Promise(function (resolve, reject) {
            let output = {};
            async.each(Object.keys(images), function (element, done) {
                cloudinary.v2.uploader.upload(images[element], (err, image) => {
                    if(!err){
                        output[element] = image.secure_url;
                        done();
                    } else {
                        done(err);
                    }
                });
            }, function (err) {
                if (!err) {
                    resolve(output);
                } else {
                    reject(err, output);
                }
            });
        });
    },
};