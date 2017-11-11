
function setDefault(name, value){
    var a = localStorage.getItem(name);
    if (a == null){
        localStorage.setItem(name, value);                 
    }
    
}

/* Initial */

setDefault('language', 'en');
setDefault('delivery_to', 'Phnom Penh,ភ្នំពេញ');
setDefault('delivery_fee', '0');
setDefault('user_id', 'not_login');


var lang = localStorage.getItem('language');
var user_id = localStorage.getItem('user_id');



/* Fix ontap */
$(document).on('tap', '[ontap]', function(){
     new Function($(this).attr('ontap'))();
});


function selectTab(tab){
    $('.my-tab-content .a').hide();
    $('.my-tab-content #'+tab).show();
    $('.my-tab .a').removeClass('selected');
    $('.my-tab #'+tab).addClass('selected');
}

    
function selectLocation(name_en, name_kh){
    closeSmallModal('choose_location_modal');
    updateDeliveryTo(name_en, name_kh);
}

$.post('http://www.nekoten.khmerqq.com/app/location.php',{}, function(data){
    var arr = JSON.parse(data);        
    for (var i = 0; i < arr.length; i++){
        var a = arr[i];
        var str = '<li class="item item-complex" onclick="selectLocation(\''+a['name_en']+'\', \''+a['name_kh']+'\')">';
            str += '<a class="item-content">';
            str += '<span k="'+a['name_kh']+'">'+a['name_en']+'</span>';
            str += '<span class="price-li">$ '+a['price']+' </span>';
        str += '</a></li>';
        $('#choose_location_ul_2').append(str); 
    }
    load('delivery_to');
    la();
});

function postAddress(){
    var user_id = localStorage.getItem('user_id');
    var name = $('#shipping_info_form #name').val();
    var phone_number = $('#shipping_info_form #phone_number').val();
    var location = $('#shipping_info_form #location').attr('value');
    var address = $('#shipping_info_form #address').val();
    var near_by = $('#shipping_info_form #near_by').val();
    var bus_name = $('#shipping_info_form #bus_name').val();
    var bus_phone_number = $('#shipping_info_form #bus_phone_number').val();
    
    var addr_selected = $('.my-tab #tab-address').hasClass('selected');
   
    if (addr_selected) {
        var coordinate = '';
    } else {
        var coordinate = $('#shipping_info_form #coordinate').val();
    }
    
    $.post('http://www.nekoten.khmerqq.com/app/post_address.php', {user_id:user_id, name: name, phone_number:phone_number, location:location, 
        address:address, near_by:near_by, coordinate:coordinate, bus_name:bus_name, bus_phone_number:bus_phone_number},
        function(data){
            if (data == 'success'){               
                loadDefaultShippingInfo();                    
                $('#add_address').hide();
                closeModal('shipping_info_modal');
                closeModal('shipping_address_modal');                
            }
    });                
}


function getLocation(){
    var onSuccess = function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var str = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDocD-TtjQMfFFWBrBVUnl9BzBrhmX-AdA&q='+lat+','+lng;
        $('#gps-map-frame').attr('src', str);
        $('#coordinate').val(lat+','+lng);
        
    };
    navigator.geolocation.getCurrentPosition(onSuccess);
}

function isLogined(){
    var a = localStorage.getItem('user_id');
    return (typeof a !== 'undefined' && a !== null);
}



function closeSmallModal(page){        
    $('#'+page).css('transform', 'translateY(100%)');    
}

function openModal(page){
    
    $('#'+page).height($(window).height());        
    $('#'+page).css('transform', 'translateY(0)');
    $('.header-view').hide();        
    $('.tab-nav').hide();        
    //StatusBar.hide(); 
    
}
function closeModal(page){        
    $('#'+page).css('transform', 'translateY(100%)');    
    $('.header-view').show();        
    $('.tab-nav').show();
}


function openSmallModal(page){
    
    $('#'+page).height($(window).height());
    $('#'+page).css('transform', 'translateY(0)');    
    $('.header-view').hide();        
    $('.tab-nav').hide();        
    //StatusBar.hide();
    
}


function alertConfirm(en, kh){            
    if (lang == 'en') $('#alert_confirm .ms-alert-header').text(en);
    else  $('#alert_confirm .ms-alert-header').text(kh);
    $('#alert_confirm').css('display', 'flex');                    
}

function myAlert(en, kh){
    if (lang == 'en') $('#alert .ms-alert-header').text(en);
    else  $('#alert .ms-alert-header').text(kh);
    $('#alert').css('display', 'flex');   
}


