function Customer(){
    this.list = null;
    this.datatable = null;
    this.dropify = null;
}

Customer.prototype.init = function(){
    $('#saveCustomer').on('click', this.submit_form.bind(this));
}

Customer.prototype.http = function(type, url, formData){
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

                self.loader('hide');
            }
        });
    });
}

Customer.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

Customer.prototype.loader = function(action){
    if(action=='show'){
        $('#tblLoader').show();
        $('.body').hide();
    }else if(action=='hide'){
        $('#tblLoader').hide();
        $('.body').show();
    }
}

Customer.prototype.set_datatable = function(){
    this.datatable = $("#listCustomersTable").dataTable();
}

Customer.prototype.destroy_datatable = function(){
    if(this.datatable) this.datatable.fnDestroy();
}

Customer.prototype.set_customers_listing_html = function(){
    var html = `<table class="table table-hover dt-responsive nowrap" id="listCustomersTable" style="width:100%;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>`;

    $(`.body`).html(html);
    this.datatable = $(`#listCustomersTable`).dataTable();
}

Customer.prototype.listing_customers = function(type){
    customer.destroy_datatable();
    if(this.list.length>0){
        this.list.forEach(element => {
            this.list_customer(element, type);
        });
    }
    customer.set_datatable();
}

Customer.prototype.list_customer = function(customer, type){
    var html = this.list_customer_html(customer, type);
    $(`#listCustomersTable`).find('tbody').append(html);
}

Customer.prototype.list_customer_html = function(customer, type){
    var statusBtnText = (customer.status==1)? 'Deactive' : 'Active' ;
    var buttons = `<button type="button" class="btn btn-default btn-line" onclick="edit_customer(${customer.id})">Edit</button>
    <button type="button" class="btn btn-default" id="customer-status-btn-${customer.id}" onclick="change_customer_status(${customer.id})">${statusBtnText}</button>
    <button type="button" class="btn btn-default red-bg" title="Delete Customer" onclick="destroy_customer(${customer.id})">Delete</button>`;
    if(type=='deleted'){
        buttons = `<button type="button" class="btn btn-default btn-line" onclick="restore_customer(${customer.id})">Restore</button>`;
    }
    return `<tr id="customer-row-${customer.id}">
        <td>${customer.id}</td>
        <td>${customer.first_name}&nbsp;${customer.last_name}</td>
        <td>${buttons}</td>
    </tr>`;
}

Customer.prototype.open_side_bar = function(id=null){
    $('#dropifyImgDiv').empty();
    $('#dropifyImgDiv').append('<input type="file" name="profile_pic" id="profile_pic" />');

    $("#customer_addresses_area").hide();
    $("#add_address").prop('checked', false);
    this.clear_form();
    (id)? this.open_side_bar_edit(id) : this.open_side_bar_add() ;
    $('#dataSidebarLoader').hide();
}

Customer.prototype.open_side_bar_add = function(){
    this.dropify = $('#profile_pic').dropify();
    $("input[name=customer_id]").val('');
    openSidebar();
}

Customer.prototype.open_side_bar_edit = function(id){
    var customer, shipping, billing;
    $("input[name=customer_id]").val(id);

    customer = this.list.find(x=>x.id==id);

    shipping = null;
    billing = null;
    if(customer.addresses){
        shipping = customer.addresses.find(x=>x.type=='shipping');
        billing = customer.addresses.find(x=>x.type=='billing');
    }

    /**
     * Setting Customer Profile Picture
     */

    if(customer.profile_pic!=''){
        $('#profile_pic').attr("data-height", '100px');
        $('#profile_pic').attr("data-default-file", customer.profile_pic);
    }
    this.dropify = $('#profile_pic').dropify();

    /**
     * Setting Customer Data
     */
    $('#customer_first_name').val(customer.first_name);
    $('#customer_last_name').val(customer.last_name);
    $('#customer_email').val(customer.email);
    // $('#customer_company_name').val(customer.company_name);
    $('#customer_country_id').val(customer.country_id).trigger('change');
    $('#customer_state').val(customer.state);
    $('#customer_city').val(customer.city);
    $('#customer_street_address').val(customer.street_address);
    $('#customer_postal_code').val(customer.postal_code);
    $('#customer_date_of_birth').val(customer.date_of_birth);
    $('#customer_primary_phone').val(customer.primary_phone);
    $('#customer_secondary_phone').val(customer.secondary_phone);
    $('#username').val(customer.username);

    /**
     * Setting Customer Shipping Data
     */

    if(shipping){
        $("#customer_addresses_area").show();
        $("#add_address").prop('checked', true);
        $('#name_shipping').val(shipping.name);
        $('#company_shipping').val(shipping.company);
        $('#email_shipping').val(shipping.email);
        $('#country_id_shipping').val(shipping.country_id).trigger('change');
        $('#state_shipping').val(shipping.state);
        $('#city_shipping').val(shipping.city);
        $('#address_1_shipping').val(shipping.address_1);
        $('#address_2_shipping').val(shipping.address_2);
        $('#postal_code_shipping').val(shipping.postal_code);
        $('#phone_shipping').val(shipping.phone);
    }

    /**
     * Setting Customer Billing Data
     */

    if(billing){
        $("#customer_addresses_area").show();
        $("#add_address").prop('checked', true);
        $('#name_billing').val(billing.name);
        $('#company_billing').val(billing.company);
        $('#email_billing').val(billing.email);
        $('#country_id_billing').val(billing.country_id).trigger('change');
        $('#state_billing').val(billing.state);
        $('#city_billing').val(billing.city);
        $('#address_1_billing').val(billing.address_1);
        $('#address_2_billing').val(billing.address_2);
        $('#postal_code_billing').val(billing.postal_code);
        $('#phone_billing').val(billing.phone);
    }

    $.each($('.form-control'), function(){
        $(this).focus();
        $(this).blur();
    });

    $('#customer_first_name').focus();
    $('#customer_first_name').blur();
    openSidebar();
}

