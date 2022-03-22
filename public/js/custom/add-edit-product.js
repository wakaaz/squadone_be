
$(document).on("click","#cancel_update_product",function(){
    location.href = "/manage_vehicles";
})
function Product(){
    this.currentRemovedFile = null;
    this.deletedIds = [];
    this.propertiesValues - [];
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
        <input type="hidden" value="${input.val()}" name="key_features[]" id="key-feature-input-${counter}">
    </div>`;
    $(`#key-feature-area`).append(html);
    el.val(counter+1);
    input.val('');
}

function remove_key_feature(id){
    $(`#key-feature-${id}`).remove();
}

function load_properties(properties){
    if(properties.green_label){
        var html = `<div class="col-6">
                        <label class="font12 mb-5">Green Label Property (${properties.green_label.name})</label>
                        <div class="form-s2">
                        <select class="form-control" style="width:100%!important" name="property[green_label][${properties.green_label.id}][]" id="property-green-label-${properties.green_label.id}">
                        ${product.propertyVByProIdSelectOptions(properties.green_label.id)}
                        </select>
                        </div>
                    </div>`;
        $("#add-property-area").append(html);
        $(`#property-green-label-${properties.green_label.id}`).select2();
    }
    if(properties.below_name){
        var html = `<div class="col-6">
                        <label class="font12 mb-5">Below Name Property (${properties.below_name.name})</label>
                        <div class="form-s2">
                        <select class="form-control" multiple style="width:100%!important" name="property[below_name][${properties.below_name.id}][]" id="property-below-name-label-${properties.below_name.id}">
                        ${product.propertyVByProIdSelectOptions(properties.below_name.id)}
                        </select>
                        </div>
                    </div>`;

        $("#add-property-area").append(html);
        $(`#property-below-name-label-${properties.below_name.id}`).select2({
            tags: true,
        });
    }
    if(properties.other.length>0){
        properties.other.forEach(element => {
            var html = `<div class="col-6 mt-5">
                          <label class="font12 mb-5">${element.name}</label>
                          <div class="form-s2">
                          <select class="form-control" multiple style="width:100%!important" name="property[other][${element.id}][]" id="property-${element.id}">
                          ${product.propertyVByProIdSelectOptions(element.id)}
                          </select>
                          </div>
                        </div>`;
            $("#add-property-area").append(html);
            $(`#property-${element.id}`).select2({
                tags: true,
            });
        });
    }
}

