function Inventory(){
    this.products = null;
    this.variants = null;
    this.sub_categories = null;
}

Inventory.prototype.http = function(type, url, formData){
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

Inventory.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

var inventory = new Inventory();

function get_inventory_data(){
    inventory.http('GET', '/inventory-get-data', {}).then((e)=>{
        var data = JSON.parse(e);
        inventory.variants = data.products;
        inventory.sub_categories = data.sub_categories;
        set_products_from_variants().then((products)=>{
            inventory.products = products;
            switch ($("#inventory-type").val()) {
                case 'repricing':
                    set_repricing_table();
                    break;
                case 'stock':
                    set_stock_table();
                    break;
                case 'tags':
                    set_tags_table();
                    break;
                case 'delete-inventory':
                    set_delete_inventory_table();
                    break;
                default:
                    break;
            }
        });

    });
}

function get_deleted_inventory_data(){
    inventory.http('GET', '/get-deleted-inventory-data', {}).then((e)=>{
        var data = JSON.parse(e);
        inventory.products = data.products;
        inventory.sub_categories = data.sub_categories;
        set_deleted_inventory_table();
    });
}


if($("#inventory-type").val()=='deleted-inventory'){
    get_deleted_inventory_data();
}else{
    get_inventory_data();
}



function set_products_from_variants(){
    return new Promise(function (resolve, reject) {
        var products = [];
        inventory.variants.map(x=>x.product).forEach(element => {
            if(element){
                if(products.length>0){
                    if(products.map(x=>x.id).indexOf(element.id)==-1){
                        products.push(element);
                    }
                }else{
                    products.push(element);
                }
            }
        });
        resolve(products);
    });
}

function set_repricing_table(){
    var data = inventory.variants;
    var html = `<thead>
            <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Barcode</th>
                <th>Sell Price</th>
                <th>Cost Price</th>
                <th>Wholesale Price</th>
                <th>Action</th>
            </tr>
        </thead><tbody>`;

    if(data.length>0){
        data.forEach(element => {
            var attrHtml = '<br>';
            if(element.attributes.length>0){
                element.attributes.forEach(attribute => {
                    attrHtml += `<label class="label label-theme">${attribute.assignment_value}</label>`;
                });
            }
            html += `<tr>
                <td>${element.product.sku}</td>
                <td>${element.product.name} ${attrHtml}</td>
                <td>${element.barcode}</td>
                <td><input type="text" class="form-control input-text product-price" variant-id="${element.id}" value="${element.sell_price}" id="product-sell-price-input-${element.id}" action="sell_price"></td>
                <td><input type="text" class="form-control input-text product-price" variant-id="${element.id}" value="${element.cost_price}" id="product-cost-price-input-${element.id}" action="cost_price"></td>
                <td><input type="text" class="form-control input-text product-price" variant-id="${element.id}" value="${element.whole_sale_price}" id="product-wholesale-price-input-${element.id}" action="whole_sale_price"></td>
                <td><button type="button" class="btn btn-default btn-line" onclick="update_repricing(${element.id})">Update</button></td>
            </tr>`
        });
    }

    html += `</tbody>`;
    $(".listTable").html(html);
    $(".listTable").dataTable();
    $("#tblLoader").hide();
    $(".body").show();
    $(".listTable").css('width', '100%');
    $(".product-price").on('blur', function(e){
        update_repricing_single($(e.currentTarget).val(), $(e.currentTarget).attr('variant-id'), $(e.currentTarget).attr('action'));
    });
}


function set_stock_table(){
    var data = inventory.variants;
    var html = `<thead>
            <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Barcode</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Add Stock</th>
                <th>Action</th>
            </tr>
        </thead><tbody>`;

    if(data.length>0){
        data.forEach(element => {
            var attrHtml = '<br>';
            if(element.attributes.length>0){
                element.attributes.forEach(attribute => {
                    attrHtml += `<label class="label label-theme">${attribute.assignment_value}</label>`;
                });
            }
            var sub_category = inventory.sub_categories.filter(x=>x.id==element.product.category_id);
            html += `<tr>
                <td>${element.product.sku}</td>
                <td>${element.product.name} ${attrHtml}</td>
                <td>${element.barcode}</td>
                <td>${sub_category[0].category_name}</td>
                <td id="stock-quantity-${element.id}">${element.initial_quantity}</td>
                <td><input type="text" class="form-control input-text product-stock" variant-id="${element.id}" id="product-stock-input-${element.id}" value="${element.initial_quantity}"></td>
                <td><button type="button" class="btn btn-default btn-line" onclick="update_stock(${element.id})">Update</button></td>
            </tr>`
        });
    }

    html += `</tbody>`;
    $(".listTable").html(html);
    $(".listTable").dataTable();
    $("#tblLoader").hide();
    $(".body").show();
    $(".listTable").css('width', '100%');
    // $(".product-stock").on('blur', function(e){
    //     update_stock($(e.currentTarget).attr('variant-id'));
    // });
}

function set_tags_table(){
    var data = inventory.products;
    var html = `<thead>
            <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Title</th>
                <th>Tags</th>
                <th>Keywords</th>
                <th>Action</th>
            </tr>
        </thead><tbody>`;

    if(data.length>0){
        data.forEach(element => {
            var SEO = (element.seo!='')? JSON.parse(element.seo): '' ;
            html += `<tr>
                <td>${element.sku}</td>
                <td>${element.name}</td>
                <td><input type="text" class="form-control input-text product-seo" product-id="${element.id}" id="product-seo-title-input-${element.id}" value="${SEO.page_title}" action="page_title"></td>
                <td><input type="text" class="form-control input-text product-seo" product-id="${element.id}" id="product-seo-tags-input-${element.id}" value="${SEO.meta_tag_name}" action="meta_tag_name"></td>
                <td><input type="text" class="form-control input-text product-seo" product-id="${element.id}" id="product-seo-keywords-input-${element.id}" value="${SEO.meta_keywords}" action="meta_keywords"></td>
                <td><button type="button" class="btn btn-default btn-line" onclick="update_seo(${element.id}, 'all')">Update</button></td>
            </tr>`
        });
    }

    html += `</tbody>`;
    $(".listTable").html(html);
    $(".listTable").dataTable();
    $("#tblLoader").hide();
    $(".body").show();
    $(".listTable").css('width', '100%');
    $(".product-seo").on('blur', function(e){
        update_seo($(e.currentTarget).attr('product-id'), $(e.currentTarget).attr('action'));
    });
}

function set_delete_inventory_table(){
    var data = inventory.products;
    var html = `<thead>
            <tr>
                <th>SKU</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead><tbody>`;

    if(data.length>0){
        data.forEach(element => {
            var sub_category = inventory.sub_categories.filter(x=>x.id==element.category_id);
            var btn_color = '';
            var btn_text = 'Deactive';
            if(element.status==0){
                btn_color = 'green-bg';
                btn_text = 'Active';
            }
            html += `<tr id="product-row-${element.id}">
                <td>${element.sku}</td>
                <td><img src="${element.thumbnail}" class="product-image"></td>
                <td>${element.name}</td>
                <td>${sub_category[0].category_name}</td>
                <td><button type="button" class="btn btn-default ${btn_color}" id="product-status-btn-${element.id}" onclick="update_product_status(${element.id})">${btn_text}</button></td>
                <td><button type="button" class="btn btn-default red-bg" id="product-delete-btn-${element.id}" onclick="open_delete_modal_confirm(${element.id})">Delete</button></td>
            </tr>`
        });
    }

    html += `</tbody>`;
    $(".listTable").html(html);
    $(".listTable").dataTable();
    $("#tblLoader").hide();
    $(".body").show();
    $(".listTable").css('width', '100%');
}

function set_deleted_inventory_table(){
    var data = inventory.products;
    var html = `<thead>
            <tr>
                <th>SKU</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Action</th>
            </tr>
        </thead><tbody>`;

    if(data.length>0){
        data.forEach(element => {
            var sub_category = inventory.sub_categories.filter(x=>x.id==element.category_id);
            html += `<tr id="product-row-${element.id}">
                <td>${element.sku}</td>
                <td><img src="${element.thumbnail}" class="product-image"></td>
                <td>${element.name}</td>
                <td>${sub_category[0].category_name}</td>
                <td><button type="button" class="btn btn-default btn-line" id="product-restore-btn-${element.id}" onclick="open_restore_modal_confirm(${element.id})">Restore</button></td>
            </tr>`
        });
    }

    html += `</tbody>`;
    $(".listTable").html(html);
    $(".listTable").dataTable();
    $("#tblLoader").hide();
    $(".body").show();
    $(".listTable").css('width', '100%');
}

function update_repricing(variant_id){
    formData = new FormData();
    formData.append('sell_price', $(`#product-sell-price-input-${variant_id}`).val());
    formData.append('cost_price', $(`#product-cost-price-input-${variant_id}`).val());
    formData.append('whole_sale_price', $(`#product-wholesale-price-input-${variant_id}`).val());
    inventory.http('POST', `/inventory-update-repricing/${variant_id}`, formData).then((e)=>{
        inventory.notification('success', 'Bulk Pricing Changed Successfully.');
    });
}

function update_repricing_single(value, variant_id, type){
    formData = new FormData();
    formData.append('value', value);
    formData.append('type', type);
    inventory.http('POST', `/inventory-update-repricing-single/${variant_id}`, formData).then((e)=>{
        if(e=='updated'){
            inventory.notification('success', `${type.replace('_', ' ').toUpperCase()} Changed Successfully.`);
        }
    });
}

function update_stock(variant_id){
    var quantity = $(`#product-stock-input-${variant_id}`).val();
    formData = new FormData();
    formData.append('initial_quantity', quantity);
    inventory.http('POST', `/inventory-update-stock/${variant_id}`, formData).then((e)=>{
        if(e=='updated'){
            $(`#stock-quantity-${variant_id}`).html(quantity);
            inventory.notification('success', 'Product Stock Changed Successfully.');
        }
    });
}

function update_seo(product_id, type){
    var page_title = $(`#product-seo-title-input-${product_id}`).val();
    var meta_tag_name = $(`#product-seo-tags-input-${product_id}`).val();
    var meta_keywords = $(`#product-seo-keywords-input-${product_id}`).val();

    var product = inventory.products.filter(x=>x.id==product_id);
    var SEO = (product[0].seo!='')? JSON.parse(product[0].seo): '' ;

    if(type=='page_title' && SEO.page_title==page_title) return false;
    if(type=='meta_tag_name' && SEO.meta_tag_name==meta_tag_name) return false;
    if(type=='meta_keywords' && SEO.meta_keywords==meta_keywords) return false;

    formData = new FormData();
    formData.append('type', type);
    formData.append('title', page_title);
    formData.append('tags', meta_tag_name);
    formData.append('keywords', meta_keywords);
    inventory.http('POST', `/inventory-update-seo/${product_id}`, formData).then((e)=>{
        inventory.notification('success', 'SEO Detail has Changed Successfully.');
    });
}

function update_product_status(id){
    var index = inventory.products.findIndex(x=>x.id==id);
    var status = (inventory.products[index].status==0)? 1 : 0 ;
    inventory.products[index].status = parseInt(status);
    if(inventory.products[index].status==0){
        $(`#product-status-btn-${id}`).removeClass('green-bg').addClass('green-bg');
        $(`#product-status-btn-${id}`).text('Active');
    }else{
        $(`#product-status-btn-${id}`).removeClass('green-bg');
        $(`#product-status-btn-${id}`).text('Deactive');
    }
    var formData = new FormData();
    formData.append('status', inventory.products[index].status);
    inventory.http('POST', `/update-inventory-product-status/${id}`, formData).then((e)=>{
        inventory.notification('success', 'Product Status has Changed Successfully.');
    });
}

function open_delete_modal_confirm(id){
    $(`#product-delete-id`).val(id);
    $("#deleteProduct").modal("show");
}

function delete_Product(){
    var id = $(`#product-delete-id`).val();
    $("#deleteProduct").modal("hide");
    $(`#product-row-${id}`).remove();
    inventory.http('DELETE', `/delete-inventory-product/${id}`, {}).then((e)=>{
        inventory.notification('success', 'You have delete a product successfully.');
    });
}

function open_restore_modal_confirm(id){
    $(`#product-restore-id`).val(id);
    $("#restoreProduct").modal("show");
}

function restore_Product(){
    var id = $(`#product-restore-id`).val();
    $("#restoreProduct").modal("hide");
    $(`#product-row-${id}`).remove();
    inventory.http('get', `/restore-inventory-product/${id}`, {}).then((e)=>{
        inventory.notification('success', 'You have restore a product successfully.');
    });
}
