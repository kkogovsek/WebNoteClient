angular.module('notes',[
    'ui.router',
    'notes.service',
    'ui.utils'
])
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'notes', {
            url: '/notes',
            views: {
                "main": {
                    controller: function($scope, ResourceService){
                        $scope.subjects = ResourceService.getSubjects().get();
                        $scope.newSubject = function(){
                            ResourceService.newSubject($scope.name).post();
                            $scope.subjects = ResourceService.getSubjects().get();
                            $scope.name = "";
                            alert("Subject added");
                        };
                    },
                    templateUrl: function($stateParams){
                        return 'notes/notes.tpl.html';
                    }
                },
                "content": {
                    controller: function($scope, ResourceService){
                        $scope.subjects = ResourceService.getSubjects().get();
                    },
                    templateUrl:  'notes/templates/selectArticle.tpl.html'
                }
            },
            data:{ pageTitle: 'Notes' }
        })
        .state( 'notes.select', {
            views: {
                "content": {
                    controller: function($scope, ResourceService, $state){
                        $scope.selected = undefined;
                        $scope.subjects = ResourceService.getSubjects().get();
                        $scope.redirect = function(url) {
                            $state.href(url);
                        };
                    },
                    templateUrl:  'notes/templates/selectArticle.tpl.html'
                }
            }
        })
        .state( 'notes.edit', {
            views: {
                "content": {
                    controller: function($scope, ResourceService, $window, $rootScope, $interval){
                        $scope.article = {};
                        if($rootScope.selected) {
                            $scope.subject = $rootScope.selected.subject;
                            $scope.id = $rootScope.selected.note.file;
                            $scope.article.title = $rootScope.selected.note.title;
                            ResourceService.getNotes($rootScope.selected.subject.id, $rootScope.selected.note.file).get().$promise.then(function(val){
                                $scope.article.text = decodeURIComponent(val.data.replace(/\+/g, '%20'));
                            });
                        }
                        else {
                            $scope.article.text = "";
                        }

                        $scope.subjects = ResourceService.getSubjects().get();
                        $scope.post = function() {
                            var find = '   ';
                            var re = new RegExp(find, 'g');
                            $scope.article.text = $scope.article.text.replace(re,'\t');
                            if(!$scope.id) {
                                $scope.updated = false;
                                $scope.saved = true;

                                $scope.id = ResourceService.postNotes($scope.subject.id, $scope.article.text, $scope.article.title);
                                $scope.id.then(function(id){
                                    $scope.id = id;
                                });
                            }
                            else {
                                $scope.updated = true;
                                $scope.saved = false;

                                ResourceService.updateNotes($scope.subject.id, $scope.id, $scope.article.text).post();
                            }
                        };

                        $interval(function() {
                            if($scope.id) {
                                $scope.updated = true;
                                $scope.saved = false;

                                ResourceService.updateNotes($scope.subject.id, $scope.id, $scope.article.text).post();
                            }
                        }, 60000);

                        $interval(function() {
                            $scope.updated = false;
                            $scope.saved = false;
                        }, 10000);

                        $scope.$watch('article.text',function() {
                            var converter = new $window.Showdown.converter();
                            $scope.text = converter.makeHtml(decodeURIComponent($scope.article.text));
                            angular.element(document.querySelector('#text')).html($scope.text);
                        });
                    },
                    templateUrl: 'notes/templates/editArticle.tpl.html'
                }
            }
        })
        .state( "notes.view", {
            views: {
                "content": {
                    controller: function($scope, ResourceService, $rootScope, $window){
                        $scope.subject = $rootScope.selected.subject;
                        $scope.note = $rootScope.selected.note;
                        $scope.text = "Loading ...";
                        ResourceService.getNotes($rootScope.selected.subject.id, $rootScope.selected.note.file).get().$promise.then(function(val){
                            var converter = new $window.Showdown.converter();
                            $scope.text = converter.makeHtml(decodeURIComponent(val.data.replace(/\+/g, '%20')));
                            angular.element(document.querySelector('#text')).html($scope.text);
                        });
                    },
                    templateUrl: 'notes/templates/viewArticle.tpl.html'
                }
            }
        })
        ;
    })
    .directive('markdown', function($window) {
        var converter = new $window.Showdown.converter();
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                var htmlText = converter.makeHtml(element.text());
                element.html(htmlText);
            }
        };
    })
;