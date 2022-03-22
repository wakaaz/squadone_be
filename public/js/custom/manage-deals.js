function Deal(){
    this.deal = null;
    this.products = {
        list: [],
        selected: []
    };
    this.base_url = $('#base_url').val();
    this.datatable = {
        productList01Dt: null
    };
}

Deal.prototype.http = function(type, url, formData){
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
                if (err.status == 422 || err.status == 500) {
                    self.notification('error', 'Some Error Occured, please try again.');
                }

                $("#dealForm").show();
                $("#tblLoader").hide();
            }
        });
    });
}

Deal.prototype.load_products_by_category = function(categoryId){
    $("#tblLoader1").show();
    var url = `/promotions/load-products-by-category/${categoryId}`;
    this.http('GET', url, {}).then((e)=>{
        $("#tblLoader1").hide();
        var products = JSON.parse(e);
        if(products.length<=0){
            setTimeout(() => {
                $("#AddTable").find('tbody').append('<tr><td colspan="2" style="text-align: center;font-size: 0.9rem;">No Product Found...</td></tr>');
            }, 100);
        }
        this.products.list = products;
        if(products.length>0){
            var p = [];
            [...new Set(this.products.list.map(x=>x.id))].forEach(id => {
                var pro = this.products.list.filter(x=>x.id==id);
                p.push(pro[0]);
            });
            this.products.list = p;
        }
        this.set_add_list_products();
    });
}

Deal.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

Deal.prototype.set_add_list_products = function(){
    $("#AddTable").find('tbody').html('');
    if(this.products.list.length>0){
        this.set_modal_product_html(this.products.list);
    }
}

Deal.prototype.set_modal_product_html = function(products){
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
            btnHtml = `<button type="button" class="btn btn-default red-bg mb-0 btn-remove" product-id="${element.id}" id="delete-product-btn-${element.id}" onclick="delete_product(${element.id})">Remove</button>`;
        }
        var html = `<tr id="addProductRow${element.id}">
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


Deal.prototype.add_product = function(id){
    $(`#add-product-btn-${id}`).replaceWith(`<button type="button" class="btn btn-default red-bg mb-0 btn-remove" product-id="${id}" id="delete-product-btn-${id}" onclick="delete_product(${id})">Remove</button>`);

    this.products.selected.push(id);
    this.products.selected = [...new Set(this.products.selected)];

    var product = this.products.list.find(x=>x.id==id);
    this.set_product_list_html(product);

}

Deal.prototype.set_product_list_html = function(product){
    this.destroy_datatable();
    var el, html, date, discount_price;
    el = $("#productList01");

    date = '';
    discount_price = '';
    if(this.deal){
        var d = this.deal.detail.filter(x=>x.product_id==product.id);
        if(d.length>0){
            date = new Date(d[0].start_date);
            date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            discount_price = d[0].discount_price;
        }
    }

    html = `<tr id="listOneRow${product.id}"><td class="sorting_1" tabindex="0">${product.name}</td><td><input type="text" class="form-control input-text" name="date[]" id="date-${product.id}" value="${date}"></td><td><input type="number" class="form-control input-text" name="discount_price[]" id="discount_price" value="${discount_price}"></td><td><button type="button" class="btn btn-default red-bg mb-0 btn-remove" product-id="${product.id}" id="delete-product-btn-${product.id}" onclick="delete_product(${product.id})">Remove</button><input type="hidden" name="product_id[]" value="${product.id}"></td></tr>`;

    el.find('table > tbody').append(html);

    $(`#date-${product.id}`).datepicker({
        format: 'yyyy-mm-dd'
    }).on('changeDate', function(e) {
        $(this).datepicker('hide');
    });
    this.set_datatable();
}

Deal.prototype.delete_product = function(id){
    this.destroy_datatable();
    var selectedArray = this.products.selected;
    $(`#listOneRow${id}`).remove();

    $(`#delete-product-btn-${id}`).replaceWith(`<button type="button" class="btn btn-default mb-0" product-id="${id}" id="add-product-btn-${id}" onclick="add_product(${id})">Add</button>`);

    selectedArray.forEach((element, index) => {
        if(element==id) selectedArray.splice(index, 1);
    });
    this.set_datatable();
}

Deal.prototype.set_add_list_products = function(){
    $("#AddTable").find('tbody').html('');
    if(this.products.list.length>0){
        this.set_modal_product_html(this.products.list);
    }
}

Deal.prototype.set_datatable = function(){
    this.datatable.productList01Dt = $("#productList01").find('table').dataTable();
}

Deal.prototype.destroy_datatable = function(){
    if(this.datatable.productList01Dt) this.datatable.productList01Dt.fnDestroy();
}

