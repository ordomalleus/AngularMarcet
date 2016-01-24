//Модуль для работы с сервером json и обработкой полученных данных
var dataApp = angular.module('data', []);

//TODO: переиминовать в dataOrdersService
/**
 * Фактори для работы с данными Заказов
 */
dataApp.factory('dataService', ['$http', '$rootScope', '$localStorage', '$interval',
    function ($http, $rootScope, $localStorage, $interval) {

        var DataService = {};

        /**
         * Модель для хранения всех пуллов
         * @type {{pulls: Array}}
         */
        var model = {
            pulls: [], //текущие пуллы
        };

        /**
         * Содержит актуальные пуллы с ордерами
         * @type {{actual: Array}}
         */
        var kontrol = {
            actual: []
        };

        /**
         * Временное хранение пуллов пришедших с сервера
         * @type {{firstPulls: Array}}
         */
        var json = {
            firstPulls: [], //первичный пулл
        };

        /**
         * Запрос к json каждые 10сек и обновление моделей если они изменились
         */
        var updatePulls;
        function startUpdatePulls(){
            updatePulls = $interval(function () {
                getJsonPull().success(function (data) {
                    json.firstPulls = data;
                    if (angular.toJson(json.firstPulls) != angular.toJson(model.pulls)) {
                        model.pulls = angular.copy(json.firstPulls);
                        getActualOrder();
                    }
                }).error(function (headers) {
                    console.log('нет json');
                });
            }, 10000);
        }
        startUpdatePulls();//запуск интервала.

        /**
         * Запрос к серверу за новвыми даными
         * @returns {*}
         */
        var getJsonPull = function () {
            return $http({
                method: 'GET',
                url: 'http://office.domoidostavim.ru/routes',
                //token: $localStorage.token,
                headers: {'Authorization': $localStorage.token},
            }).success(function (data, status, headers, config) {
            }).error(function (data, status, headers) {
                console.log(headers);
            });
        };

        /**
         * Первичный прием данных
         */
        getJsonPull().success(function (data) {
            json.firstPulls = data;
            if (angular.toJson(json.firstPulls) != angular.toJson(model.pulls)) {
                model.pulls = angular.copy(json.firstPulls);
                getActualOrder();
            }
        }).error(function () {
            console.log('нет json на первичный прием данных в dataService');
        });

        /**
         * Обновляет модель пуллов и ордеров на кантроле
         */
        function getActualOrder() {
            kontrol.actual = [];
            var temp = angular.copy(model.pulls);

            for (var i = temp.length - 1; i >= 0; i--) {
                for (var y = temp[i].orders.length - 1; y >= 0; y--) {
                    if (temp[i].orders[y].on_control === false) {
                        temp[i].orders.splice(y,1);
                    }
                }
                if  (temp[i].orders.length < 1){
                    temp.splice(i,1);
                }
            }
            kontrol.actual = temp;
        }

        //Паблик методы для работы с сервисом================================================>
        /**
         * Возвращает разовый запрос к серверу с атуальными пуллами
         * @returns {Function}
         */
        DataService.getFirstJson = function () {
            return getJsonPull;
        };

        /**
         * Возвращает текущее состояние всех пуллов
         * @returns {{pulls: Array}}
         */
        DataService.getModel = function () {
            return model;
        };

        /**
         * Возвращает текущее состояние всех ордеров на кантролле
         * @returns {{actual: Array}}
         */
        DataService.getControl = function () {
            return kontrol;
        };

        /**
         * Возвращает колличество пулов для меню
         * @returns {*|Function|o}
         */
        DataService.getModelCalc = function () {
            return model.pulls.length;
        };

        /**
         * Возвращает колличество ордеров на кантролле для меню
         * @returns {*|Function|o}
         */
        DataService.getActualCalc = function () {
            return kontrol.actual.length;
        };

        /**
         * Остановка $interval. Перестает обновлять данные с сервера
         * @returns {boolean}
         */
        DataService.stopUpdateJson = function (){
            return $interval.cancel(updatePulls);
        };

        /**
         * Запуск $interval. Начинает обновлять данные с сервера
         * @returns {boolean}
         */
        DataService.startUpdateJson = function (){
            return startUpdatePulls();
        };

        return DataService;
    }]);

/**
 * фактори для работы с данными персонала
 */
