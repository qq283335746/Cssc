angular.module('ngTygaSoft.services.ImportData', [])
.factory('$tygasoftImportData', function ($ionicLoading, $ionicPopup, $http, $tygasoftMC, $tygasoftCommon, $tygasoftDbHelper) {

    var ts = {};

    ts.Bind = function ($scope) {
        $scope.onImport = function () {
            ts.GetOrderPurchaseCargoList(1, 1000);
            //ts.GetOrderPurchaseCargoListTest(1, 1000);
        };

    };

    ts.GetOrderPurchaseCargoList = function (pageIndex, pageSize) {
        try {
            var url = "" + $tygasoftCommon.ServerUrl() + "/Services/PdaService.svc/GetOrderPurchaseCargoList";
            var sData = '{"model":{"PageIndex":"' + pageIndex + '","PageSize":"' + pageSize + '"}}';
            //console.log('url--' + url);
            $ionicLoading.show();
            $http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
            $http({
                method: 'POST',
                url: url,
                data: sData
            }).then(function (res) {
                $ionicLoading.hide();
                var result = res.data;
                //alert(JSON.stringify(result));
                //console.log('GetCargoList--result--' + JSON.stringify(result));
                if (result.ResCode != 1000) {
                    $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: result.Msg, okText: $tygasoftMC.MC.Btn_OkText });
                    return false;
                }
                var jData = JSON.parse(result.Data);
                var okCount = 0;
                for (var i = 0; i < jData.length; i++) {
                    var item = jData[i];
                    //console.log('GetCargoList--item--' + JSON.stringify(item));
                    $tygasoftDbHelper.DoInsert('OrderPurchaseCargo', 'Admin', $tygasoftMC.DataStatus.Import, item.Barcode, JSON.stringify(item), true);
                    okCount++;
                }
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.GetString('Server_Data_ImportCount', okCount), okText: $tygasoftMC.MC.Btn_OkText });

            }, function (err) {
                $ionicLoading.hide();
                alert($tygasoftMC.MC.Http_Err);
            });
        }
        catch (e) {
            $ionicLoading.hide();
        }
    };

    ts.GetOrderPurchaseCargoListTest = function (pageIndex, pageSize) {
        try {
            var url = $tygasoftCommon.ServerUrl() + "/Services/PdaService.svc/GetOrderPurchaseCargoList";
            var sData = '{"model":{"PageIndex":"' + pageIndex + '","PageSize":"' + pageSize + '"}}';
            alert('url--' + url);
            $ionicLoading.show();
            $http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
            $http({
                method: 'POST',
                url: url,
                data: sData
            }).then(function (res) {
                $ionicLoading.hide();
                var result = res.data;
                alert('result--' + JSON.stringify(result));
                console.log('result--' + JSON.stringify(result));
                if (result.ResCode != 1000) {
                    $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: result.Msg, okText: $tygasoftMC.MC.Btn_OkText });
                    return false;
                }
                var jData = JSON.parse(result.Data);
                var okCount = 0;
                for (var i = 0; i < jData.length; i++) {
                    var item = jData[i];
                    //console.log('GetCargoList--item--' + JSON.stringify(item));
                    //$tygasoftDbHelper.DoInsert('Cargo', 'Admin', $tygasoftMC.DataStatus.Import, item.Id, JSON.stringify(item), true);
                    okCount++;
                }
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.GetString('Server_Data_ImportCount', okCount), okText: $tygasoftMC.MC.Btn_OkText });

            }, function (err) {
                $ionicLoading.hide();
                alert($tygasoftMC.MC.Http_Err);
            });
        }
        catch (e) {
            $ionicLoading.hide();
        }
    };

    return ts;
});