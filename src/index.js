import moment from 'moment';
import request from 'request';
import cheerio from 'cheerio';
import titleCase from 'titlecase-turkish';

const baseURL = 'http://kafeterya.metu.edu.tr';
const menuPath = '/tarih';

export default function fetchMenu() {
    let date, callback;

    if (arguments.length === 1) {
        date = moment();
        callback = arguments[0];
    }
    else if (arguments.length === 2) {
        date = moment(arguments[0]);
        callback = arguments[1];
    }
    else {
        throw new Error("parameters are (date, callback) and date is optional.");
    }

    if (!date.isValid()) {
        throw new Error("Invalid date.");
    }

    if (typeof callback !== 'function') {
        throw new Error("callback should be a function");
    }

    let dateString = baseURL + menuPath + '/' + date.format('DD-MM-YYYY');

    request(dateString, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(body);

            const itemLists = $('div.yemek-listesi');

            if (itemLists.length !== 4) {
                return callback(new Error("N/A"));
            }

            let menu = {
                lunch: [],
                dinner: [],
                alacarte: [],
                socialBuilding: []
            };

            let menuToPush;

            itemLists.each((i, itemList) => {
                if ([0, 1].indexOf(i) !== -1) {
                    let items = $(itemList).find('div.yemek');

                    items.each((j, item) => {
                        let title = titleCase($(item).find('p').text());
                        let image = baseURL + '/' + $(item).find('img').attr('src');

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
                    let items = $(itemList).find('pre').text().trim().split('\n');

                    items.forEach((item) => {
                        let title = titleCase(item);

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
        }
    });
}