function loadShippingAddr(selected_id){
    var user_id = localStorage.getItem('user_id');
    $('.qw .shipping_address_item').html('');
    $.post('http://nekoten.khmerqq.com/app/shipping_address.php', {user_id:user_id}, function(data){
        var a = JSON.parse(data);        
        if (a.length == 0){            
            var str = '<div class="u">';
            if (lang == 'en') str += 'No Shipping Address'; else str += 'គ្មានអាស័យដ្ឋានដឹកជញ្ជូន';            
            str += '</div>';
            $('.qw .shipping_address_item').html(str);
        } else {
            for (var i = 0; i < a.length; i++){
                var abc = window.location.href.split('/');
                var current_page = abc[abc.length-1];
                var b = a[i];
                var str = '<li class="item item-complex">';
                str += shippingInfoItem(b);                                            
                
                if (current_page == 'review_order'){
                    if (b['id'] == selected_id) {
                        str += '<span class="fa fa-check"></span>';
                    }                
                } else if (current_page == 'shipping_addr'){
                    str += '<span class="fa fa-angle-right"></span>';
                }
                str += '</li>';
                $('.qw .shipping_address_item').append(str);                                    
            }
            $('.qw .shipping_address_item .shipping-item').on('tap', function(){
                
                if (current_page == 'review_order'){     
                    var id = $(this).attr('value');
                    var str = '<a class="item-content shipping-item" value="'+id+'">';
                    str += $(this).html();
                    str += '<span class="fa fa-angle-right"></span></a>';                                        
                    $('.eq #shipping_addr').html(str);
                    $('.eq #shipping_addr_id').val(id);                    
                    $('.eq #shipping_addr .shipping-item').on('click', function(){
                        loadShippingAddr(id);
                        openModal('shipping_address_modal');
                    });
                    closeModal('shipping_address_modal');                    
                }
            });
        }            
        la();
    });
}



function shippingInfoItem(a){
              
    if (a['result'] == 'success'){
        $('.eq #add_address').hide();
        var str = '<a class="item-content shipping-item" value="'+a['id']+'"><b>'+a['name']+'</b><br>';
        if (a['address'] != '') str += a['address']+'<br>';
        if (lang == 'en') str += a['location'].split(',')[0]+'<br>'; else str += a['location'].split(',')[1]+'<br>';
        if (a['near_by'] != ''){
            if (lang == 'en') str += 'Near by: '; else str += 'នៅក្បែរ: ';
            str += a['near_by']+'<br>';
        }                    
        if (lang == 'en') str += 'Tel: '; else str += 'លេខទូរស័ព្ទ: ';
        str += +a['phone_number']+'<br>';
        if (a['coordinate'] != '') {            
            var lat = a['coordinate'].split(',')[0].substr(0,9);
            var lng = a['coordinate'].split(',')[1].substr(0,9);
            str += 'GPS: '+lat+', '+lng;
            var src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyC62zOchEdNGLWgfZmgQqzmsVgyZrmQeZo&zoom=18&q='+a['coordinate'];            
            str += '<iframe id="gps-map-frame" height="200" frameborder="0" src="'+src+'"></iframe>';            
        }
        if (a['bus_name'] != ''){
            str += '<div class="send-by-bus"></div>';                
            if (lang == 'en') {
                str += 'Send item via Bus<br>'; 
                str += 'Bus Name: '+a['bus_name']+'<br>';
                str += 'Bus Phone Number: ' + a['bus_phone_number'];
            } else {
                str += 'ផ្ញើរទំនិញតាមឡាន<br>';
                str += 'ឈ្មោះឡាន: '+a['bus_name']+'<br>';
                str += 'លេខទូរស័ព្ទឡាន: ' + a['bus_phone_number'];
            }                                                         
        }
    }
    return str;
}


