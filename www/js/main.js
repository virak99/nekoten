
function setDefault(name, value){
    var a = localStorage.getItem(name);
    if (typeof a === 'undefined' && a === null){
        localStorage.setItem(name, value);                 
    }
    
}

/* Initial */
setDefault('delivery_fee', '0');
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



function la(en, kh){
    if (localStorage.getItem('language') == 'en'){
        return en;
    } else {
        return kh;
    }
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
                            str += '<div class="i"><span class="delete ion-ios-trash-outline" onclick="deleteCart(\''+ad['ad_id']+'\')"></span></div>';
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

function updateDeliveryTo(name_en, name_kh, fee){
    
    localStorage.setItem('delivery_to', name_en+','+name_kh);
    localStorage.setItem('delivery_fee', fee);
    if (fee == 0) fee = 'Free'; else fee = '$ '+fee;
    if (lang == 'en'){        
        $('#shipping_info_form #location').text(name_en); // Shipping Info Page
        $('.mr #delivery_to').text(name_en); // More Page
        $('#product_delivery_to #delivery_to').text(name_en); // Product Page
        $('#product_delivery_to #delivery_fee').text(fee); // Product Page
    } else {
        $('#shipping_info_form #location').text(name_kh);
        $('.mr #delivery_to').text(name_kh);
        $('#product_delivery_to #delivery_to').text(name_kh); // Product Page
        $('#product_delivery_to #delivery_fee').text(fee); // Product Page
    }  
}

function loadProduct(ad_id){  
    
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
            alert(position.coords.latitude+','+position.coords.longitude);
        });
    }
}


