'use strict';

angular.module('myApp.view1', ['ngRoute', 'uiCropper'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl',
            css: 'view1/view1.css'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$document', '$q', 'imageServices',
        function($scope, $document, $q, imageServices) {
        $scope.myImage='';
        $scope.myCroppedImage='';
        $scope.filename = '';
        $scope.results = {
            imageVertical: '',
            imageHorizontal: '',
            imageHorizontalSmall:'',
            imageGallery: ''
        };
        $scope.state = 0;
        $scope.errorMessage = '';

        $scope.size = {
            imageVertical: {
                "result-size": { w: 365, h: 450 },
                "area-size": { w: 106.9, h: 131.8 },
                "aspect-ratio": 0.811
            },
            imageHorizontal: {
                "result-size": { w: 755, h: 450 },
                "area-size": { w: 221.2, h: 131.8 },
                "aspect-ratio": 1.677
            },
            imageHorizontalSmall:  {
                "result-size": { w: 365, h: 212 },
                "area-size": { w: 106.9, h: 62.11 },
                "aspect-ratio": 1.721
            },
            imageGallery: {
                "result-size": { w: 380, h: 380 },
                "area-size": { w: 111.33, h: 111.33 },
                "aspect-ratio": 1
            }
        };

        $scope.close = function () {
            $scope.state = 0;
            $scope.results = {
                imageVertical: '',
                imageHorizontal: '',
                imageHorizontalSmall:'',
                imageGallery: ''
            };
            $document[0].getElementById('myModal').style.display = "none";
        };

        $scope.open = function () {
            $scope.state = 0;
            $document[0].getElementById('myModal').style.display = "block";
        };

        let handleFileSelect=function(evt) {
            let file=evt.currentTarget.files[0];
            let reader = new FileReader();
            reader.onload = function (evt) {
                let img = new Image();
                img.onload = function () {
                    if(img.width === 1024 && img.height === 1024) {
                        $scope.$apply(function($scope) {
                            $scope.myImage=evt.target.result;
                        });
                    } else {
                        $scope.errorMessage = "image size should be 1024 x 1024";
                        $scope.close();
                        alert($scope.errorMessage);
                    }
                };
                img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
            $scope.open();
        };



        $scope.submit = function () {
            $scope.state = 1;
            if($scope.results !== {}) {
                imageServices.uploadImages($scope.results)
                    .then((results) => {
                        if(results.hasOwnProperty('data') && results.data.status === "success") {
                            $scope.state = 2;
                            $scope.results = results.data.data;
                        }
                    })
                    .catch((err) => {
                        $scope.close();
                        alert(err);
                    });
            }
        };

        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    }]);