function load_attributes(attributes){
    if(attributes.length>0){
        attributes.forEach(element => {
            var html = `<div class="col-4 add-attribute"><div class="form-s2"><label class="font12 mb-5">Select ${element.name}</label><select class="form-control formselect variant-attribute" attribute_id="${element.id}" style="width: 100%!important" name="add_attribute[${element.id}]" id="attribute-${element.id}"><option value="">Select ${element.name}*</option>`;
            if(element.assignments.length>0){
                element.assignments.forEach(assign => {
                    html += `<option value="${assign.id}">${assign.value}</option>`;
                });
            }
            html += `</select></div></div>`;
            $("#add-attribute-area").append(html);
            $(`#attribute-${element.id}`).select2();
        });
    }
}
function add_new_variant(){
    if(!$("#collapsePOCdetail").hasClass('show')){
        $('#collapsePOCdetail').collapse("show");
        return false;
    }

    if(!product.check_validation($("#collapsePOCdetail"))){
        product.notification('error', 'Please provide all the required information while adding a variant (*)');
        return false;
    }

    var counter = $("#add-variant-counter").val();
    counter = parseInt(counter);
    var formData = new FormData();
    formData.append('counter', counter);
    formData.append('barcode', $("input[name=add_barcode]").val());
    formData.append('sell_price', $("input[name=add_sell_price]").val());
    formData.append('cost_price', $("input[name=add_cost_price]").val());
    formData.append('whole_sale_price', $("input[name=add_whole_sale_price]").val());
    formData.append('initial_quantity', $("input[name=add_initial_quantity]").val());
    formData.append('id', 0);
    formData.append('variant_image_id', 0);

    if($(".variant-attribute").length>0){
        var attributes = {};
        $.each($(".variant-attribute"), function(index, element){
            attributes[parseInt($(element).attr('attribute_id'))] = $(element).val();
        });
        formData.append('attribute', JSON.stringify(attributes));
    }
    product.http('POST', '/add-new-variant', formData).then((e)=>{
        if(e=='barcode_exists'){
            product.notification('error', 'Error: Barcode is already exists, please try another one.');
            return false;
        }
        $("#variants-area").append(e);
        $('#collapsePOCdetail').collapse("hide");
        clone_variant_image(counter);
        trigger_variant_html_dom();
        $("#add-variant-counter").val(counter+1);

        $("input[name=add_barcode]").val('');
        $("input[name=add_sell_price]").val('');
        $("input[name=add_cost_price]").val('');
        $("input[name=add_whole_sale_price]").val('');
        $("input[name=add_initial_quantity]").val('');

        if($(".variant-attribute").length>0){
            $.each($(".variant-attribute"), function(index, element){
                $(element).val('');
                $(element).trigger('change');
                $(element).next().find('.select2-selection').removeClass('input-error')
            });
        }
    });
}
function clone_variant_image(counter){
    var originalFile = $("#input-file-now");

    if(originalFile[0].files.length<=0){
        $(`#input-file-now-${counter}`).dropify();
        return false;
    }

    var variantImage = originalFile.clone();
    variantImage.attr('id', `input-file-now-${counter}`);
    variantImage.attr('name', `variant_image[${counter}]`);

    $(`#input-file-now-${counter}`).replaceWith(variantImage);
    var el = $(`#input-file-now-${counter}`);
    variantImage.attr('data-default-file', el[0].files[0].name);
    $(`#input-file-now-${counter}`).dropify();
    setTimeout(function(){
        const preview = $(`#variant-image-dropify-${counter}`).find('.has-preview').find('.dropify-preview').find('.dropify-render').find('img');
        const file = document.querySelector(`#input-file-now-${counter}`).files[0];
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            preview[0].src = reader.result;
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    }, 500);
}
function submit_form(){
    var formData = new FormData($("#product-form")[0]);
    formData.append('deletedIds', product.deletedIds);
    var default_car_thumbnail = $("input[name=default_car_thumbnail]")[0].files[0];
    var h_img_for_mobile = $("input[name=h_img_for_mobile]")[0].files[0];
    var h_img_for_tab = $("input[name=h_img_for_tab]")[0].files[0];
    var h_img_for_laptop = $("input[name=h_img_for_laptop]")[0].files[0];
    var bg_thumbnail = $("input[name=bg_thumbnail]")[0].files[0];
    if(default_car_thumbnail){
        formData.append('default_car_thumbnail', default_car_thumbnail);
    }
    if(h_img_for_mobile){
        formData.append('h_img_for_mobile', h_img_for_mobile);
    }
    if(h_img_for_tab){
        formData.append('h_img_for_tab', h_img_for_tab);
    }
    if(h_img_for_laptop){
        formData.append('h_img_for_laptop', h_img_for_laptop);
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
    var url = (product_id.trim()=='')? '/store-product' : '/update-product' ;
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
                var message = (result.status=='product_added')? 'Congratulation! Product added successfully.' : 'Congratulation! Product updated successfully.' ;
                product.notification('success', message);
                if(result.status=='product_updated'){
                   location.reload();
                }
            }
            $(".progress").removeClass("progress-striped");
            $(".progress").addClass("progress-bar-default");
            setTimeout(function(){
            	$(".progress").slideUp(1000);
            	setTimeout(function(){
            		$(".myprogress").text(0 + '%');
            		$(".myprogress").css('width', 0 + '%');
            		$(".progress").removeClass("progress-bar-default");
            		$(".progress").addClass("progress-striped");
            	}, 1000);
            	$("#loader_files_spinner").hide();
            	$("#files_div").append(data);
                socket.emit("home event",JSON.stringify({type:'reload recent files',project_id:$project_id}));
                row_highlight();
                initiateMagnify();
            	get_recent_photos();
            }, 1000);
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


function open_variants_area(ids){
    $.each(ids, function(key, id){
        $(`#collapsePOCdetail${id}`).collapse("show");
        $(`#variant-barcode-${id}`).addClass('input-error');
        $(`#variant-barcode-${id}`).on('keydown', function(e){
            ($(e).val()=='')? $(`#variant-barcode-${id}`).addClass('input-error') : $(`#variant-barcode-${id}`).removeClass('input-error') ;
        })
    });
}

function trigger_variant_html_dom(){
    $(".attribute-select").select2();
    $('.form-control').on('focus blur', function (e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');


    $(".collapseVariantClodeBtn").on('click', function(e){
        e.stopPropagation();
        var id = $(this).attr('variantid');
        if($(`#collapsePOCdetail${id}`).hasClass('show')){
            $(`#collapsePOCdetail${id}`).collapse("hide");
        }else{
            $(`#collapsePOCdetail${id}`).collapse("show");
        }
    });

}
trigger_variant_html_dom();
function delete_varitant(counter, id){
    if(id!=0) product.deletedIds.push(id);
    $(`#variant-row-${counter}`).remove();
}
$("#blureEffct").find('input, textarea').on('keydown', function(e){
    var el = $(e.currentTarget);
    (el.val()=='')? el.addClass('input-error') : el.removeClass('input-error') ;
});

$('#blureEffct').find('select').on('change', function(e){
    var el = $(e.currentTarget);
    (el.val()=='')? el.next().find('.select2-selection').addClass('input-error') : el.next().find('.select2-selection').removeClass('input-error') ;
});
function delete_product_media(){
    var type = $("#image-type").val();
    var id = $("#image-id").val();
    var formData = new FormData();
    formData.append('type', type);
    formData.append('id', id);


    $('#deleteImages').modal('hide');
    product.currentRemovedFile.previewElement.remove();

    product.http('POST', '/delete-product-media', formData).then(function(e){
        var result = JSON.parse(e);
        product.notification(result.action, result.data);
    });
}
function create_product_copy(type){
    (type)? $("#duplicateProductModal").modal("hide") : window.location = '/manage_vehicles' ;
}



