import {assert} from 'chai';
import moment from 'moment';
import metuMenu from './';

describe('(basic)', () => {
    describe('should get menu for 2016-05-12', () => {
        it('menu should be valid', (done) => {
            metuMenu('2016-05-12', (error, menu) => {
                assert.equal(menu.lunch.length, 4);
                assert.equal(menu.dinner.length, 4);
                assert.isAbove(menu.alacarte.length, 0);
                assert.isAbove(menu.socialBuilding.length, 0);
                done();
            });
        });
    });
});

describe('Without', () => {
    describe('a callback', () => {
        it('should throw an error', () => {
            assert.throws(() => {
                metuMenu();
            }, 'callback');
        });
    });

    describe('a valid callback (function type check)', () => {
        it('should throw an error', () => {
            assert.throws(() => {
                metuMenu(1);
            }, 'callback');
        });
    });

    // TODO: fix this test when js Date fallback is removed from momentjs (it always passes for now).
    describe('a valid date', () => {
        it('should callback with an error', (done) => {
            let date = moment('i');

            assert.throws(() => {
                metuMenu(date, () => {

                });
            }, 'date');
            done();
        });
    });

    describe('a date', () => {
        it('should get today\'s menu', (done) => {
            let now = moment();
            let defaultMenu, todaysMenu;

            metuMenu((error, menu) => {
                defaultMenu = menu;
            });

            metuMenu(now, (error, menu) => {
                todaysMenu = menu;
            });

            assert.equal(defaultMenu, todaysMenu);
            done();
        });
    });
});