'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/gallery', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl',
            css: 'view2/view2.css'
        });

    }])

    .controller('View2Ctrl', [ '$scope', '$document', 'imageServices',
        function($scope, $document, imageServices) {

        let slideIndex = 1;
        $scope.gallery = {};
        $scope.selected = '';


        $scope.openModal = function(image) {

            $document[0].getElementById('myModal').style.display = "block";
            $scope.selected = image;
            showSlides(1);
        };

        $scope.closeModal = function() {
            $document[0].getElementById('myModal').style.display = "none";
            $scope.selected = '';
            slideIndex = 1;

        };

        // Next/previous controls
        $scope.plusSlides = function (n) {
            showSlides(slideIndex += n);
        };

        // Thumbnail image controls
        $scope.currentSlide = function (n) {
            showSlides(slideIndex = n);
        };

        function showSlides (n) {
            let i;
            let slides = $document[0].getElementsByClassName("mySlides");
            let dots = $document[0].getElementsByClassName("demo");
            let captionText = $document[0].getElementById("caption");
            if (n > slides.length) {slideIndex = 1;}
            if (n < 1) {slideIndex = slides.length;}
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace("active", "");
            }
            slides[slideIndex-1].style.display = "block";
            dots[slideIndex-1].className += " active";
            captionText.innerHTML = dots[slideIndex-1].alt;
        }

        $scope.getImages = function () {
            imageServices.getImages()
                .then((data) => {
                    $scope.gallery = data.data.data;
                })
                .catch((err) => {
                    $scope.errorMessage = err || "cant fatch gallery images";
                    alert($scope.errorMessage);
                });
        };
        $scope.getImages();
    }]);