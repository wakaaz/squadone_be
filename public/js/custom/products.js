var acceptedFileTypes = "image/*"; //dropzone requires this param be a comma separated list
var fileList = new Array;
var i = 0;
var callForDzReset = false;
var myDropzone = '';

var segments = location.href.split('/');
var last_operation = 'add';
var opp_name = 'Product';
var base_url = '';

var all_properties = [];
var all_products = [];
var all_product_properties = [];
var all_variants = [];
var all_var_images = [];
var all_attributes_assignment = [];
var all_sub_categories = [];
var all_attributes = [];
var all_variant_attributes = [];
var all_products_gallery = [];

var random_id_for_add = '';
var random_id_for_update = '';

var update_assignment_val = '';
var selected_cat_for_variant = '';

var total_records = 0;
var totalPages = 0;

var update_category_id = '';
var update_properties_array = [];
$(document).ready(function() {
    $('#dataSidebarLoader').hide();
    if (segments[3] == 'manage_product') {
        $('#productImgDiv').empty()
        $('#productImgDiv').append('<input type="file" name="productThumbnail" id="productThumbnail" />');
        $('#productThumbnail').dropify();
        fetchDataForProducts();

        myDropzone = new Dropzone("#dropzoneVariantImages", {
            url: "/upload_variant_images",
            addRemoveLinks: true,
            maxFiles: 4,
            acceptedFiles: 'image/*',
            maxFilesize: 5,
            init: function() {
                this.on("success", function(file, serverFileName) {
                    file.serverFn = serverFileName;
                    fileList[i] = {
                        "serverFileName": serverFileName,
                        "fileName": file.name,
                        "fileId": i
                    };
                    i++;
                });
            },
            removedfile: function(file) {
                var cust_key = $('.hidden_key_id').val();
                if ($('#operation').val() == "update") {
                    var name = '';
                    if (file.name.split('variant_images/')[1]) {
                        name = file.name.split('variant_images/')[1]
                    } else {
                        name = file.serverFn;
                    }
                    $.ajax({
                        type: 'GET',
                        url: '/remove_variant_images/' + name,
                        data: {
                            _token: '{!! csrf_token() !!}',
                            cust_key: cust_key
                        },
                        success: function(data) {
                            var _ref;
                            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    });
                } else {
                    if (!callForDzReset) {
                        var name = file.serverFn.split('variant_images/')[1];
                        $.ajax({
                            type: 'GET',
                            url: '/remove_variant_images/' + name,
                            data: {
                                _token: '{!! csrf_token() !!}',
                                cust_key: cust_key
                            },
                            success: function(data) {
                                console.log('success: ' + data);
                            }
                        });
                    }
                    var _ref;
                    return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
                }
            }
        });

        document.querySelector("#add-product-copy-btn").addEventListener('click', duplicateProduct)

    } else if (segments[3] == 'products_list') {
        fetchBrandsList();
        $('.open_page').text('Brands')
    } else if (segments[3] == 'BrandProducts') {
        fetchProducts();
        $('.open_page').text('Products')
    } else if (segments[3] == 'ProductItems' || segments[3] == 'ProductDetail') {
        if (segments[3] == 'ProductDetail') {
            fetchForProductDetail(segments[4]);
            opp_name = 'Variant';
            // $('select[name="product_id"]').val(segments[4]).trigger('change');
            // $('select[name="product_id"]').parent().parent().hide();
        } else if (segments[3] == 'ProductItems') {
            fetchProductItems();
        }

        $('.open_page').text('Items')
        myDropzone = new Dropzone("#dropzoneVariantImages", {
            url: "/upload_variant_images",
            addRemoveLinks: true,
            maxFiles: 4,
            acceptedFiles: 'image/*',
            maxFilesize: 5,
            init: function() {
                this.on("success", function(file, serverFileName) {
                    file.serverFn = serverFileName;
                    fileList[i] = {
                        "serverFileName": serverFileName,
                        "fileName": file.name,
                        "fileId": i
                    };
                    i++;
                });
            },
            removedfile: function(file) {
                var cust_key = $('.hidden_key_id').val();
                if ($('#operation').val() == "update") {
                    var name = '';
                    if (file.name.split('variant_images/')[1]) {
                        name = file.name.split('variant_images/')[1]
                    } else {
                        name = file.serverFn;
                    }
                    $.ajax({
                        type: 'GET',
                        url: '/remove_variant_images/' + name,
                        data: {
                            _token: '{!! csrf_token() !!}',
                            cust_key: cust_key
                        },
                        success: function(data) {
                            var _ref;
                            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    });
                } else {
                    if (!callForDzReset) {
                        var name = file.serverFn.split('variant_images/')[1];
                        $.ajax({
                            type: 'GET',
                            url: '/remove_variant_images/' + name,
                            data: {
                                _token: '{!! csrf_token() !!}',
                                cust_key: cust_key
                            },
                            success: function(data) {
                                console.log('success: ' + data);
                            }
                        });
                    }
                    var _ref;
                    return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
                }
            }
        });
    } else if (segments[3] == 'gallery') {
        fetchInvForGallery();
    }
    // else if(segments[3] == 'ProductDetail'){
    //     fetchForProductDetail(segments[4]);
    // }

    $(document).on('click', '.nav-item', function() {
        $('.opp_name').text(' New ' + $(this).attr('name'));
        opp_name = $(this).attr('name');
    })

    $(document).on('click', '.openDataSidebarForAdd', function() {
        if (opp_name == 'Product') {
            $('.productCore_form_div').show();
            $('.variant_form_div').hide();
        } else {
            $('.productCore_form_div').hide();
            $('.variant_form_div').show();
            if (segments[3] == 'ProductDetail') {
                $('select[name="product_id"]').val(segments[4]).trigger('change');
                $('select[name="product_id"]').parent().parent().hide();
            }
        }

        if (last_operation == 'update') {
            properties = [];
            update_properties_array = [];
            update_category_id = 0;
            $('.selected_cat_div').empty();
            $('input[name="product_name"]').val('')
            $('input[name="product_sku"]').val('')
            $('textarea[name="description"]').val('')
            $('input[name="sell_price"]').val('')
            $('input[name="cost_price"]').val('')
            $('input[name="whole_sale_price"]').val('')
            $('input[name="barcode"]').val('')

            $('.category_id').val(0).trigger('change');
            $('.brand_id').val(0).trigger('change');
            $('.product_id').val(0).trigger('change');
            $('.attribute_id').val(0).trigger('change');

            $('#productImgDiv').empty()
            $('#productImgDiv').append('<input type="file" name="productThumbnail" id="productThumbnail" />');
            $('#productThumbnail').dropify();
            $('.hidden_key_id').val(random_id_for_add);
            $('.dz-image-preview').empty();
        }
        openSidebar();
        last_operation = 'add';
        $('#operation').val('add');
    })


    $(document).on('click', '.openDataSidebarForUpdate', function() {
        update_properties_array = [];
        var id = $(this).attr('id');
        if (opp_name == 'Product') {
            $('.productCore_form_div').show();
            $('.variant_form_div').hide();
            $('#product_update_id').val(id);
        } else {
            $('.productCore_form_div').hide();
            $('.variant_form_div').show();
            $('#variant_update_id').val(id);
        }

        openSidebar();
        last_operation = 'update';
        $('#operation').val('update');

        if (opp_name == 'Product') {
            var data = all_products.find(x => x.id == id);
            $('._cl-bottom').show();
            $('.pc-cartlist').show();

            put_data_into_fields(data);
            update_category_id = data.category_id;






            // $('.property_value').each(function() {
            //     $(this).val(props.find(x => x.property_id == $(this).attr('id')).property_value)
            //     $(this).focus();
            // });
        } else {
            $('.dz-image-preview').empty();
            var data = all_variants.find(x => x.id == id);
            $('._cl-bottom').show();
            $('.pc-cartlist').show();

            $('input[name="sell_price"]').focus();
            $('input[name="sell_price"]').val(data.sell_price);
            $('input[name="sell_price"]').blur();

            $('input[name="cost_price"]').focus();
            $('input[name="cost_price"]').val(data.cost_price);
            $('input[name="cost_price"]').blur();

            $('input[name="whole_sale_price"]').focus();
            $('input[name="whole_sale_price"]').val(data.whole_sale_price);
            $('input[name="whole_sale_price"]').blur();

            $('input[name="barcode"]').focus();
            $('input[name="barcode"]').val(data.barcode);
            $('input[name="barcode"]').blur();

            update_assignment_val = data.attribute_value;
            $('select[name="product_id"]').val(data.product_id).trigger('change')
            $('select[name="attribute_id"]').val(data.attribute_id).trigger('change')


            random_id_for_update = data.image_key;
            $('.hidden_key_id').val(random_id_for_update);

            var mockFile = "";
            var images = all_var_images.filter(x => x.product_id == id);
            images.forEach(element => {
                mockFile = {
                    name: element.image,
                    size: 12345
                };
                myDropzone.options.addedfile.call(myDropzone, mockFile);
                // And to show the thumbnail of the file:
                myDropzone.options.thumbnail.call(myDropzone, mockFile, element.image);
            });

            setTimeout(function() {
                $('.dz-image').find('img').css('width', '100%');
                $('.dz-image').find('img').css('height', '100%');
            }, 500)

            var assign_attr = all_variant_attributes.filter(x => x.variant_id == id);
            setTimeout(function() {
                assign_attr.forEach(element => {
                    $(`.attr_ass_${element['attribute_id']}`).val(element['assignment_id']).trigger('change');
                })
            }, 800)
        }

    })

    $(document).on('change', '.category_id', function() {
        if ($(this).val() == update_category_id) {
            $('.selected_cat_div').empty();
            if (update_properties_array.length > 0) {
                update_properties_array.forEach(element => {
                    if ($(`[prop="${element['property_id']}}"]`).length) {
                        $(`[prop="${element['property_id']}}"]`).append(`<div class="row">
                        <div class="col-md-10">
                            <div class="form-group">
                                    <input type="text" id="${element['property_id']}" value="${element['property_value']}" class="form-control property_value">
                                </div>
                            </div>
                            <div class="col-md-2" style="padding: 0;">
                        <button id="${element['property_name']+'/'+element['property_id']}}" style="width: 25px; border-radius:0; background: #01223c;
                        padding: 10px 0px; font-size: 11px; margin-top: 14px" type="button" class="btn btn-line add_more"><i class="fa fa-plus" style="color:white"></i></button>
                        <button id="${element['property_name']+'/'+element['property_id']}}" style="width: 25px; border-radius:0; background: red;
                        padding: 10px 0px; font-size: 11px; margin-top: 14px" type="button" class="btn btn-line removeProp"><i class="fa fa-times" style="color:white"></i></button>
                        </div>
                    </div>`)
                    } else {
                        $('.selected_cat_div').append(`
                    <label style="font-size: 10px">${element['property_name']}*</label>
                    <div prop="${element['property_id']}}">
                        <div class="row">
                            <div class="col-md-10">
                                <div class="form-group">
                                        <input type="text" id="${element['property_id']}" value="${element['property_value']}" class="form-control property_value">
                                    </div>
                                </div>
                            <div class="col-md-2" style="padding: 0;">
                                <button id="${element['property_name']+'/'+element['property_id']}}" style="width: 25px; border-radius:0; background: #01223c;
                                padding: 10px 0px; font-size: 11px; margin-top: 14px" type="button" class="btn btn-line add_more"><i class="fa fa-plus" style="color:white"></i></button>
                            </div>
                        </div>
                    </div><hr>`);
                    }
                })
                $(".form-control").on("focus blur", function(e) {
                    $(this).parent().toggleClass(
                        "focused",
                        e.type === "focus" || this.value.length > 0
                    );
                }).trigger("blur");
            }



        } else {
            $('.selected_cat_div').empty();
            var selected_property = $(".category_id option:selected").attr('name');
            var properties = [];
            if (selected_property) {
                selected_property.split(',').forEach(element => {
                    properties.push({
                        'id': element,
                        'name': all_properties.find(x => x.id == element).name
                    });
                    var prop_name = all_properties.find(x => x.id == element).name;
                    $('.selected_cat_div').append(`
                    <label style="font-size: 10px">${prop_name}*</label>
                    <div prop="${element}">
                        <div class="row">
                    <div class="col-md-10">
                        <div class="form-group">
                                <input type="text" id="${element}" class="form-control property_value">
                            </div>
                        </div>
                        <div class="col-md-2" style="padding: 0;">
                        <button id="${prop_name+'/'+element}" style="width: 25px; border-radius:0; background: #01223c;
                        padding: 10px 0px; font-size: 11px; margin-top: 14px" type="button" class="btn btn-line add_more"><i class="fa fa-plus" style="color:white"></i></button>
                    </div>
                </div>
                    </div><hr>`);
                });
                // $(".form-control").on("focus blur", function(e) {
                //     $(this).parent().toggleClass(
                //         "focused",
                //         e.type === "focus" || this.value.length > 0
                //     );
                // }).trigger("blur");

            }
        }

    })

    $(document).on('click', '.removeProp', function() {
        $(this).parent().parent().remove()
    })

    $(document).on('click', '.add_more', function() {
        var prop_name = $(this).attr('id').split('/')[0];
        var element = $(this).attr('id').split('/')[1];

        $(`[prop="${element}"]`).append(`<div class="row">
            <div class="col-md-10">
                <div class="form-group">
                        <input type="text" id="${element}" class="form-control property_value">
                    </div>
                </div>
                <div class="col-md-2" style="padding: 0;">
            <button id="${prop_name+'/'+element}" style="width: 25px; border-radius:0; background: #01223c;
            padding: 10px 0px; font-size: 11px; margin-top: 14px" type="button" class="btn btn-line add_more"><i class="fa fa-plus" style="color:white"></i></button>
            <button id="${prop_name+'/'+element}" style="width: 25px; border-radius:0; background: red;
            padding: 10px 0px; font-size: 11px; margin-top: 14px" type="button" class="btn btn-line removeProp"><i class="fa fa-times" style="color:white"></i></button>
            </div>
        </div>`)

        // $(".form-control").on("focus blur", function(e) {
        //     $(this).parent().toggleClass(
        //         "focused",
        //         e.type === "focus" || this.value.length > 0
        //     );
        // }).trigger("blur");
    });

    $(document).on('change', '.product_id', function() {
        $('.attributes_div').empty();
        var selected_pro_cat = all_sub_categories.find(x => x.id == $(".product_id option:selected").attr('name'));
        if (selected_pro_cat) {
            selected_pro_cat.attribute_id.split(',').forEach(element => {
                var data = all_attributes.find(x => x.id == element);
                $('.attributes_div').append(`<div class="col-md-6">
                    <div class="form-s2 pt-19">
                        <select name="attribute_id" attr_id="${data.id}" class="form-control formselect required_variant attribute_id attr_ass_${data.id}">
                            <option value="" selected disabled>Select ${data.name}*</option>
                        </select>
                    </div>
                </div> `);
                all_attributes_assignment.filter(x => x.attribute_id == data.id).forEach(element => {
                    $(`.attr_ass_${data.id}`).append(`<option ${update_assignment_val == element['id'] ? 'selected' : ''} name="${data.id}" value="${element['id']}">${element['value']}</option>`);
                })
            });
            $(".formselect").select2();
        }
    })

    $(document).on('click', '#save_product_data', function() {
        var invalidSave = [];
        var property_values = [];
        var variant_attributes = [];

        var fillable = opp_name == 'Product' ? '.required' : '.required_variant';
        $(fillable).each(function() {
            if (!$(this).val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                invalidSave.push(true);
            } else {
                invalidSave.push(false);
            }
        });

        if (invalidSave.includes(true))
            return;

        if (opp_name == 'Product') {
            $('.property_value').each(function() {
                if ($(this).val()) {
                    property_values.push({
                        'id': $(this).attr('id'),
                        'value': $(this).val() ? $(this).val() : null
                    });
                }
            });
        } else {
            $('.attribute_id').each(function() {
                variant_attributes.push({
                    'attribute_id': $(this).find('option:selected').attr('name'),
                    'assigment_id': $(this).val(),
                    'assignment_value': $(this).find('option:selected').text()
                });
            });
        }



        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        $('#cancel_product_data').attr('disabled', 'disabled');
        thisRef.text('Processing..');

        var url = '/save_product';
        if (opp_name != 'Product') {
            url = '/save_variant'
        }

        $('#saveProductForm').ajaxSubmit({
            type: "POST",
            url: url,
            data: {
                property_values: property_values,
                variant_attributes: variant_attributes
            },
            cache: false,
            success: function(response) {
                thisRef.removeAttr('disabled');
                $('#cancel_product_data').removeAttr('disabled');
                thisRef.text('Save');
                var result = JSON.parse(response);
                if (result.status == "success") {
                    if (segments[3] == 'BrandProducts' || segments[3] == 'ProductDetail' || segments[3] == 'ProductItems') {
                        location.reload();
                        return;
                    }
                    fetchDataForProducts();
                    $('#notifDiv').text('Saved Successfully!');
                    //if ($('#operation').val() == "add") {
                    $('input[name="product_name"]').val('');
                    $('input[name="product_sku"]').val('');
                    $('textarea[name="description"]').val('');
                    $('input[name="sell_price"]').val('')
                    $('input[name="cost_price"]').val('')
                    $('input[name="whole_sale_price"]').val('')
                    $('input[name="barcode"]').val('')
                    $('select[name="brand_id"]').val(0).trigger('change');
                    $('select[name="category_id"]').val(0).trigger('change');
                    $('.product_id').val(0).trigger('change');
                    $('.attribute_id').val(0).trigger('change');
                    $('#pl-close').click();
                    $('.selected_cat_div').empty();
                    $('#productImgDiv').empty()
                    $('#productImgDiv').append('<input type="file" name="productThumbnail" id="productThumbnail" />');
                    $('#productThumbnail').dropify();
                    callForDzReset = true;
                    $('.dz-image-preview').empty();
                    //}

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    if(segments[4]){
                        window.open('/manage_product', '_self');
                    }else{
                        $('#product-copy-id').val(result.product_id);
                        $('#duplicateProductModal').modal('show');
                    }
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to save at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function(err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function(i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });
    })




    $(document).on('click', '.page_link', function() {
        var not_found = true;

        current_active_page = parseFloat($(this).attr('name'));
        //$(this).addClass('active');
        not_found = false;

        if (!not_found) {

            $('.products_grid_view_div').empty();
            all_products_gallery[current_active_page].map(function(element) {
                var pro_variant = all_variants.filter(x => x.product_id == element['id']);
                $('.products_grid_view_div').append(`<div class="col-lg-3 col-md-4">
                        <div class="_product-card">
                            <div class="offer">2 FOR £20</div>
                            <div class="offer2"><span>NIC-SHOTS</span>INCLUDED</div>

                            <div class="PR-Thumb">
                                <div class="middle"><img src="${base_url+element['thumbnail']}" alt="" /></div>
                            </div>
                            <div class="p-val property_val_${element['id']}"> </div>
                            <h2>${element['name']}</h2>
                            <div class="lab-div property_div_${element['id']}"> </div>
                            <div class="price"><span class="p-span">£32.00</span> <span class="p-from">From:</span>
                                <span class="price_from_${element['id']}"></span></div>
                            <div class="lab-size first_div_${element['id']}"></div>
                            <div class="lab-colors second_div_${element['id']}"></div>
                            <div><a href="ProductDetail/${element['id']}" class="btn view-detail"><i class="fa fa-list"></i> View Detail</a></div>
                        </div>
                    </div>`);
                var prop_added = [];
                var props = all_product_properties.filter(x => x.product_id == element['id'])

                var product_id = element['id'];
                props.forEach(element => {
                    if (element['placement'] == 1) {
                        if (prop_added.includes(element.property_name)) {
                            $(`.property_div_${product_id}`).find(`.${product_id}_div`).append(' ' + element.property_value);
                        } else {
                            prop_added.push(element.property_name);
                            $(`.property_div_${product_id}`).append(`<strong class="first_${product_id}">${element.property_name}:</strong><span class="${product_id}_div">${' '+element.property_value}</span><br>`)
                        }
                    } else if (element['placement'] == 2) {
                        $(`.property_val_${product_id}`).text(element.property_value ? element.property_value : '--')
                    }
                })

                var first = [];
                var second = [];
                var prices = [];
                pro_variant.forEach(element => {
                    prices.push(parseFloat(element.sell_price));
                    var attr = all_variant_attributes.find(x => x.variant_id == element['id']);
                    if (attr === undefined) {

                    } else {
                        if (attr.placement == 1) {
                            if (first.includes(attr.attribute)) {
                                $(`.first_div_${product_id}`).find(`.${attr.attribute}_div`).append(`<span>${attr.assignment_value}</span>`);
                            } else {
                                first.push(attr.attribute);
                                $(`.first_div_${product_id}`).append(`<strong class="first_${attr.attribute}">${attr.attribute}:</strong><div class="${attr.attribute}_div"> <span>${attr.assignment_value}</span></div>`)
                            }
                        } else if (attr.placement == 2) {
                            if (second.includes(attr.attribute)) {
                                $(`.second_div_${product_id}`).find(`.${attr.attribute}_div`).append(` <span>${attr.assignment_value}</span>`);
                            } else {
                                second.push(attr.attribute);
                                $(`.second_div_${product_id}`).append(`<strong class="second_${attr.attribute}">${attr.attribute}:</strong><div class="${attr.attribute}_div"><span>${attr.assignment_value}</span></div>`)
                            }
                        }
                    }
                })
                $(`.price_from_${element['id']}`).text('£' + prices ? prices.sort( function (a,b) { return a === b ? 0 : a < b ? -1: 1} )[0] : 0);
            });
        }

    })

    $(document).on('input', '.search_product', function() {
        rendersearch($(this).val().toLowerCase(), $('.ctaegory_filter').val(), $('.brand_filter').val(), $('.sort_filter').val());
    })

    $(document).on('change', '.ctaegory_filter', function() {
        rendersearch($('.search_product').val().toLowerCase(), $(this).val(), $('.brand_filter').val(), $('.sort_filter').val());
    })

    $(document).on('change', '.brand_filter', function() {
        rendersearch($('.search_product').val().toLowerCase(), $('.ctaegory_filter').val(), $(this).val(), $('.sort_filter').val());
    })

    $(document).on('change', '.sort_filter', function() {
        rendersearch($('.search_product').val().toLowerCase(), $('.ctaegory_filter').val(), $('.brand_filter').val(), $(this).val());
    })

});

function fetchDataForProducts() {
    all_properties = [];
    all_products = [];
    all_product_properties = [];
    all_variants = [];
    all_var_images = [];
    all_attributes_assignment = [];
    all_attributes = [];
    all_sub_categories = [];
    all_variant_attributes = [];
    var total_products = 0;
    var ttal_variants = 0;
    $('.tblLoader').show();
    $.ajax({
        type: 'GET',
        url: '/fetchDataForProducts',
        success: function(response) {
            $('.tblLoader').hide();
            var response = JSON.parse(response);
            all_properties = response.properties;
            all_products = response.products;
            base_url = response.base_url;
            all_product_properties = response.product_properties;
            all_variants = response.variants;
            all_var_images = response.variant_images;
            all_attributes_assignment = response.attributes_assignment;
            all_sub_categories = response.sub_categories;
            all_attributes = response.attributes;
            all_variant_attributes = response.variant_attributes;

            $('.body_core').empty();
            $('.body_core').append('<table class="table table-hover dt-responsive nowrap" id="ProductTable" style="width:100%;"><thead><tr><th>ID</th><th>Product Name</th><th>Product SKU</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#ProductTable tbody').empty();
            $('.product_id').empty();
            $('.product_id').append(`<option value="0" disabled selected>Select Product*</option>`);
            response.products.forEach(element => {
                total_products++;
                $('#ProductTable tbody').append(`<tr><td>${element['id']}</td><td>${element['name']}</td><td>${element['sku']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdate">Edit</button></td></tr>`);
                $('.product_id').append(`<option value="${element['id']}" name="${element['category_id']}">${element['name']}</option>`);
            });
            $('.body_core').hasClass('active') ? $('.body_core').fadeIn() : null;
            $('#ProductTable').DataTable();
            $('.count_core').text(total_products);

            $('.body_variants').empty();
            $('.body_variants').append('<table class="table table-hover dt-responsive nowrap" id="VariantTable" style="width:100%;"><thead><tr><th>ID</th><th>Product Name</th><th>Sell Price</th><th>Cost Price</th><th>Action</th></tr></thead><tbody></tbody></table>');
            response.variants.forEach(element => {
                ttal_variants++;
                $('#VariantTable tbody').append(`<tr><td>${element['id']}</td><td>${element['product_name']}</td><td>${element['sell_price']}</td><td>${element['cost_price']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdate">Edit</button></td></tr>`);
            });
            $('#VariantTable').DataTable();
            $('.body_variants').hasClass('active') ? $('.body_variants').fadeIn() : null;
            $('.count_variants').text(ttal_variants);

            $('.hidden_key_id').val(randomString(50, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));
            random_id_for_add = $('.hidden_key_id').val();

            if(segments[4]){
                checkIfDuplicateProduct(segments[4]);
            }
        }
    });
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function fetchBrandsList() {
    $.ajax({
        type: 'GET',
        url: '/fetchProductBrandsList',
        success: function(response) {
            $('.body_brands').empty();
            $('.body_brands').append('<table class="table table-hover dt-responsive nowrap" id="BrandTable" style="width:100%;"><thead><tr><th>S.No</th><th>Brand Name</th><th>Total Products</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#BrandTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            all_properties = response;
            response.forEach(element => {
                $('#BrandTable tbody').append(`<tr><td>${sNo}</td><td>${element['brand']}</td><td>${element['total_products']}</td><td><a href="/BrandProducts/${element['brand_id']}" class="btn btn-default btn-line">View Products</a></td></tr>`);
                sNo++;
            });
            $('#tblLoader').hide();
            $('.body_brands').fadeIn();
            $('#BrandTable').DataTable();
        }
    });
}

function fetchProducts() {
    opp_name = 'Product';
    all_products = [];
    base_url = '';
    all_properties = [];
    all_product_properties = [];
    $.ajax({
        type: 'GET',
        url: '/fetchProducts/' + segments[4],
        success: function(response) {
            $('.body_brands').empty();
            $('.body_brands').append('<table class="table table-hover dt-responsive nowrap" id="ProductTable" style="width:100%;"><thead><tr><th>S.No</th><th>SKU</th><th>Name</th><th>Total Items</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#ProductTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            all_products = response.products;
            base_url = response.base_url;
            all_properties = response.properties;
            all_product_properties = response.product_properties;
            response.products.forEach(element => {
                $('#ProductTable tbody').append(`<tr><td>${sNo}</td><td>${element['sku']}</td><td>${element['name']}</td><td>${element['total_variants']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdate">Edit</button><a href="/ProductItems/${element['id']}" class="btn btn-default btn-line">View Items</a></td></tr>`);
                sNo++;
            });
            $('#tblLoader').hide();
            $('.body_brands').fadeIn();
            $('#ProductTable').DataTable();
        }
    });
}

function fetchProductItems() {
    opp_name = 'Variant';
    all_variants = [];
    all_var_images = [];
    all_sub_categories = [];
    all_attributes = [];
    all_attributes_assignment = [];
    all_variant_attributes = [];
    $.ajax({
        type: 'GET',
        url: '/fetchProductItems/' + segments[4],
        success: function(response) {
            $('.body_brands').empty();
            $('.body_brands').append('<table class="table table-hover dt-responsive nowrap" id="ItemsTable" style="width:100%;"><thead><tr><th>S.No</th><th>Product Name</th><th>Cost Price</th><th>Barcoade</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#ItemsTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            all_variants = response.items;
            all_var_images = response.variant_images
            all_sub_categories = response.sub_categories;
            all_attributes = response.attributes;
            all_attributes_assignment = response.attributes_assignment;
            all_variant_attributes = response.variant_attributes
            response.items.forEach(element => {
                $('#ItemsTable tbody').append(`<tr><td>${sNo}</td><td>${element['product_name']}</td><td>${element['cost_price']}</td><td>${element['barcode']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdate">Edit</button></td></tr>`);
                sNo++;
            });

            $('.product_id').empty();
            $('.product_id').append(`<option value="0" disabled selected>Select Product*</option>`);
            response.products.forEach(element => {
                $('.product_id').append(`<option value="${element['id']}" name="${element['category_id']}">${element['name']}</option>`);
            })

            $('#tblLoader').hide();
            $('.body_brands').fadeIn();
            $('#ItemsTable').DataTable();
        }
    });
}


function fetchInvForGallery() {
    $('.tblLoader').fadeIn();
    $('.products_grid_view_div').empty();
    $('.search_product').val('');
    $.ajax({
        type: 'GET',
        url: '/FetchprodctsForGallery',
        success: function(response) {
            var response = JSON.parse(response);
            // console.log(response);
            //return;

            $('.tblLoader').hide();
            all_products = response.products;
            all_variants = response.variants;
            all_variant_attributes = response.variant_attributes;
            total_records = response.products.length;
            all_product_properties = response.product_properties;
            base_url = response.base_url;
            var recsPerPage = 12;
            totalPages = Math.ceil(total_records / recsPerPage);
            offset = 0;
            var pageNo = 0;
            var current_records = 0;
            var array_items_count = 0;
            var total_indexes = 0;

            //for testing
            fetchPagination(totalPages, current_records);

            $('.pagination').append(`<li name="-1" class="page-item page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
            var i;
            for (i = 1; i <= totalPages; i++) {
                $('.pagination').append(`<li name="${i}" class="page-item page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
            }
            $('.pagination').append('<li class="page-item page_link next" name="+1"><a class="page-link">Next</a></li>');

            //base_url = response.base_url;
            var test = [];
            response.products.forEach(element => {
                current_records++;
                array_items_count++;
                var pro_variant = all_variants.filter(x => x.product_id == element['id']);

                if (current_records <= 12) {
                    $('.products_grid_view_div').append(`<div class="col-lg-3 col-md-4">
                        <div class="_product-card">
                            <div class="offer">2 FOR £20</div>
                            <div class="offer2"><span>NIC-SHOTS</span>INCLUDED</div>

                            <div class="PR-Thumb">
                                <div class="middle"><img src="${base_url+element['thumbnail']}" alt="" /></div>
                            </div>
                            <div class="p-val property_val_${element['id']}"> </div>
                            <h2>${element['name']}</h2>
                            <div class="lab-div property_div_${element['id']}"> </div>
                            <div class="price"><span class="p-span">£32.00</span> <span class="p-from">From:</span>
                                <span class="price_from_${element['id']}"></span></div>
                            <div class="lab-size first_div_${element['id']}"></div>
                            <div class="lab-colors second_div_${element['id']}"></div>
                            <div><a href="ProductDetail/${element['id']}" class="btn view-detail"><i class="fa fa-list"></i> View Detail</a></div>
                        </div>
                    </div>`);
                    var prop_added = [];
                    var props = all_product_properties.filter(x => x.product_id == element['id'])

                    var product_id = element['id'];
                    props.forEach(element => {
                        if (element['placement'] == 1) {
                            if (prop_added.includes(element.property_name)) {
                                $(`.property_div_${product_id}`).find(`.${product_id}_div`).append(' ' + element.property_value);
                            } else {
                                prop_added.push(element.property_name);
                                $(`.property_div_${product_id}`).append(`<strong class="first_${product_id}">${element.property_name}:</strong><span class="${product_id}_div">${' '+element.property_value}</span><br>`)
                            }
                        } else if (element['placement'] == 2) {
                            $(`.property_val_${product_id}`).text(element.property_value ? element.property_value : '--')
                        }
                    })

                    var first = [];
                    var second = [];
                    var prices = [];
                    pro_variant.forEach(element => {
                        prices.push(parseFloat(element.sell_price));

                        var attr = all_variant_attributes.find(x => x.variant_id == element['id']);
                        if (attr === undefined) {

                        } else {
                            if (attr.placement == 1) {
                                if (first.includes(attr.attribute)) {
                                    $(`.first_div_${product_id}`).find(`.${attr.attribute}_div`).append(`<span>${attr.assignment_value}</span>`);
                                } else {
                                    first.push(attr.attribute);
                                    $(`.first_div_${product_id}`).append(`<strong class="first_${attr.attribute}">${attr.attribute}:</strong><div class="${attr.attribute}_div"> <span>${attr.assignment_value}</span></div>`)
                                }
                            } else if (attr.placement == 2) {
                                if (second.includes(attr.attribute)) {
                                    $(`.second_div_${product_id}`).find(`.${attr.attribute}_div`).append(` <span>${attr.assignment_value}</span>`);
                                } else {
                                    second.push(attr.attribute);
                                    $(`.second_div_${product_id}`).append(`<strong class="second_${attr.attribute}">${attr.attribute}:</strong><div class="${attr.attribute}_div"><span>${attr.assignment_value}</span></div>`)
                                }
                            }
                        }
                    })
                    $(`.price_from_${element['id']}`).text('£' + prices ? prices.sort( function (a,b) { return a === b ? 0 : a < b ? -1: 1} )[0] : 0);

                }
                test.push(element);
                all_products_gallery[total_indexes] = test;
                if (array_items_count == 12) {
                    array_items_count = 0;
                    test = [];
                    total_indexes++;
                }
            });
        }
    });
}

function rendersearch(search = null, cat_filter = null, brand = null, sort = null) {
    $('.products_grid_view_div').empty();
    $('.pagination').empty();

    if (search == '') {
        searchArray = all_products;
    } else {
        searchArray = all_products.filter(function(x) {
            return (x['name'] ? x.name.toLowerCase().includes(search) : '') || (x.description ? x.description.toLowerCase().includes(search) : '') || (x.sku ? x.sku.toLowerCase().includes(search) : '');
        });
    }

    if (cat_filter != 0) {
        searchArray = searchArray.filter(function(x) {
            return x.category_id == cat_filter;
        })
    }

    if (brand != 0) {
        searchArray = searchArray.filter(function(x) {
            return x.brand_id == brand;
        });
    }

    if (sort != 0) {
        if (sort == 'asc') {
            sortResults(searchArray, 'name', true);
        } else if (sort == 'desc') {
            sortResults(searchArray, 'name', false);
        } else if (sort == 'oldest') {
            sortResults(searchArray, 'id', true);
        } else if (sort == 'latest') {
            sortResults(searchArray, 'id', false);
        }

    }


    var recsPerPage = 12;
    totalPages = Math.ceil(searchArray.length / recsPerPage);
    $('.count_poc').text(searchArray.length);
    offset = 0;
    var pageNo = 0;
    var current_records = 0;
    var array_items_count = 0;
    var total_indexes = 0;
    var test = [];
    fetchPagination(totalPages, current_records);
    $('.pagination').append(`<li name="-1" class="page-item poc_page_link disabled previous"><a class="page-link" tabindex="-1">Previous</a></li>`);
    var i;
    for (i = 1; i <= totalPages; i++) {
        $('.pagination').append(`<li name="${i}" class="page-item poc_page_link ${i <= 1 ? 'active' : ''}"><a class="page-link">${i}</a></li>`);
        all_products_gallery.push({})
    }
    $('.pagination').append('<li class="page-item poc_page_link next" name="+1"><a class="page-link">Next</a></li>');

    searchArray.forEach(element => {
        current_records++;
        array_items_count++;
        var pro_variant = all_variants.filter(x => x.product_id == element['id']);

        if (current_records <= 12) {
            $('.products_grid_view_div').append(`<div class="col-lg-3 col-md-4">
                <div class="_product-card">
                    <div class="offer">2 FOR £20</div>
                    <div class="offer2"><span>NIC-SHOTS</span>INCLUDED</div>

                    <div class="PR-Thumb">
                        <div class="middle"><img src="${base_url+element['thumbnail']}" alt="" /></div>
                    </div>
                    <div class="p-val property_val_${element['id']}"> </div>
                    <h2>${element['name']}</h2>
                    <div class="lab-div property_div_${element['id']}"> </div>
                    <div class="price"><span class="p-span">£32.00</span> <span class="p-from">From:</span>
                        <span class="price_from_${element['id']}"></span></div>
                    <div class="lab-size first_div_${element['id']}"></div>
                    <div class="lab-colors second_div_${element['id']}"></div>
                    <div><a href="ProductDetail/${element['id']}" class="btn view-detail"><i class="fa fa-list"></i> View Detail</a></div>
                </div>
            </div>`);
            var prop_added = [];
            var props = all_product_properties.filter(x => x.product_id == element['id'])

            var product_id = element['id'];
            props.forEach(element => {
                if (element['placement'] == 1) {
                    if (prop_added.includes(element.property_name)) {
                        $(`.property_div_${product_id}`).find(`.${product_id}_div`).append(' ' + element.property_value);
                    } else {
                        prop_added.push(element.property_name);
                        $(`.property_div_${product_id}`).append(`<strong class="first_${product_id}">${element.property_name}:</strong><span class="${product_id}_div">${' '+element.property_value}</span><br>`)
                    }
                } else if (element['placement'] == 2) {
                    $(`.property_val_${product_id}`).text(element.property_value ? element.property_value : '--')
                }
            })

            var first = [];
            var second = [];
            var prices = [];
            pro_variant.forEach(element => {
                prices.push(parseFloat(element.sell_price));
                var attr = all_variant_attributes.find(x => x.variant_id == element['id']);
                if (attr === undefined) {

                } else {
                    if (attr.placement == 1) {
                        if (first.includes(attr.attribute)) {
                            $(`.first_div_${product_id}`).find(`.${attr.attribute}_div`).append(`<span>${attr.assignment_value}</span>`);
                        } else {
                            first.push(attr.attribute);
                            $(`.first_div_${product_id}`).append(`<strong class="first_${attr.attribute}">${attr.attribute}:</strong><div class="${attr.attribute}_div"> <span>${attr.assignment_value}</span></div>`)
                        }
                    } else if (attr.placement == 2) {
                        if (second.includes(attr.attribute)) {
                            $(`.second_div_${product_id}`).find(`.${attr.attribute}_div`).append(` <span>${attr.assignment_value}</span>`);
                        } else {
                            second.push(attr.attribute);
                            $(`.second_div_${product_id}`).append(`<strong class="second_${attr.attribute}">${attr.attribute}:</strong><div class="${attr.attribute}_div"><span>${attr.assignment_value}</span></div>`)
                        }
                    }
                }
            })
            $(`.price_from_${element['id']}`).text('£' + prices ? prices.sort( function (a,b) { return a === b ? 0 : a < b ? -1: 1} )[0] : 0);

        }


        test.push(element);
        all_products_gallery[total_indexes] = test;
        if (array_items_count == 12) {
            array_items_count = 0;
            test = [];
            total_indexes++;
        }

    });
}


function fetchForProductDetail(id) {
    opp_name = 'Variant';
    $('#tblLoader').fadeIn();
    $('.listOfItems').hide();
    all_sub_categories = [];
    all_attributes = [];
    all_attributes_assignment = [];
    all_variants = [];
    all_variant_attributes = [];
    $.ajax({
        type: 'GET',
        url: '/GetProItems/' + id,
        success: function(response) {
            $('.listOfItems').empty();
            $('.listOfItems').append('<li><div class="row"><div class="col-md-7"><strong>Item Name</strong></div><div class="col-md-5"><strong>Action</strong></div></div></li>');
            // return;
            var response = JSON.parse(response);
            sno = 1;
            all_sub_categories = response.sub_categories;
            all_attributes = response.attributes;
            all_attributes_assignment = response.attributes_assignment;
            all_variants = response.items;
            all_variant_attributes = response.variant_attributes;
            response.items.forEach(element => {
                let itmName = `${element.product_name}/${element.barcode}`;
                $('.listOfItems').append(`<li>
                <div class="row">
                    <div class="col-md-7">${itmName}</div>
                    <div class="col-md-5">
                        <button class="btn btn-primary btn-line" data-toggle="collapse"
                            href="#${"ProductItem" +element.id}" role="button" aria-expanded="false"
                            aria-controls="${"ProductItem" +element.id}">View Detail</button>
                        <button class="btn btn-primary btn-line openDataSidebarForUpdate" id="${element.id}">Edit</button>
                    </div>
                    <div class="collapse" id="${"ProductItem" +element.id}" style="min-width: 100% !important">
                        <div class="items-Details"> <strong>Description: </strong> ${element.product_desc}
                            <div class="row PT-10">
                                <div class="col"><strong style="display: block">Sell Price. </strong> ${element.sell_price}</div>
                                <div class="col"><strong style="display: block">Cost Price. </strong> ${element.cost_price}</div>
                                <div class="col"><strong style="display: block">Wholesale Price. </strong> ${element.whole_sale_price}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>`);
            });
            $('#tblLoader').hide();
            $('.listOfItems').fadeIn();
            $('.hidden_key_id').val(randomString(50, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));
            random_id_for_add = $('.hidden_key_id').val();
        }
    });
}

function duplicateProduct(){
    var productId = $('#product-copy-id').val();
    //`{!! route("manage-product", ${productId}) !!}`
    window.open(`/manage_product/${productId}`, '_blank');
}

function checkIfDuplicateProduct(productId){
    openSidebar();
    var data = all_products.find(x => x.id == productId);
    put_data_into_fields(data);
    $('#operation').val('add');

}

function put_data_into_fields(data){
    var id = data.id;
    $('#productImgDiv').empty()
    $('#productImgDiv').append('<input type="file" name="productThumbnail" id="productThumbnail" />');

    $('input[name="product_name"]').focus();
    $('input[name="product_name"]').val(data.name);
    $('input[name="product_name"]').blur();

    $('input[name="product_sku"]').focus();
    $('input[name="product_sku"]').val(data.sku);
    $('input[name="product_sku"]').blur();

    $('textarea[name="description"]').val(data.description);

    $('select[name="brand_id"]').val(data.brand_id).trigger('change')
    $('select[name="category_id"]').val(data.category_id).trigger('change');

    var imgUrl = base_url + data.thumbnail;
    $("#productThumbnail").attr("data-height", '100px');
    $("#productThumbnail").attr("data-default-file", imgUrl);
    $('#productThumbnail').dropify();

    var props = all_product_properties.filter(x => x.product_id == id);
    update_properties_array = props;
    if (props.length > 0) {
        $('.selected_cat_div').empty();
        props.forEach(element => {
            if ($(`[prop="${element['property_id']}}"]`).length) {
                $(`[prop="${element['property_id']}}"]`).append(`<div class="row">
                <div class="col-md-10">
                    <div class="form-group">
                            <input type="text" id="${element['property_id']}" value="${element['property_value']}" class="form-control property_value">
                        </div>
                    </div>
                    <div class="col-md-2" style="padding: 0;">
                <button id="${element['property_name']+'/'+element['property_id']}}" style="width: 25px; border-radius:0; background: #01223c;
                padding: 10px 0px; font-size: 11px; margin-top: 14px" type="button" class="btn btn-line add_more"><i class="fa fa-plus" style="color:white"></i></button>
                <button id="${element['property_name']+'/'+element['property_id']}}" style="width: 25px; border-radius:0; background: red;
                padding: 10px 0px; font-size: 11px; margin-top: 14px" type="button" class="btn btn-line removeProp"><i class="fa fa-times" style="color:white"></i></button>
                </div>
            </div>`)
            } else {
                $('.selected_cat_div').append(`
            <label style="font-size: 10px">${element['property_name']}*</label>
            <div prop="${element['property_id']}}">
            <div class="row">
            <div class="col-md-10">
                <div class="form-group">
                        <input type="text" id="${element['property_id']}" value="${element['property_value']}" class="form-control property_value">
                    </div>
                </div>
                <div class="col-md-2" style="padding: 0;">
                <button id="${element['property_name']+'/'+element['property_id']}}" style="width: 25px; border-radius:0; background: #01223c;
                padding: 10px 0px; font-size: 11px; margin-top: 14px" type="button" class="btn btn-line add_more"><i class="fa fa-plus" style="color:white"></i></button>
            </div>
        </div>
            </div><hr>`);
            }
        })

        $(".form-control").on("focus blur", function(e) {
            $(this).parent().toggleClass(
                "focused",
                e.type === "focus" || this.value.length > 0
            );
        }).trigger("blur");
    }
}

var item = [];

function fetchPagination(pageLen = null, curPage = null) {
    item = [];
    for (var i = 1; i <= pageLen; i++) {
        item.push(i);
    }
    render(pageLen, curPage, item, true);
}

function render(pageLen = null, curPage, item, first) {
    $('#holder').empty();
    var html = '',
        separatorAdded = false;
    for (var i in item) {
        if (isPageInRange(curPage, i, pageLen, 2, 2)) {
            html += '<li class="page_link" name="' + i + '" data-page="' + i + '">' + item[i] + '</li>';
            // as we added a page, we reset the separatorAdded
            separatorAdded = false;
        } else {
            if (!separatorAdded) {
                // only add a separator when it wasn't added before
                html += '<li class="separator" />';
                separatorAdded = true;
            }
        }
    }

    var holder = document.querySelector('#holder');
    holder.innerHTML = html;
    document.querySelector('#holder>li[data-page="' + curPage + '"]').classList.add('active');
    if (first) {
        holder.addEventListener('click', function(e) {
            if (!e.target.getAttribute('data-page')) {
                // no relevant item clicked (you could however offer expand here )
                return;
            }
            curPage = parseInt(e.target.getAttribute('data-page'));
            render(pageLen, curPage, item);
        });
    }
}

function isPageInRange(curPage, index, maxPages, pageBefore, pageAfter) {
    if (index <= 1) {
        // first 2 pages
        return true;
    }
    if (index >= maxPages - 2) {
        // last 2 pages
        return true;
    }
    if (index >= curPage - pageBefore && index <= curPage + pageAfter) {
        return true;
    }
}


function sortResults(array, prop, asc) {
    array.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
}
