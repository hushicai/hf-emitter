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
            it('default maxListeners should be 10', function () {
                expect(emitter._maxListeners).toBe(10);
            });
            it('setMaxListeners should throw exception', function () {
                expect(function () {
                    emitter.setMaxListeners('n');
                }).toThrow(
                    new TypeError('n must be a positive number.')
                );
            });
            it('setMaxListeners', function () {
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
                expect(emitter.on).toHaveBeenCalled();
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
                expect(emitter._events).toBeUndefined();
                emitter.off();
                expect(emitter._events).toBeUndefined();
            }),
            it('off all events', function () {
                emitter.on('x1', empty);
                emitter.on('x2', empty);
                emitter.on('x3', empty);
                expect(emitter._events).toBeDefined();
                emitter.off();
                expect(emitter._events).toBeUndefined();
            });
            it('off with event type', function () {
                emitter.on('x', empty);
                expect(emitter._events.x1).toBeUndefined();
                emitter.off('x1');
                expect(emitter._events.x).toBeDefined();
                emitter.off('x');
                expect(emitter._events.x).toBeUndefined();
            });
            it('off with event type and listener', function () {
                emitter.on('x', empty);
                expect(emitter._events.x).toBeDefined();
                emitter.off('x', function () {});
                expect(emitter._events.x.length).toBe(1);
                emitter.off('x', empty);
                expect(emitter._events.x.length).toBe(0);
            });
            it('emit', function () {
                var log = jasmine.createSpy('log');
                emitter.emit('x');
                emitter.on('x', log);
                emitter.emit('x', 2);
                expect(log).toHaveBeenCalled();
                expect(log).toHaveBeenCalledWith(2);
            });
            it('setMaxListeners', function () {
                // spyOn(emitter, 'on');
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
                // expect(emitter.on.calls.count()).toBe(6);
            });
        });
    }
);
