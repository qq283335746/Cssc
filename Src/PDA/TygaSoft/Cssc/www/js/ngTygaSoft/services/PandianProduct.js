angular.module('ngTygaSoft.services.PandianProduct', [])

.factory('$tygasoftPandianProduct', function ($http, $ionicLoading, $ionicPopup, $ionicModal, ionicDatePicker, $tygasoftMC, $tygasoftCommon, $tygasoftDbHelper) {

    var ts = {};

    ts.Bind = function ($scope, key) {
        $scope.btnTabIndex = 0;
        $scope.onTabSelected = function (index) {
            $scope.btnTabIndex = index;
        };
        $scope.onBarcodeChanged = function () {
            if ($scope.btnTabIndex == 0) {
                ts.GetBarcode($scope);
            }
        };
        $scope.onSure = function () {
            ts.GetBarcode($scope);
        };
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
        $ionicModal.fromTemplateUrl('templates/DlgPandianProduct.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.pandianProductModal = modal;
        });
        $scope.onCancelDlgPandianProduct = function () {
            $scope.pandianProductModal.hide();
        };
        $scope.onSavePandianProduct = function () {
            var pQty = $scope.OrderPurchaseCargoInfo.PQty;
            if (!pQty) {
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.GetString('Params_NotExist', pQty), okText: $tygasoftMC.MC.Btn_OkText });
                return false;
            }
            if (pQty > $scope.OrderPurchaseCargoInfo.Qty) {
                $ionicPopup.confirm({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_QtyErrorConfirm, cancelText: $tygasoftMC.MC.Btn_CancelText, okText: $tygasoftMC.MC.Btn_OkText }).then(function (r) {
                    if (r) {
                        ts.OnSavePandianProduct($scope);
                    }
                })
                return false;
            }
            ts.OnSavePandianProduct($scope);
        };
    };

    ts.OnSavePandianProduct = function ($scope) {
        var key = $scope.OrderPurchaseCargoInfo.Barcode + "|" + $scope.ModelInfo.OrderCode;
        $scope.OrderPurchaseCargoInfo.OrderCode = $scope.ModelInfo.OrderCode;
        $scope.OrderPurchaseCargoInfo.Warehouse = $scope.ModelInfo.Warehouse;
        var value = JSON.stringify($scope.OrderPurchaseCargoInfo);
        $tygasoftDbHelper.DoInsert('PandianProduct', 'Admin', $tygasoftMC.DataStatus.Update, key, value,true).then(function (res) {
            if (!res || res == 0) {
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_ExError, okText: $tygasoftMC.MC.Btn_OkText });
                return false;
            }
            $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Response_Ok, okText: $tygasoftMC.MC.Btn_OkText });
            ts.GetPandianProductList($scope);
            $scope.onCancelDlgPandianProduct();
        }, function (err) {
            alert(err)
        })
    };

    ts.GetBarcode = function ($scope) {
        var barcode = $scope.ModelData.Barcode;
        $scope.ModelData.Barcode = '';
        if (!barcode || barcode == '') return false;

        ts.GetOrderPurchaseCargoInfo($scope, barcode);
    };

    ts.GetOrderPurchaseCargoInfo = function ($scope,barcode) {
        try {
            $ionicLoading.show();
            $tygasoftDbHelper.GetValueByKey('OrderPurchaseCargo',barcode).then(function (res) {
                $ionicLoading.hide();
                if (!res) {
                    $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.GetString('Params_NotExist', barcode), okText: $tygasoftMC.MC.Btn_OkText });
                    return false;
                }
                $scope.OrderPurchaseCargoInfo = JSON.parse(res);
                $scope.pandianProductModal.show();
            }, function (err) {
                $ionicLoading.hide();
                alert(err)
            })
        }
        catch (e) {
            $ionicLoading.hide();
        }
    }

    ts.GetPandianProductList = function ($scope) {
        try {
            var sqlWhere = "and KeyName like '%" + $scope.ModelInfo.OrderCode + "%' ";
            $tygasoftDbHelper.ExecuteReader('PandianProduct', sqlWhere).then(function (res) {
                if (res) {
                    var list = [];
                    for (var i = 0; i < res.length; i++) {
                        list.push(JSON.parse(res.item(i).ContentValue));
                    }
                    $scope.PandianProductItems = list;
                }
            })
        }
        catch (e) {}
    };

    return ts;
});