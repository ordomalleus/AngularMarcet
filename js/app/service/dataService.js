var dataApp = angular.module('dataService', []);

dataApp.factory('dataServiceFactory', ['$http', '$rootScope', '$localStorage',
    function ($http, $rootScope, $localStorage) {

        var DataService = {};

        /**
         * Модель дата-фабрики
         * @type {{catalog: Array, car: Array}}
         */
        var model = {
            catalog: [],
            car: []
        };

        /**
         * Получает данные из json в model фактори, пересобирает в массив объектов
         * @returns {*}
         */
        DataService.getJson = function () {
            model.catalog = [];
            return $http({
                method: 'GET',
                url: '/js/app/json/products.json'
            }).success(function (data) {
                angular.forEach(data, function (value) {
                    this.push(value);
                }, model.catalog);
                //пишем в localStorage
                $localStorage.games = model.catalog;
            }).error(function (data, status, headers) {
                console.log(data, status, headers);
            });
        };
        /**
         * Вызов первичных данных
         */
        DataService.getJson();

        /**
         * Возвращает конвертируемый обьект json в массив обьектов
         * @returns {*}
         */
        DataService.getModelCatalog = function () {
            return model.catalog;
        };

        /**
         * Возвращает модель с карзиной
         * @returns {*}
         */
        DataService.getModelCar = function () {
            return model.car;
        };

        /**
         * Добавляет в карзину игру
         * @param index
         * @param obj
         */
        DataService.addCar = function (index, obj) {
            obj.index = index;
            var test = {
                flag: false
            };

            if (model.car.length > 0) {
                angular.forEach(model.car, function (value) {
                    if (value.index === index) {
                        this.flag = true;
                    }
                }, test);
                if (!test.flag) {
                    model.car.push(obj);
                }
            } else {
                model.car.push(obj);
            }
        };

        /**
         * Удаляет одну выбранную игру из карзины
         * @param id
         */
        DataService.removeCar = function (id) {
            for (var i = 0; i < model.car.length; i++) {
                if (model.car[i].index === id) {
                    model.car.splice(i, 1);
                }
            }
        };

        /**
         * Чистит карзину
         */
        DataService.removeAllCar = function () {
            model.car = [];
        };

        return DataService;
    }]);
