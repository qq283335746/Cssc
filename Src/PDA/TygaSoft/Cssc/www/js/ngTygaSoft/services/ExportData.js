angular.module('ngTygaSoft.services.ExportData', [])
.factory('$tygasoftExportData', function ($http, $ionicLoading, $ionicPopup, $tygasoftMC, $tygasoftCommon, $tygasoftDbHelper) {

    var ts = {};

    ts.Bind = function ($scope) {
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };
        $scope.onCommit = function () {
            ts.OnCommit($scope);
        }
    };

    ts.GetPandianProductList = function ($scope) {
        try {
            $ionicLoading.show();
            $tygasoftDbHelper.GetAll('PandianProduct').then(function (res) {
                $ionicLoading.hide();
                if (res) {
                    var list = [];
                    for (var i = 0; i < res.length; i++) {
                        list.push(JSON.parse(res.item(i).ContentValue));
                    }
                    $scope.PandianProductItems = list;
                }
                else $scope.PandianProductItems = [];
            }, function (err) {
                $ionicLoading.hide();
                alert(err)
            })
        }
        catch (e) {
            $ionicLoading.hide();
        }
    };

    ts.OnCommit = function ($scope) {
        try {
            if (!$scope.PandianProductItems || $scope.PandianProductItems.length == 0) {
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Data_ToServer_EmptyError, okText: $tygasoftMC.MC.Btn_OkText });
                return false;
            }
            var okCount = 0;
            $ionicLoading.show();
            var url = "" + $tygasoftCommon.ServerUrl() + "/Services/PdaService.svc/SaveOrderPurchaseCargo";
            var totalLen = $scope.PandianProductItems.length;
            for (var i = 0; i < totalLen; i++) {
                var item = $scope.PandianProductItems[i];
                if (item.OrderCode && item.OrderCode != '') {
                    okCount++;
                    try {
                        var sData = '{"model":{"ItemJson":"' + encodeURIComponent(JSON.stringify(item)) + '"}}';
                        $http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                        $http({
                            method: 'POST',
                            url: url,
                            data: sData
                        }).then(function (res) {
                            var result = res.data;
                            //alert('result--' + JSON.stringify(result));
                            if (result.ResCode != 1000) {
                                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: result.Msg, okText: $tygasoftMC.MC.Btn_OkText });
                                return false;
                            }
                            var key = item.Barcode + "|" + item.OrderCode;
                            $tygasoftDbHelper.Delete("PandianProduct", key);

                        }, function (err) {
                            $ionicLoading.hide();
                            alert($tygasoftMC.MC.Http_Err);
                        });
                    }
                    catch (e) {
                        $ionicLoading.hide();
                        return false;
                    }
                }
            }
            $ionicLoading.hide();
            if (okCount == 0) {
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Data_ToServer_EmptyError, okText: $tygasoftMC.MC.Btn_OkText });
                return false;
            }
            
            $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Response_Ok, okText: $tygasoftMC.MC.Btn_OkText });
            var totalItv = 0;
            var objItv = setInterval(function () {
                ts.GetPandianProductList($scope);
                if ($scope.PandianProductItems.length == 0) clearInterval(objItv);
                else {
                    if (totalItv > okCount * 2) {
                        clearInterval(objItv);
                    }
                }
                totalItv++;
            }, 2000);
        }
        catch (e) {
            alert($tygasoftMC.MC.M_ExError);
        }
    };

    return ts;
});