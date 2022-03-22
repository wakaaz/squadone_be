function Organization(){

}

Organization.prototype.http = function(type, url, formData){
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
                $("#organizationForm").show();
                $("#tblLoader").hide();
            }
        });
    });
}

Organization.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

Organization.prototype.check_validation = function(el, type=null){
    var result = true;
    var inputs = (type)? el.find('.required') : el.find('input, select, textarea') ;

    $.each(inputs, function(k, e){
        if($(e).hasClass('required')){
            if($(e).attr('type')!='file' && $(e).val()==''){
                $(e).addClass('input-error');
                if($(e)[0].localName=='select'){
                    $(e).next().find('.select2-selection').addClass('input-error');
                }
                result = false;
            }
        }
    });
    return result
}

Organization.prototype.set_store_html = function(store){
    var html = `<tr id="store-row-${store.id}">
        <td>${store.address} <input type="hidden" name="store_address[]" value="${store.address}"></td>
        <td>${store.phone} <input type="hidden" name="store_phone[]" value="${store.phone}"></td>
        <td>${store.postal_code} <input type="hidden" name="store_postal_code[]" value="${store.postal_code}"></td>
        <td>${store.lat} <input type="hidden" name="store_lat[]" value="${store.lat}"></td>
        <td>${store.lon} <input type="hidden" name="store_lon[]" value="${store.lon}"></td>
        <td><button type="button" class="btn smBTN red-bg" onclick="delete_store(${store.id})">Delete</button></td>
    </tr>`;
    $(`#storeLocationsArea`).append(html);
}

var organization = new Organization();

function add_more_store(){
    if(!$("#collapsePOCdetail").hasClass('show')){
        $('#collapsePOCdetail').collapse("show");
        return false;
    }
    var validationInputs = ["#store_phone", "#store_postal_code", "#store_address", "#store_lat", "#store_lon"];
    var is_valid = true;
    validationInputs.forEach(element => {
        if($(element).val()==''){
            organization.notification('error', 'Please provide all the required information (*)');
            is_valid = false;
        }
    });
    if(!is_valid) return false;

    var counter = parseInt($(`#counter`).val());

    var store = {
        id: counter,
        phone: $(`#store_phone`).val(),
        postal_code: $(`#store_postal_code`).val(),
        address: $(`#store_address`).val(),
        lat: $(`#store_lat`).val(),
        lon: $(`#store_lon`).val()
    };
    organization.set_store_html(store);
    $(`#counter`).val(counter+1);
    $('#collapsePOCdetail').collapse("hide");

    $.each($(`#store_location_from_div`).find('input'), function(){
        $(this).val('');
    });
}

function delete_store(id){
    $(`#store-row-${id}`).remove();
}

function close_add_more_store(){
    $('#collapsePOCdetail').collapse("hide");
}

function submit_form(){
    $("#organizationForm").hide();
    $("#tblLoader").show();
    if(!organization.check_validation($("#organizationForm"))){
        organization.notification('error', 'Please provide all the required information (*)');
        return false;
    }
    var formData = new FormData($(`#organizationForm`)[0]);
    organization.http('POST', 'organization/store', formData).then((e)=>{
        organization.notification('success', 'You have updated organization detail successfully.');
        $("#organizationForm").show();
        $("#tblLoader").hide();
    });
}

$("#organizationForm").hide();
$("#tblLoader").show();
organization.http('GET', '/get-organization-detail', {}).then((e)=>{
    $('#dropifyImgDiv').empty();
    $('#dropifyImgDiv').append('<input type="file" name="logo" id="logo" />');
    if(e=='not-added'){
        $("#organizationForm").show();
        $("#tblLoader").hide();
        $(`#logo`).dropify();
        return false;
    }else{
        var data = JSON.parse(e);
        $(`#name`).val(data.name);
        $(`#phone`).val(data.phone);
        $(`#email`).val(data.email);
        $(`#registration_number`).val(data.registration_number);
        $(`#vat_number`).val(data.vat_number);
        $(`#postal_code`).val(data.postal_code);
        $(`#address`).val(data.address);
        $.each($(`#organizationForm`).find('input'), function(e){
            $(this).blur();
            $(this).focus();
        });

        if(data.logo!=''){
            $('#logo').attr("data-height", '100px');
            $('#logo').attr("data-default-file", data.logo);
        }

        if(data.store_locations!=''){
            var store_locations = JSON.parse(data.store_locations);
            store_locations.forEach(store => {
                var counter = parseInt($('#counter').val());
                store.id = counter;
                organization.set_store_html(store);
                $('#counter').val(counter+1);
            });
        }
    }
    $(`#logo`).dropify();
    $("#organizationForm").show();
    $("#tblLoader").hide();
});
