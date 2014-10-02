var app = angular.module('qAll', []);


app.factory('getFiles', function ($q, $http) {

    return function (files) {
        return $q.all(files.map(loadFile));
    };

    function loadFile(file) {
        var deffered = $q.defer();

        $http({
            url: file,
            method: 'GET'
        }).
            success(function (data) {
                deffered.resolve(data);
            }).
            error(function (error) {
                deffered.reject();
            });

        return deffered.promise;
    }

});

app.controller('MainCtrl', function ($scope, getFiles) {

    getFiles(['/file/part1.json', '/file/part2.json', '/file/part3.json'])
        .then(function (combinedData) {
            $scope.part1 = combinedData[0];
            $scope.part2 = combinedData[1];
            $scope.part3 = combinedData[2];
        })

});