function loadCart(){        
    var shopping_cart = localStorage.getItem('shopping_cart');
    if (!shopping_cart){
        $('#no_item_in_cart').show();        
        $('.cart-footer').hide();        
        
    } else {        
        
        $('#no_item_in_cart').hide();            
        $('.cart-footer').show();        
        var cart = localStorage.getItem('shopping_cart').split(',');
        var size_l = '120';       
        var subtotal = 0;
        var cart_count = 0;
        var delivery_fee = localStorage.getItem('delivery_fee');
        $('.delivery_fee').text('$ '+delivery_fee);
        $('#cart-cart').html('');
        $('#cart-review').html('');
            
        for (var j = 1; j < cart.length; j++){
            var ad_id = cart[j].split(':')[0];
            var opt = cart[j].split(':')[1];
            var qty = cart[j].split(':')[2];                
            cart_count += parseInt(qty);
            
            $.post('http://www.nekoten.khmerqq.com/app/product_item.php',{qty:qty, size_l:size_l, ad_id:ad_id},function(data){
                
                var ad = JSON.parse(data)[0];        
                subtotal += parseFloat(ad['price'].replace('$ ', '').replace(',', ''))*parseInt(qty);                     
                var str = '<li class="p-list" id="cart-item-'+ad['ad_id']+'">';
                    str += '<div class="a" style="width:'+size_l+'px;height:'+size_l+'px">';
                        str += '<img src="http://nekoten.khmerqq.com/ads/'+ad['ad_id']+'/1_m.jpg" style="width:'+ad['w']+'; height:'+ad['h']+'; margin-'+ad['margin']+':'+ad['px_l']+'px">';
                    str += '</div>';
                    str += '<div class="b">';
                        str += '<div class="c">'+ad['title']+'</div>';
                        str += '<div class="cc"><span class="ion-checkmark-round"></span><span k=" មានក្នុងស្តុក"> In Stock</span></div>';
                        str += '<div class="e">';
                            str += '<div class="dd">'+ad['price']+'</div>';
                            str += '<div class="h">';
                                str += '<span class="jj" onclick="qtyMinus(\''+ad['ad_id']+'\')"><span class="j ion-ios-minus-empty"></span></span>';
                                str += '<span id="qty">'+ad['qty']+'</span>';
                                str += '<span class="jj" onclick="qtyPlus(\''+ad['ad_id']+'\')"><span class="j ion-ios-plus-empty"></span></span>';
                            str += '</div>';
                            str += '<div class="i"><span class="delete ion-ios-trash-outline" ontap="deleteCart(\''+ad['ad_id']+'\')"></span></div>';
                        str += '</div>';
                    str += '</div>';
                str += '</li>';
                $('#cart-cart').append(str);                            
                $('#cart-review').append(str);                            
                
                $('.subtotal').text('$ '+subtotal.toFixed(2));
                $('.total').text('$ '+(parseFloat(subtotal)+parseFloat(delivery_fee)).toFixed(2));
            });                 
        }
        $('.cart_count').text(cart_count);
        $('.badge').text(cart_count);
        
    }
}

function switchLocationTab(){
    /* For Add an Address of Review Order */
    if (localStorage.getItem('delivery_to') != 'Phnom Penh,ភ្នំពេញ'){
        $('#shipping_info_form #phnom_penh_tab').hide();
        $('#shipping_info_form #province_tab').show();                
    } else {
        $('#shipping_info_form #phnom_penh_tab').show();
        $('#shipping_info_form #province_tab').hide();            
    }    
}


function updateDeliveryTo(name_en, name_kh, fee){
    
    localStorage.setItem('delivery_to', name_en+','+name_kh);
    localStorage.setItem('delivery_fee', fee);
    if (fee == 0) var fee2 = 'Free'; else var fee2 = '$ '+fee;
    if (lang == 'en'){        
        $('#shipping_info_form #location').text(name_en); // Shipping Info Page
        $('.mr #delivery_to').text(name_en); // More Page
        $('#product_delivery_to #delivery_to').text(name_en); // Product Page  
        $('.lg #location').text(name_en); // Add an address  
        $('.delivery_fee').text('$ '+ fee); // Cart & Review Order Page
        $('#product_delivery_to #delivery_fee').text(fee2); // Product Page        
        switchLocationTab();
    } else {
        $('#shipping_info_form #location').text(name_kh);
        $('.mr #delivery_to').text(name_kh);
        $('#product_delivery_to #delivery_to').text(name_kh); // Product Page        
        $('#product_delivery_to #delivery_fee').text(fee2); // Product Page
        $('.lg #location').text(name_kh); // Add an address
        $('.delivery_fee').text('$ '+ fee); // Cart & Review Order Page
        switchLocationTab();
    }  
    $('.lg #location').attr('value', name_en+','+name_kh); // Add an address
    loadCart();
}

