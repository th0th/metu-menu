'use strict';

var _chai = require('chai');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('(basic)', function () {
    describe('should get menu for 2016-05-12', function () {
        it('menu should be valid', function (done) {
            (0, _2.default)('2016-05-12').then(function (menu) {
                _chai.assert.equal(menu.lunch.length, 4);
                _chai.assert.equal(menu.dinner.length, 4);
                _chai.assert.isAbove(menu.alacarte.length, 0);
                _chai.assert.isAbove(menu.socialBuilding.length, 0);
                done();
            }).catch(function (error) {
                done(error);
            });
        });
    });

    describe('for a weekend date (2016-05-15)', function () {
        it('should throw an error', function (done) {
            (0, _2.default)('2016-05-15').then(function () {
                done(new Error('didn\'t throw an error.'));
            }).catch(function (error) {
                _chai.assert.instanceOf(error, Error);
                done();
            });
        });
    });
});

describe('Without', function () {
    // TODO: fix this test when js Date fallback is removed from momentjs (it always passes for now).
    describe('a valid date', function () {
        it('should throw an error', function (done) {
            var date = (0, _moment2.default)('i');

            (0, _2.default)(date).then(function () {
                done(new Error('didn\'t throw an error'));
            }).catch(function (error) {
                _chai.assert.instanceOf(error, Error);
                done();
            });
        });
    });

    describe('a date', function () {
        it('should get today\'s menu (or the same error)', function (done) {
            var now = (0, _moment2.default)();

            (0, _2.default)(now).then(function (todaysMenu) {

                (0, _2.default)().then(function (defaultMenu) {
                    _chai.assert.deepEqual(todaysMenu, defaultMenu);
                    done();
                }).catch(function () {
                    done(new Error('got an error without date.'));
                });
            }).catch(function (todaysError) {
                (0, _2.default)().then(function () {
                    done(new Error('got the menu without date'));
                }).catch(function (defaultError) {
                    _chai.assert.equal(todaysError.message, defaultError.message);
                    done();
                });
            });
        });
    });
});