'use strict';

var firstApp = angular.module('RootApp', [
    'ui.router',
    'ngStorage',
    'gameCatalog',
    'spisok',
    'dataService'
]);

firstApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            views: {
                'app': {
                    templateUrl: 'js/app/tempalte/app.html',
                    controller: 'AppCtrl'
                }
            }
        })
        .state('Catalog', {
            url: '/',
            parent: 'home',
            views: {
                'catalog': {
                    templateUrl: 'js/app/tempalte/gameCatalog.html',
                    controller: 'GameCtrl'
                },
                'spisok': {
                    templateUrl: 'js/app/tempalte/spisok.html',
                    controller: 'SpisokCtrl'
                }
            }
        });
});

firstApp.controller('AppCtrl', ['$scope',
    function ($scope) {

    }]);
