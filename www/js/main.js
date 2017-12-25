/* Initial */
setDefault('language', 'en');
setDefault('delivery_to', 'Phnom Penh,ភ្នំពេញ');
setDefault('delivery_fee', '0');
setDefault('user_id', 'not_login');
setDefault('remind_update_left', REMIND_UPDATE_FOR_N_TIMES);
   


/* Global Variable */
var lang = localStorage.getItem('language');
var user_id = localStorage.getItem('user_id');
var URL = 'http://www.nekoten.sangskrit.com/';
var size_l = '120';
var size_g = ($(window).width()-30)/2;
var APP_VERSION = '1.0';
var REMIND_UPDATE_FOR_N_TIMES = '15';
var upload_img_id = 'smallImage';

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
   
   
/* On Click Home Button Scroll to Top */
setTimeout(function() {        
    $('.ion-ios-home').on('click', function(){
        $('.ion-content').animate({
            scrollTop: $(".ion-content").offset().top
        }, 300);
    })    
}, 500);



function openUrl(url){
    window.open(url, '_system', 'location=no');   
    //cordova.InAppBrowser.open(url);
}
function reportToMe(){
    var url= 'fb://user-thread/100001442709860';    
    cordova.InAppBrowser.open(url);
}
    
function call(number) {
    var url= 'tel://'+number;    
    cordova.InAppBrowser.open(url);    
}

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
    var coordinate = $('#shipping_info_form #coordinate').val();
    
    if (name == ''){
        myAlert('Please enter the Name', 'សូមបញ្ចូលឈ្មោះ');
    } else if (phone_number == ''){
        myAlert('Please enter the Phone Number', 'សូមបញ្ចូលលេខទូរស័ព្ទ');
    } else if (location == 'Phnom Penh' && addr_selected && address == '') {        
        myAlert('Please enter the Address', 'សូមបញ្ចូលអាស័យដ្ឋាន');    
    } else {
                
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
}


function loadStore(store_id){
    openModal('store_modal');
    $.post(URL+'app/store.php', {store_id:store_id, size_g:size_g}, function(data){
        
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
        var str = '';
        for (var i = 0; i < arr.length; i++){            
            var ad = arr[i];            
            
             str += '<ion-item onclick="loadProduct(\''+ad['ad_id']+'\');" class="ad-item">';
                str += '<div class="b" style="width:'+size_g+'px;height:'+size_g+'px">';
                    str += '<img style="width:'+ad['width']+'; height:'+ad['height']+'; margin-'+ad['margin']+':'+ad['margin-px']+'px" src="'+URL+'ads/'+ad['ad_id']+'/1_m.jpg">';
                str += '</div>';
                str += '<div class="a">';
                    str += '<span class="aa">'+ad['price']+'</span>';
                    str += '<span class="ab"><span>'+ad['n_order']+'</span> <span k="កម្មង់">order</span></span>';
                str += '</div>';
            str += '</ion-item>';                        
        }  
        $('#store_products').html(str);
        
    });
    
}

