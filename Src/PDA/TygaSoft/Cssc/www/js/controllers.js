angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $tygasoftMenu) {
    $tygasoftMenu.Bind($scope);
})
.controller('DefaultCtrl', function ($scope) {

})
.controller('AddPandianCtrl', function ($scope, $tygasoftCommon, $tygasoftPandian) {
    $scope.ModelData = { "OrderCode": "" + $tygasoftCommon.GetRndOrderCode(999) + "" };
    $tygasoftPandian.Bind($scope, "AddPandian");
})
.controller('PandianCtrl', function ($scope, $tygasoftPandian) {
    $scope.ModelData = {};
    $tygasoftPandian.Bind($scope, "Pandian");
    $scope.$on('$ionicView.enter', function (e) {
        $tygasoftPandian.GetPandianList($scope);
    });
})
.controller('PandianProductCtrl', function ($scope, $stateParams, $tygasoftPandianProduct) {
    $scope.ModelData = { "Barcode": "" };
    $scope.ModelInfo = JSON.parse($stateParams.item);
    $tygasoftPandianProduct.Bind($scope, "");
    $scope.$on('$ionicView.enter', function (e) {
        $tygasoftPandianProduct.GetPandianProductList($scope);
    });
})
.controller('ImportDataCtrl', function ($scope, $tygasoftImportData) {
    $tygasoftImportData.Bind($scope);
})
.controller('ExportDataCtrl', function ($scope, $tygasoftExportData) {
    $tygasoftExportData.Bind($scope);
    $scope.$on('$ionicView.enter', function (e) {
        $tygasoftExportData.GetPandianProductList($scope);
    });
})
.controller('SysCtrl', function ($scope, $tygasoftLocalStorage, $tygasoftSys) {
    $scope.ModelData = { "ServiceUrl": "" + $tygasoftLocalStorage.Get("ServiceUrl", "") + "" };
    $tygasoftSys.Bind($scope);
});