function loadProduct(ad_id){  
    $('#related_products').html('');
    
    $.post('http://www.nekoten.khmerqq.com/app/product.php',{ad_id:ad_id, lang:lang},function(data){
        
        var ad = JSON.parse(data)[0];
        $('#title').html(ad['title']);
        
        var img = ad['image'].split(',');
        
        /* Update product view */
        $.post('http://nekoten.khmerqq.com/app/update_view.php',{ad_id:ad_id});
        
        $('#ad_image').trigger('destroy.owl.carousel');
        //$('#ad_image').html($('#ad_image').find('.owl-stage-outer').html()).removeClass('owl-loaded');
        for (var i = 0; i < img.length; i++){
            var img_url = 'http://nekoten.khmerqq.com/ads/'+ad['ad_id']+'/'+img[i];
            
            $('#ad_image').append('<img id="ad-img-'+(i+1)+'" src="'+img_url+'" onclick="viewFullScreen('+img.length+')">');
        }
        $('#ad_image').owlCarousel({
            responsive:{
                0:{
                    items:1
                }
            }
        });
        
        /* Check Wishlist */
        var wishlist = localStorage.getItem('wishlist');
        if (wishlist.includes(','+ad_id)){
            $('.wishlist-btn').addClass('added');
        } else {
            $('.wishlist-btn').removeClass('added');
        }
        /*
        $.post('http://nekoten.khmerqq.com/ajax/add_to_wishlist.php', {ad_id:ad_id, user_id:user_id},function(data){
            if (data == 'existed'){
            
            }
            alert(data);
        });   
        */
        
        
        $('#ad_id').val(ad_id);
        $('.pp #price').html(ad['price']);
        $('.pp #normal_price').html(ad['normal_price']);
        $('.pp #discount').html('-'+ad['discount']+'%');
        var qty = ad['quantity'];
        $('.pp #quantity').html(qty);
        /*
        $.post('http://nekoten.khmerqq.com/module/quantity_panel.php',{lang:lang,qty:qty}, function(data){
            $('.pp #quantity').html(data);
        });
        
        if (qty == 0){
            t += '<span class="sold-out">SOLD OUT</span>';
        } else if (qty <= 10){
            t += '<span class="item-left">'+qty+' item';
            if (qty > 1) t += 's';
            t += ' left</span>';
        } else {
            t += '<span class="in-stock">IN STOCK</span>';
        }
        */
        
        
        $('.ii #rate').html(ad['rate']);
        $('.ii #review').html(ad['review']);
        $('.ii #view').html(ad['view']);
        $('.ii #n_order').html(ad['n_order']);
        $('.pd #desc').html(ad['description']);
        
        
        /* Related Products */    
        $.post('http://www.nekoten.khmerqq.com/app/related_products.php',{size:size, ad_id:ad_id},function(data){                                
            var a_wh = (size-30)/2;                    
            var arr = JSON.parse(data);   
            
            for (var i = 0; i < arr.length; i++){            
                var ad = arr[i];            
                var ad_id = ad['ad_id'];  
                
                var str = '<ion-item onclick="loadProduct(\''+ad_id+'\');" class="ad-item">';
                    str += '<div class="b" style="width:'+a_wh+'px;height:'+a_wh+'px">';
                        str += '<img style="width:'+ad['width']+'; height:'+ad['height']+'; margin-'+ad['margin']+':'+ad['margin-px']+'px" src="http://www.nekoten.khmerqq.com/ads/'+ad['ad_id']+'/1_m.jpg">';
                    str += '</div>';
                    str += '<div class="a">';
                        str += '<span class="aa">'+ad['price']+'</span>';
                        str += '<span class="ab"><span>'+ad['n_order']+'</span> <span k="កម្មង់">order</span></span>';
                    str += '</div>';
                str += '</ion-item>';
                
                $('#related_products').append(str);
            }  
                                                    
        });
    
    
    
        $('#product_body').show();
        $('#ad_images').show();
    });
    
    
    /*
    $.post('http://www.nekoten.khmerqq.com/app/question.php',{ad_id:ad_id},function(data){
        var arr = JSON.parse(data);
        $('#question_panel #question').html('');
        $('question_panel #n_question').text(arr[0]['nq']);
        for (var i = 0; i < arr.length; i++){
            var q = arr[i];
            var str = '<div class="b">';
                str += '<div class="c">';
                    str += '<img src="http://www.nekoten.khmerqq.com/users/'+q['posted_by']+'/profile.jpg">';
                str += '</div>';
                str += '<div class="d">';
                    str += '<div class="g">';
                        str += '<span class="e">'+q['full_name']+'</span>';
                        str += '<span class="f">'+q['posted_date']+'</span>';
                    str += '</div>';
                    str += '<div class="h">'+q['question']+'</div>';
                str += '</div></div>';
            $('#question_panel #question').append(str);
        }        
    });
    */
    loadQuestionList('panel');
    window.location.href='#tab/product/';    
}


