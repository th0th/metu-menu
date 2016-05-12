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
            (0, _2.default)('2016-05-12', function (error, menu) {
                _chai.assert.equal(menu.lunch.length, 4);
                _chai.assert.equal(menu.dinner.length, 4);
                _chai.assert.isAbove(menu.alacarte.length, 0);
                _chai.assert.isAbove(menu.socialBuilding.length, 0);
                done();
            });
        });
    });
});

describe('Without', function () {
    describe('a callback', function () {
        it('should throw an error', function () {
            _chai.assert.throws(function () {
                (0, _2.default)();
            }, 'callback');
        });
    });

    describe('a valid callback (function type check)', function () {
        it('should throw an error', function () {
            _chai.assert.throws(function () {
                (0, _2.default)(1);
            }, 'callback');
        });
    });

    // TODO: fix this test when js Date fallback is removed from momentjs (it always passes for now).
    describe('a valid date', function () {
        it('should callback with an error', function (done) {
            var date = (0, _moment2.default)('i');

            _chai.assert.throws(function () {
                (0, _2.default)(date, function () {});
            }, 'date');
            done();
        });
    });

    describe('a date', function () {
        it('should get today\'s menu', function (done) {
            var now = (0, _moment2.default)();
            var defaultMenu = void 0,
                todaysMenu = void 0;

            (0, _2.default)(function (error, menu) {
                defaultMenu = menu;
            });

            (0, _2.default)(now, function (error, menu) {
                todaysMenu = menu;
            });

            _chai.assert.equal(defaultMenu, todaysMenu);
            done();
        });
    });
});