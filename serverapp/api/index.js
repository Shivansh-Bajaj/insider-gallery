'use strict';

const router = require('express').Router();
const async = require('async');
const cloudinary = require('../util/cloudinary');
const imageSchema = require('../schema/images');

router.get('/', function (req, res) {

    res.json({
        "status": "success"
    });
});

router.get('/images/get', function (req, res) {
    imageSchema.find().sort('-updatedAt').exec((err, results) => {
        if(!err && results) {
            res.json({
                "status": "success",
                "data": results
            });
        }
    });
});

router.post('/images/upload', function (req, res) {
    async.waterfall([function (next) {
        if(req.body.hasOwnProperty('imageGallery') && req.body.hasOwnProperty('imageHorizontal') &&
            req.body.hasOwnProperty('imageHorizontalSmall') &&
            req.body.hasOwnProperty('imageVertical')) {
            cloudinary.uploadMultiple(req.body)
                .then((result) => {
                    next(null, result);
                })
                .catch((err, result) => {
                    next(err, result);
                });
        }
    }, function (results, next) {
        if(results) {
            results = new imageSchema(results);
            results.save()
                .then((doc) => {
                    next(null, doc);
                });
        } else {
            next('image empty', null);
        }
    }], function (err, urls) {
        if(!err) {
            res.json({
                "status": "success",
                "data": urls
            });
        } else {
            res.json({
                "status": "fail",
                "data": urls,
                "error": err
            });
        }
    });
});
module.exports = router;