/* Initial */
setDefault('language', 'en');
setDefault('delivery_to', 'Phnom Penh,ភ្នំពេញ');
setDefault('delivery_fee', '0');
setDefault('user_id', 'not_login');
setDefault('remind_update_left', REMIND_UPDATE_FOR_N_TIMES);
   
localStorage.setItem('user_id', 'fhtv');


/* Global Variable */
var lang = localStorage.getItem('language');
var user_id = localStorage.getItem('user_id');
var URL = 'http://www.nekoten.sangskrit.com/';
var size_l = '120';
var SIZE_G = ($(window).width()-30)/2;
var APP_VERSION = '1.0';
var REMIND_UPDATE_FOR_N_TIMES = '15';
var href = window.location.href.split(',');
var current_page = href[href.lenght-1];

  

/* Check Update Available */
$.post(URL+'app/get_info.php', {name:'latest_version,change_log'}, function(data){
    var a = JSON.parse(data);
    var latest_version = a[0]['value'];
    var change_log = a[1]['value'];
    var remind_update_left = localStorage.getItem('remind_update_left'); 
    if (latest_version > APP_VERSION){
        if (remind_update_left < 1){
            localStorage.setItem('remind_update_left', REMIND_UPDATE_FOR_N_TIMES);
            $('#new_update_available_alert #change_log').html(change_log);
            $('#new_update_available_alert').css('display', 'flex');
        } else {
            
            remind_update_left--;
            localStorage.setItem('remind_update_left', remind_update_left);
        }
    }
});



/* Load Shopping Cart Label */
loadCart();

/* Load Delivery Time */
loadDeliveryTime(); 
   
function connectionError(){
    $('#connection_error_alert').css('display', 'flex');   
}


function setDefault(name, value){
    var a = localStorage.getItem(name);
    if (a == null){
        localStorage.setItem(name, value);                 
    }
    
}     

function selectTab(tab){
    $('.my-tab-content .a').hide();
    $('.my-tab-content #'+tab).show();
    $('.my-tab .a').removeClass('selected');
    $('.my-tab #'+tab).addClass('selected');
}

    
    
/* Fix ontap */
$(document).on('tap', '[ontap]', function(){
     new Function($(this).attr('ontap'))();
});



function selectLocation(name_en){
    closeSmallModal('choose_location_modal');
    updateDeliveryTo(name_en);
}



function postAddress(){
    var user_id = localStorage.getItem('user_id');
    var name = $('#shipping_info_form #name').val();
    var phone_number = $('#shipping_info_form #phone_number').val();
    var location = $('#shipping_info_form #location').attr('value');
    var address = $('#shipping_info_form #address').val();
    var near_by = $('#shipping_info_form #near_by').val();
    var bus_name = $('#shipping_info_form #bus_name').val();
    var bus_phone_number = $('#shipping_info_form #bus_phone_number').val();
    var default_address = $('#shipping_info_form #default_address').val();
    
    
    var addr_selected = $('.my-tab #tab-address').hasClass('selected');
   
    if (addr_selected) {
        var coordinate = '';
    } else {
        var coordinate = $('#shipping_info_form #coordinate').val();
    }
    
    $.post(URL+'app/post_address.php', {user_id:user_id, default_address:default_address, name: name, phone_number:phone_number, location:location, 
        address:address, near_by:near_by, coordinate:coordinate, bus_name:bus_name, bus_phone_number:bus_phone_number},
        function(data){
            if (data == 'success'){ 
                var a = window.location.href.split('/');
                var b = a[a.length-1];
                if (b == 'review_order') {
                    loadDefaultShippingInfo();                    
                    $('#add_address').hide();
                    closeModal('shipping_address_modal'); 
                }
                closeModal('shipping_info_modal');
                               
            }
    });                
}


