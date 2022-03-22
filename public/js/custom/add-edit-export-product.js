
function Product(){
    this.currentRemovedFile = null;
    this.deletedIds = [];
    //this.propertiesValues - [];
}

Product.prototype.http = function(type, url, formData){
    return new Promise(function (resolve, reject) {
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
            },
            url: url,
            type: type,
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function(e){
                resolve(e);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

Product.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

Product.prototype.check_validation = function(el, type=null){
    var result = true;
    var inputs = (type)? el.find('.required') : el.find('input, select, textarea') ;

    $.each(inputs, function(k, e){
        if($(e).attr('type')!='file' && $(e).val()==''){
            $(e).addClass('input-error');
            if($(e)[0].localName=='select'){
                $(e).next().find('.select2-selection').addClass('input-error');
            }
            result = false;
        }
    });
    return result
}

Product.prototype.propertyVByProIdSelectOptions = function(propId){
    var propValues = this.propertiesValues;
    propValues = propValues.filter(x=>x.property && x.property.id==propId);
    var html = '';
    if(propValues.length>0){
        propValues.forEach(element => {
            html += `<option value="${element.id}">${element.name}</option>`;
        });
    }
    return html;
}

let product = new Product();

var imagesDropZone = new Dropzone("#product-images-dropzone", {
    addRemoveLinks: true,
    // maxFiles: 4,
    acceptedFiles: 'image/*',
    // maxFilesize: 5,
    autoProcessQueue: false,
    removedfile: function(file) {
        if(file.delete_file_type){
            file.previewElement.remove();
        }else{
            $("#image-type").val('image');
            $("#image-id").val(file.id);
            $("#deleteImages").modal('show');
            product.currentRemovedFile = file;
        }
    }
});

function delete_product_media(){
    var type = $("#image-type").val();
    var id = $("#image-id").val();
    var formData = new FormData();
    formData.append('type', type);
    formData.append('id', id);


    $('#deleteImages').modal('hide');
    product.currentRemovedFile.previewElement.remove();

    product.http('POST', '/delete-export-product-media', formData).then(function(e){
        var result = JSON.parse(e);
        product.notification(result.action, result.data);
    });
}

$(document).ready(function(){
    set_product_images_area();
});

$(`.property`).select2({
    tags: true,
    tokenSeparators: [","]
});

function set_product_images_area(){
    var productImages = $("#product-images").html();
    var base_url = $("#base_url").val();
    if(productImages.trim()!=''){
        productImages = JSON.parse(productImages);
        if(productImages.length>0){
            $.each(productImages, function(k, v){
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

// $("#category_id").on('change', function(e){
//     var element = $(e);
//     console.log(element);
// });

function load_sub_cats(id){

    product.http('GET', `/get-sub-cat/${id}`, {}).then((e)=>{
        var subCats = JSON.parse(e);
        $('#sub_category_id').html('<option value="">Select Sub Category*</option>');
        subCats.forEach(element => {
            $('#sub_category_id').append(`<option value="${element.id}">${element.category_name}</option>`);

        });
    });
}

$(".sub_category_id").select2().on("select2:opening", function(e) {
    if($('.form-barcode-input').length>0){
        $("#alertModalText").text('Please remove the variants from different category and attributes.');
        $("#alertModal").modal('show');
        setTimeout(() => {
            $('#sub_category_id').select2('close');
        }, 1);
    }
}).on('change', function(e){
    load_properties_attributes(this.value);
});

/*$("#delBtn").on('click', '.remove-pkg-tr', function () {
    $(this).closest('tr').remove();
});*/

function removeMe(that){
    $(that).closest('tr').remove();
}
function add_pkg_details() {
    var pkg_details_id = $("#pkg_details").val();
    var pkg_details_text = $("#pkg_details option:selected").text();
    var pkg_amount = $("#pkg_amount").val();
    if (pkg_amount == ''){
        alert('Please Enter Amount');
        return false;
    }
    $('#pkg_details_table tbody').append('' +
        '<tr id="'+ pkg_details_id + '">' +
        '<td>'+ pkg_details_text +'</td>' +
        '<td id="tdAmount">' + pkg_amount + '</td>' +
        '<td><button type="button" onclick="removeMe(this);"><i class="fa fa-trash-alt "></i></button></td>' +
        '</tr>');
    //alert(pkg_details_text);


}

function load_properties_attributes(id){
    product.http('GET', `/load-properties-attributes/${id}`, {}).then((e)=>{
        var result = JSON.parse(e);
        $("#add-property-area").html('');
        $(".add-attribute").remove();
        load_properties(result.properties);
        load_attributes(result.attributes);
    });
}

function add_key_feature(){
    var counter, html, el, input;
    el = $("#key-feature-counter");
    input = $("#key-feature-input");
    counter = parseInt(el.val());
    html = `<div class="alert fade show alert-color _add-secon" role="alert" id="key-feature-${counter}">${input.val()}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="remove_key_feature(${counter})"> <span aria-hidden="true">×</span> </button>
        <input type="hidden" value="${input.val()}" name="search_tags[]" id="key-feature-input-${counter}">
    </div>`;
    $(`#key-feature-area`).append(html);
    el.val(counter+1);
    input.val('');
}

function remove_key_feature(id){
    $(`#key-feature-${id}`).remove();
}




function submit_form(){
    if(!product.check_validation($("#export-product-form"), 'required')){
        product.notification('error', 'Please provide all the required information (*)');
        return false;
    }

    var formData = new FormData($("#export-product-form")[0]);
    formData.append('deletedIds', product.deletedIds);
    var thumbnail = $("input[name=thumbnail]")[0].files[0];
    var bg_thumbnail = $("input[name=bg_thumbnail]")[0].files[0];
    var hero_img = $("input[name=hero_img]")[0].files[0];
    var packaging_img = $("input[name=packaging_img]")[0].files[0];
    var meta_property_image = $("input[name=meta_property_image]")[0].files[0];
    //var packaging_details = $('#pkg_details_table').prop('outerHTML');
    var arrVal = [];

    $('#pkg_details_table tr').each(function(index, tr) {
        var id = this.id;
        $(tr).find('td[id="tdAmount"]').each (function (index, td) {
            var cellText = $(this).html();
            arrVal.push({
                id:id,
                value: cellText,
            });
        });
    });

    formData.append('packaging_details', JSON.stringify(arrVal));
    if(thumbnail){
        formData.append('thumbnail', thumbnail);
    }
    if(hero_img){
        formData.append('hero_img', hero_img);
    }
    if(packaging_img){
        formData.append('packaging_img', packaging_img);
    }
    if(meta_property_image){
        formData.append('meta_property_image', meta_property_image);
    }
    if(bg_thumbnail){
        formData.append('bg_thumbnail', bg_thumbnail);
    }
    if(imagesDropZone.files.length>0){
        imagesDropZone.files.forEach((x, i)=>{
            formData.append('images[]', imagesDropZone.files[i]);
        });
    }

    var product_id = $("input[name=product_id]").val();
    var url = (product_id.trim()=='')? '/store-export-product' : '/update-export-product' ;

    // remove_product_files();
    // return false;

    $("#progress-bar-area").show();
    $('#product-progress').text('0%');
    $('#product-progress').css('width', '0%');

    $.ajax({
        url: url,
        type: 'POST',
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                	var percentComplete = evt.loaded / evt.total;
                	percentComplete = parseInt(percentComplete * 100);
                	$('#product-progress').text(percentComplete + '%');
                	$('#product-progress').css('width', percentComplete + '%');
                }
            }, false);
            return xhr;
        },
        success: function (e) {
            var result = JSON.parse(e);

            if(result.action=='error'){
                switch (result.status) {
                    case 'sku_exists':
                        product.notification('error', result.data);
                        break;
                    case 'barcodes_exists':
                        product.notification('error', 'Some of variant\'s barcode are already exists please check.');
                        open_variants_area(JSON.parse(result.data));
                        break;
                    default:
                        break;
                }
            }
            product.deletedIds = [];
            setTimeout(function(){ $("#progress-bar-area").fadeOut(); }, 1000);

            if(result.action=='success'){

                var message = (result.status=='product_added')? 'Congratulation! Export Product added successfully.' : 'Congratulation! Export Product updated successfully.' ;
                product.notification('success', message);

                if(result.status=='product_added'){
                    window.location = '/export_product' ;
                    //$("#duplicateProductModal").modal("show");
                }

                if(result.status=='product_updated'){
                    imagesDropZone.files.forEach(function(file, key){
                        file.delete_file_type = true;
                        imagesDropZone.removeFile(file);
                    });
                    $("#product-images").text(JSON.stringify(result.data.media));
                    set_product_images_area();
                }
            }
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
        },
    });
    return false;
}


$("#blureEffct").find('input, textarea').on('keydown', function(e){
    var el = $(e.currentTarget);
    (el.val()=='')? el.addClass('input-error') : el.removeClass('input-error') ;
});

$('#blureEffct').find('select').on('change', function(e){
    var el = $(e.currentTarget);
    (el.val()=='')? el.next().find('.select2-selection').addClass('input-error') : el.next().find('.select2-selection').removeClass('input-error') ;
});


function create_product_copy(type){
    (type)? $("#duplicateProductModal").modal("hide") : window.location = '/export_product' ;
}



