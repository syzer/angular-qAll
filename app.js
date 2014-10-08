'use strict';

var app = angular.module('qAll', []);

app.factory('loadFile', function ($q, $http) {
    return function loadFile(file) {
        var deffered = $q.defer();

        $http({url: file, method: 'GET'})
            .success(function (data) {
                deffered.resolve(data);
            })
            .error(function (error) {
                deffered.reject();
            });

        return deffered.promise;
    }
});

app.factory('getFiles', function ($q, loadFile) {
    return function (files) {
        return $q.all(files.map(loadFile));
    };
});

app.factory('allWithProgress', function ($q) {
    return function allWithProgress(promises, progress) {
        var total = promises.length;
        var now = 0;
        promises.forEach(function (p) {
            p.then(function () {
                now++;
                progress(now / total);
            });
        });
        return $q.all(promises);
    }
});


app.controller('MainCtrl', function ($scope, $log, getFiles, allWithProgress, loadFile) {

    var files = ['/file/part1.json', '/file/part2.json', '/file/part3.json'];

    function loadAndPrintFiles(files) {
        return getFiles(files)
            .then(function (combinedData) {
                $scope.part1 = combinedData[0];
                $scope.part2 = combinedData[1];
                $scope.part3 = combinedData[2];
            })
            .catch(function (error) {
                $scope.error = "There was an error reading files.";
            });
    }

    // normal
    loadAndPrintFiles(files);

    // with non existent file
//    files.push('NonExistent');
    loadAndPrintFiles(files);

    // allWithProgress
    allWithProgress(files.map(loadFile), function reportProgress(progress) {
        $log.log('progressBar', progress * 100, '%');
    }).then(function (combinedData) {
        $log.log('combinedData', combinedData);
    }).catch(function (error) {
        $log.log("There was an error reading files.");
    })

});
