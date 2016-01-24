'use strict';

var gameApp = angular.module('gameCatalog', ['ngStorage', 'ngSanitize']);

gameApp.controller('GameCtrl', ['$scope', 'dataServiceFactory', '$sce',
    function ($scope, dataServiceFactory, $sce) {

        //модель для данных
        $scope.model = {
            games: []
        };

        /**
         * Устанавливаем наблюдатель за фабрикой и после получения данных выключаем наблюдатель
         */
        var dataWatch = $scope.$watch(function () {
            return dataServiceFactory.getModelCatalog()
        }, function (newVal) {
            if (newVal.length > 0) {
                $scope.model.games = dataServiceFactory.getModelCatalog();
                //останавливаем наблюдение после получения ассинхроного запроса. Чтобы зря не нагружать рессурсы
                //если нужны реалтайм данные то вызывать не нужно, тогда всегда будем получать актуальные данные
                dataWatch();
            }
        }, true);

        /**
         * Разбивает строку по знаку :
         * @param str
         * @returns {*}
         */
        $scope.getTitleGames = function (str) {
            var result = '';
            var temp = [];
            temp = str.split(':');
            if (temp[1] === undefined) {
                return temp[0];
            } else {
                result = temp[0] + ':' + '<br>' + temp[1];
                return $sce.trustAsHtml(result);
            }
        };

        /**
         * Меняет каталог игр. В карзине или нет
         * @param index
         * @returns {string}
         */
        $scope.setCar = function (index) {
            var data = dataServiceFactory.getModelCar();
            var test = {
                flag: false
            };
            if (data.length < 1) {
                return 'noCar';
            }
            angular.forEach(data, function (value) {
                if (value.index === index) {
                    this.flag = true;
                }
            }, test);
            if (!test.flag) {
                return 'noCar';
            } else {
                return 'yesCar'
            }
        };

        /**
         * Добавляет в карзину выбранную игру
         * @param index
         */
        $scope.addCar = function (index) {
            var obj = $scope.model.games[index];
            dataServiceFactory.addCar(index, obj);
        };


    }]);