Customer.prototype.clear_form = function(){
    document.querySelector("#saveCustomerForm").reset();
}

Customer.prototype.destroy_customer = function(id){
    this.loader('show');
    var self = this;
    this.http('DELETE', `customer/destroy/${id}`, {}).then(function(){
        self.destroy_datatable();
        $(`#customer-row-${id}`).remove();
        self.set_datatable();
        self.loader('hide');
    });
}

Customer.prototype.submit_form = function(){
    var formData = new FormData($('#saveCustomerForm')[0]);
    this.http('POST', 'customer/store', formData).then((e)=>{
        var data = JSON.parse(e);
        if(data.status=='error'){
            this.notification('error', data.result);
            return;
        }
        this.notification('success', 'Customer Added Successfully!');
        if($('#customer_id').val()==''){
            this.destroy_datatable();
            this.list.push(data.result);
            this.list_customer(data.result, 'general');
            this.set_datatable();
        }else{
            html = this.list_customer_html(data.result, 'general');
            $(`#customer-row-${data.result.id}`).replaceWith(html);
        }
        closeSidebar();
    });
}

var customer = new Customer();
customer.init();

var segments = location.href.split('/');
if(segments[3]=='manage-deleted-customers'){
    customer.http('GET', 'get-deleted-customers', {}).then((e)=>{
        var data = JSON.parse(e);
        customer.list = data;
        customer.set_customers_listing_html();
        customer.listing_customers('deleted');
        customer.loader('hide');
    });
}else{
    customer.http('GET', 'get-customers', {}).then((e)=>{
        var data = JSON.parse(e);
        customer.list = data;
        customer.set_customers_listing_html();
        customer.listing_customers('general');
        customer.loader('hide');
    });
}


function add_customer(){
    customer.open_side_bar();
}

function edit_customer(id){
    customer.open_side_bar(id);
}

function destroy_customer(id){
    customer.destroy_customer(id);
}

function restore_customer(id){
    customer.loader('show');
    customer.http('GET', `restore-deleted-customer/${id}`, {}).then((e)=>{
        customer.notification('success', 'You have restored a customer successfully.');
        customer.destroy_datatable();
        $(`#customer-row-${id}`).remove();
        customer.set_datatable();
        customer.loader('hide');
    });
}

function change_customer_status(id){
    var cu = customer.list.find(x=>x.id==id);
    status = (cu.status==1)? 0 : 1 ;
    var formData = new FormData();
    formData.append('id', id);
    formData.append('status', status);
    customer.loader('show');
    customer.http('POST', `change-customer-status`, formData).then((e)=>{
        customer.notification('success', 'You have changed a customer status successfully.');
        var btntext = (status==1)? 'Deactive' : 'Active' ;
        $(`#customer-status-btn-${id}`).text(btntext);
        customer.loader('hide');
    });
}

$('#add_address').on('click', function(){
    if($(this).is(':checked')){
        $("#customer_addresses_area").slideDown();
    }else{
        $("#customer_addresses_area").slideUp();
    }
});

$('#same_as_shipping').on('click', function(){
    if($(this).is(':checked')){
        $("#customer_billing_area").slideUp();
    }else{
        $("#customer_billing_area").slideDown();
    }
});


$(document).ready(function(){
    $('#customer_date_of_birth').datepicker({
        format: 'yyyy-mm-dd'
    }).on('changeDate', function(e) {
        $(this).datepicker('hide');
    });
});


var dropifyImageDiv = $("#dropifyImgDiv");
dropifyImageDiv.empty();
dropifyImageDiv.append('<input type="file" name="profile_pic" id="profile_pic" />');
customer.dropify = $("#profile_pic").dropify();
