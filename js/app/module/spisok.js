'use strict';

var spisokApp = angular.module('spisok', ['ui.router', 'ngStorage']);

spisokApp.controller('SpisokCtrl', ['$scope', 'dataServiceFactory', '$localStorage',
    function ($scope, dataServiceFactory, $localStorage) {

        //модель для данных
        $scope.model = {
            lists: []
        };

        /**
         * Устанавливаем наблюдатель за фабрикой
         */
        $scope.$watch(function () {
            return dataServiceFactory.getModelCar()
        }, function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.model.lists = dataServiceFactory.getModelCar();
                //пишем в localStorage
                $localStorage.car = newVal;
            }
        }, true);

        /**
         * Введет подсчет итоговой суммы
         * @returns {number}
         */
        $scope.summ = function () {
            var obj = {
                summ: 0
            };
            angular.forEach($scope.model.lists, function (value) {
                if (value.price) {
                    this.summ += value.price;
                }
            }, obj);
            return obj.summ
        };

        /**
         * Удаляем игру из карзины
         * @param index
         */
        $scope.removeCar = function (index) {
            var id = $scope.model.lists[index].index;
            dataServiceFactory.removeCar(id);
        };

        /**
         * Очищает весь список
         */
        $scope.removeAllCar = function () {
            dataServiceFactory.removeAllCar();
        };


    }]);
