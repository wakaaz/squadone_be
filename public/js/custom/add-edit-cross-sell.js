function CrossSell() {
    this.products = [];
    this.primaryList = {list:[], ids:[]};
    this.crossList = {list:[], ids:[]};
    this.datatable = {
        productList01Dt: null,
        productList02Dt: null
    };
    this.action = 'primary';
}

CrossSell.prototype.http = function(type, url, formData){
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

                $("#crossSellForm").show();
                $("#tblLoader").hide();
            }
        });
    });
}

CrossSell.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

CrossSell.prototype.set_datatable = function(){
    this.datatable.productList01Dt = $("#productList01").find('table').dataTable();
    this.datatable.productList02Dt = $("#productList02").find('table').dataTable();
}

CrossSell.prototype.destroy_datatable = function(){
    if(this.datatable.productList01Dt) this.datatable.productList01Dt.fnDestroy();
    if(this.datatable.productList02Dt) this.datatable.productList02Dt.fnDestroy();
}

CrossSell.prototype.loader = function(action){
    if(action=='show'){
        $('#tblLoader').show();
    }else if(action=='hide'){
        $('#tblLoader').hide();
    }
}

CrossSell.prototype.init = function(){
    this.loader('hide');
}

CrossSell.prototype.load_products_by_category = function(categoryId){
    $("#tblLoader1").show();
    var crosssell = this;
    var url = `/promotions/load-products-by-category/${categoryId}`;
    this.http('GET', url, {}).then((e)=>{
        $("#tblLoader1").hide();
        var products = JSON.parse(e);
        if(products.length<=0){
            setTimeout(() => {
                $("#AddTable").find('tbody').append('<tr><td colspan="2" style="text-align: center;font-size: 0.9rem;">No Product Found...</td></tr>');
            }, 100);
        }
        crosssell.products = products;
        // console.log(this.products);
        // crosssell.products.list = products;
        // if(products.length>0){
        //     var p = [];
        //     [...new Set(crosssell.products.list.map(x=>x.id))].forEach(id => {
        //         var pro = crosssell.products.list.filter(x=>x.id==id);
        //         p.push(pro[0]);
        //     });
        //     crosssell.products.list = p;
        //     crosssell.products.offset = crosssell.products.offset+crosssell.products.limit;
        // }
        this.set_add_list_products();
    });
}


CrossSell.prototype.set_add_list_products = function(){
    $("#AddTable").find('tbody').html('');
    if(this.products.length>0){
        this.set_modal_product_html(this.products);
    }
}

