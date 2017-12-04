
var ad_id = $('#product_body #ad_id').val();
var size = $(window).width();

/* Auto Hide Header */
var is_header_showed = false;
    $('#product_page_content').scroll(function(){                
        
        if (!is_header_showed){
            if(($('.ad_images').height() - $('#product_page_content').scrollTop()) < 0) {
                is_header_showed = true;
                $('#product_page_header').addClass('has-header');                        
            }    
        } else {
            if(($('.ad_images').height() - $('#product_page_content').scrollTop()) > 0) {
                is_header_showed = false;
                $('#product_page_header').removeClass('has-header');                        
            }    
        }
        
        
    });
    
    
/* Related Products */    
$.post(URL+'app/related_products.php',{size:size, ad_id:ad_id},function(data){                                
    var a_wh = (size-30)/2;                    
    var arr = JSON.parse(data);   
    
    var b = window.location.href.split('/');
    var page = b[b.length-1].split('-')[1];
    if (page == 'wishlist') page = 'account';
    
    for (var i = 0; i < arr.length; i++){            
        var ad = arr[i];            
        var ad_id = ad['ad_id'];  
        
        var str = '<ion-item onclick="loadProduct(\''+ad_id+'\', \''+page+'\');" class="ad-item">';
            str += '<div class="b" style="width:'+a_wh+'px;height:'+a_wh+'px">';
                str += '<img style="width:'+ad['width']+'; height:'+ad['height']+'; margin-'+ad['margin']+':'+ad['margin-px']+'px" src="'+URL+'ads/'+ad['ad_id']+'/1_m.jpg">';
            str += '</div>';
            str += '<div class="a">';
                str += '<span class="aa">'+ad['price']+'</span>';
                str += '<span class="ab"><span>'+ad['n_order']+'</span> <span k="កម្មង់">order</span></span>';
            str += '</div>';
        str += '</ion-item>';
        
        $('#related_products').append(str);
    }  
    la();                                               
});
        

function askQuestion(){
    var body = $('#question_body').val();
    var ad_id = $('#product_body #ad_id').val();
    
    
    $.post(URL+'/app/ask_question.php',{body:body,ad_id:ad_id,user_id:user_id}, function(data){
        if (data.includes('success')){
            loadQuestionReviewList('question', 'panel', '');
            loadQuestionReviewList('question', 'modal', '');
            myAlert('Question submitted', 'សំនួរត្រូវបានបង្ហោះរួចរាល់។');
            $('#alert .confirm').on('click', function(){
                closeModal('question_modal');
            });                
        }
    });
    
    
}
    
    
    
function wishlist(){
    if (user_id == 'not_login'){
        openModal('sign_in_modal');
    } else {
        var ad_id = $('#product_body #ad_id').val();
        
        $.post(URL+'ajax/add_to_wishlist.php', {ad_id:ad_id, user_id:user_id},function(data){
            
            if (data.includes('existed')){
                $('.wishlist-btn').removeClass('added');                
            } else if (data.includes('success')){                
                myAlert('Added to Wishlist', 'បានដាក់ចូលក្នុងទំនិញចង់បានរួចរាល់');
                $('#alert .confirm').on('click', function(){
                    $('.wishlist-btn').addClass('added');                
                });
            }            
        });
    }
}

/* Load Delivery To */        
if (lang == 'en'){            
    $('#product_delivery_to #delivery_to').text(localStorage.getItem('delivery_to').split(',')[0]);
} else {
    $('#product_delivery_to #delivery_to').text(localStorage.getItem('delivery_to').split(',')[1]);
} 
var fee = localStorage.getItem('delivery_fee');
if (fee == '0') fee = 'Free'; else fee = '$ '+fee;
$('#product_delivery_to #delivery_fee').text(fee);
    
    

function hammerIt(elm) {    
    hammertime = new Hammer(elm, {});
    hammertime.get('pinch').set({
        enable: true
    });
    var posX = 0,
        posY = 0,
        scale = 1,
        last_scale = 1,
        last_posX = 0,
        last_posY = 0,
        max_pos_x = 0,
        max_pos_y = 0,
        transform = "",
        el = elm;

    //hammertime.on('doubletap pan pinch panend pinchend', function(ev) {        
        hammertime.on('doubletap pinch', function(ev) {        
        if (ev.type == "doubletap") {
            transform =
                "translate3d(0, 0, 0) " +
                "scale3d(2, 2, 1) ";
            scale = 2;
            last_scale = 2;
            try {
                if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != "matrix(1, 0, 0, 1, 0, 0)") {
                    transform =
                        "translate3d(0, 0, 0) " +
                        "scale3d(1, 1, 1) ";
                    scale = 1;
                    last_scale = 1;
                }
            } catch (err) {}
            el.style.webkitTransform = transform;
            transform = "";
        }

        //pan    
        if (scale != 1) {
            posX = last_posX + ev.deltaX;
            posY = last_posY + ev.deltaY;
            max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
            max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
            if (posX > max_pos_x) {
                posX = max_pos_x;
            }
            if (posX < -max_pos_x) {
                posX = -max_pos_x;
            }
            if (posY > max_pos_y) {
                posY = max_pos_y;
            }
            if (posY < -max_pos_y) {
                posY = -max_pos_y;
            }
        }


        //pinch
        if (ev.type == "pinch") {
            scale = Math.max(.999, Math.min(last_scale * (ev.scale), 4));
        }
        if(ev.type == "pinchend"){last_scale = scale;}

        //panend
        if(ev.type == "panend"){
            last_posX = posX < max_pos_x ? posX : max_pos_x;
            last_posY = posY < max_pos_y ? posY : max_pos_y;
        }

        if (scale != 1) {
            transform =
                "translate3d(" + posX + "px," + posY + "px, 0) " +
                "scale3d(" + scale + ", " + scale + ", 1)";
        }

        if (transform) {
            el.style.webkitTransform = transform;
        }
    });
}