function loadStore(store_id){
    openModal('store_modal');
    $.post(URL+'app/store.php', {store_id:store_id, size_g:SIZE_G}, function(data){
        
        var a = JSON.parse(data)[0];
        $('#store #name').text(a['name']);
        $('#store #n_order').text(a['n_order']);
        $('#store #n_product').text(a['n_product']);
        if (a['timeline_pic'] == 'exist'){
            $('#store #timeline_pic').attr('src', URL+'stores/'+store_id+'/timeline.jpg');
        }
        if (a['profile_pic'] == 'exist'){
            $('#store #profile_pic').attr('src', URL+'stores/'+store_id+'/profile.jpg');
        }
        
                                      
                           
        var arr = a['ads'];   
        
        for (var i = 0; i < arr.length; i++){            
            var ad = arr[i];            
            
            var str = '<ion-item onclick="loadProduct(\''+ad['ad_id']+'\');" class="ad-item">';
                str += '<div class="b" style="width:'+SIZE_G+'px;height:'+SIZE_G+'px">';
                    str += '<img style="width:'+ad['width']+'; height:'+ad['height']+'; margin-'+ad['margin']+':'+ad['margin-px']+'px" src="'+URL+'ads/'+ad['ad_id']+'/1_m.jpg">';
                str += '</div>';
                str += '<div class="a">';
                    str += '<span class="aa">'+ad['price']+'</span>';
                    str += '<span class="ab"><span>'+ad['n_order']+'</span> <span k="កម្មង់">order</span></span>';
                str += '</div>';
            str += '</ion-item>';
            
            $('#store_products').append(str);
        }  
        
        
                                                    
     
        
    })
    
}

