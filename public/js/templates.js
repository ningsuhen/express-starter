(function () {
    this.JST || (this.JST = {});
    this.JST['HomeView'] = function (obj) {
        var __p = [], print = function () {
            __p.push.apply(__p, arguments);
        };
        with (obj || {}) {
            __p.push('<h3>', hello, '</h3>');
        }
        return __p.join('');
    };
    this.JST['views/TestView'] = function (obj) {
        var __p = [], print = function () {
            __p.push.apply(__p, arguments);
        };
        with (obj || {}) {
            __p.push('<h3>', hello, '</h3>');
        }
        return __p.join('');
    };
}).call(this);