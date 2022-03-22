function FreeProducts(){
    this.products = null;
    this.primaryProduct = null;
    this.selectedProduct = null;
    this.selectedVariants = [];
    this.datatable = null;
}

FreeProducts.prototype.http = function(type, url, formData){
    var self = this;
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
                console.log(err);
                if (err.status == 422 || err.status == 500) {
                    self.notification('error', 'Some Error Occured, please try again.');
                }

                $("#promotionForm").show();
                $("#tblLoader").hide();
            }
        });
    });
}

FreeProducts.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

var fp = new FreeProducts();


function select_primary_product(primaryId){
    fp.primaryProduct = primaryId;
}

if($("#create-form").val()==1){
    var free_product_id = $("#free-product-id").val();
    $("#tblLoader").show();
    $(".body").hide();
    fp.http('GET', `/load-products-for-nick-shot/${free_product_id}`, {}).then((e)=>{
        var p = JSON.parse(e);
        var html = `<option value="">Product Name Here...</option>`;
        p.forEach(function(product){
            html += `<option value="${product.id}">${product.name}</option>`;
        });
        $(`#select-product-dropdown`).html(html);
        $("#tblLoader").hide();
        $(".body").show();
        setTimeout(() => {
            $("#selectedProductTableArea").css('width', '100%');
        }, 100);
        if(free_product_id){
            get_free_product_by_id(free_product_id);
        }
    });

    fp.http('GET', '/load-free-category-products', {}).then((e)=>{
        if(e!='no-category'){
            fp.products = JSON.parse(e);
            set_free_products_html();
        }
    });

}else{
    $("#tblLoader").hide();
    $(".body").show();
    $(".listTable").dataTable();
}

function get_free_product_by_id(free_product_id){
    $("#tblLoader").show();
    $(".body").hide();
    fp.http('GET', `/get-free-product-by-id/${free_product_id}`, {}).then((e)=>{
        var data = JSON.parse(e);
        $('#quantity').val(data.quantity);
        $("#select-product-dropdown").val(data.product_id);
        $("#select-product-dropdown").trigger('change');
        $("#select-product-dropdown").attr('disabled');
        // fp.selectedProduct = data.linked_product_id;
        data.detail.forEach(element => {
            fp.selectedVariants.push(element.linked_variant_id);
        });
        fp.selectedVariants = [...new Set(fp.selectedVariants)];
        select_product(data.linked_product_id, true);
        $("#tblLoader").hide();
        $(".body").show();
    });
}




// else{
//     fp.http('GET', '/load-free-products-list', {}).then((e)=>{
//         var data = JSON.parse(e);
//         $("#tblLoader").hide();
//         $(".body").show();
//         $(".listTable").dataTable();
//     });
// }


function set_free_products_html(){
    var products = fp.products;
    var base_url = $('#base_url').val();
    products.forEach(element => {
        var html = `<tr id="add-product-row-${element.id}" class="add-product-row">
            <td width="80%">
            <div class="ProListDiv"><img class="PrList_img" src="${base_url+element.thumbnail}" alt="" />
                <div class="PR_Name">${element.name}</div>
            </div>
            </td>
            <td><button type="button" class="btn btn-default mb-0" product-id="${element.id}" onclick="select_product(${element.id})" id="add-product-button-${element.id}">Add</button></td>
        </tr>`;
        $('.AddProductTable').find('tbody').append(html);
    });
}

function select_product(id, action=false){
    if(!fp.primaryProduct){
        fp.notification('error', 'Please select primary product.');
        return false;
    }
    if(!action){
        fp.selectedVariants = [];
        if(fp.primaryProduct==id){
            fp.notification('error', 'You cannot link same product, please try another one.');
            return false;
        }
    }
    fp.selectedProduct = id;
    var product = fp.products.find(x=>x.id==id);

    $.each($('.active-product'), function(k, e){
        var pId = $(e).attr('product-id');
        var p = fp.products.find(x=>x.id==pId);
        $(`#add-product-button-${p.id}`).replaceWith(`<button type="button" class="btn btn-default mb-0" product-id="${p.id}" onclick="select_product(${p.id})" id="add-product-button-${p.id}">Add</button>`);
    });

    $(`#add-product-button-${id}`).replaceWith(`<button type="button" class="btn btn-default red-bg mb-0 active-product" product-id="${product.id}" onclick="remove_product(${product.id})" id="add-product-button-${product.id}">Remove</button>`);

    set_selected_product_variants();
}