function loadQuestionList(opt){
    var ad_id = $('#ad_id').val();
    $.post('http://www.nekoten.khmerqq.com/app/question.php',{ad_id:ad_id},function(data){
        var arr = JSON.parse(data);
        $('#question_'+opt+' #question').html('');
        $('#question_'+opt+' #n_question').text(arr[0]['nq']);
        for (var i = 0; i < arr.length; i++){
            var q = arr[i];
            
            var str = '<div class="b">';
                str += '<div class="c">';
                    str += '<img src="http://www.nekoten.khmerqq.com/users/'+q['posted_by']+'/profile.jpg">';
                str += '</div>';
                str += '<div class="d">';
                    str += '<div class="g">';
                        str += '<span class="e">'+q['full_name']+'</span>';
                        str += '<span class="f">'+q['posted_date']+'</span>';
                    str += '</div>';
                    str += '<div class="h">'+q['question']+'</div>';
                str += '</div></div>';
            $('#question_'+opt+' #question').append(str);
        }        
    });
}


function searchClick(){ 
    $('.cancel').show();    
}
function cancelClick(){
   $('.search-bar .cancel').hide();
   $('.search-bar .search').val('');
   $('.search-form').html('');
   $('.search-form').height('0');
}
function addSearchHistory(keyword){
    var a = localStorage.getItem('search_history');
    if (!a.includes(','+keyword)){
        a = ','+keyword + a;
    }
    localStorage.setItem('search_history', a);
    loadSearchHistory();
}
/*
function search(keyword){    
    $('#search_res_item').html('');
    cancelClick();
    searchProduct(keyword); 
    window.location.href = '#tab/search_res';
}
*/


function searchKeyword(tab){
    var q = $('#search-'+tab).val();
    //alert(q);
    if (q == ''){
        $('.search-form').html('');
        $('.search-form').height('0');
    } else {
        $.post('http://www.nekoten.khmerqq.com/app/search.php',{q:q},function(data){
            var arr = JSON.parse(data);
            $('.search-form').html('');
            $('.search-form').height('800px');
            for (var i = 0; i < arr.length; i++){
                var ad = arr[i];
                var str = '<ion-item class="item item-complex" onclick="search(\''+ad['keyword']+'\')")>';
                str += '<a class="item-content">'+ad['keyword']+'</a></ion-item>';
                //$('.search-form').append('<li onclick="$(\'#search_res_item\').html(\'\'); cancelClick(); searchProduct(\''+ad['keyword']+'\'); window.location.href=\'#tab/search_res\'")>'+ad['keyword']+'</li>');
                $('.search-form').append(str);
                
                
            }
        });
    }
}

function submitSearchForm(tab){
    var keyword = $('#'+tab).val();
    searchProduct(keyword);;
    cancelClick(); 
    window.location.href = '#tab/search_res';
    addSearchHistory(keyword);
}

function searchProduct(keyword) {
    
    var size_l = '120';
    var size_g = ($(window).width()-30)/2;
    
    $.post('http://www.nekoten.khmerqq.com/app/search_result.php',{size_g:size_g, size_l:size_l, keyword:keyword},function(data){
        var arr = JSON.parse(data);
        //$('#search_res_item').html('');
        for (var i = 0; i < arr.length; i++){
            var ad = arr[i];
            var ad_id = ad['ad_id'];
            var str = '<li class="p-list" px_l="'+ad['px_l']+'" px_g="'+ad['px_g']+'" margin="'+ad['margin']+'" onclick="loadProduct(\''+ad_id+'\');">';
                str += '<div class="a" style="width:'+size_l+'px;height:'+size_l+'px">';
                    str += '<img style="width:'+ad['w']+'; height:'+ad['h']+'; margin-'+ad['margin']+':'+ad['px_l']+'px" src="http://www.nekoten.khmerqq.com/ads/'+ad['ad_id']+'/1.jpg">';
                str += '</div>';
                str += '<div class="b">';
                    str += '<div class="c">'+ad['title']+'</div>';
                    str += '<div class="e">';
                        str += '<div class="d">'+ad['price']+'</div>';
                        str += '<div class="g">'+ad['n_order']+' Orders</div>';
                    str += '</div>';
                str += '</div>';
            str += '</li>';
            $('#search_res_item').append(str);
        }        
    });
    setTimeout(function() {
        $('#search-search-res').val(keyword);
    }, 100);
}

function la(){
    if (localStorage.getItem('language') == 'kh'){
        $('[k]').each(function(){
            $(this).text($(this).attr('k'));
            $(this).attr('placeholder', $(this).attr('k'));
        });
    }
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            var coordinate = position.coords.latitude+','+position.coords.longitude;
            var src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyC62zOchEdNGLWgfZmgQqzmsVgyZrmQeZo&q='+coordinate;
            $('#gps-map-frame').attr('src', src);
            $('.lg #coordinate').val(coordinate);
        });
    }
}


