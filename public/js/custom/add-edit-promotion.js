function Promotion(){
    this.promotion = null,
    this.base_url = '';
    this.types = null;
    this.selectedType = null;
    this.discountFilters = null;
    this.discountFiltersByPromotions = null;
    this.selectedFilters = null;
    this.selectedFilter = null;
    this.col = null;
    this.products = {
        list: [],
        selected: [],
        free: [],
        offset: 0,
        limit: 50,
        selectedAction: 'primary-product'
    };
    this.categories = {
        list: [],
        selected: []
    }
    this.datatable = {
        productList01Dt: null,
        productList02Dt: null,
        productList03Dt: null
    };
    this.DOMStrings = {
        price_section: {
            discount_offer: `<div class="col-2 PT-5 price-section-input">
                <label class="font12 mb-0">Discount Type</label>
                <select class="custom-select custom-select-sm" name="discount_type" id="discount_type">
                    <option value="">Select Discount Type</option>
                    <option value="percentage">Percentage</option>
                    <option value="price">Price</option>
                </select>
            </div>
            <div class="col-2 pt-9 price-section-input">
                <div class="form-group">
                <label class="control-label mb-5">Value</label>
                <input type="number" class="form-control" name="discount_price" id="discount_price">
                </div>
            </div>`,
            free_product: `<div class="col-2 pt-9 price-section-input">
                <div class="form-group">
                <label class="control-label mb-5">Minimum Qty.</label>
                <input type="number" class="form-control" name="minimum_quantity" id="minimum_quantity">
                </div>
            </div>
            <div class="col-2 pt-9 price-section-input">
                <div class="form-group">
                <label class="control-label mb-5">Free Qty.</label>
                <input type="number" class="form-control" name="free_quantity" id="free_quantity">
                </div>
            </div>`,
            bulk_offer: `<div class="col-2 pt-9 price-section-input">
                <div class="form-group">
                <label class="control-label mb-5">Minimum Qty.</label>
                <input type="number" class="form-control" name="minimum_quantity" id="minimum_quantity">
                </div>
            </div>
            <div class="col-2 pt-9 price-section-input">
                <div class="form-group">
                <label class="control-label mb-5">Price</label>
                <input type="number" class="form-control" name="discount_price" id="discount_price">
                </div>
            </div>`,
            bundle_offer: `<div class="col-2 pt-9 price-section-input">
                <div class="form-group">
                <label class="control-label mb-5">Price</label>
                <input type="number" class="form-control" name="discount_price" id="discount_price">
                </div>
            </div>`
        },
        productList01: `<div class="" id="productList01">
            <div class="header RrulesHeading mt-10 mb-20" style="margin-left:-15px">
                <h2>Add <span>Products</span></h2> <button type="button" class="btn btn-primary add-pr-btn">Add Product</button>
            </div>
            <table class="table table-hover dt-responsive nowrap" style="width:100%">
                <thead>
                    <tr>
                    <th>Item Name</th>
                    <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`,
        productList02: `<div class="" id="productList02">
            <div class="header RrulesHeading mt-10 mb-20" style="margin-left:-15px">
                <h2>Add <span>Products</span></h2> <button type="button" class="btn btn-primary add-pr-btn">Add Product</button>
            </div>
            <table class="table table-hover dt-responsive nowrap" style="width:100%">
                <thead>
                    <tr>
                    <th>Item Name</th>
                    <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`,
        productList03: `<div class="" id="productList03">
            <div class="header RrulesHeading mt-10 mb-20" style="margin-left:-15px">
                <h2>Add <span>Products</span></h2> <button type="button" class="btn btn-primary add-pr-btn">Add Product</button>
            </div>
            <table class="table table-hover dt-responsive nowrap" style="width:100%">
                <thead>
                    <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`
    }
}

Promotion.prototype.init = function(){
    this.types = JSON.parse($("#promotion-types").text());
    this.discountFilters = JSON.parse($("#discount-filters").text());
    this.discountFiltersByPromotions = JSON.parse($("#discount-filters-by-promotion").text());
    // this.load_products();
    this.load_categories();
}

