angular.module('starter.services', [])

.factory('Chats', function() {

  var chats = [{
    face: 'img/max.png'
  }, {
    face: 'img/adam.jpg'
  }, {
    face: 'img/mike.png'
  }];

/*
var str = localStorage.getItem('aa');
var chats = JSON.parse(str);
*/
  return {
    all: function() {
      return chats;
    }
  };
});
