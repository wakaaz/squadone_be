function Wholesaler(){
    this.DOMStrings = {
        form: {
            business_name: '#business_name',
            business_type: '#business_type',
            business_phone: '#business_phone',
            business_registration_id: '#business_registration_id',
            business_address: '#business_address',
            business_email: '#business_email',
            business_city: '#business_city',
            business_state: '#business_state',
            business_country: '#business_country',
            poc_name: '#poc_name',
            poc_email: '#poc_email',
            poc_phone: '#poc_phone',
            poc_designation: '#poc_designation',
            username: '#username',
            password: '#password'
        },
        wholesalers:null,
        add_button: '.add_button',
        dropifyImgDiv: '#dropifyImgDiv',
        picture: '#picture',
        wholesalerForm: '#wholesalerForm',
        save_button: '#save-button',
        cancel_button: '#cancel-button',
        wholesaler_id: '#wholesaler_id',
        notifDiv: '#notifDiv',
        body: '.body',
        loader: '#tblLoader',
        listTable: '.listTable',
        listTableBody: '.listTableBody',
        listDataTable:null,
        edit_btn: '.edit-btn',
        delete_btn: '.delete-btn',
        body_table: `<table class="table table-hover dt-responsive nowrap listTable" style="width:100%">
                        <thead>
                            <tr>
                                <th>Wholesaler ID</th>
                                <th>Username</th>
                                <th>Business Name</th>
                                <th>Business Email</th>
                                <th>Business Phone</th>
                                <th>Business Country</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody class='listTableBody'></tbody>
                    </table>`
    }
}

Wholesaler.prototype.init = function(){
    this.render_html();
    this.add_event_listners();
    this.set_dropify();
    this.fetch();
}

Wholesaler.prototype.render_html = function(){
    $(this.DOMStrings.body).html(this.DOMStrings.body_table);
}

Wholesaler.prototype.fetch = function(){
    var self = this;
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
        },
        url: '/fetch-wholesalers',
        type: 'GET',
        cache: false,
        contentType: false,
        processData: false,
        success: function(e){
            self.wholesalers = JSON.parse(e);
            self.listing_wholesalers();
        },
        error: function(err) {
            self.notification('error', 'Failed to load Wholesalers at the moment');
            if (err.status == 422) {
                $.each(err.responseJSON.errors, function(i, error) {
                    var el = $(document).find('[name="' + i + '"]');
                    el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                });
            }
        }
    });
}

Wholesaler.prototype.add_event_listners = function(){
    document.querySelector(this.DOMStrings.add_button).addEventListener('click', this.open_form_modal.bind(this));
    document.querySelector(this.DOMStrings.save_button).addEventListener('click', this.add_update.bind(this));
    $.each($('#wholesalerForm').find('input'), function(){
        var el = $(this);
        el.on('keyup', function(){
            el.removeClass('input-invalid');
        });
    });
}

Wholesaler.prototype.listing_wholesalers = function(){
    this.wholesalers.forEach((element) => {
        var html = this.listing_wholesaler_html(element);
        $(this.DOMStrings.listTableBody).append(html);
    });
    $(this.DOMStrings.loader).hide();
    $(this.DOMStrings.body).fadeIn();
    this.listDataTable = $(this.DOMStrings.listTable).DataTable();

    $(this.DOMStrings.edit_btn).on('click', this.open_form_modal.bind(this));
    $(this.DOMStrings.delete_btn).on('click', this.delete_wholesaler.bind(this));
    // document.querySelector('.edit-btn').addEventListener('click', this.open_form_modal.bind(this));
}

Wholesaler.prototype.listing_wholesaler_html = function(element){
    var contactInfo = JSON.parse(element.contact_information),
        businessEmail = contactInfo.email.filter(el=>el.type=='business'),
        businessPhone = contactInfo.phone.filter(el=>el.type=='business');

    return `<tr id="row-${element.id}">
                <td>${element.id}</td>
                <td>${element.username}</td>
                <td>${element.business_name}</td>
                <td>${businessEmail[0].value}</td>
                <td>${businessPhone[0].value}</td>
                <td>${element.business_country}</td>
                <td>
                    <button wholesaler="${element.id}" class="btn btn-default btn-line edit-btn">Edit</button>
                    <button wholesaler="${element.id}" class="btn btn-default delete-btn">Delete</button>
                </td>
            </tr>`;
}


