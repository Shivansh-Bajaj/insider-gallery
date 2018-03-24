'use strict';

var myModule = angular.module('myApp.imageServices', []);
myModule.factory('imageServices', function($q, $http) {
    return {
        uploadImages: function (images) {
            return $http({
                method: 'POST',
                url: '/api/v1/images/upload',
                header: {
                    'content-type': 'application/json'
                },
                data: images
            });
        },
        getImages: function () {
            return $http.get('/api/v1/images/get);
        }
    };
});