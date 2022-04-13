var imagesDropZone;

$(document).ready(function () {
    imagesDropZone = new Dropzone("#product-images-dropzone", {
        addRemoveLinks: true,
        maxFiles: 20,
        acceptedFiles: 'image/*',
        autoProcessQueue: false,
        removedfile: function (file) {
            var _ref;
            removeFileFromFilesOfArrayInDropzone(file);
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        }
    });
    set_product_images_area();
})
function submitImages() {
    formData = new FormData();
    if (imagesDropZone.files.length > 0) {
        imagesDropZone.files.forEach((x, i) => {
                formData.append('images[]', imagesDropZone.files[i]);
        });
    }
    formData.append('vehicle_id',$('#vehicle_id').val());
    $.ajax({
        url:'/save-images-for-vehicle',
        type:'POST',
        data: formData,
        processData:false,
        contentType:false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
        },
        success:function(e){
            if(e.code == 200){
                notification('success',"Saved Successfully");
              }else{
                notification('error',"Something Went Wrong");
              }
        },
        error:function(e){
            notification('error',"Something Went Wrong");
        }
    })
}
function set_product_images_area(){
    var productImages = $("#product-images").html();
    var base_url = $("#base_url").val();
    if(productImages.trim()!=''){
        productImages = JSON.parse(productImages);
        if(productImages.length>0){
            $.each(productImages, function(v,k){
                var productImage = v;
                productImage.url = `${base_url}${v.full_path}`;
                productImage.size = parseInt(v.file_size);
                imagesDropZone.emit("addedfile", productImage);
                imagesDropZone.emit("thumbnail", productImage, productImage.url);
                imagesDropZone.files.push(productImage);
            });
        }
    }
}
function removeFileFromFilesOfArrayInDropzone(file) {
    if (file.id) {
        $.ajax({
            url: `/delete-image-from-media/${file.id}`,
            type: 'GET',
            success: function (e) {
                if(e.code == '200'){
                    notification('success',"Image Removed Successfully");   
                }
            },
            error:function(e){
                if(e){
                    notification('error',"Something Went Wrong");   
                }
            }
        })
    }

}
function notification(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}