Promotion.prototype.http = function(type, url, formData){
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

Promotion.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

Promotion.prototype.set_filters_price_section_html = function(){
    var html = '';
    this.selectedFilters.forEach(e => {
        html += `<div class="col-auto pr-400">
            <div class="custom-control custom-radio">
            <input class="custom-control-input" type="radio" name="discount_filter_id" id="filter${e.id}" value='${e.column_name}' onchange="select_filter($(this).val())">
            <label class="custom-control-label font13 pt-3" for="filter${e.id}">${e.name}</label>
            </div>
        </div>`;
    });
    $('#is_bulk_exclusive_div').html('');
    if(this.selectedType=='bulk-offer'){
        $('#is_bulk_exclusive_div').html(`<div class="col-auto pr-400">
            <div class="custom-control custom-radio">
                <input class="custom-control-input" type="radio" name="bulk_type" id="is_bulk_default" onchange="showBulkOfferCriteria()" value="default" checked>
                <label class="custom-control-label font13 pt-3" for="is_bulk_default">Default</label>
            </div>
            <div class="custom-control custom-radio">
                <input class="custom-control-input" type="radio" name="bulk_type" id="is_bulk_exclusive" onchange="showBulkOfferCriteria()" value="bulk">
                <label class="custom-control-label font13 pt-3" for="is_bulk_exclusive">Exclusive</label>
            </div>
            <div class="custom-control custom-radio">
                <input class="custom-control-input" type="radio" name="bulk_type" id="is_bulk_mix_match" onchange="showBulkOfferCriteria()" value="mixMatch">
                 <label class="custom-control-label font13 pt-3" for="is_bulk_mix_match">Mix & Match</label>
            </div>
        </div>`);
    }
    $("#filters-area").html(html);

    $(".price-section-input").remove();
    $("#price-section").after(this.DOMStrings.price_section[this.selectedType.replace('-', '_')]);
}

Promotion.prototype.set_promotion_html = function(){
    $('#promotionSelectionArea').html('');
    if(this.selectedFilter!='entire-store'){
        switch (this.col) {
            case 6:
                this.set_col_6();
                break;
            default:
                this.set_col_12();
                break;
        }
    }
}

Promotion.prototype.set_col_6 = function(){
    $('#promotionSelectionArea').append(this.DOMStrings.productList01);
    $('#promotionSelectionArea').append(this.DOMStrings.productList02);
    $('#productList01').addClass('col-md-6');
    $('#productList02').addClass('col-md-6');
    this.datatable.productList01Dt = $("#productList01").find('table').dataTable();
    this.datatable.productList02Dt = $("#productList02").find('table').dataTable();

    $('.add-pr-btn').on('click', this.open_add_modal.bind(this));

    if(this.selectedType=='free-product'){
        if(this.selectedFilter=='same-product'){
            $('#productList01').find('.header > h2').html("Primary <span>Products</span>");
            $('#productList01').find('button').attr('action-type', 'primary-products');
        }else if(this.selectedFilter=='different-product'){
            $('#productList01').find('.header > h2').html("Primary <span>Products</span>");
            $('#productList01').find('button').text('Add Primary Product');
            $('#productList01').find('button').attr('action-type', 'primary-products');

            $('#productList02').find('.header > h2').html("Free <span>Products</span>");
            $('#productList02').find('button').text('Add Free Product');
            $('#productList02').find('button').attr('action-type', 'free-products');
        }
    }
}

Promotion.prototype.set_col_12 = function(){
    var elType, el, table;
    elType = 'productList01';
    table = 'productList01Dt';
    if(this.selectedType == 'bundle-offer'){
        elType = 'productList03';
        table = 'productList03Dt';
    }
    $('#promotionSelectionArea').html(this.DOMStrings[elType]);
    el = $(`#${elType}`);
    el.addClass('col-md-12');
    this.datatable[table] = el.find('table').dataTable();
    $('.add-pr-btn').on('click', this.open_add_modal.bind(this));

    if(this.selectedType=='discount-offer'){
        if(this.selectedFilter=='specific-products'){
            el.find('.header > h2').html("Add <span>Specific Products</span>");
            el.find('button').attr('action-type', 'primary-products');
        }
    }

    if(this.selectedType=='bulk-offer'){
        if(this.selectedFilter=='specific-products'){
            el.find('.header > h2').html("Add <span>Specific Products</span>");
        }else if(this.selectedFilter=='specific-category'){
            el.find('.header > h2').html("Add <span>Specific Category</span>");
            el.find('button').text('Add Category');
            el.find('button').attr('action-type', 'category');
        }
    }
}

Promotion.prototype.open_add_modal = function(e){
    $("#load-products-by-category-area").show();

    if(this.selectedFilter=='different-product'){
        this.products.selectedAction = $(e.currentTarget).attr('action-type');
    }


    $("#AddTable").find('tbody').html('');
    $('#product-cl-sec').addClass('active');
    $('#blureEffct').addClass('blur-div');
    $('body').toggleClass('no-scroll');
    $('i').toggleClass('fa-arrow-left  fa-arrow-right');
    this.set_add_list();

    if(this.selectedType=='bulk-offer'){
        var bulkType = $('input[name=bulk_type]:checked').val();
        if(bulkType!='default'){
            $("#load-products-by-category-area").hide();
        }
    }
}

// Promotion.prototype.load_products = function(){
//     var url = `/promotions/get-products/${promotion.products.offset}/${promotion.products.limit}`
//     promotion.http('GET', url, {}).then((e)=>{
//         var products = JSON.parse(e);
//         if(products.length>0){
//             promotion.products.list = promotion.products.list.concat(products);
//             var p = [];
//             [...new Set(promotion.products.list.map(x=>x.id))].forEach(id => {
//                 var pro = promotion.products.list.filter(x=>x.id==id);
//                 p.push(pro[0]);
//             });
//             promotion.products.list = p;
//             promotion.products.offset = promotion.products.offset+promotion.products.limit;
//             this.set_add_list_products();
//         }
//         if(!$("#promotion-id").val()) $("#tblLoader").hide();
//     });
// }

Promotion.prototype.load_products_by_category = function(categoryId){
    $("#tblLoader1").show();
    var url = `/promotions/load-products-by-category/${categoryId}`;
    promotion.http('GET', url, {}).then((e)=>{
        $("#tblLoader1").hide();
        var products = JSON.parse(e);
        if(products.length<=0){
            setTimeout(() => {
                $("#AddTable").find('tbody').append('<tr><td colspan="2" style="text-align: center;font-size: 0.9rem;">No Product Found...</td></tr>');
            }, 100);
        }
        promotion.products.list = products;
        if(products.length>0){
            var p = [];
            [...new Set(promotion.products.list.map(x=>x.id))].forEach(id => {
                var pro = promotion.products.list.filter(x=>x.id==id);
                p.push(pro[0]);
            });
            promotion.products.list = p;
            promotion.products.offset = promotion.products.offset+promotion.products.limit;
        }
        this.set_add_list_products();
    });
}

Promotion.prototype.load_products_by_attribute_brand = function(brandId, attributeId){
    $("#tblLoader1").show();
    var url = `/load-products-by-attribute-brand/${brandId}/${attributeId}`;
    promotion.http('GET', url, {}).then((e)=>{
        $("#tblLoader1").hide();
        var products = JSON.parse(e);
        if(products.length<=0){
            setTimeout(() => {
                $("#AddTable").find('tbody').append('<tr><td colspan="2" style="text-align: center;font-size: 0.9rem;">No Product Found...</td></tr>');
            }, 100);
        }
        promotion.products.list = products;
        if(products.length>0){
            var p = [];
            [...new Set(promotion.products.list.map(x=>x.id))].forEach(id => {
                var pro = promotion.products.list.filter(x=>x.id==id);
                p.push(pro[0]);
            });
            promotion.products.list = p;
            promotion.products.offset = promotion.products.offset+promotion.products.limit;
        }
        this.set_add_list_products();
    });
}

Promotion.prototype.load_products_by_sub_cat = function(sub_cat_id){
    $("#tblLoader1").show();
    var url = `/load-products-by-sub-cat/${sub_cat_id}`;
    promotion.http('GET', url, {}).then((e)=>{
        $("#tblLoader1").hide();
        var products = JSON.parse(e);
        if(products.length<=0){
            setTimeout(() => {
                $("#AddTable").find('tbody').append('<tr><td colspan="2" style="text-align: center;font-size: 0.9rem;">No Product Found...</td></tr>');
            }, 100);
        }
        promotion.products.list = products;
        if(products.length>0){
            var p = [];
            [...new Set(promotion.products.list.map(x=>x.id))].forEach(id => {
                var pro = promotion.products.list.filter(x=>x.id==id);
                p.push(pro[0]);
            });
            promotion.products.list = p;
            promotion.products.offset = promotion.products.offset+promotion.products.limit;
        }
        this.set_add_list_products();
    });
}

Promotion.prototype.load_categories = function(){
    var url = `/promotions/get-categories`
    promotion.http('GET', url, {}).then((e)=>{
        var categories = JSON.parse(e);
        if(categories.length>0){
            promotion.categories.list = promotion.categories.list.concat(categories);
        }
    });
}

Promotion.prototype.set_add_list = function(){
    if(this.selectedFilter=='specific-category'){
        $('#load-products-by-category-area').hide();
        this.set_add_list_categories();
    }else{
        $('#load-products-by-category-area').show();
        this.set_add_list_products();
    }
    openSidebar();
}

Promotion.prototype.set_add_list_categories = function(){
    var categories = this.categories.list;
    if(categories.length>0){
        categories.forEach((element, index) => {
            var btnHtml = ``;
            if(this.categories.selected.indexOf(element.id)==-1){
                btnHtml = `<button type="button" class="btn btn-default mb-0" category-id="${element.id}" id="add-category-btn-${element.id}" onclick="add_category(${element.id})">Add</button>`
            }else{
                btnHtml = `<button type="button" class="btn btn-default red-bg mb-0 btn-remove" category-id="${element.id}" id="delete-category-btn-${element.id}" onclick="delete_category(${element.id})">Remove</button>`;
            }
            var html = `<tr>
                <td>
                    <div class="ProListDiv">
                        <div class="PR_Name">${element.category_name}</div>
                    </div>
                </td>
                <td>${btnHtml}</td>
            </tr>`;
            $("#AddTable").find('tbody').append(html);
        });
    }
}

Promotion.prototype.set_add_list_products = function(){
    $("#AddTable").find('tbody').html('');
    if(this.products.list.length>0){
        this.set_modal_product_html(this.products.list);
    }
}

Promotion.prototype.set_modal_product_html = function(products){
    $("#AddTable").find('tbody').html('');
    var selectedArray = this.products.selected;
    if(this.products.selectedAction=='free-products'){
        var selectedArray = this.products.free;
    }

    products.forEach((element, index) => {
        var btnHtml = ``;
        if(selectedArray.indexOf(element.id)==-1){
            btnHtml = `<button type="button" class="btn btn-default mb-0" product-id="${element.id}" id="add-product-btn-${element.id}" onclick="add_product(${element.id})">Add</button>`
        }else{
            btnHtml = `<button type="button" class="btn btn-default red-bg mb-0 btn-remove" product-id="${element.id}" id="delete-product-btn-${element.id}" onclick="delete_product(${element.id}, '${this.products.selectedAction}')">Remove</button>`;
        }
        var html = `<tr>
            <td>
                <div class="ProListDiv">
                    <img class="PrList_img" src="${this.base_url+element.thumbnail}" alt="" />
                    <div class="PR_Name">${element.name}</div>
                </div>
            </td>
            <td>${btnHtml}</td>
        </tr>`;
        $("#AddTable").find('tbody').append(html);
    });
}

Promotion.prototype.add_product = function(id){
    $(`#add-product-btn-${id}`).replaceWith(`<button type="button" class="btn btn-default red-bg mb-0 btn-remove" product-id="${id}" id="delete-product-btn-${id}" onclick="delete_product(${id}, '${this.products.selectedAction}')">Remove</button>`);

    if(this.products.selectedAction=='free-products'){
        this.products.free.push(id);
        this.products.free = [...new Set(this.products.free)];
    }else{
        this.products.selected.push(id);
        this.products.selected = [...new Set(this.products.selected)];
    }

    var product = this.products.list.find(x=>x.id==id);
    this.set_product_list_html(product, this.products.selectedAction);

}

Promotion.prototype.set_product_list_html = function(product, action){
    this.destroy_datatable();

    var el, inputName, rowName, html, quantity_val, promotionDetailProduct;
    el = $("#productList01");
    inputName = 'module_id';
    rowName = 'listOneRow';
    if(action=='free-products'){
        el = $("#productList02");
        inputName = 'linked_id';
        rowName = 'listTwoRow';
    }

    if(product){
        html = `<tr id="${rowName}${product.id}"><td class="sorting_1" tabindex="0">${product.name}</td><td><button type="button" class="btn btn-default red-bg mb-0 btn-remove" product-id="${product.id}" action-type="${this.products.selectedAction}" id="delete-product-btn-${product.id}" onclick="delete_product(${product.id}, '${this.products.selectedAction}')">Remove</button><input type="hidden" name="${inputName}[]" value="${product.id}"></td></tr>`;

        if(this.selectedType == 'bundle-offer'){
            el = $("#productList03");
            quantity_val = '';
            if(this.promotion){
                promotionDetailProduct = this.promotion.detail.filter(x=>x.module_id==product.id);
                if(promotionDetailProduct.length>0) quantity_val = promotionDetailProduct[0].quantity;
            }
            html = `<tr id="${rowName}${product.id}"><td class="sorting_1" tabindex="0">${product.name}</td><td><input type="number" name="quantity[]" value="${quantity_val}"></td><td><button type="button" class="btn btn-default red-bg mb-0 btn-remove" product-id="3" action-type="${this.products.selectedAction}" id="delete-product-btn-${product.id}" onclick="delete_product(${product.id}, '${this.products.selectedAction}')">Remove</button><input type="hidden" name="${inputName}[]" value="${product.id}"></td></tr>`;
        }

        el.find('table > tbody').append(html);
    }



    this.set_datatable();
}

Promotion.prototype.delete_product = function(id, type){
    this.destroy_datatable();

    var rowName = 'listOneRow';
    var selectedArray = this.products.selected;
    if(type=='free-products'){
        rowName = 'listTwoRow';
        selectedArray = this.products.free;
    }
    $(`#${rowName+id}`).remove();

    $(`#delete-product-btn-${id}`).replaceWith(`<button type="button" class="btn btn-default mb-0" product-id="${id}" id="add-product-btn-${id}" onclick="add_product(${id})">Add</button>`);

    selectedArray.forEach((element, index) => {
        if(element==id) selectedArray.splice(index, 1);
    });

    this.set_datatable();
}


Promotion.prototype.add_category = function(id){
    this.destroy_datatable();
    this.categories.selected.push(id);
    $(`#add-category-btn-${id}`).replaceWith(`<button type="button" class="btn btn-default red-bg mb-0 btn-remove" category-id="${id}" id="delete-category-btn-${id}" onclick="delete_category(${id})">Remove</button>`);
    this.categories.selected = [...new Set(this.categories.selected)];

    var category = this.categories.list.find(x=>x.id==id);
    this.set_category_list_html(category);
    this.set_datatable();
}

Promotion.prototype.set_category_list_html = function(category){
    $("#productList01").find('table > tbody').append(`<tr id="listOneRow${category.id}"><td class="sorting_1" tabindex="0">${category.category_name}</td><td><button type="button" class="btn btn-default red-bg mb-0 btn-remove" category-id="3" id="delete-category-btn-${category.id}" onclick="delete_category(${category.id})">Remove</button><input type="hidden" name="module_id[]" value="${category.id}"></td></tr>`);
}

Promotion.prototype.delete_category = function(id){
    $(`#listOneRow${id}`).remove();
    $(`#delete-category-btn-${id}`).replaceWith(`<button type="button" class="btn btn-default mb-0" category-id="${id}" id="add-category-btn-${id}" onclick="add_category(${id})">Add</button>`);
    this.categories.selected.forEach((element, index) => {
        if(element==id) this.categories.selected.splice(index, 1);
    });
}

Promotion.prototype.triggers = function(){
    $('.form-control').on('focus blur', function (e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');
}

Promotion.prototype.set_datatable = function(){
    this.datatable.productList01Dt = $("#productList01").find('table').dataTable();
    this.datatable.productList02Dt = $("#productList02").find('table').dataTable();
    this.datatable.productList03Dt = $("#productList03").find('table').dataTable();
}

Promotion.prototype.destroy_datatable = function(){
    if(this.datatable.productList01Dt) this.datatable.productList01Dt.fnDestroy();
    if(this.datatable.productList02Dt) this.datatable.productList02Dt.fnDestroy();
    if(this.datatable.productList03Dt) this.datatable.productList03Dt.fnDestroy();
}

var promotion = new Promotion();
promotion.init();
promotion.base_url = $("#base_url").val();

function select_type(val){
    $('#bulk_offer_exclusive_criteria_div').hide();
    $('#bulk_offer_mix_match_criteria_div').hide();
    $('#pl-close').click();
    promotion.datatable.productList01Dt = null;
    promotion.datatable.productList02Dt = null;
    $("#promotionSelectionArea").html('');
    var assigns = promotion.discountFiltersByPromotions[val];
    promotion.selectedFilters = promotion.discountFilters.filter((v, k)=>{
        if(assigns.indexOf(v.column_name)!=-1) return v;
    });
    promotion.selectedType = val;
    promotion.set_filters_price_section_html();
    promotion.triggers();
}

function select_filter(val){
    $('#pl-close').click();
    promotion.col = (val=='different-product')? 6 : 12;
    promotion.selectedFilter = val;
    promotion.set_promotion_html();
    promotion.products.selected = [];
    promotion.products.free = [];
    promotion.categories.selected = [];
}

function add_product(id){
    promotion.add_product(id);
}

function delete_product(id, type){
    promotion.delete_product(id, type);
}

function add_category(id){
    promotion.add_category(id);
}

function delete_category(id){
    promotion.delete_category(id);
}

function submitForm(){
    var bulkType = $('input[name=bulk_type]:checked').val();

    promotion.destroy_datatable();
    var formData = new FormData($("#promotionForm")[0]);
    formData.delete('DataTables_Table_0_length');
    formData.delete('DataTables_Table_1_length');
    formData.delete('DataTables_Table_2_length');

    if(bulkType!='default'){
        if(bulkType=='bulk'){
            formData.append('bulk_main_category_id', $('#exclusive_main_category_id').val());
            formData.append('bulk_sub_category_id', $('#exclusive_sub_category_id').val());
        }

        if(bulkType=='mixMatch'){
            formData.append('bulk_main_category_id', $('#mix_main_category_id').val());
            formData.append('bulk_sub_category_id', $('#mix_sub_category_id').val());
        }
    }

    $("#promotionForm").hide();
    $("#tblLoader").show();
    promotion.set_datatable();
    promotion.http('POST', '/add-update-promotion', formData).then((e)=>{
        var message = 'Promotion added successfully.';
        if($("#promotion-id").val()){
            message = 'Promotion updated successfully.';
        }
        promotion.notification('success', message);
        $("#promotionForm").show();
        $("#tblLoader").hide();
        // setTimeout(() => {
        //     window.location = '/manage-promotions';
        // }, 1000);
    })
}


var promotionId = $("#promotion-id").val();
if(promotionId){
    $("#create-update-promotion-breadcrumb").html('<span>Update</span>');
    $("#create-update-promotion-head").html('Update <span> Promotion </span>');
    $("#submit-button").text('Update Promotion')
    $("#tblLoader").show();
    promotion.http('GET', `/promotion/get-promotion/${promotionId}`, {}).then((e)=>{
        var result = JSON.parse(e);
        promotion.promotion = result.promotion;
        if(result.promotion.products){
            promotion.products.list = result.promotion.products;
        }
        var productsSelected = result.promotionProducts;
        var productsSelectedIds = [...new Set(productsSelected.map(x=>x.id))];
        var productsIds = [...new Set(promotion.products.list.map(x=>x.id))];
        var diff = productsSelectedIds.filter(function(i) {return productsIds.indexOf(i) < 0;});
        diff.forEach(id => {
            var p = productsSelected.filter(x=>x.id==id);
            promotion.products.list.push(p[0]);
        });
        set_promotion(result.promotion);
        $("#tblLoader").hide();
    });
}else{
    $("#tblLoader").hide();
}


function set_promotion(result){
    $("#type_id").val(result.type.column_name).trigger('change').attr('disabled', true);
    $("#title").val(result.title);
    $("#sub_title").val(result.sub_title);
    $("#start_date").val(result.start_date);
    $("#end_date").val(result.end_date);
    $("#minimum_quantity").val(result.minimum_quantity);
    $("#free_quantity").val(result.free_quantity);
    $("#discount_price").val(result.discount_price);
    $(`#discount_type option[value="${result.discount_type}"]`).prop('selected', true);
    $(`input[name=discount_filter_id][value="${result.discount_filter.column_name}"]`).prop('checked', true).trigger('change');
    $(`input[name=discount_filter_id]`).attr('disabled', true);

    if(result.banner){
        $('#banner_image_url').attr('src', result.banner);
    }
    console.log(result);

    promotion.triggers();


    var selected = result.detail.map((el)=>{
        return el.module_id
    });

    if(promotion.selectedFilter=='specific-category'){
        promotion.categories.selected = selected;
        promotion.categories.selected.forEach(id => {
            var category = promotion.categories.list.filter((cat)=>cat.id==id);
            promotion.set_category_list_html(category[0]);
        });
    }else{
        promotion.products.selected = selected;
        promotion.products.selected.forEach(id => {
            var product = promotion.products.list.filter((prod)=>prod.id==id);
            promotion.set_product_list_html(product[0], 'primary-products');
        });

        if(result.discount_filter.column_name=="different-product"){
            var freeProducts = result.detail[0].linked_id;
            freeProducts = freeProducts.split(',');
            promotion.products.free = freeProducts.map(el=>parseInt(el));
            freeProducts = promotion.products.list.filter(element=>{
                if(promotion.products.free.indexOf(element.id)!=-1) return element;
            });
            freeProducts.forEach(product => {
                promotion.set_product_list_html(product, 'free-products');
            });
        }
    }

    if(promotion.selectedType=='bulk-offer'){
        // promotion.set_modal_product_html(result.products);
        if(result.is_bulk_mix_match){
            $('input[name=bulk_type][value="mixMatch"]').prop('checked', true);

            $('#bulk_offer_mix_match_criteria_div').show();
            $('#mix_main_category_id').select2('destroy');
            $('#mix_main_category_id').val(result.bulk_main_category_id).select2();

            $('#mix_sub_category_id').html('').html(`<option value="">Select Sub Category</option>`);
            if(result.subCategories.length>0){
                result.subCategories.forEach(sub_category => {
                    $('#mix_sub_category_id').append(`<option value="${sub_category.id}">${sub_category.category_name}</option>`);
                });
            }
            setTimeout(()=>{
                $('#mix_sub_category_id').val(result.bulk_sub_category_id).select2();
            }, 100);

        }else if(result.is_bulk_exclusive){
            $('input[name=bulk_type][value="bulk"]').prop('checked', true);

            $('#bulk_offer_exclusive_criteria_div').show();
            $('#exclusive_main_category_id').select2('destroy');
            $('#exclusive_main_category_id').val(result.bulk_main_category_id).select2();

            $('#exclusive_sub_category_id').html('').html(`<option value="">Select Sub Category</option>`);
            if(result.subCategories.length>0){
                result.subCategories.forEach(sub_category => {
                    $('#exclusive_sub_category_id').append(`<option value="${sub_category.id}">${sub_category.category_name}</option>`);
                });
            }
            setTimeout(()=>{
                $('#exclusive_sub_category_id').val(result.bulk_sub_category_id).select2();
            }, 100);


            $('#exclusive_attribute_id').html('').html(`<option value="">Select Attribute</option>`);
            if(result.attributes.length>0){
                result.attributes.forEach(attribute => {
                    $('#exclusive_attribute_id').append(`<option value="${attribute.id}">${attribute.coloumn_name}</option>`);
                });
            }
            setTimeout(()=>{
                $('#exclusive_attribute_id').val(result.bulk_attribute_id).select2();
            }, 100);



            $('#exclusive_brand_id').html('').html(`<option value="">Select Brand</option>`);
            if(result.brands.length>0){
                result.brands.forEach(brand => {
                    $('#exclusive_brand_id').append(`<option value="${brand.id}">${brand.name}</option>`);
                });
            }
            setTimeout(()=>{
                $('#exclusive_brand_id').val(result.bulk_brand_id).select2();
            }, 100);

        }else{
            $('input[name=bulk_type][value="default"]').prop('checked', true);
        }

        $('input[name=bulk_type]').attr('disabled', 'disabled');
    }

    $("#tblLoader").hide();
}

function load_products_by_category(categoryId){
    promotion.load_products_by_category(categoryId);
}

// jQuery(function($) {
//     $('#overflow-plist').on('scroll', function() {
//         if(Math.ceil($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
//             promotion.load_products();
//         }
//     })
// });



function search_products_categories(val){
    var products = promotion.products.list.filter(product=>{
        if(product.name.toString().toLowerCase().indexOf(`${val.toLowerCase()}`)!=-1) return true;
    });

    (products.length>0)? promotion.set_modal_product_html(products) : promotion.set_modal_product_html(promotion.products.list) ;
}




$(document).ready(function(){
    $('#start_date, #end_date').datepicker({
        format: 'yyyy-mm-dd'
    }).on('changeDate', function(e) {
        $(this).datepicker('hide');
    });
});


function showBulkOfferCriteria(){
    var type = $('input[name=bulk_type]:checked').val();
    $("#load-products-by-category-area").show();
    if(type!='default'){
        $("input[name=discount_filter_id][value='specific-category']").removeAttr('disabled');
        $("#load_products_by_category").removeAttr('disabled');
        $('#exclusive_sub_category_id').html('');
        $('#exclusive_attribute_id').html('');
        $('#exclusive_brand_id').html('');
        promotion.products.list = [];
        promotion.set_add_list_products();
        $('#bulk_offer_exclusive_criteria_div').hide();
        $('#bulk_offer_mix_match_criteria_div').hide();
        // $("#load-products-by-category-area").hide();
        if(type=='bulk'){
            $('#bulk_offer_exclusive_criteria_div').show();
            $("input[name=discount_filter_id][value='specific-products']").prop("checked",true).trigger('change');
            $("input[name=discount_filter_id][value='specific-category']").attr('disabled', 'disabled');
            $("#load_products_by_category").attr('disabled', 'disabled');
        }

        if(type=='mixMatch'){
            $('#bulk_offer_mix_match_criteria_div').show();
            $("input[name=discount_filter_id][value='specific-products']").prop("checked",true).trigger('change');
            $("input[name=discount_filter_id][value='specific-category']").attr('disabled', 'disabled');
            $("#load_products_by_category").attr('disabled', 'disabled');
        }
    }else{
        $("input[name=discount_filter_id][value='specific-category']").removeAttr('disabled');
        $("#load_products_by_category").removeAttr('disabled');
        $('#sub_category_id').html('');
        $('#attribute_id').html('');
        $('#brand_id').html('');
        promotion.products.list = [];
        promotion.set_add_list_products();
        $('#bulk_offer_exclusive_criteria_div').hide();
        $('#bulk_offer_mix_match_criteria_div').hide();
    }

}

function load_sub_categories(id){
    var type = $('input[name=bulk_type]:checked').val();
    if(type=='bulk'){
        var el = $('#exclusive_sub_category_id');
    }else if(type=='mixMatch'){
        var el = $('#mix_sub_category_id');
    }
    el.html('').html(`<option value="">Select Sub Category</option>`);
    promotion.http('GET', `/load-sub-category-for-promotions/${id}`).then((e)=>{
        var data = JSON.parse(e);
        if(data.length>0){
            data.forEach(element => {
                el.append(`<option value="${element.id}">${element.category_name}</option>`);
            });
        }
    });
}

function load_sub_cat_attributes(id){
    $('#exclusive_attribute_id').html('').html(`<option value="">Select Attribute</option>`);
    promotion.http('GET', `/load-attributes-by-sub-cat/${id}`).then((e)=>{
        var data = JSON.parse(e);
        if(data.length>0){
            data.forEach(element => {
                $('#exclusive_attribute_id').append(`<option value="${element.id}">${element.name}</option>`);
            });
        }
    });
}


function load_brands_for_exclusive_offer(attribute_id){
    promotion.destroy_datatable();
    promotion.products.selected = [];
    $('#productList01').find('table').find('tbody').html('');
    promotion.set_datatable();


    var category_id = $('#exclusive_main_category_id').val();
    var sub_category_id = $('#exclusive_sub_category_id').val();
    $('#exclusive_brand_id').html('').html(`<option value="">Select Brand</option>`);
    promotion.http('GET', `/load-brands-for-exclusive-offer/${category_id}/${sub_category_id}/${attribute_id}`).then((e)=>{
        var data = JSON.parse(e);
        if(data.length>0){
            data.forEach(element => {
                $('#exclusive_brand_id').append(`<option value="${element.id}">${element.name}</option>`);
            });
        }
    });
}


function load_products_for_exclusive_offer(brand_id){
    promotion.destroy_datatable();
    promotion.products.selected = [];
    $('#productList01').find('table').find('tbody').html('');
    promotion.set_datatable();
    var attribute_id = $('#exclusive_attribute_id').val();
    promotion.load_products_by_attribute_brand(brand_id, attribute_id);
}


function load_products_by_sub_cat(sub_cat_id) {
    promotion.destroy_datatable();
    promotion.products.selected = [];
    $('#productList01').find('table').find('tbody').html('');
    promotion.set_datatable();
    promotion.load_products_by_sub_cat(sub_cat_id);
}
