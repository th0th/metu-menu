import Promise from 'bluebird';
import Moment from 'moment';
import Request from 'request';
import Cheerio from 'cheerio';
import TitleCase from 'titlecase-turkish';

const baseURL = 'http://kafeterya.metu.edu.tr';
const menuPath = '/tarih';

/**
 *
 * @param {string} date - The date of day to get menu of.
 */
function fetchMenu(date=null) {
    return new Promise((resolve, reject) => {
        if (date === null) {
            date = Moment();
        } else {
            date = Moment(date);
        }

        if (!date.isValid()) {
            reject(new Error("Date is not valid."))
        }

        let dateString = baseURL + menuPath + '/' + date.format('DD-MM-YYYY');

        Request(dateString, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const $ = Cheerio.load(body);

                const itemLists = $('div.yemek-listesi');

                if (itemLists.length !== 4) {
                    reject(new Error("The menu for " + dateString + " is not available."));
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
                            let title = TitleCase($(item).find('p').text());
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
                            let title = TitleCase(item);

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
            } else {
                reject(error);
            }
        });
    });
}

module.exports = fetchMenu;