function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validation(){
    var isvalid = true;
    $.each($('#wholesalerForm').find('input'), function(){
        if($(this).attr('type')!='file' && $(this).attr('type')!='password'){
            if($(this).hasClass('required') && $(this).val()==''){
                $(this).addClass('input-invalid');
                isvalid = false;
            }
        }
    });

    var passwordField = $("#password");
    if($("#wholesaler_id").val()=='' && passwordField.val()==''){
        if(passwordField.hasClass('required') && passwordField.val()==''){
            passwordField.addClass('input-invalid');
            isvalid = false;
        }
    }

    if(!validateEmail($('#business_email').val())){
        $('#business_email').addClass('input-invalid');
        isvalid = false;
    }
    if(!validateEmail($('#poc_email').val())){
        $('#poc_email').addClass('input-invalid');
        isvalid = false;
    }

    return isvalid;
}


function reset_validation(){
    $.each($('#wholesalerForm').find('input'), function(){
        if($(this).attr('type')!='file'){
            $(this).removeClass('input-invalid');
        }
    });
}


Wholesaler.prototype.add_update = function(event){
    if(!validation()){
        this.notification('error', 'Please provide all the required information (*)');
        return false;
    }

    var wholesaler_id = $(this.DOMStrings.wholesaler_id).val();
    var url = (wholesaler_id=='')? '/add-wholesaler' : `/update-wholesaler/${wholesaler_id}` ;
    var self = this;
    var formData = new FormData($(this.DOMStrings.wholesalerForm)[0]);
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
        },
        url: url,
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(e){
            var result = JSON.parse(e);
            if(result.status=='username_exists'){
                self.notification('error', result.data);
                $(self.DOMStrings.form.username).addClass('input-invalid');
            }
            if(result.action=='add' && result.status=='success'){
                self.add_wholesaler(result);
                reset_validation();
            }
            if(result.action=='update' && result.status=='success'){
                self.update_wholesaler(result);
                reset_validation();
            }
        },
        error: function(err) {
            self.notification('error', 'Failed to add Wholesaler at the moment');
            if (err.status == 422) {
                $.each(err.responseJSON.errors, function(i, error) {
                    var el = $(document).find('[name="' + i + '"]');
                    el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                });
            }
        }
    });
}

Wholesaler.prototype.add_wholesaler = function(result){
    this.wholesalers.push(result.data);
    var html = this.listing_wholesaler_html(result.data);
    $(this.DOMStrings.listTableBody).append(html);
    this.notification('success', 'Wholesaler have been added successfully');
    this.clear_form();
    $('.dropify-clear').click();
    $(`#row-${result.data.id}`).find('.edit-btn').on('click', this.open_form_modal.bind(this));
    $(`#row-${result.data.id}`).find('.delete-btn').on('click', this.delete_wholesaler.bind(this));
}

Wholesaler.prototype.update_wholesaler = function(result){
    var html = this.listing_wholesaler_html(result.data);
    $(`#row-${result.data.id}`).replaceWith(html);
    var index = this.wholesalers.findIndex(element=>element.id==result.data.id);
    this.wholesalers[index] = result.data;
    this.clear_form();
    $('.dropify-clear').click();
    $(`#row-${result.data.id}`).find('.edit-btn').on('click', this.open_form_modal.bind(this));
    $(`#row-${result.data.id}`).find('.delete-btn').on('click', this.delete_wholesaler.bind(this));
    $(this.DOMStrings.wholesaler_id).val('');
    $('.overlay-for-sidebar').click();
    this.notification('success', 'Wholesaler have been updated successfully');
}

Wholesaler.prototype.delete_wholesaler = function(event){
    var el = $(event.currentTarget);
    var wholesalerId = el.attr('wholesaler');
    var index = this.wholesalers.findIndex(element => element.id==wholesalerId);
    // delete this.wholesalers[index];
    this.wholesalers.splice(index, 1);
    var self = this;
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
        },
        url: `/delete-wholesaler/${wholesalerId}`,
        type: 'DELETE',
        success: function(result) {
            self.notification('success', 'Wholesaler deleted successfully');
        },
        error: function(err) {
            self.notification('error', 'Failed to delete Wholesaler at the moment');
            if (err.status == 422) {
                $.each(err.responseJSON.errors, function(i, error) {
                    var el = $(document).find('[name="' + i + '"]');
                    el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                });
            }
        }
    });
    $(`#row-${wholesalerId}`).remove();
}

