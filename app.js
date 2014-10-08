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
                deffered.reject(error + file);
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

        return $q.all(promises.map(function (p) {
            return p.then(function (data) {
                now++;
                progress(now / total);
            })
        }));
    }
});

app.controller('MainCtrl', function ($scope, $log, getFiles, allWithProgress, loadFile) {

    var files = ['/file/part1.json', '/file/part2.json', '/file/part3.json'];

    function loadAndPrintFiles(files) {
        return getFiles(files)
            .then(function (combinedData) {
                $scope.combinedData = combinedData;
            })
            .catch(function (error) {
                $scope.error = 'There was an error reading files.' + error;
            });
    }

    // normal
    loadAndPrintFiles(files);

    // with non existent file
    files.push('NonExistent.json');
    loadAndPrintFiles(files);

    // allWithProgress
    allWithProgress(files.map(loadFile), function reportProgress(progress) {
        $log.log('progressBar', progress * 100, '%');
    }).then(function (combinedData) {
        $log.log('combinedData', combinedData);
    }).catch(function (error) {
        $log.log('There was an error reading files.', error);
    })

});
