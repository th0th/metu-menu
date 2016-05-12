'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = fetchMenu;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _titlecaseTurkish = require('titlecase-turkish');

var _titlecaseTurkish2 = _interopRequireDefault(_titlecaseTurkish);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseURL = 'http://kafeterya.metu.edu.tr';
var menuPath = '/tarih';

function fetchMenu() {
    var date = void 0,
        callback = void 0;

    if (arguments.length === 1) {
        date = (0, _moment2.default)();
        callback = arguments[0];
    } else if (arguments.length === 2) {
        date = (0, _moment2.default)(arguments[0]);
        callback = arguments[1];
    } else {
        throw new Error("parameters are (date, callback) and date is optional.");
    }

    if (!date.isValid()) {
        throw new Error("Invalid date.");
    }

    if (typeof callback !== 'function') {
        throw new Error("callback should be a function");
    }

    var dateString = baseURL + menuPath + '/' + date.format('DD-MM-YYYY');

    (0, _request2.default)(dateString, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var _ret = function () {
                var $ = _cheerio2.default.load(body);

                var itemLists = $('div.yemek-listesi');

                if (itemLists.length !== 4) {
                    return {
                        v: callback(new Error("N/A"))
                    };
                }

                var menu = {
                    lunch: [],
                    dinner: [],
                    alacarte: [],
                    socialBuilding: []
                };

                var menuToPush = void 0;

                itemLists.each(function (i, itemList) {
                    if ([0, 1].indexOf(i) !== -1) {
                        var items = $(itemList).find('div.yemek');

                        items.each(function (j, item) {
                            var title = (0, _titlecaseTurkish2.default)($(item).find('p').text());
                            var image = baseURL + '/' + $(item).find('img').attr('src');

                            if (i === 0) {
                                menuToPush = menu.lunch;
                            }

                            if (i === 1) {
                                menuToPush = menu.dinner;
                            }

                            menuToPush.push({
                                title: title,
                                image: image
                            });
                        });
                    }

                    if ([2, 3].indexOf(i) !== -1) {
                        var _items = $(itemList).find('pre').text().trim().split('\n');

                        _items.forEach(function (item) {
                            var title = (0, _titlecaseTurkish2.default)(item);

                            if (i === 2) {
                                menuToPush = menu.alacarte;
                            }

                            if (i === 3) {
                                menuToPush = menu.socialBuilding;
                            }

                            menuToPush.push({
                                title: title
                            });
                        });
                    }
                });

                callback(false, menu);
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
    });
}