dataApp.factory('dataServicePersonal', ['$http', '$rootScope', '$localStorage', '$interval',
    function ($http, $rootScope, $localStorage, $interval) {

        var DataService = {};

        /**
         * Модель для хранения данных
         * @type {{works: Array}}
         */
        var model = {
            works: [] //текущие на смене
        };

        /**
         * Временное хранение данных пришедших с сервера
         * @type {{firstJson: Array}}
         */
        var json = {
            firstJson: [], //первичный пулл
        };

        /**
         * Запрос к json каждые 10сек и обновление моделей если они изменились
         */
        var updatePulls;
        function startUpdatePulls(){
            updatePulls = $interval(function () {
                getJsonPull().success(function (data) {
                    json.firstJson = data;
                    if (angular.toJson(json.firstJson) != angular.toJson(model.works)) {
                        model.works = angular.copy(json.firstJson);
                    }
                }).error(function (status) {
                    console.log('нет json в dataServicePersonal. Код сервера: ' + status);
                });
            }, 10000);
        }

        /**
         * Запрос к серверу за новвыми даными
         *
         */
        var getJsonPull = function () {
            return $http({
                method: 'GET',
                url: 'http://office.domoidostavim.ru/vehicles',
                //token: $localStorage.token,
                headers: {'Authorization': $localStorage.token}
            }).success(function (data, status, headers, config) {
            }).error(function (status) {
                console.log('нет json в dataServicePersonal. Код сервера: ' + status);
            });
        };

        /**
         * Отправка на сервер нового статуса vehicle у Персонала -> на смене
         * @param vehicle
         * @returns {*}
         */
        var setUpdateJsonPersonalAvailable = function(vehicle){
            return $http({
                method: 'POST',
                url: 'http://office.domoidostavim.ru/vehicles',
                //token: $localStorage.token,
                headers: {'Authorization': $localStorage.token},
                data: vehicle
            }).success(function (data) {
            }).error(function (status) {
                console.log('не смогли отсолать json в dataServicePersonal. Код сервера: ' + status);
            });
        };

        /**
         * Отправка на сервер формы нового водителя
         * @param model
         * @returns {*}
         */
        var setUpdateJsonPersonalFormVoditel = function(model){
            return $http({
                method: 'POST',
                url: 'http://office.domoidostavim.ru/vehicles/new',
                headers: {'Authorization': $localStorage.token},
                data: model
            }).success(function (data) {
            }).error(function (data, status) {
                console.log('не смогли отправить json при отправки формы в dataServicePersonal. Ответ: ' + JSON.stringify(data));
                console.log('не смогли отправить json при отправки формы в dataServicePersonal. Код сервера: ' + status);
            });
        };

        /**
         * Первичный прием данных
         */
        getJsonPull().success(function (data) {
            json.firstJson = data;
            if (angular.toJson(json.firstJson) != angular.toJson(model.works)) {
                model.works = angular.copy(json.firstJson);
            }
        }).error(function (status) {
            console.log('нет json в dataServicePersonal. Код сервера: ' + status);
        });

        //Паблик методы для работы с сервисом================================================>
        /**
         * Возвращает разовый запрос к серверу с атуальными данными
         * @returns {Function}
         */
        DataService.getFirstJson = function () {
            return getJsonPull();
        };

        /**
         * Возвращает текущее состояние модели
         * @returns {{works: Array}}
         */
        DataService.getModel = function () {
            return model;
        };

        /**
         * Возвращает колличество обьектов Персонала -> на смене для меню
         * @returns {Number}
         */
        DataService.getModelCalc = function () {
            return model.work.length;
        };

        /**
         * Остановка $interval. Перестает обновлять данные с сервера
         * @returns {boolean}
         */
        DataService.stopUpdateJson = function (){
            return $interval.cancel(updatePulls);
        };

        /**
         * Запуск $interval. Начинает обновлять данные с сервера
         * @returns {boolean}
         */
        DataService.startUpdateJson = function (){
            return startUpdatePulls();
        };

        /**
         * Публичный метод обнавления статуса работы у персонала|водителей
         * @param vehicle
         * @returns {*}
         */
        DataService.setUpdateJsonAvailable = function (vehicle){
            return setUpdateJsonPersonalAvailable(vehicle);
        };

        /**
         * Публичный метод отправки формы добавления персонала
         * @param json
         * @returns {*}
         */
        DataService.setJsonPersonalVoditel = function (json){
            return setUpdateJsonPersonalFormVoditel(json);
        };

        return DataService;
    }]);


