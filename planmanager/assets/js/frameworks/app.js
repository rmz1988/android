//初始化angularjs登录模块
var loginModule = angular.module('login', ['w5c.validator']);
loginModule.config(["w5cValidatorProvider", "$httpProvider", function (w5cValidatorProvider, $httpProvider) {
    setHttpProvider($httpProvider);

    w5cValidatorProvider.config({
        blurTrig: false,
        showError: false,
        removeError: false
    });

    w5cValidatorProvider.setRules({
        username: {
            required: '请输入用户名',
            w5cuniquecheck: '用户不存在'
        },
        password: {
            required: '请输入密码',
            w5cuniquecheck: '用户名与密码不匹配'
        },
        address: {
            required: '请设置服务器地址',
            w5cuniquecheck: '验证码不正确'
        }
    });
}]);


//初始化angularjs首页模块
var mainModule = angular.module('main', ['ngAnimate', 'ui.router', 'w5c.validator']);
mainModule.config(["$stateProvider", "w5cValidatorProvider", "$httpProvider",
    function ($stateProvider, w5cValidatorProvider, $httpProvider) {
        setHttpProvider($httpProvider);

        //w5c校验全局配置
        w5cValidatorProvider.config({
            blurTrig: true,
            showError: true,
            removeError: true
        });

        w5cValidatorProvider.setRules({
            title: {
                required: '请填写计划内容'
            }
        });

        //路由配置
        $stateProvider.state('list', {
            url: '/list/:type',
            templateUrl: 'plan_list.html'
        }).state('auditList', {
            url: '/auditList',
            templateUrl: 'plan_audit.html'
        }).state('setting', {
            url: '/setting',
            templateUrl: 'setting.html'
        }).state('add', {
            url: '/add',
            templateUrl: 'add_plan.html'
        }).state('execute', {
            url: '/execute',
            templateUrl: 'plan_execute.html'
        }).state('audit', {
            url: '/audit',
            templateUrl: 'audit_detail.html'
        }).state('detail', {
            url: '/detail',
            templateUrl: 'plan_detail.html'
        }).state('executeDetail', {
            url: '/execute/detail',
            templateUrl: 'execute_detail.html'
        });

    }
]);

/**
 * 设置$httpProvider
 * @param httpProvider
 */
function setHttpProvider(httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '.' + i;
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '.' + subName;
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}