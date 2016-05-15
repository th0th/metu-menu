import {assert} from 'chai';
import moment from 'moment';
import metuMenu from './';

describe('(basic)', () => {
    describe('should get menu for 2016-05-12', () => {
        it('menu should be valid', (done) => {
            metuMenu('2016-05-12')
                .then((menu) => {
                    assert.equal(menu.lunch.length, 4);
                    assert.equal(menu.dinner.length, 4);
                    assert.isAbove(menu.alacarte.length, 0);
                    assert.isAbove(menu.socialBuilding.length, 0);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });

    describe('for a weekend date (2016-05-15)', () => {
        it('should throw an error', (done) => {
            metuMenu('2016-05-15')
                .then(() => {
                    done(new Error('didn\'t throw an error.'));
                })
                .catch((error) => {
                    assert.instanceOf(error, Error);
                    done();
                });
        });
    });
});

describe('Without', () => {
    // TODO: fix this test when js Date fallback is removed from momentjs (it always passes for now).
    describe('a valid date', () => {
        it('should throw an error', (done) => {
            let date = moment('i');

            metuMenu(date)
                .then(() => {
                    done(new Error('didn\'t throw an error'));
                })
                .catch((error) => {
                    assert.instanceOf(error, Error);
                    done();
                });
        });
    });

    describe('a date', () => {
        it('should get today\'s menu (or the same error)', (done) => {
            let now = moment();

            metuMenu(now)
                .then((todaysMenu) => {

                    metuMenu()
                        .then((defaultMenu) => {
                            assert.deepEqual(todaysMenu, defaultMenu);
                            done();
                        })
                        .catch(() => {
                            done(new Error('got an error without date.'));
                        });
                })
                .catch((todaysError) => {
                    metuMenu()
                        .then(() => {
                            done(new Error('got the menu without date'));
                        })
                        .catch((defaultError) => {
                            assert.equal(todaysError.message, defaultError.message);
                            done();
                        });
                });
        });
    });
});