function loadOrderDetail(order_id){    
    
    window.location.href = "#tab/order_detail";
    $.post(URL+'app/order.php', {order_id:order_id, lang:lang}, function(data){
        var a = JSON.parse(data)[0];
        
        $('#order_detail #order_date').text(a['ordered_date']);
        $('#order_detail #order_id').text(a['id']);
        $('#order_id_title').text('#'+a['id']);
        $('#order_detail #delivery_time').text(a['delivery_time']);
        $('#order_detail #'+a['payment_method']).show();
        $('#order_detail #subtotal').text('$ '+a['subtotal']);
        $('#order_detail #delivery_fee').text('$ '+a['delivery_fee']);
        $('#order_detail #total').text('$ '+a['total']);
        $('#order_detail #item_count').text(a['item_count']);        
        
        
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

            var str2 = '<li class="p-list" onclick="loadProduct(\''+d['ad_id']+'\')">';                    
                str2 += '<div class="a">';
                    str2 += '<img src="'+URL+'ads/'+d['ad_id']+'/1_m.jpg" style="width:100%;height:100%">';
                str2 += '</div>';
                str2 += '<div class="b">';
                    str2 += '<div class="c">';
                        str2 += d['title'];
                    str2 += '</div>';    
                    str2 += '<div class="ee">';
                        str2 += '<div class="dd">';
                            str2 += '<span>$ '+d['unit_price']+'</span> ';
                            str2 += '<span style="color:black">x '+d['quantity']+'</span>';
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
        $('#gps_map').geocomplete({
            map: "#gps_map",
            mapOptions: {
                draggable: false,
                zoom: 16
            },                
            location: [lat, lng]                        
        });
        $('.lg #coordinate').val(lat+','+lng);
        $('.lg #coordinate_text').text(lat+', '+lng);
        
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
    
    /* Fix Pop Up Keyboard */
    $('.search-bar .search').prop('disabled', true);
    
        
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


function addNewAddress(direct_form_review_tab){
 
    /* Default values for Add an Address Tab*/    
    $('.lg #name').val(localStorage.getItem('full_name'));
    $('.lg #phone_number').val(localStorage.getItem('phone_number'));    
    
    if (direct_form_review_tab) {
        if (lang == 'en') $('#submit_shipping_info_form').text('Delivery to this Address');
        else $('#submit_shipping_info_form').text('ផ្ញើរមកកាន់អាស័យដ្ឋាននេះ');        
    } else {
        if (lang == 'en') $('#submit_shipping_info_form').text('Save Address');
        else $('#submit_shipping_info_form').text('រក្សាទុកអាស័យដ្ឋាន');        
    }
    openModal('shipping_info_modal');
 }
 
function deleteAddress(){
    var id = $('#shipping_info_form #addr_id').val();
    alertConfirm('Delete this shipping Address?', 'លុបអាស័យដ្ឋានដឹកជញ្ជូននេះចេញ?');
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
            if (lang == 'en') str += 'Coordinate: '; else str += 'កូអេដោនេ: ';
            str += lat+', '+lng;
            
            str += '<div id="map-'+a['id']+'" class="map_canvas">Loading map ...</div>';
            
            setTimeout(function() {        
                $("#map-"+a['id']).geocomplete({
                    map: "#map-"+a['id'],
                    mapOptions: {
                        draggable: false,
                        zoom: 16
                    },                
                    location: [lat, lng]                        
                });       
            }, 1);
            
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
        }, 500);
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
                            str += '<div class="i"><span class="delete ion-ios-trash-outline" onclick="deleteCart(\''+ad['ad_id']+'\')"></span></div>';
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
        
        if (wishlist != '' && wishlist != null){
            if (wishlist.includes(','+ad_id)){
                $('.wishlist-btn').addClass('added');            
            } else {            
                $('.wishlist-btn').removeClass('added');
            }
        }
        
        
        $('#ad_id').val(ad_id);
        $('.pp #price').html(ad['price']);
        $('.pp #normal_price').html(ad['normal_price']);
        $('.pp #discount').html('-'+ad['discount']+'%');
        var qty = ad['quantity'];
        $('.pp #quantity').html(qty);
        
        
        /* Default Quantity Text Value */
        $('.at #qty').text(1);
        
        $('.ii #ad_id_txt').html(ad['ad_id']);
        $('.ii #view').html(ad['view']);
        $('.ii #n_order').html(ad['n_order']);
        $('.pd #desc').html(ad['description']);
        
        
        var src = URL+'stores/'+ad['store_id']+'/profile.jpg';
        $('#store_info #store_img').attr('src', src);
        $('#store_info #store_full_name').text(ad['store_name']);
        $('#store_info #store_n_product').text(ad['store_n_product']);
        
        /* Load Store */
        $('#store_info').on('click', function(){
            loadStore(ad['store_id']);
        });
        $('.store_info_btn').on('click', function(){
            loadStore(ad['store_id']);
        })
        
        /* Update product view */
        if (user_id != 'not_login')
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
        $.post(URL+'app/related_products.php',{size_g:size_g, ad_id:ad_id},function(data){                                
                             
            var arr = JSON.parse(data);   
            var str = '';
            for (var i = 0; i < arr.length; i++){            
                var ad = arr[i];            
                var ad_id = ad['ad_id'];  
                
                str += '<ion-item onclick="loadProduct(\''+ad_id+'\');" class="ad-item">';
                    str += '<div class="b" style="width:'+size_g+'px;height:'+size_g+'px">';
                        str += '<img style="width:'+ad['width']+'; height:'+ad['height']+'; margin-'+ad['margin']+':'+ad['margin-px']+'px" src="'+URL+'ads/'+ad['ad_id']+'/1_m.jpg">';
                    str += '</div>';
                    str += '<div class="a">';
                        str += '<span class="aa">'+ad['price']+'</span>';
                        str += '<span class="ab"><span>'+ad['n_order']+'</span> <span k="កម្មង់">order</span></span>';
                    str += '</div>';
                str += '</ion-item>';
                
            }  
            $('#related_products').html(str);
                                                    
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

function gotoCart(){
    $('#loaded_ad_id').val(''); 
    closeModal('product_modal'); 
    
    window.location.href='#tab/cart';
    /* Fix Pop Up Keyboard */
    setTimeout(function() {        
        $('.search-bar .search').prop('disabled', false);       
    }, 500);
    
}

function closeStore(){
    closeModal('store_modal');
    /* Fix Pop Up Keyboard */
    setTimeout(function() {        
        $('.search-bar .search').prop('disabled', false);       
    }, 500);
}

function goBackProduct(){    
    var a = $('#loaded_ad_id').val();    
    var b = a.split(',');
    var ad_id = $('#ad_id').val();
    
    if (b.length == 2){                    
        $('#loaded_ad_id').val('');
        closeModal('product_modal'); 
        
        /* Fix Pop Up Keyboard */
        setTimeout(function() {        
            $('.search-bar .search').prop('disabled', false);       
        }, 500);
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



function sendVerificationCode(){
    var phone = $('.rg #phone_number').val();
    if (phone == ''){
        myAlert('Please enter your phone number.', 'សូមបញ្ចូលលេខទូរស័ព្ទ។');
    } else {
        $.post(URL+'app/forget_password.php', {phone:phone, code:'first'}, function(data){
            if (data.includes('not_match')){
                myAlert('Phone number doesn\'t exist in our system.', 'លេខទូរស័ព្ទនេះមិនមាននៅក្នុងប្រព័ន្ធយើងខ្ញុំទេ ។');
            } else if (data.includes('success')){
                myAlert('We have sent a SMS with a Verification Code to your phone number.', 'យើងបានផ្ញើរសារលេខកូដបញ្ជាក់ទៅកាន់លេខទូរស័ព្ទរួចរាល់ ។');
                $('#forget_1').hide();
                $('#forget_2').show();
                $('#forget_2 #phone_number_text').text(phone);
            }
        });
    }
}


function resendVerificationCode(){
    var phone = $('#forget_2 #phone_number_text').text();
    
    $.post(URL+'app/forget_password.php', {phone:phone, code:'resend'}, function(data){
        if (data.includes('wait')){
            myAlert('Please wait for 1 minute to request a new SMS.', 'សូមរង់ចាំ១នាទីដើម្បីស្នើសុំសារលេខកូដសារជាថ្មី ។');
        } else if (data.includes('success')){
            myAlert('We have resent the SMS.', 'យើងខ្ញុំបានផ្ញើរសារថ្មីរួចរាល់ ។');
        }
    });
}

function submitNewPassword(){
    var phone = $('#forget_3 #phone_number_text').text();
    var new_pwd = $('#forget_3 #new_pwd').val();
    var confirm_pwd = $('#forget_3 #confirm_pwd').val();
    
    if (new_pwd == '') {
        myAlert('Please enter new password.', 'សូមបញ្ចូលលេខសំងាត់ថ្មី');
    } else if (confirm_pwd == '') {
        myAlert('Please enter new password again to confirm', 'សូមបញ្ចូលលេខសំងាត់ម្តងទៀតដើម្បីបញ្ជាក់');
    } else if (new_pwd != confirm_pwd) {
        myAlert('Confirm password is not matched', 'បញ្ជាក់លេខសំងាត់ថ្មីមិនត្រឹមត្រូវ');
    } else {
        $.post(URL+'app/forget_password.php', {phone:phone, code:'password', password:new_pwd},
        function(data){
            if (data.includes('success')){
                myAlert('Password has been changed successfully.', 'លេខសំងាត់ត្រូវបានប្តូររួចរាល់');
                closeModal('forget_password_modal');
                openModal('sign_in_modal');
            }
        });
    }
}

function submitVerificationCode(){
    var phone = $('#forget_2 #phone_number_text').text();
    var code = $('#forget_2 #code').val();
    
    $.post(URL+'app/forget_password.php', {phone:phone, code:code}, function(data){
        if (data.includes('wrong_code')){
            myAlert('The Verification Code is not valid.', 'លេខកូដបញ្ជាក់មិនត្រឹមត្រូវ ។');
        } else if (data.includes('success')){
            $('#forget_2').hide();
            $('#forget_3').show();
            $('#forget_3 #phone_number_text').text(phone);
        }
    });
}

function loadQuestionReviewList(type, opt, AD_ID){
    var ad_id = '';
    if (opt != 'account') {
        if (AD_ID == '') var ad_id = $('#product_body #ad_id').val();        
        else var ad_id = AD_ID;
    }
    
    if (type == 'review' && opt == 'modal'){
        $.post(URL+'app/review_modal.php', {ad_id:ad_id}, function(data){
            //alert(data);
            var a = JSON.parse(data);
            var total_rate = 0;
            var count = 0;
            
            for (var i = 0; i < a.length; i++){
                var b = a[i];
                $('.lu #rate_count_'+b['rate']).text(b['count']);
                count += parseInt(b['count']);
                total_rate += parseInt(b['rate']*count);
            }
            
            
            $('.lu #total_review').text(count);
            var rate2 = (total_rate/count).toFixed(1).replace('.0', '');
            $('.lu #avg_rate').text(rate2);
            
            
            for (var i = 0; i < a.length; i++){
                var b = a[i];
                var each_count = parseInt(b['count'])/count;
                
                $('.lu #rate_bar_'+b['rate']).css('width', each_count*100);
                $('.lu #unrate_bar_'+b['rate']).css('width', (1-each_count)*100);                
                
            }
            
                    
            var str = '';
            var rate = (total_rate/count).toFixed(0);            
            for (var k = 1; k <= rate; k++){
                str += '<span class="fa fa-star rated"></span>';
            }
            for (var k = (rate+1); k <= 5; k++){
                str += '<span class="fa fa-star unrated"></span>';
            }
            $('.lu #total_rate_star').html(str);
            
                    
        });
    }
    
    
    $.post(URL+'app/question_review.php',{type:type, opt:opt, ad_id:ad_id, user_id:user_id},function(data){ 
        
        var arr = JSON.parse(data);        
        
        /* Default Value */
        $('#'+type+'_'+opt+' #'+type).html('');        
        if (arr.length == 0){
            
            
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
            } else if (opt == 'account') {
                $('#account_n_'+type).text(0);
            } else if (opt == 'modal') {
                if (type == 'review') $('#review_header').hide();
                $('#'+type+'_'+opt+' #n_'+type).text(0);
            }
        } else {
            if (opt == 'account') {
                $('#account_n_'+type).text(arr[0]['num_rows']);
            } else {
                $('#'+type+'_'+opt+' #n_'+type).text(arr[0]['num_rows']);
            }
            
            if (opt == 'modal'){
                if (type == 'review') $('#review_header').show();
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
                    
                    str += '<div class="dd">';
                        str += '<div class="d">';
                            str += '<div class="g">';
                                str += '<span class="e">';
                                str += '<span class="ee">'+q['full_name']+'</span>';
                                if (type == 'review'){
                                    if (lang == 'en') str += ' rated '; else str += ' បានវាយតម្លៃ ';
                                    var rate = parseInt(q['rate'], 10);
                                    for (var j = 1; j <= rate; j++){
                                        str += '<span class="fa fa-star rated"></span>';
                                    }
                                    for (var j = (rate+1); j <= 5; j++){
                                        str += '<span class="fa fa-star unrated"></span>';
                                    }                                
                                }
                                str += '</span>';
                                str += '<span class="f">'+q['posted_date']+'</span>';
                            str += '</div>';
                            str += '<div class="h">'+q['data']+'</div>';
                            if (type == "review" && q['has_image'] == 1){
                                str += '<div class="i">';
                                for (var l = 0; l < q['images'].length; l++){
                                    str += '<img class="hh" src="'+URL+'/reviews/'+q['id']+'/'+q['images'][l]+'">';
                                }
                                str += '</div>';
                                
                            }
                        str += '</div>';
                            
                        if (type == 'question' && q['replies'] != null){                               
                            var r = q['replies'];
                            var str2 = '';
                            for (var k = 0; k < r.length; k++){
                                var s = r[k];
                                str2 += '<div class="b">';
                                    str2 += '<div class="c">';
                                        str2 += '<img src="'+URL+'stores/'+s['posted_by']+'/profile.jpg">';
                                    str2 += '</div>';
                                    str2 += '<div class="d">';
                                        str2 += '<div class="g">';
                                            str2 += '<span class="e">';
                                            str2 += '<span class="ee">'+s['full_name']+'</span>';                                                
                                            str2 += '</span>';
                                            str2 += '<span class="f">'+s['posted_date']+'</span>';
                                        str2 += '</div>';
                                        str2 += '<div class="h">'+s['reply']+'</div>';
                                    str2 += '</div>';
                                str2 += '</div>';
                            }                                
                            str += str2;
                        }   
                    str += '</div>'; // .dd
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
    
    /* Fix Keyboard Pop Up */
    $('.search-bar .search').prop('disabled', true);
     setTimeout(function() {        
        $('.search-bar .search').prop('disabled', false);       
    }, 500);
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
                                    str += '<span onclick="removeWishlist(\''+ad['ad_id']+'\')"class="delete ion-ios-trash-outline"></span>';
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
    } else {        
        c = ','+keyword;
        b = a.split(',');        
        var d = b.length;
        if (d > 9) d = 9;
        for (var i = 1; i < d; i++){
            if (b[i] != keyword) c += ',' + b[i];
        }
    }
    
    localStorage.setItem('search_history', c);
    loadSearchHistory();
}


function search(keyword){    
    $('#search_res_item').html('');
    cancelClick();
    searchProduct(keyword, 'best_match');
    addSearchHistory(keyword);
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


function submitReview(){
    var ad_id = $('#product_body #ad_id').val();
    var review = $('.wt #review_text').val();
    var rate = $('.wt #review_rate').val();
    var has_image = 0;
    /* Has Image? */
    for (var i = 1; i <= 4; i++){
        if ($('#rv_'+i+' img').attr('src') != null){
            has_image = 1;
        }
    }
    $.post(URL+'/app/submit_review.php', {user_id:user_id, has_image:has_image, ad_id:ad_id, review:review, rate:rate}, function(data){
        var a = JSON.parse(data);
        if (a['result'] == 'success'){
            
            /* Upload Photos */
            for (var i = 1; i <= 4; i++){
                if ($('#rv_'+i+' img').attr('src') != null){
                    uploadPhoto($('#rv_'+i+' img').attr('src'), a['id']);
                }
            }
            
            loadQuestionReviewList('review', 'panel', ad_id);
            myAlert('Thank you for your review.', 'សូមអរគុណសំរាប់ការវាយតម្លៃរបស់លោកអ្នក ។');
            $('#alert .confirm').on('click', function(){                        
                closeModal('submit_review_modal');                        
            });
        }
        
        
    });
}

function submitSearchForm(tab){
    var keyword = $('#'+tab).val();        
    if (keyword != ''){
        $('#hide_keyboard').focus();  // Hide Keyboard on Search Submit
        searchProduct(keyword, 'best_match');            
        addSearchHistory(keyword);    
        cancelClick();
        window.location.href = '#tab/search';  
        window.location.href = '#tab/search_res'; 
        
    }
}

function searchProduct(keyword, opt) {
    
    
    $('#search_res_item').html('');
    
    
    $.post(URL+'app/search_result.php',{size_g:size_g, size_l:size_l, keyword:keyword, opt:opt},function(data){
        
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
        
        if (arr.length < 2) {
            loadOtherProducts(keyword);
        } else {
            $('#no_res').hide();
            $('.other-products').hide();
        }
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
    $.post(URL+'app/search_result.php',{size_g:size_g, size_l:size_l, keyword:'$other$'},function(data2){        
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
   
function getInfo(name){
    $.post(URL+'app/get_info.php',{name:name}, function(data){       
        $('#'+name).html(JSON.parse(data)[0]['value']);
        la();
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


function openActionMenu(id){    
    $('#'+id).css('display', 'flex');   
    setTimeout(function(){
        $('#'+id+' .ms-alert-body').css('transform', 'translateY(0)');    
    }, 100);
    
}
function closeActionMenu(){    
    $('.action-menu .ms-alert-body').css('transform', 'translateY(150%)');
    setTimeout(function(){ $('.action-menu').css('display', 'none');}, 200);
    
}

