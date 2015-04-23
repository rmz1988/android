loginModule.controller('LoginController', ['$scope', "$http", function ($scope, $http) {
    var loginInfo = android.getTempLoginUser();
    if (loginInfo != null && loginInfo != undefined) {
        loginInfo = JSON.parse(loginInfo);
        $scope.params = $scope.params || {};
        $scope.params.apiUser = loginInfo.username;
        $scope.params.apiPassword = loginInfo.password;
    }

    $scope.address = android.getAddress();

    $scope.setAddress = function () {
        android.setTempLoginUser($scope.params.apiUser, $scope.params.apiPassword);
        window.location.href = '/android_asset/html/set_address.html';
    };

    $scope.login = function () {
        android.login();
        var url = $scope.address + '/API/Login/';
        var params = $scope.params || {};
        $http.post(url, params).success(function (result) {
            if (result.status) {
                android.saveLoginUser(result.number, result.code, result.user, result.name, result.root,
                    result.rootname, result.department, result.position, result.depname, result.posname,
                    result.power, result.key);
                android.dismissDialog();
                window.location.href = '/android_asset/html/index.html'
            } else {
                android.loginFailed();
            }
        }).error(function () {
            android.loginFailed();
        });
    }
}]);

loginModule.controller("AddressSetController", ["$scope", function ($scope) {
    $scope.setAddress = function () {
        android.saveAddress($scope.address);
        $scope.back();
    };

    $scope.back = function () {
        window.location.href = '/android_asset/html/login.html';
    }
}]);

mainModule.controller("ViewController", ["$scope", function ($scope) {
    $scope.active = [true, false, false, false];

    $scope.selected = function (idx) {
        for (var i = 0; i < $scope.active.length; i++) {
            $scope.active[i] = (i == idx);
        }
    }
}]);

mainModule.controller("TitleController", ["$scope", "$state", "$stateParams", "planTypeService", function ($scope, $state, $stateParams, planTypeService) {
    var times = {
        year: '本年度计划',
        yearnext: '下年度计划',
        month: '本月计划',
        monthnext: '下月计划',
        weeks: '本周计划',
        weeksnext: '下周计划'
    };
    if ($stateParams.type != undefined && $stateParams.type != '') {
        $scope.time = times[$stateParams.type];
        planTypeService.type = $stateParams.type;
    } else {
        $scope.time = times['year'];
        planTypeService.type = 'year';
    }

    $scope.selectTime = function (idx) {
        $scope.time = times[idx];
        planTypeService.type = idx;
    };

    $scope.back = function (state, params) {
        $state.go(state, params, {reload: true});
    };

}]);

mainModule.controller("SettingController", ['$scope', function ($scope) {
    $scope.logout = function () {
        window.location.href = '/android_asset/html/login.html';
    };

    $scope.exit = function () {
        android.exit();
    };
}]);

mainModule.controller("AddPlanController", ['$scope', '$http', "$state", function ($scope, $http, $state) {
    $scope.hasSubmit = false;

    $scope.plan = $scope.plan || {};
    $scope.plan.apiType = 'year';

    $scope.savePlan = function () {
        android.saving();
        $scope.hasSubmit = true;

        var loginUser = JSON.parse(android.getLoginUser());
        var address = JSON.parse(android.getAddress()).address;
        var url = address + '/API/PlanNew/';
        var plan = $scope.plan || {};
        plan.apiUser = loginUser.user;
        plan.apiKey = loginUser.key;

        $http.post(url, plan).success(function (result) {
            if (result.status) {
                android.saveSuccess();
                $state.go('list', {type: $scope.plan.apiType}, {reload: true});
            } else {
                android.saveFailed();
                $scope.hasSubmit = false;
            }
        }).error(function () {
            $scope.hasSubmit = false;
            android.saveFailed();
        });

    }
}]);

mainModule.controller("PlanListController", ["$scope", "$state", function ($scope, $state) {
    $scope.apiType = 'year';

    $scope.detail = function () {
        $state.go('detail', '', {reload: true});
    };

    $scope.deletePlan = function (id) {
        //todo 删除任务
        alert('删除任务' + id);
    }
}]);

mainModule.controller("PlanAuditController", ["$scope", "$state", function ($scope, $state) {
    $scope.apiType = 'year';

    $scope.audit = function () {
        $state.go('audit', '', {reload: true});
    }
}]);

mainModule.controller('PlanDetailController', ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {
    //todo 加载计划信息
    var times = {
        year: '本年度计划',
        yearnext: '下年度计划',
        month: '本月计划',
        monthnext: '下月计划',
        weeks: '本周计划',
        weeksnext: '下周计划'
    };

    var plan = $scope.plan = $scope.plan || {};
    plan.type = times['year'];
    plan.apiTitle = '测试计划';
    plan.apiTime = '8月份';
    plan.apiQuantity = '2';
    plan.apiQuality = '优秀';
    plan.apiEvaluation = '优秀';
    plan.apiCost = '没有成本';
}]);

mainModule.controller('AuditDetailController', ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {
    //todo 加载计划信息
    $scope.auditResult = '0';
    var times = {
        year: '本年度计划',
        yearnext: '下年度计划',
        month: '本月计划',
        monthnext: '下月计划',
        weeks: '本周计划',
        weeksnext: '下周计划'
    };

    var plan = $scope.plan = $scope.plan || {};
    plan.type = times['year'];
    plan.apiTitle = '测试计划';
    plan.apiTime = '8月份';
    plan.apiQuantity = '2';
    plan.apiQuality = '优秀';
    plan.apiEvaluation = '优秀';
    plan.apiCost = '没有成本';
}]);

mainModule.controller('PlanExecuteController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    $scope.apiType = 'year';

    $scope.execute = function () {
        $state.go('executeDetail', '', {reload: true});
    }
}]);

mainModule.controller('ExecuteDetailController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
    //todo 加载计划信息
    $scope.auditResult = '0';
    var times = {
        year: '本年度计划',
        yearnext: '下年度计划',
        month: '本月计划',
        monthnext: '下月计划',
        weeks: '本周计划',
        weeksnext: '下周计划'
    };

    var plan = $scope.plan = $scope.plan || {};
    plan.type = times['year'];
    plan.apiTitle = '测试计划';
    plan.apiTime = '8月份';
    plan.apiQuantity = '2';
    plan.apiQuality = '优秀';
    plan.apiEvaluation = '优秀';
    plan.apiCost = '没有成本';
    plan.apiStatus = '0';
}]);