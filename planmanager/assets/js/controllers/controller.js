loginModule.controller('LoginController', ['$scope', "$http", function ($scope, $http) {
    var loginInfo = android.getTempLoginUser();
    if (loginInfo != null && loginInfo != undefined) {
        loginInfo = JSON.parse(loginInfo);
        $scope.username = loginInfo.username;
        $scope.password = loginInfo.password;
    }

    var address = android.getAddress();
    if (address != null && address != undefined) {
        $scope.address = JSON.parse(address).address;
    }

    $scope.setAddress = function () {
        android.setTempLoginUser($scope.username, $scope.password);
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
                window.location.href = '/android_asset/html/main.html#/list/'
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
        android.saveAddress($scope.name, $scope.address);
        $scope.back();
    };

    $scope.back = function () {
        window.location.href = '/android_asset/html/login.html';
    }
}]);

mainModule.controller("ViewController", ["$scope", function ($scope) {
    $scope.active = [true, false, false];

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

    $scope.addPlan = function () {
        $state.go('add', '', {reload: true});
    };

    $scope.back = function (state, params) {
        $state.go(state, params, {reload: true});
    }
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

mainModule.controller("PlanListController", ["$scope", "$state", "planTypeService", function ($scope, $state, planTypeService) {
    $scope.apiType = 'year';

    $scope.service = planTypeService;
    $scope.$watch("service", function (service) {
        //修改任务类型
        $scope.apiType = service.type;
        //todo 加载对应类型计划
    }, true);

    $scope.execute = function () {
        $state.go('execute', '', {reload: true});
    };

    $scope.deletePlan = function (id) {
        //todo 删除任务
        alert('删除任务' + id);
    }
}]);

mainModule.controller("PlanAuditController", ["$scope", "$state", "planTypeService", function ($scope, $state, planTypeService) {
    $scope.apiType = 'year';

    $scope.service = planTypeService;
    $scope.$watch("service", function (service) {
        //修改任务类型
        $scope.type = service.type;

        //todo 加载对应类型计划
    }, true);

    $scope.audit = function () {
        $state.go('audit', '', {reload: true});
    }
}]);