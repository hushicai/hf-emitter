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
            it('emit', function () {
                var log = jasmine.createSpy('log');
                emitter.on('x', log);
                emitter.emit('x');
                expect(log).toHaveBeenCalledWith();
                emitter.emit('x', 2);
                expect(log).toHaveBeenCalledWith(2);
            });
            it('off all events', function () {
                emitter.on('x1', empty);
                emitter.on('x2', empty);
                emitter.on('x3', empty);
                emitter.off();
                expect(function () {
                    emitter.emit('x1');
                    emitter.emit('x2');
                    emitter.emit('x3');
                }).toThrow();
            });
            it('off with event type', function () {
                var handler = jasmine.createSpy('handler');
                emitter.on('x', handler);
                emitter.emit('x');
                expect(handler).toHaveBeenCalledWith();
                emitter.emit('x', 1);
                expect(handler).toHaveBeenCalledWith(1);
                emitter.off('x');
                expect(function () {
                    emitter.emit('x');
                }).toThrow();
            });
            it('off with event type and listener', function () {
                var handler = jasmine.createSpy('handler');
                emitter.on('x', handler);
                emitter.emit('x');
                expect(handler).toHaveBeenCalledWith();
                // off失败
                emitter.off('x', function () {});
                // 因此应该还可以emit
                emitter.emit('x', 2);
                expect(handler).toHaveBeenCalledWith(2);
                // off成功
                emitter.off('x', handler);
                // 现在设置maxListeners为2，则应该只能添加两个
                // 证明上面那个handler已经成功卸载
                emitter.setMaxListeners(2);
                emitter.on('x', handler);
                expect(function () {
                    emitter.on('x', handler);
                }).not.toThrow();
                expect(function () {
                    emitter.on('x', handler);
                }).toThrow();
            });
        });
    }
);
