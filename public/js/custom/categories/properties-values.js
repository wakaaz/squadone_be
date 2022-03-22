function PropertiesValues(){
    this.data = [];
    this.datatable = null;
    this.update_id = null;
}

PropertiesValues.prototype.http = function(type, url, formData){
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

                $('#tblLoader').hide();
                $('.body').fadeIn();

                $('#saveProperty').removeAttr('disabled');
                $('#cancelProperty').removeAttr('disabled');
                $('#saveProperty').text('Save');
            }
        });
    });
}

PropertiesValues.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

PropertiesValues.prototype.reset_table = function(){
    this.destroy_datatable();
    if(this.data && this.data.length>0){
        this.set_values(this.data).then(()=>{
            this.set_datatable();
        });
    }else{
        this.set_datatable();
    }
}

PropertiesValues.prototype.set_values = function(data){
    $('#PropertyTable').find('tbody').html('');
    return new Promise(function(resolve, reject){
        var t = data.forEach(element => {
            $('#PropertyTable').find('tbody').append(`<tr><td>${element.id}</td><td>${(element.property)?element.property.name : ''}</td><td>${element.name}</td><td><button id="${element.id}" class="btn btn-default btn-line openDataSidebarForUpdateMainCat">Edit</button></td></tr>`);
        });
        resolve(t);
    });
}

PropertiesValues.prototype.set_datatable = function(){
    this.datatable = $("#PropertyTable").dataTable();
}

PropertiesValues.prototype.destroy_datatable = function(){
    if(this.datatable) this.datatable.fnDestroy();
}

var PV = new PropertiesValues();

PV.http('GET', '/get-properties-values', {}).then((e)=>{
    $('.body_property').empty();
    $('.body_property').append('<table class="table table-hover dt-responsive nowrap" id="PropertyTable" style="width:100%;"><thead><tr><th>ID</th><th>Property</th><th>Property Value</th><th>Action</th></tr></thead><tbody></tbody></table>');
    PV.data = JSON.parse(e);
    PV.reset_table();
    $('#tblLoader').hide();
    $('.body').fadeIn();
});


$(document).on('click', '.openDataSidebarForAddingProperty', function() {
    $('#dataSidebarLoader').hide();
    PV.update_id = null;
    $('input[name="name"]').val("");
    $('input[name="name"]').blur();
    openSidebar();
});
$(document).on('click', '.openDataSidebarForUpdateMainCat', function() {
    $('#dataSidebarLoader').hide();
    var id = $(this).attr('id');
    var propElement = PV.data.find(x=>x.id==id);
    if(propElement){
        $('#main_property_id').val((propElement.property)? propElement.property.id : '');
        $('#main_property_id').trigger('change');
        $('input[name="name"]').val(propElement.name);
        $('input[name="name"]').blur();
        $('input[name="name"]').focus();
        PV.update_id = propElement.id;

        $('#IconArea').empty();
        $('#IconArea').html(`<label class="font12 mb-5">Add Picture</label>
        <div class="upload-pic"></div>
        <input type="file" id="input-file-icon" name="icon" class="dropify" data-default-file="${propElement.icon}" />`);
        $('#input-file-icon').dropify();


        openSidebar();
    }else{
        PV.notification('error', 'Error occured, please refresh.');
    }
});

$(document).on('click', '#saveProperty', function(){
    if($('input[name=name]').val()==''){
        PV.notification('error', 'Please provide all the required information (*)');
        return false;
    }
    var formData = new FormData($('#savePropertyForm')[0]);
    if(PV.update_id){
        formData.append('id', PV.update_id);
    }


    $('#saveProperty').attr('disabled', 'disabled');
    $('#cancelProperty').attr('disabled', 'disabled');
    $('#saveProperty').text('Processing..');

    PV.http('POST', '/save-properties-values', formData).then((e)=>{
        if(e=='already_exists'){
            PV.notification('error', 'Property value already exists.');
            return;
        }
        if(PV.update_id){
            var index = PV.data.findIndex(x=>x.id==PV.update_id);
            PV.data[index] = JSON.parse(e);
            PV.notification('success', 'Property Value Updated Succesfully.');
        }else{
            PV.data.push(JSON.parse(e));
            PV.notification('success', 'Property Value Added Succesfully.');
        }
        PV.reset_table();
        $("#contentContainerDiv").click();

        $('#saveProperty').removeAttr('disabled');
        $('#cancelProperty').removeAttr('disabled');
        $('#saveProperty').text('Save');
    });
});


$("#main_property_id").select2();
