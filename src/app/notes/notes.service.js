angular.module('notes.service',['ngResource'])
    .constant('ServiceSettings', {
        restPath: 'http://172.16.0.12:80/'
    })
    .factory('ResourceService',['$resource','ServiceSettings',function($resource,ServiceSettings) {
        return {
            getSubjects: function () {
                return $resource(
                    ServiceSettings.restPath +"subjects.php",
                    {},
                    {
                        get:  {method:'GET' ,isArray:true}
                    });
            },
            newSubject: function (newName) {
                return $resource(
                    ServiceSettings.restPath +"subjects.php",
                    {
                        name: newName
                    },
                    {
                        post:  {method:'POST' ,isArray:false}
                    });
            },
            getNotes: function(subject, id) {
                return $resource(
                    ServiceSettings.restPath +"notes.php",
                    {
                        subject: subject,
                        id: id
                    },
                    {
                        get:  {method:'GET' ,isArray:false}
                    });
            },
            postNotes : function(upSubject, upData, upTitle) {
                return this.restPostNotes(upSubject, upData, upTitle).post().$promise.then(function(res){
                    return res.id;
                });
            },
            restPostNotes: function(upSubject, upData, upTitle) {
                return $resource(
                    ServiceSettings.restPath +"notes.php",
                    {
                        subject: upSubject,
                        data: upData,
                        title: upTitle
                    },
                    {
                        post:  {method:'POST' ,isArray:false}
                    });
            },
            updateNotes: function(upSubject, upId, upData) {
                return $resource(
                    ServiceSettings.restPath +"notes.php",
                    {
                        subject: upSubject,
                        id: upId,
                        data: upData
                    },
                    {
                        post:  {method:'POST' ,isArray:false}
                    });
            }
        };
    }]);