function viewFullScreen(photo_num){
    $('.ad_images').addClass('img-full-screen');                     
    $('.img-full-screen').height($(window).height());        
    $('.owl-carousel .owl-stage-outer').css('overflow', 'initial');
    for (var i = 1; i <= photo_num ; i++){
    	hammerIt(document.getElementById("ad-img-"+i));
	}
    $('.scroll').addClass('no-scroll');
    $('.owl-dots').hide();
    $('.back').hide();
}
function removeFullScreen(){
    $('.ad_images').removeClass('img-full-screen');   
    $('.ad_images').height('auto');
    $('.back').show();
    
    $('.scroll').removeClass('no-scroll');
    $('.owl-dots').show();
}

$.post(URL+'app/location.php',{}, function(data){
    var arr = JSON.parse(data);
    for (var i = 0; i < arr.length; i++){
        var a = arr[i];
        var str = '<li class="item item-complex" onclick="closeModal(\'delivery_option_product\'); updateDeliveryTo(\''+a['name_en']+'\',\''+a['name_kh']+'\',\''+a['price']+'\')">';
            str += '<a class="item-content">';
            str += '<span k="'+a['name_kh']+'">'+a['name_en']+'</span>';
            str += '<span class="price-li">$ '+a['price']+' </span>';
        str += '</a></li>';
        $('#choose_location_ul').append(str); 
    }
    load('delivery_to');
    la();
});



/* Submit Review */

$('.wt .c .fa').on('tap', function(){
    var a = parseInt($(this).attr('id')[1], 10);
    var rate_en = ['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent'];
    var rate_kh = ['អន់', 'មធ្យម', 'ល្អបង្គួរ', 'ល្អ', 'ល្អប្រសើរ'];

    if (lang == 'en') var str = rate_en[a-1]; else str = rate_kh[a-1]; 
    $('.wt .c #rate_text').text(str);
    $('.wt #review_rate').val(a);
    
    for (var i = 1; i <= a; i++){
        $('.wt .c #r'+i).addClass('fa-star selected');
    }
    if (a < 5) {
        for (var j = (a+1); j <= 5; j++){
            $('.wt .c #r'+j).removeClass('selected');
        }
    }
});

function submitReview(){
    var ad_id = $('#product_body #ad_id').val();
    var review = $('.wt #review_text').val();
    var rate = $('.wt #review_rate').val();
    
    $.post(URL+'/app/submit_review.php', {user_id:user_id, ad_id:ad_id, review:review, rate:rate}, function(data){
        if (data.includes('success')){
            loadQuestionReviewList('review', 'panel', ad_id);
            myAlert('Thank you for your review.', 'សូមអរគុណសំរាប់ការវាយតម្លៃរបស់លោកអ្នក ។');
            $('#alert .confirm').on('click', function(){                        
                closeModal('submit_review_modal');                        
            });
        }
    });
}
    




function addToCart(){
    
    var ad_id = $('#product_body #ad_id').val();
    var qty = parseInt($('.at #qty').val(), 10);
    var opt = 0;

    var a = localStorage.getItem('shopping_cart');

    if (a == '' || a == null){
        var b = ','+ad_id+':'+opt+':'+qty;
    } else {
        var b = '';
        var added = 0;
        var c = a.split(',');
        for (var i = 1; i < c.length; i++){
            if (c[i].split(':')[0] == ad_id && c[i].split(':')[1] == opt){
                b += ','+ad_id+':'+opt+':'+(parseInt(c[i].split(':')[2], 10)+qty);
                added = 1;
            } else {
                b += ','+c[i];
            }
        }
        if (!added) b = ','+ad_id+':'+opt+':'+qty+b;
    }
    localStorage.setItem('shopping_cart', b);
    loadCart();        
    $('#added_to_cart_alert').css('display', 'flex');        
}
    
function qtyPlus(){
    if ($('#qty').val() < 10) {
        $('#qty').val(parseInt($('#qty').val(), 10)+1);
    }
}
function qtyMinus(){
    if ($('#qty').val() > 1) {
        $('#qty').val(parseInt($('#qty').val(), 10)-1);
    }
}