var pictureSource;   // picture source
var destinationType; // sets the format of returned value

document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}
function choosePhoto(id){
    upload_img_id = id;
    openActionMenu('choose_photo_action');
}
function onPhotoURISuccess(imageURI) {
    $('#'+upload_img_id+' img').attr('src', imageURI);
    $('#'+upload_img_id+' span').hide();
    $('#'+upload_img_id+' img').show();        
}
function takePhoto(){
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 20,
    destinationType: destinationType.FILE_URI});
}
function getPhotoFromGallery(){
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 20,
    destinationType: destinationType.FILE_URI,
    sourceType: pictureSource.PHOTOLIBRARY});
}

function changeProfilePic(){
    if ($('#cpp img').attr('src') != null){
        var imageURI = $('#cpp img').attr('src');
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType = "image/jpeg";
    
        options.params = {
            id: user_id,
            opt: 'profile'
        }
    
        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI("http://nekoten.sangskrit.com/app/upload.php"), win, fail, options);

    }
}

function uploadReviewPhoto(imageURI, id) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";

    options.params = {
        id: id,
        opt: 'review'
    }

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://nekoten.sangskrit.com/app/upload.php"), win, fail, options);
}

function onFail(message) {
    console.log('Failed because: ' + message);
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}