CrossSell.prototype.set_modal_product_html = function(products){
    $("#AddTable").find('tbody').html('');
    var selectedArray = (this.action=='primary')? this.primaryList.ids : this.crossList.ids ;
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


CrossSell.prototype.add_product = function(id){
    $(`#add-product-btn-${id}`).replaceWith(`<button type="button" class="btn btn-default red-bg mb-0 btn-remove" product-id="${id}" id="delete-product-btn-${id}" onclick="delete_product(${id}, '${this.action}')">Remove</button>`);

    var array = (this.action=='primary')? this.primaryList.ids : this.crossList.ids ;

    array.push(id);
    array = [...new Set(array)];

    var product = this.products.find(x=>x.id==id);
    this.set_product_list_html(product, this.action);

}

CrossSell.prototype.delete_product = function(id, type){
    this.destroy_datatable();

    var rowName = 'listOneRow';
    var selectedArray = this.primaryList.ids;
    if(type=='cross'){
        rowName = 'listTwoRow';
        selectedArray = this.crossList.ids;
    }
    $(`#${rowName+id}`).remove();

    // $(`#delete-product-btn-${id}`).replaceWith(`<button type="button" class="btn btn-default mb-0" product-id="${id}" id="add-product-btn-${id}" onclick="add_product(${id})">Add</button>`);

    selectedArray.forEach((element, index) => {
        if(element==id) selectedArray.splice(index, 1);
    });

    this.set_datatable();
    // console.log(this);
}

CrossSell.prototype.set_product_list_html = function(product, action){
    this.destroy_datatable();
    var el, inputName, rowName, html, quantity_val, promotionDetailProduct;
    el = $("#productList01");
    inputName = 'primary_ids';
    rowName = 'listOneRow';
    if(action=='cross'){
        el = $("#productList02");
        inputName = 'cross_ids';
        rowName = 'listTwoRow';
    }

    if(product){
        html = `<tr id="${rowName}${product.id}"><td class="sorting_1" tabindex="0">${product.name}</td><td><button type="button" class="btn btn-default red-bg mb-0 btn-remove" product-id="${product.id}" action-type="${action}" id="delete-product-btn-${product.id}" onclick="delete_product(${product.id}, '${action}')">Remove</button><input type="hidden" name="${inputName}[]" value="${product.id}"></td></tr>`;

        // if(this.selectedType == 'bundle-offer'){
        //     el = $("#productList03");
        //     quantity_val = '';
        //     if(this.promotion){
        //         promotionDetailProduct = this.promotion.detail.filter(x=>x.module_id==product.id);
        //         if(promotionDetailProduct.length>0) quantity_val = promotionDetailProduct[0].quantity;
        //     }
        //     html = `<tr id="${rowName}${product.id}"><td class="sorting_1" tabindex="0">${product.name}</td><td><input type="number" name="quantity[]" value="${quantity_val}"></td><td><button type="button" class="btn btn-default red-bg mb-0 btn-remove" product-id="3" action-type="${this.products.selectedAction}" id="delete-product-btn-${product.id}" onclick="delete_product(${product.id}, '${this.products.selectedAction}')">Remove</button><input type="hidden" name="${inputName}[]" value="${product.id}"></td></tr>`;
        // }

        el.find('table > tbody').append(html);
    }

    this.set_datatable();
}

var crosssell = new CrossSell();


var crossSellId = $("#cross-sell-id").val();
if(crossSellId){
    $("#create-update-cross-sell-breadcrumb").html('<span>Update</span>');
    $("#create-update-cross-sell-head").html('Update <span> Cross Sell </span>');
    $("#submit-button").text('Update Cross Sell');

    crosssell.loader('show');

    crosssell.http('GET', `/cross-sell/get-cross-sell/${crossSellId}`, {}).then((e)=>{
        var result = JSON.parse(e);

        crosssell.primaryList.list = [];
        crosssell.primaryList.ids = [];

        crosssell.crossList.list = [];
        crosssell.crossList.ids = [];

        if(result.cross_products.length>0){
            result.cross_products.forEach(primary => {
                if(primary.product) crosssell.primaryList.list.push(primary.product);
                if(primary.product) crosssell.primaryList.ids.push(primary.product.id);

                crosssell.set_product_list_html(primary.product, 'primary');
            });
        }

        if(result.cross_list.length>0){
            result.cross_list.forEach(corss_li => {
                if(corss_li.product) crosssell.crossList.list.push(corss_li.product);
                if(corss_li.product) crosssell.crossList.ids.push(corss_li.product.id);

                crosssell.set_product_list_html(corss_li.product, 'cross');
            });
        }

        $('#title').val(result.title);
        $('#title').blur().focus();

        $('#sub_title').val(result.sub_title);
        $('#sub_title').blur().focus();

        $('#discount_price').val(result.discount_price);
        $('#discount_price').blur().focus();

        $('#discount_type').val(result.discount_type).trigger('change');

        crosssell.loader('hide');
    });
}else{
    crosssell.init();
}

function OpenProductModal(action){
    // crosssell.products = [];
    // $('#load_products_by_category').val('').trigger('selected');
    // crosssell.set_modal_product_html(crosssell.products);
    crosssell.action = action;
    crosssell.set_add_list_products();
    openSidebar();
}

function load_products_by_category(categoryId){
    crosssell.load_products_by_category(categoryId);
}

function add_product(id){
    crosssell.add_product(id);
}

function delete_product(id, type){
    crosssell.delete_product(id, type);
}


function submitForm(){
    // var bulkType = $('input[name=bulk_type]:checked').val();

    crosssell.destroy_datatable();
    var formData = new FormData($("#crossSellForm")[0]);
    formData.delete('DataTables_Table_0_length');
    formData.delete('DataTables_Table_1_length');

    $("#crossSellForm").hide();
    $("#tblLoader").show();
    crosssell.set_datatable();
    crosssell.http('POST', '/add-update-cross-sell', formData).then((e)=>{
        var message = 'Cross sell added successfully.';
        if($("#cross-sell-id").val()){
            message = 'Cross sell updated successfully.';
        }
        crosssell.notification('success', message);
        $("#crossSellForm").show();
        $("#tblLoader").hide();
        setTimeout(() => {
            window.location = '/cross-sell';
        }, 1000);
    })
}