Wholesaler.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $(this.DOMStrings.notifDiv);
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

Wholesaler.prototype.open_form_modal = function(event){
    if(event.currentTarget.classList.contains(this.DOMStrings.edit_btn.replace('.', ''))){
        this.set_form('edit', event);
    }

    if(event.currentTarget.classList.contains(this.DOMStrings.add_button.replace('.', ''))){
        this.set_form('add', event);
    }
}

Wholesaler.prototype.set_form = function(type, event){
    (type=='add')? this.clear_form(event) : this.edit_form(event) ;
    openSidebar();
    reset_validation();
}

Wholesaler.prototype.clear_form = function(){
    var form = this.DOMStrings.form;
    Object.values(form).forEach(element => {
        $(element).val('');
        $(element).focus();
        $(element).blur
    });
    $(form.business_country).val('0');
    $(form.business_country).trigger('change');
    $(form.business_name).focus();
    $(form.business_name).blur();

    $(this.DOMStrings.wholesaler_id).val('');
    var self = this;
    setTimeout(function(){
        $(self.DOMStrings.form.username).val('');
        $(self.DOMStrings.form.password).val('');
    }, 1000);


    this.set_dropify();
}

Wholesaler.prototype.edit_form = function(event){
    $(this.DOMStrings.dropifyImgDiv).empty();
    $(this.DOMStrings.dropifyImgDiv).append('<input type="file" name="picture" id="picture" />');

    var el, wholesalerId, wholesaler;
    el = $(event.currentTarget);
    wholesalerId = el.attr('wholesaler');
    wholesaler = this.wholesalers.filter(e=>e.id==wholesalerId);
    wholesaler = wholesaler[0];

    self = this;
    $.each($(this.DOMStrings.wholesalerForm).find('input'), function(){
        if($(this).attr('type')!='file' && $(this).attr('type')!='password' && $(this).attr('name')!='_token'){
            $(this).val(wholesaler[$(this).attr('name')]);
            $(this).focus();
            $(this).blur();
        }
    });

    $(this.DOMStrings.form.password).val('');

    $(this.DOMStrings.form.business_country).val(wholesaler.business_country);
    $(this.DOMStrings.form.business_country).trigger('change');

    $('#picture').attr("data-height", '100px');
    $('#picture').attr("data-default-file", wholesaler.picture);
    $('#picture').dropify();

    var contactInfo = JSON.parse(wholesaler.contact_information),
        business_email = contactInfo.email.filter(el=>el.type=='business'),
        business_phone = contactInfo.phone.filter(el=>el.type=='business'),
        poc_email = contactInfo.email.filter(el=>el.type=='poc'),
        poc_phone = contactInfo.phone.filter(el=>el.type=='poc');

    business_email = business_email[0].value;
    business_phone = business_phone[0].value;
    poc_email = poc_email[0].value;
    poc_phone = poc_phone[0].value;

    $(this.DOMStrings.form.business_phone).val(business_phone);
    $(this.DOMStrings.form.business_phone).focus();
    $(this.DOMStrings.form.business_phone).blur();

    $(this.DOMStrings.form.poc_phone).val(poc_phone);
    $(this.DOMStrings.form.poc_phone).focus();
    $(this.DOMStrings.form.poc_phone).blur();

    $(this.DOMStrings.form.business_email).val(business_email);
    $(this.DOMStrings.form.business_email).focus();
    $(this.DOMStrings.form.business_email).blur();

    $(this.DOMStrings.form.poc_email).val(poc_email);
    $(this.DOMStrings.form.poc_email).focus();
    $(this.DOMStrings.form.poc_email).blur();

    $(this.DOMStrings.form.business_name).val(wholesaler.business_name);
    $(this.DOMStrings.form.business_name).focus();
    $(this.DOMStrings.form.business_name).blur();

    $(this.DOMStrings.wholesaler_id).val(wholesaler.id);
}

Wholesaler.prototype.set_dropify = function(){
    var el = $(this.DOMStrings.dropifyImgDiv);
    el.empty();
    el.append('<input type="file" name="picture" id="picture" />');
    $(this.DOMStrings.picture).dropify();
}

var wholesaler = new Wholesaler();
wholesaler.init();