Deal.prototype.triggers = function(){
    $('.form-control').on('focus blur', function (e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');
}

var deal = new Deal();
var segments = location.href.split('/');

if(segments[3]=='deal-form'){
    $("#tblLoader").hide();
    $(".body").show();
    deal.datatable.productList01Dt = $("#productList01").find('table').dataTable();
}

if(segments[3]=='manage-deals' || segments[3]=='manage-deleted-deals'){
    $("#tblLoader").hide();
    $(".body").show();
    $(".listTable").dataTable();
}


function open_add_product_modal(){
    $("#AddTable").find('tbody').html('');
    $('#product-cl-sec').addClass('active');
    $('#blureEffct').addClass('blur-div');
    $('body').toggleClass('no-scroll');
    $('i').toggleClass('fa-arrow-left  fa-arrow-right');
    deal.set_add_list_products();
}

function load_products_by_category(categoryId){
    deal.load_products_by_category(categoryId);
}

function add_product(id){
    deal.add_product(id);
}

function delete_product(id){
    deal.delete_product(id);
}


function submitForm(){
    var formData = new FormData($("#dealForm")[0]);
    formData.delete('DataTables_Table_0_length');
    $("#dealForm").hide();
    $("#tblLoader").show();
    deal.http('POST', '/add-update-deal', formData).then((e)=>{
        var message = 'Deal added successfully.';
        if($("#deal-id").val()){
            message = 'Deal updated successfully.';
        }
        deal.notification('success', message);
        $("#dealForm").show();
        $("#tblLoader").hide();
        // setTimeout(() => {
        //     window.location = '/manage-deals';
        // }, 1000);
    })
}

var dealId = $("#deal-id").val();
if(dealId){
    $("#create-update-deal-breadcrumb").html('<span>Update</span>');
    $("#create-update-deal-head").html('Update <span> Deal </span>');
    $("#submit-button").text('Update Deal')
    $("#tblLoader").show();
    deal.http('GET', `/deal/get-deal/${dealId}`, {}).then((e)=>{
        var result = JSON.parse(e);
        deal.deal = result;
        var productList = result.detail.map(x=>{
            if(x.product) return x.product;
        }).filter(x=>{
            if(x) return x;
        });
        deal.products.list = productList;

        // product_list = [...new Set(product_list)];
        // console.log(product_list);
        // deal.deal = result.deal;
        // var productsSelected = result.deal.detail;
        // var productsSelectedIds = [...new Set(productsSelected.map(x=>x.id))];
        // deal.products.list = result.dealProducts;
        // var productsIds = [...new Set(result.deal.detail.map(x=>{
        //     if(x.product) return x.product.id;
        // }))];
        // var diff = productsSelectedIds.filter(function(i) {return productsIds.indexOf(i) < 0;});
        // diff.forEach(id => {
        //     var p = productsSelected.filter(x=>x.id==id);
        //     deal.products.list.push(p[0]);
        // });
        set_deal(result);
        $("#tblLoader").hide();
    });
}


function set_deal(result){
    $(".AddTable").find('table > tbody').html('');
    // $("#type_id").val(result.type.column_name).trigger('change').attr('disabled', true);
    $("#title").val(result.title);
    deal.triggers();

    // $("#start_date").val(result.start_date);
    // $("#end_date").val(result.end_date);
    // $("#minimum_quantity").val(result.minimum_quantity);
    // $("#free_quantity").val(result.free_quantity);
    // $("#discount_price").val(result.discount_price);
    // $(`#discount_type option[value="${result.discount_type}"]`).prop('selected', true);
    // $(`input[name=discount_filter_id][value="${result.discount_filter.column_name}"]`).prop('checked', true).trigger('change');
    // $(`input[name=discount_filter_id]`).attr('disabled', true);

    // promotion.triggers();
    // $("#tblLoader").hide();

    var selected = result.detail.filter((el)=>{
        if(el.product) return el;
    }).map(x=>x.product.id);
    deal.products.selected = selected;
    deal.products.selected.forEach(id => {
        var product = deal.products.list.filter(prod=>prod.id==id);
        deal.set_product_list_html(product[0]);
    });

    // if(result.discount_filter.column_name=="different-produt"){
    //     var freeProducts = result.detail[0].linked_id;
    //     freeProducts = freeProducts.split(',');
    //     deal.products.free = freeProducts.map(el=>parseInt(el));
    //     freeProducts = deal.products.list.filter(element=>{
    //         if(deal.products.free.indexOf(element.id)!=-1) return element;
    //     });
    //     freeProducts.forEach(product => {
    //         deal.set_product_list_html(product, 'free-products');
    //     });
    // }
}

function open_delete_modal(id){
    $(`#deal-delete-id`).val(id);
    $(`#deleteDeal`).modal('show');
}


function delete_deal(){
    var dealId = $(`#deal-delete-id`).val();
    deal.http('GET', `/deal/delete-deal/${dealId}`, {}).then((e)=>{
        deal.notification('success', 'You have deleted a deal successfully.');
        setTimeout(() => {
            location.reload();
        }, 500);
    });
}


function open_restore_confim_modal(id){
    $(`#deal-restore-id`).val(id);
    $(`#restoreDeal`).modal('show');
}

function restore_deal(){
    var dealId = $(`#deal-restore-id`).val();
    deal.http('GET', `/deal/restore-deal/${dealId}`, {}).then((e)=>{
        deal.notification('success', 'You have restore a deal successfully.');
        setTimeout(() => {
            location.reload();
        }, 500);
    });
}
