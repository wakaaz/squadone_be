function ShippingZone() {
    this.countries = [];
    this.zone = null;
    this.ListTable = null;
}

ShippingZone.prototype.http = function(type, url, formData){
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

ShippingZone.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

ShippingZone.prototype.set_datatable = function(){
    this.ListTable = $("#ListTable").find('table').dataTable();
}

ShippingZone.prototype.destroy_datatable = function(){
    if(this.ListTable) this.ListTable.fnDestroy();
}

ShippingZone.prototype.loader = function(action){
    if(action=='show'){
        $('#tblLoader').show();
    }else if(action=='hide'){
        $('#tblLoader').hide();
    }
}

ShippingZone.prototype.set_zone = function(){
    this.destroy_datatable();
    if(this.countries.length>0){
        this.countries.forEach(element => {
            $('#ListTableBody').append(`<tr>
                <td>${element.nicename}</td>
                <td id="country-td-${element.id}"><button type="button" class="btn btn-default btn-line mb-0" onclick="addZoneCountry(${element.id})">Add</button></td>
            </tr>`);
        });
    }

    this.set_datatable();
}

ShippingZone.prototype.set_zone_html = function(){
    if(!this.zone) return false;

    if(this.zone.detail.length>0){
        this.destroy_datatable();
        this.zone.detail.forEach(element => {
            addZoneCountry(element.country_id);
        });
        this.set_datatable();
    }
}

ShippingZone.prototype.init = function(){
    var self = this;
    var zone_id = $('input[name=zone_id]').val();
    var url = (zone_id)? `/GetShippingZoneData/${zone_id}` : `GetShippingZoneData` ;
    this.http('GET', url).then((e)=>{
        var data = JSON.parse(e);
        self.countries = data.countries;
        self.zone = data.zone;
        self.set_zone();
        self.set_zone_html();
    });
    this.loader('hide');
}


var shippingzone = new ShippingZone();
shippingzone.init();


function addZoneCountry(id){
    $(`#country-td-${id}`).replaceWith(`<td id="country-td-${id}"><button type="button" class="btn btn-default red-bg mb-0" onclick="removeZoneCountry(${id})">Remove</button><input type="hidden" name="country_id[]" value="${id}"></td>`);
}

function removeZoneCountry(id) {
    $(`#country-td-${id}`).replaceWith(`<td id="country-td-${id}"><button type="button" class="btn btn-default btn-line mb-0" onclick="addZoneCountry(${id})">Add</button></td>`);
}


function SubmitForm(){
    shippingzone.destroy_datatable();
    var name = $('#ZoneName').val();
    if(name==''){
        shippingzone.notification('error', 'Please Enter Zone Name.');
        return false;
    }
    var formData = new FormData($("#ShippingZoneForm")[0]);
    shippingzone.set_datatable();
    $.ajax({
        url: '/SaveShippingZone',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
        },
        success: function (e) {
            shippingzone.notification('success', 'Shipping zone added succesfully.')
            window.location = '/shipping-zones-list';
        }
    });
}
