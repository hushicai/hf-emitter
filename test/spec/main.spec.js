/**
 * @file test spec
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var Emitter = require('main');

        var emitter;

        function empty() {}

        beforeEach(function () {
            emitter = new Emitter();
        });

        afterEach(function () {
            emitter = null;
        });

        describe('Emitter test suite', function () {
            it('Emitter', function () {
                expect(emitter.setMaxListeners).toBeDefined();
                expect(emitter.on).toBeDefined();
                expect(emitter.off).toBeDefined();
                expect(emitter.emit).toBeDefined();
            });
            it('setMaxListeners called with a illegal number should throw type error', function () {
                expect(function () {
                    emitter.setMaxListeners('n');
                }).toThrow(
                    new TypeError('n must be a positive number.')
                );
            });
            it('setMaxListeners should limit events count', function () {
                emitter.setMaxListeners(5);
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                expect(function () {
                    emitter.on('x', empty);
                }).toThrowError(
                    'warning: possible memory leak detected. 5 listeners added.'
                );
            });
            it('on called with enough arguments should throw error', function () {
                expect(function () {
                    emitter.on();
                }).toThrow(
                    new Error('not enough arguments')
                );
                expect(function () {
                    emitter.on('x');
                }).toThrow(
                    new Error('not enough arguments')
                );
            });
            it('on', function () {
                spyOn(emitter, 'on');
                emitter.on('x', empty);
                expect(emitter.on).toHaveBeenCalledWith('x', empty);
            });
            it('on called with limit times should throw rangeError', function () {
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                emitter.on('x', empty);
                expect(function () {
                    emitter.on('x', empty);
                }).toThrow(
                    new RangeError('warning: possible memory leak detected. 10 listeners added.')
                );
            });
            it('off when no events', function () {
                emitter.off();
            }),
            it('off all events', function () {
                emitter.on('x1', empty);
                emitter.on('x2', empty);
                emitter.on('x3', empty);
                emitter.off();
            });
            it('off with event type', function () {
                emitter.on('x', empty);
                emitter.off('x1');
                emitter.off('x');
            });
            it('off with event type and listener', function () {
                emitter.on('x', empty);
                emitter.off('x', function () {});
                emitter.off('x', empty);
            });
            it('emit', function () {
                var log = jasmine.createSpy('log');
                expect(function () {
                    emitter.emit();
                }).toThrowError('type arguments required');
                emitter.emit('x');
                emitter.on('x', log);
                emitter.emit('x1');
                emitter.emit('x');
                expect(log).toHaveBeenCalledWith();
                emitter.emit('x', 2);
                expect(log).toHaveBeenCalledWith(2);
            });
        });
    }
);
