'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

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

/**
 *
 * @param {string} date - The date of day to get menu of.
 */
function fetchMenu() {
    var date = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    return new _bluebird2.default(function (resolve, reject) {
        if (date === null) {
            date = (0, _moment2.default)();
        } else {
            date = (0, _moment2.default)(date);
        }

        if (!date.isValid()) {
            reject(new Error("Date is not valid."));
        }

        var dateString = baseURL + menuPath + '/' + date.format('DD-MM-YYYY');

        (0, _request2.default)(dateString, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                (function () {
                    var $ = _cheerio2.default.load(body);

                    var itemLists = $('div.yemek-listesi');

                    if (itemLists.length !== 4) {
                        reject(new Error("The menu for " + dateString + " is not available."));
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

                    resolve(menu);
                })();
            } else {
                reject(error);
            }
        });
    });
}

module.exports = fetchMenu;