function loadOrderDetail(order_id){    
    $.post(URL+'app/order.php', {order_id:order_id, lang:lang}, function(data){
        var a = JSON.parse(data)[0];
        $('#order_detail #order_date').text(a['ordered_date']);
        $('#order_detail #order_id').text(a['id']);
        $('#order_id_title').text('#'+a['id']);
        $('#order_detail #delivery_time').text(a['delivery_time']);
        $('#order_detail #'+a['payment_method']).show();
        
        
        var str = '';
        for (var i = 0; i < 3; i++) {
            str += '<div class="a">';
                str += '<div class="b">';
                    str += '<div class="ba"></div>';
                    str += '<div class="bb"></div>';
                str += '</div>';
                str += '<div class="c">';
                    str += '<div class="ca">';
                        str += '09-21-2017 09:45';
                    str += '</div>';
                    str += '<div class="cb">';
                        str += 'Order Received';
                    str += '</div>';
                str += '</div>';
            str += '</div>';
        }
        $('#status_bar').html(str);

        
        var c = a['ads'];
        var str = '';
        for (j = 0; j < c.length; j++){
            var d = c[j];

            var str2 = '<li class="p-list" ontap="loadProduct(\''+d['ad_id']+'\')">';                    
                str2 += '<div class="a">';
                    str2 += '<img src="'+URL+'ads/'+d['ad_id']+'/1_m.jpg" style="width:100%;height:100%">';
                str2 += '</div>';
                str2 += '<div class="b">';
                    str2 += '<div class="c">';
                        str2 += d['title'];
                    str2 += '</div>';    
                    str2 += '<div class="ee">';
                        str2 += '<div class="dd">';
                            str2 += '<span>$ 3</span> ';
                            str2 += '<span style="color:black">x 5</span>';
                        str2 += '</div>';
                    str2 += '</div>';
                str2 += '</div>';
            str2 += '</li>';
            str += str2;
        }
        $('#order_detail #order_items').html(str);
        
    });
    $.post(URL+'app/shipping_info.php',{order_id:order_id}, function(data){
        var a = JSON.parse(data)[0]; 
        var str = shippingInfoItem(a);
        $('.xv #shipping_addr').html(str);
        la();
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
    return (typeof a !== 'undefined' && a !== '');
}

function closeSmallModal(page){        
    $('#'+page).css('transform', 'translateY(100%)');    
}

function openModal(page){    
    $('#'+page).height($(window).height());        
    if (page == 'product_modal' || page == 'store_modal'){
        $('#'+page).css('transform', 'translateX(0)');
        //$('#'+page).css('z-index', parseInt($('#'+page).css('z-index'), 10)+2);
    } else {
        $('#'+page).css('transform', 'translateY(0)');    
    }    
    $('.header-view').hide();        
    $('.tab-nav').hide();        
    //StatusBar.hide();     
}
function closeModal(page){        
    if (page == 'product_modal' || page == 'store_modal'){
        $('#'+page).css('transform', 'translateX(100%)');    
    } else {
        $('#'+page).css('transform', 'translateY(100%)');        
    }
    
    $('.header-view').show();        
    var a = window.location.href.split('/');
    var b = a[a.length-1];
    if (!b.includes('product')){
        $('.tab-nav').show();
    }
    
}



function openSmallModal(page){
    
    $('#'+page).height($(window).height());
    $('#'+page).css('transform', 'translateY(0)');    
    $('.header-view').hide();        
    $('.tab-nav').hide();        
    //StatusBar.hide();
    
}
   
                  
function signInRegister(opt){
    var full_name = $('#'+opt+'_form #full_name').val();
    var phone = $('#'+opt+'_form #phone_number').val();
    var password = $('#'+opt+'_form #password').val();
    
    if (opt == 'register' && full_name.length == 0){
        myAlert('Please enter your full name', 'សូមបញ្ចូលឈ្មោះរបស់អ្នក');
    } else if (phone.length == 0) {
        myAlert('Please enter your phone number.', 'សូមបញ្ចូលលេខទូរស័ព្ទ');
    } else if (password.length == 0) {
        myAlert('Please enter your phone number.', 'សូមបញ្ចូលលេខលេខសំងាត់');
    } else {
        $.post(URL+'app/'+opt+'.php',{full_name:full_name, phone:phone, password:password},function(data){            
            var a = JSON.parse(data);            
            if (a['result'] == 'success'){
                localStorage.setItem('user_id', a['user_id']);
                user_id = a['user_id'];
                localStorage.setItem('full_name', a['full_name']);
                localStorage.setItem('phone_number', a['phone_number']);
                localStorage.setItem('wishlist', a['wishlist']);
                myAlert('Hello, '+a['full_name'], 'សួស្តី '+a['full_name']);
                loadMyAccount();
                closeModal(opt+'_modal');
            } else if (a['result'] == 'phone') {
                if (opt == 'sign_in') {
                    myAlert('Account does not exist.', 'លេខទូរស័ព្ទមិនត្រឹមត្រូវ');                         
                } else if (opt == 'register') {
                    myAlert('This phone number is already in use.', 'លេខទូរស័ព្ទនេះត្រូវបានចុះឈ្មោះរួចរាល់');     
                }
            }  else if (opt == 'sign_in' && a['result'] == 'password') {
                myAlert('Password is incorrect.', 'លេខសំងាត់មិនត្រឹមត្រូវ');    
            }
            
        });
    }  
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
    $.post(URL+'app/shipping_address.php', {user_id:user_id}, function(data){
        var a = JSON.parse(data);        
        if (a.length == 0){            
            var str = '<div class="u">';
            if (lang == 'en') str += 'No Shipping Address'; else str += 'គ្មានអាស័យដ្ឋានដឹកជញ្ជូន';            
            str += '</div>';
            $('.qw .shipping_address_item').html(str);
        } else {
            var abc = window.location.href.split('/');
            var current_page = abc[abc.length-1];
            
            for (var i = 0; i < a.length; i++){            
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
            $('.qw .shipping_address_item .shipping-item').on('click', function(){
                
                if (current_page == 'review_order'){                         
                    var id = $(this).attr('value');                    
                    var str = '<a class="item-content shipping-item" value="'+id+'">';
                    str += $(this).html();
                    str += '<span class="fa fa-angle-right"></span></a>';                                        
                    $('.eq #shipping_addr').html(str);
                    $('.eq #shipping_addr_id').val(id);   
                    updateDeliveryTo(a['name_en']);
                    $('.eq #shipping_addr .shipping-item').on('click', function(){                        
                        loadShippingAddr(id);
                        openModal('shipping_address_modal');
                    });
                    closeModal('shipping_address_modal');                    
                } else if (current_page == 'shipping_addr'){     
                    var id = $(this).attr('value');
                    
                    openModal('shipping_info_modal');  
                    editAddress(id);
                }
            });
        }            
        la();
    });
}


function addNewAddress(){
 
    /* Default values for Add an Address Tab*/
    $('.lg #name').val(localStorage.getItem('full_name'));
    $('.lg #phone_number').val(localStorage.getItem('phone_number'));
    
    openModal('shipping_info_modal');
 }
 
function deleteAddress(){
    var id = $('#shipping_info_form #addr_id').val();
    alertConfirm('Delete this shipping Address', 'លុបអាស័យដ្ឋានដឹកជញ្ជូននេះចេញ');
    $('#alert_confirm .confirm').on('click', function(){
        $.post(URL+'app/delete_address.php', {id:id}, function(data){
            if (data.includes('success')){
                closeModal('shipping_info_modal');
                loadShippingAddr(0);
            }
        });
    });
}
 
function editAddress(id){
    $.post(URL+'app/shipping_address.php', {id:id}, function(data){
        var a = JSON.parse(data)[0];
        $('.back #delete_address').show();
        $('#shipping_info_form #addr_id').val(id);
        $('#shipping_info_form #name').val(a['name']);
        $('#shipping_info_form #phone_number').val(a['phone_number']);
        $('#shipping_info_form #address').val(a['address']);
        $('#shipping_info_form #near_by').val(a['near_by']);
        $('#shipping_info_form #bus_name').val(a['bus_name']);
        $('#shipping_info_form #bus_phone_number').val(a['bus_phone_number']);
        var en = a['location'].split(',')[0];
        var kh = a['location'].split(',')[1];
        if (lang == 'en') $('#shipping_info_form #location').text(en); 
        else $('#shipping_info_form #location').text(kh);
        switchLocationTab(en);
        
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
        str += a['phone_number']+'<br>';
        if (a['coordinate'] != '') {            
            var lat = a['coordinate'].split(',')[0].substr(0,9);
            var lng = a['coordinate'].split(',')[1].substr(0,9);
            str += 'GPS: '+lat+', '+lng;
            
            
            
            //str += '<div class="gps-map-frame" height="200"></div>';
            
            var src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyC62zOchEdNGLWgfZmgQqzmsVgyZrmQeZo&zoom=18&q='+a['coordinate'];            
            str += '<iframe class="gps-map-frame" height="200" frameborder="0" src="'+src+'"></iframe>';            
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
    if (shopping_cart == '' || shopping_cart == null){
        $('#no_item_in_cart').show();        
        $('.cart-footer').hide(); 
        $('#cart-cart').html('');
        $('#cart-review').html('');
        $('.cart_count').html('0');
        $('.noti-label').hide();    
        setTimeout(function() {        
            $('.badge').hide();
        }, 100);
    } else {                     
        $('#no_item_in_cart').hide();            
        $('.cart-footer').show();        
        var cart = shopping_cart.split(',');        
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
            
            $.post(URL+'app/product_item.php',{qty:qty, size_l:size_l, ad_id:ad_id},function(data){
                
                var ad = JSON.parse(data)[0];        
                subtotal += parseFloat(ad['price'].replace('$ ', '').replace(',', ''))*parseInt(qty);                     
                var str = '<li class="p-list" id="cart-item-'+ad['ad_id']+'">';
                    str += '<div class="a" onclick="loadProduct(\''+ad['ad_id']+'\')" style="width:'+size_l+'px;height:'+size_l+'px">';
                        str += '<img src="'+URL+'ads/'+ad['ad_id']+'/1_m.jpg" style="width:'+ad['w']+'; height:'+ad['h']+'; margin-'+ad['margin']+':'+ad['px_l']+'px">';
                    str += '</div>';
                    str += '<div class="b">';
                        str += '<div class="c" onclick="loadProduct(\''+ad['ad_id']+'\')">'+ad['title']+'</div>';
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
                
                $('.subtotal').text('$ '+subtotal);
                $('.total').text('$ '+(parseFloat(subtotal)+parseFloat(delivery_fee)));
            });                 
        }
        $('.noti-label').show();
        $('.cart_count').text(cart_count);
        $('.badge').text(cart_count);
        $('.badge').show();
        
    }
}

function deleteCart(ad_id){
    alertConfirm('Remove this item from your Shopping Cart?', 'ដកទំនិញនេះចេញពីកន្ត្រកទំនិញ?');            
    $('#alert_confirm .confirm').on('tap', function(){                                      
        var a = localStorage.getItem('shopping_cart').split(',');
        var b = '';            
        for (var i = 1; i < a.length; i++){                
            if (a[i].split(':')[0] != ad_id) {                
                b += ','+a[i];            
            }        
        }
        localStorage.setItem('shopping_cart', b);                         
        loadCart();
    });
}

function switchLocationTab(name_en){
    /* For Add an Address of Review Order */
    if (name_en != 'Phnom Penh'){
        $('#shipping_info_form #phnom_penh_tab').hide();
        $('#shipping_info_form #province_tab').show();                
    } else {
        $('#shipping_info_form #phnom_penh_tab').show();
        $('#shipping_info_form #province_tab').hide();            
    }    
}

function updateAvailablePaymentMethod(){
    var delivery_to = localStorage.getItem('delivery_to').split(',')[0];
    if (delivery_to == 'Phnom Penh'){
        selectPaymentMethod('cash_on_delivery');
        $('.uu #cash_on_delivery_opt').show();
    } else {
        selectPaymentMethod('transfer_money');
        $('.uu #cash_on_delivery_opt').hide();
    }
}

function selectPaymentMethod(type){        
    closeModal('payment_method_modal');
    $('#order #payment_method').html($('#payment_method_modal #'+type).html());
    $('#order #payment_method').attr('value', type);
}

/* Load Delivery Time for Express Delivery */
function loadDeliveryTime(){
    var delivery_to = localStorage.getItem('delivery_to').split(',')[0];
    $.post(URL+'module/delivery_time.php',{lang:lang, location:delivery_to}, function(data){

        var a = JSON.parse(data);
        $('.uu #express_delivery_time').text(a['text']);
        $('.et #delivery_time').text(a['text']); 
        $('.uu #express_delivery_time').attr('value', a['value']);
        $('.et #delivery_time').attr('value', a['value']);   
        
    });    
}

function updateDeliveryTo(name_en){    
    $.post(URL+'app/location.php', {name_en:name_en}, function(data){
        var name_kh = JSON.parse(data)[0]['name_kh'];
        var fee = JSON.parse(data)[0]['price'];
        localStorage.setItem('delivery_to', name_en+','+name_kh);
        localStorage.setItem('delivery_fee', fee);
        if (fee == 0) var fee2 = 'Free'; else var fee2 = '$ '+fee;
        if (lang == 'en'){        
            $('#shipping_info_form #location').text(name_en); // Add an address
            $('#shipping_info_form #location').attr('value', name_en); // Add an address
            $('.mr #delivery_to').text(name_en); // More Page
            $('#product_delivery_to #delivery_to').text(name_en); // Product Page  
            $('.lg #location').text(name_en); // Add an address  
            $('.delivery_fee').text('$ '+ fee); // Cart & Review Order Page
            $('#product_delivery_to #delivery_fee').text(fee2); // Product Page        
            switchLocationTab(name_en);
        } else {
            $('#shipping_info_form #location').text(name_kh); // Add an address
            $('#shipping_info_form #location').attr('value', name_en); // Add an address
            $('.mr #delivery_to').text(name_kh);
            $('#product_delivery_to #delivery_to').text(name_kh); // Product Page        
            $('#product_delivery_to #delivery_fee').text(fee2); // Product Page
            $('.delivery_fee').text('$ '+ fee); // Cart & Review Order Page
            switchLocationTab(name_en);
        }  
        updateAvailablePaymentMethod();
        loadDeliveryTime();
        $('.lg #location').attr('value', name_en+','+name_kh); // Add an address
        loadCart();
        
    });   
}


function loadProduct(ad_id){  
    openModal('product_modal');    
    //$('.product_page').html('');    
    $('.tab-nav').hide();
    $.post(URL+'app/product.php',{ad_id:ad_id, lang:lang},function(data){
        var ad = JSON.parse(data)[0];
        $('#title').html(ad['title']);
        $('.wr #rv_title').html(ad['title']); // Submit Review
        $('.wr #rv_img').attr('src', URL+'ads/'+ad_id+'/1_m.jpg');
        var img = ad['image'].split(',');
        
        /* Check Wishlist */
        var wishlist = localStorage.getItem('wishlist');
        
        if (wishlist.includes(','+ad_id)){
            $('.wishlist-btn').addClass('added');            
        } else {            
            $('.wishlist-btn').removeClass('added');
        }
        
        
        $('#ad_id').val(ad_id);
        $('.pp #price').html(ad['price']);
        $('.pp #normal_price').html(ad['normal_price']);
        $('.pp #discount').html('-'+ad['discount']+'%');
        var qty = ad['quantity'];
        $('.pp #quantity').html(qty);
        
        
        /* Default Quantity Text Value */
        $('.at #qty').val(1);
        
        $('.ii #ad_id_txt').html(ad['ad_id']);
        $('.ii #view').html(ad['view']);
        $('.ii #n_order').html(ad['n_order']);
        $('.pd #desc').html(ad['description']);
        
        
        var src = URL+'stores/'+ad['store_id']+'/profile.jpg';
        $('#store_info #store_img').attr('src', src);
        $('#store_info #store_full_name').text(ad['store_name']);
        $('#store_info #store_n_product').text(ad['store_n_product']);
        
        $('#store_info').on('click', function(){
            loadStore(ad['store_id']);
        })
        /* Update product view */
        $.post(URL+'app/update_view.php',{ad_id:ad_id, user_id:user_id});
        
        
        
        /* Ad Image */
        $('.ad_image').trigger('destroy.owl.carousel');
        $('#ad_photos').text('');
        
        var str = '';
        var str2 = '';
        for (var i = 0; i < img.length; i++){            
            var img_URL = URL+'ads/'+ad['ad_id']+'/'+img[i];
            str += '<img class="owl-lazy" style="width:100%; height:100%" id="ad-img-'+(i+1)+'" data-src="'+img_URL+'" onclick="viewFullScreen('+img.length+')">';            
            str2 += '<img src="'+img_URL+'">';
        }
        $('#ad_photos').text(str2); // For Description Details
        
        $('.ad_image').html(str);      
        $('.ad_image').owlCarousel({
            responsive:{
                0:{
                    items:1
                }
            },
            lazyLoad: true
        });
                             
        /* Related Products */    
        $.post(URL+'app/related_products.php',{size_g:SIZE_G, ad_id:ad_id},function(data){                                
                             
            var arr = JSON.parse(data);   
            
            for (var i = 0; i < arr.length; i++){            
                var ad = arr[i];            
                var ad_id = ad['ad_id'];  
                
                var str = '<ion-item onclick="loadProduct(\''+ad_id+'\');" class="ad-item">';
                    str += '<div class="b" style="width:'+SIZE_G+'px;height:'+SIZE_G+'px">';
                        str += '<img style="width:'+ad['width']+'; height:'+ad['height']+'; margin-'+ad['margin']+':'+ad['margin-px']+'px" src="'+URL+'ads/'+ad['ad_id']+'/1_m.jpg">';
                    str += '</div>';
                    str += '<div class="a">';
                        str += '<span class="aa">'+ad['price']+'</span>';
                        str += '<span class="ab"><span>'+ad['n_order']+'</span> <span k="កម្មង់">order</span></span>';
                    str += '</div>';
                str += '</ion-item>';
                
                $('#related_products').append(str);
            }  
                                                    
        });

        //$('#product_body').show();
        $('.ad_images').show();
    }).error(function(){
        connectionError();
    });
    
    /* Scroll to Top */
    scrollToTop(0);
    
    /*Record Loaded ad_id */
    $('#loaded_ad_id').val($('#loaded_ad_id').val()+','+ad_id);
    
    
    loadQuestionReviewList('question', 'panel', ad_id);
    loadQuestionReviewList('review', 'panel', ad_id);    
    
    
}

/* Scroll to Top */
function scrollToTop(delay){
    $('.ion-content').animate({
        scrollTop: $(".ion-content").offset().top
    }, delay);
}

function goBackProduct(){    
    var a = $('#loaded_ad_id').val();    
    var b = a.split(',');
    var ad_id = $('#ad_id').val();
    
    if (b.length == 2){                    
        $('#loaded_ad_id').val('');
        closeModal('product_modal');            
    } else {        
        var c = '';
        for (var i = 1; i < (b.length-2); i++){
            c += ',' + b[i];
        }        
        var e = b[b.length-2];
        $('#loaded_ad_id').val(c);
        loadProduct(e);
    }    
}


function loadQuestionReviewList(type, opt, AD_ID){
    var ad_id = '';
    if (opt != 'account') {
        if (AD_ID == '') var ad_id = $('#product_body #ad_id').val();        
        else var ad_id = AD_ID;
    }
    
    $.post(URL+'app/question_review.php',{type:type, opt:opt, ad_id:ad_id, user_id:user_id},function(data){ 
        
        var arr = JSON.parse(data);        
        /* Default Value */
        $('#'+type+'_'+opt+' #'+type).html('');
            
        if (arr.length == 0){
            if (opt == 'account') {
                $('#account_n_question').text(0);
            } else {
                $('#'+type+'_'+opt+' #n_'+type).text(0);
            }
            
            var str = '<div class="bb">';
            if (type == 'question'){
                if (lang == 'en') str += 'No Question'; else str += 'គ្មានសំនួរ';
            } else {
                if (lang == 'en') str += 'No Review'; else str += 'គ្មានរង្វាយតម្លៃ';
            }            
            str += '</div>';
            $('#'+type+'_'+opt+' #'+type).append(str);
            
            if (opt == 'panel') {
                var str = '<div class="bc">';            
                if (type == 'question'){
                    if (lang == 'en') str += 'Ask Question'; else str += 'សួរសំនួរ';
                } else {
                    if (lang == 'en') str += 'Write a Review'; else str += 'សរសេររង្វាយតម្លៃ';
                }            
                str += '</div>';
                $('#'+type+'_panel #'+type).append(str);
            }
        } else {
            if (opt == 'account') {
                $('#account_n_'+type).text(arr[0]['num_rows']);
            } else {
                $('#'+type+'_'+opt+' #n_'+type).text(arr[0]['num_rows']);
            }
            
            if (opt == 'panel') var end = 3; else var end = arr.length;
            for (var i = 0; i < end; i++){
                var q = arr[i];
                var str = '';
                
                if (opt == 'account') {
                    str += '<li class="item item-complex" onclick="loadProduct(\''+q['ad_id']+'\')"><a class="item-content">';
                    str += '<div class="ta">';
                        str += '<div class="tb">';
                            str += '<img src="'+URL+'/ads/'+q['ad_id']+'/1_m.jpg">';
                        str += '</div>';
                        str += '<div class="tc">'+q['title']+'</div>';
                    str += '</div>';
                }
                str += '<div class="b">';
                    str += '<div class="c">';
                        str += '<img src="'+URL+'users/'+q['posted_by']+'/profile.jpg">';
                    str += '</div>';
                    str += '<div class="d">';
                        str += '<div class="g">';
                            str += '<span class="e">';
                            str += '<span class="ee">'+q['full_name']+'</span>';
                            if (type == 'review'){
                                if (lang == 'en') str += ' rated '; else str += ' បានវាយតម្លៃ ';
                                str += '<span class="fa fa-star"></span> ';
                                str += q['rate'];
                            }
                            str += '</span>';
                            str += '<span class="f">'+q['posted_date']+'</span>';
                        str += '</div>';
                        str += '<div class="h">'+q['data']+'</div>';
                        
                        if (type == 'question' && q['answer'] != ''){
                            str += '<div class="i">';
                            if (lang == 'en') str += 'Store: '; else str += 'ហាង: ';
                            str += '<span>'+q['answer']+'</span></div>';
                        }                    
                    str += '</div>';
                str += '</div>';                
                  
                if (opt == 'account') {
                    str += '</a></li>';
                    str += '<div class="hr"></div>';
                }
                
                $('#'+type+'_'+opt+' #'+type).append(str);
            }               
        }
    });
}


function loadDescription(){
    $('#description #title').html($('#product_body #title').html());
    $('#description #desc').html($('.pd #desc').html());
    $('#description #photo').html($('#ad_photos').text());
    openModal('description_modal');
    /* Scroll to Top */
    $('#description').animate({
        scrollTop: $(".ion-content").offset().top
    }, 0);
}

function searchClick(){ 
    $('.cancel').show();    
}
function cancelClick(){       
    $('.search-bar .search').val('');
    $('.search-form').html('');
    $('.search-form').height('0');
    $('.search-bar .cancel').hide();
    
}

function loadWishlistViewedItem(opt){
    var user_id = localStorage.getItem('user_id');
    var size_l = '120';
    $.post(URL+'app/wishlist_viewed_item.php', {user_id:user_id, size_l:size_l, opt:opt}, function (data){        
        $('#'+opt+'_panel').html('');
        var a = JSON.parse(data);        
        for (var i = 0; i < a.length; i++){
            var ad = a[i];
            var str = '<li class="p-list">';
                    str += '<div class="a" onclick="loadProduct(\''+ad['ad_id']+'\')">';
                        str += '<img src="'+URL+'ads/'+ad['ad_id']+'/1_m.jpg" style="width:'+ad['w']+';height:'+ad['h']+';margin-'+ad['margin']+':'+ad['px_l']+'">';
                    str += '</div>';
                    str += '<div class="b">';                            
                        str += '<div class="c" onclick="loadProduct(\''+ad['ad_id']+'\')">'+ad['title']+'</div>';
                            str += '<div class="cc">';
                                str += '<span class="ion-checkmark-round"></span>';
                                str += '<span k=" មានក្នុងស្តុក"> In Stock</span>';
                            str += '</div>';
                        str += '<div class="ee">';
                            str += '<div class="dd">'+ad['price']+'</div>';
                            if (opt == 'wishlist') { 
                                str += '<div class="i">';
                                    str += '<span ontap="removeWishlist(\''+ad['ad_id']+'\')"class="delete ion-ios-trash-outline"></span>';
                                str += '</div>';
                            }
                        str += '</div>';
                    str += '</div>';
                str += '</li>';
            $('#'+opt+'_panel').append(str);
        }
        la();
        $('#n_'+opt).text(a.length);
    }); 
}


function addSearchHistory(keyword){
    var a = localStorage.getItem('search_history');
    var c = '';
    if (a == null){
        c = ','+keyword;
    } else if (!a.includes(','+keyword)){
        c = ','+keyword + a;        
    } else {        
        b = a.split(',');        
        var d = b.length;
        if (d > 9) d = 9;
        for (var i = 1; i < d; i++){
            if (b[i] != keyword) c += ',' + b[i];
        }
        c += ',' + c;
    }
    
    localStorage.setItem('search_history', c);
    loadSearchHistory();
}


function search(keyword){    
    $('#search_res_item').html('');
    cancelClick();
    searchProduct(keyword, 'best_match');
    window.location.href = '#tab/search';
    window.location.href = '#tab/search_res';
}



function searchKeyword(tab){
    var q = $('#search-'+tab).val();
    if (q == ''){
        $('.search-form').html('');
        $('.search-form').height('0');
    } else {
        $.post(URL+'app/search.php',{q:q},function(data){
            var arr = JSON.parse(data);
            $('.search-form').html('');
            $('.search-form').height('800px');            
            for (var i = 0; i < arr.length; i++){
                var ad = arr[i];
                var str = '<ion-item class="item item-complex" onclick="search(\''+ad['keyword']+'\')")>';
                str += '<a class="item-content">'+ad['display_keyword']+'</a></ion-item>';                
                $('.search-form').append(str);
                
                
            }
        });
    }
}

function submitSearchForm(tab){
    var keyword = $('#'+tab).val();        
    if (keyword != ''){
        searchProduct(keyword, 'best_match');            
        addSearchHistory(keyword);    
        cancelClick();
        window.location.href = '#tab/search';  
        window.location.href = '#tab/search_res';    
    }
}

function searchProduct(keyword, opt) {
    
    
    $('#search_res_item').html('');
    
    
    $.post(URL+'app/search_result.php',{size_g:SIZE_G, size_l:size_l, keyword:keyword, opt:opt},function(data){
        
        var arr = JSON.parse(data);            
        for (var i = 0; i < arr.length; i++){
            var ad = arr[i];                
            var ad_id = ad['ad_id'];
                var str = '<li class="p-list" px_l="'+ad['px_l']+'" px_g="'+ad['px_g']+'" margin="'+ad['margin']+'" onclick="loadProduct(\''+ad_id+'\')">';
                str += '<div class="a" style="width:'+size_l+'px;height:'+size_l+'px">';
                    str += '<img style="width:'+ad['w']+'; height:'+ad['h']+'; margin-'+ad['margin']+':'+ad['px_l']+'px" src="'+URL+'ads/'+ad['ad_id']+'/1.jpg">';
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
        
        if (arr.length < 2) loadOtherProducts(keyword);
    });
    

    setTimeout(function() {        
        if (keyword.split(':')[0] != 'category'){
            $('#search-res').val(keyword);                                
        }
        $('#search_res_keyword').val(keyword);
    }, 100);
}
    
function loadOtherProducts(keyword){

    
    $('#no_res_keyword').text("'"+keyword+"'");
    $('#no_res').show();
    $('.other-products').show();

    /* Other Products */                    
    $.post(URL+'app/search_result.php',{size_g:SIZE_G, size_l:size_l, keyword:'$other$'},function(data2){        
        var arr2 = JSON.parse(data2);        
        for (var j = 0; j < arr2.length; j++){
            var ad = arr2[j];                    
            var ad_id = ad['ad_id'];
                var str = '<li class="p-list" px_l="'+ad['px_l']+'" px_g="'+ad['px_g']+'" margin="'+ad['margin']+'" onclick="loadProduct(\''+ad_id+'\');">';
                str += '<div class="a" style="width:'+size_l+'px;height:'+size_l+'px">';
                    str += '<img style="width:'+ad['w']+'; height:'+ad['h']+'; margin-'+ad['margin']+':'+ad['px_l']+'px" src="'+URL+'ads/'+ad['ad_id']+'/1.jpg">';
                str += '</div>';
                str += '<div class="b">';
                    str += '<div class="c">'+ad['title']+'</div>';
                    str += '<div class="e">';
                        str += '<div class="d">'+ad['price']+'</div>';
                        str += '<div class="g">'+ad['n_order']+' Orders</div>';
                    str += '</div>';
                str += '</div>';
            str += '</li>';                
            $('#other_products').append(str);
        }      
    });
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