function remove_product(id){
    fp.selectedProduct = null;
    var product = fp.products.find(x=>x.id==id);
    $(`#add-product-button-${id}`).replaceWith(`<button type="button" class="btn btn-default mb-0" product-id="${product.id}" onclick="select_product(${product.id})" id="add-product-button-${product.id}">Add</button>`);
    fp.selectedVariants = [];
    set_selected_product_variants();
}


function set_selected_product_variants(){
    if(fp.datatable) fp.datatable.fnDestroy();
    $('#selectedProductTableArea').find('tbody').html('');
    var base_url = $("#base_url").val();
    var productId = fp.selectedProduct;
    var product = fp.products.find(x=>x.id==productId);
    var variants = product.variants;
    variants.forEach(element => {
        var attributeHtml = '';
        if(element.attributes.length>0){
            element.attributes.forEach(attribute => {
                attributeHtml += `&nbsp;&nbsp;|&nbsp;&nbsp;${attribute.assignment_value}`;
            });
        }
        var btnHtml = `<button type="button" class="btn btn-default btn-line mb-0" id="variant-btn-${element.id}" onclick="select_variant(${product.id}, ${element.id})">Select</button>`;
        if(fp.selectedVariants.indexOf(element.id)!=-1){
            btnHtml = `<button type="button" class="btn btn-default btn-line mb-0 red-bg selected-product" id="variant-btn-${element.id}" onclick="select_variant(${product.id}, ${element.id})">Remove</button>`;
        }
        var html = `<tr>
                        <td>
                        <div class="ProListDiv"><img class="PrList_img" src="${base_url+product.thumbnail}" alt="">
                            <div class="PR_Name">${product.name+attributeHtml}</div>
                        </div>
                        </td>
                        <td>${btnHtml}</td>
                    </tr>`;
        $('#selectedProductTableArea').find('tbody').append(html);
    });
    setTimeout(() => {
        fp.datatable = $("#selectedProductTableArea").dataTable();
    }, 100);

}


function select_variant(product_id, variant_id){
    var el = $(`#variant-btn-${variant_id}`);
    if(el.hasClass('selected-product')){
        el.text('Select');
        el.removeClass('red-bg').removeClass('selected-product');
        // fp.selectedVariants = fp.selectedVariants.splice(fp.selectedVariants.findIndex(variant_id), 1);
        // fp.selectedVariants = [...new Set(fp.selectedVariants)];
        fp.selectedVariants.forEach((element, index) => {
            if(element==variant_id) fp.selectedVariants.splice(index, 1);
        });
        console.log(fp.selectedVariants);
        return false;
    }
    fp.selectedProduct = product_id;
    fp.selectedVariants.push(variant_id);
    fp.selectedVariants = [...new Set(fp.selectedVariants)];
    fp.selectedVariants.forEach(variantId => {
        $(`#variant-btn-${variantId}`).text('Remove');
        $(`#variant-btn-${variantId}`).addClass('red-bg').addClass('selected-product');
    });
}

function is_valid(){
    if($('#select-product-dropdown').val()=='' || $('#quantity').val()==''){
        fp.notification('error', 'Please provide all the required information (*)');
        return false;
    }

    if(fp.selectedVariants.length==0){
        fp.notification('error', 'You must add atleast one free product.');
        return false;
    }

    if($('#quantity').val()==0){
        fp.notification('error', 'Please add atleast 1 quantity.');
        return false;
    }
    return true;
}

function submitForm(){
    if(!is_valid()) return false;
    $("#tblLoader").show();
    $(".body").hide();
    var product_id = $("#select-product-dropdown").val(),
        quantity = $("#quantity").val(),
        variants = fp.selectedVariants,
        formData = new FormData();

    formData.append('id', $('#free-product-id').val());
    formData.append('product_id', product_id);
    formData.append('quantity', quantity);
    formData.append('linked_product_id', fp.selectedProduct);
    formData.append('variants', variants.join());

    fp.http('POST', '/store-free-products', formData).then((e)=>{
        fp.notification('success', 'You have added free products successfully.');
        setTimeout(() => {
            window.location = '/free-nick-shot';
        }, 1500);
        $("#tblLoader").hide();
        $(".body").show();
    });
}


function open_delete_modal(id){
    $("#free-product-delete-id").val(id);
    $("#deleteFreeProduct").modal('show');
}

function delete_free_product(){
    var id = $("#free-product-delete-id").val();
    fp.http('DELETE', `/delete-free-product/${id}`, {}).then((e)=>{
        fp.notification('success', 'You have deleted free products successfully.');
        setTimeout(() => {
            window.location = '/free-nick-shot';
        }, 1500);
    });
}
