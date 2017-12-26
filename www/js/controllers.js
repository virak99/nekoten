angular.module('starter.controllers', [])


.controller('ScrollCtrl', function($scope, $ionicScrollDelegate, Chats) {
    /*
  $scope.data = {
    title : ""
  };
  $scope.chats = Chats.all();
  $scope.onComplete = function() {    
    var scrollTop = $ionicScrollDelegate.getScrollPosition().top;        
    if (($(window).height() - scrollTop) < 300){
        loadMore();
    }        
    
  };
  */
})

.controller('TabCtrl', function($scope){
    if (localStorage.getItem('language') == 'kh'){
        $scope.home = 'ទំព័រដើម';
        $scope.search = 'ស្វែងរក';
        $scope.cart = 'កន្ត្រកទំនិញ';
        $scope.my_account = 'គណនី';
        $scope.more = 'ផ្សេងទៀត';
    } else {
        $scope.home = 'Home';
        $scope.search = 'Search';
        $scope.cart = 'Cart';
        $scope.my_account = 'My Account';
        $scope.more = 'More';
    }
})

.controller('NavCtrl', function($scope, $location, $ionicHistory, $state, Chats){
        $scope.chats = Chats.all();

        $scope.myGoBack = function() {
           $backView = $ionicHistory.backView();
           if ($backView != null){
               $backView.go();
           } else {
               $location.path('tab.home');
           }
        };
        $scope.go = function ( path ) {
	       $location.path( path );
        };
        $scope.refresh = function (page) {
            if (page == 'shipping_addr'){
                loadShippingAddr();
            } else if (page == 'cart'){
                loadCart();
            } else if (page == 'wishlist'){
                loadWishlistViewedItem('wishlist');
            } else if (page == 'viewed_item'){
                loadWishlistViewedItem('viewed_item');
            } else if (page == 'question'){
                loadQuestionReviewList('question', 'account', '');
            } else if (page == 'review'){
                loadQuestionReviewList('review', 'account', '');
            } else if (page == 'order_detail'){
                var order_id = $('#order_detail #order_id').text();                
                loadOrderDetail(order_id);                
            } else if (page == 'contact_us'){
                getInfo('contact_us');
            } else if (page == 'order_all'){
                loadOrder('all');
            } else if (page == 'order_reviewed'){
                loadOrder('reviewed');
            } else if (page == 'order_paid'){
                loadOrder('paid');
            } else if (page == 'notification'){
                loadNotification();
            }
            $scope.$broadcast('scroll.refreshComplete');
        }
        

});

