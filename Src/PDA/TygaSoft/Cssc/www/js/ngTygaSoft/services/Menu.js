angular.module('ngTygaSoft.services.Menu', [])
.factory('$tygasoftMenu', function ($ionicSideMenuDelegate, $ionicPopup, $tygasoftMC) {

    var ts = {};

    ts.Bind = function ($scope) {
        $scope.onTo = function (index) {
            ts.OnTo($scope, index);
        };
        ts.GetMenus($scope);
        ts.GetHomeMenus($scope);
    };

    ts.GetMenus = function ($scope) {
        $scope.MenuItems = [{ "Id": 1, "Name": "进入盘点", "icon": "ion-ios-home-outline", "Url": "#/app/AddPandian" }, { "Id": 2, "Name": "导入数据", "icon": "ion-ios-shuffle", "Url": "#/app/ImportData" }, { "Id": 3, "Name": "导出报表", "icon": "ion-ios-snowy", "Url": "#/app/ExportData" }, { "Id": 4, "Name": "设置", "icon": "ion-ios-gear-outline", "Url": "#/app/SysSet" }, { "Id": 5, "Name": "检测更新", "icon": "ion-android-sync" }, { "Id": 6, "Name": "退出", "icon": "ion-power" }, { "Id": 7, "Name": "关于", "icon": "ion-ios-information-outline" }];
    };

    ts.GetHomeMenus = function ($scope) {
        $scope.HomeMenuItems = [{ "Id": 1, "Name": "进入盘点", "icon": "ion-ios-home-outline", "Url": "#/app/AddPandian" }, { "Id": 2, "Name": "导入数据", "icon": "ion-ios-shuffle", "Url": "#/app/ImportData" }, { "Id": 3, "Name": "导出报表", "icon": "ion-ios-snowy", "Url": "#/app/ExportData" }, { "Id": 4, "Name": "设置", "icon": "ion-ios-gear-outline", "Url": "#/app/SysSet" }];
    };

    ts.OnTo = function ($scope,index) {
        var item = $scope.MenuItems[index];
        if (!item.Url || item.Url == '') {
            switch (item.Name) {
                case "退出":
                    ts.ExitApp();
                    break;
                default:
                    break;
            }
        }
        else {
            window.location = item.Url;
        }
        $ionicSideMenuDelegate.toggleLeft();
    };

    ts.ExitApp = function () {
        $ionicPopup.confirm({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_ExitApp_Content, cancelText: $tygasoftMC.MC.Btn_CancelText, okText: $tygasoftMC.MC.Btn_OkText }).then(function (res) {
            if (res) {
                ionic.Platform.exitApp();
            }
        })
    };

    return ts;
});