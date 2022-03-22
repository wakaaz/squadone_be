var urlSettings = null;
var http = function(type, url, formData){
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

                $("#homepageSettingForm").show();
                $("#tblLoader").hide();
            }
        });
    });
}


var notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

// $("#tblLoader").hide();
// $("#homepageSettingForm").show();


function submitForm(){
    $("#tblLoader").show();
    $("#homepageSettingForm").hide();
    var formData = new FormData($(`#homepageSettingForm`)[0]);
    http('POST', 'update-homepage-settings', formData).then((e)=>{
        $("#tblLoader").hide();
        $("#homepageSettingForm").show();
        notification('success', 'Homepage setting updated successfully.');
        setTimeout(() => {
            location.reload();
        }, 2000);
    });
}

var dropifyUpload = $(".dropify-homepage").dropify();
var deleteRequest = false;

dropifyUpload.on('dropify.beforeClear', function (event, el) {
    var url = $(el.element).attr('data-default-file');
    var id = $(el.element).attr('id');
    $("#banner-delete-id").val(id);
    $("#banner-delete-url").val(url);
    if(deleteRequest){
        $("#deleteBanner").modal("hide");
        deleteRequest = false;
        return true;
    }else{
        $("#deleteBanner").modal("show");
        return false;
    }
});

function delete_banner(){
    $("#tblLoader").show();
    $("#homepageSettingForm").hide();

    var id = $("#banner-delete-id").val();
    var url = $("#banner-delete-url").val();

    var formData = new FormData();
    formData.append('url', url);

    $("#deleteBanner").modal("hide");

    http('POST', '/delete-homepage-image', formData).then((e)=>{
        deleteRequest = true;
        $(`#${id}`).next('button').trigger("click");
        $("#tblLoader").hide();
        $("#homepageSettingForm").show();
    });
}


http('GET', '/get-all-product-for-page-setting', {}).then((e)=>{
    urlSettings = JSON.parse(e);
    $("#tblLoader").hide();
    $("#homepageSettingForm").show();
});

$(".urlSelect").select2();


$(document).ready(function(){
    $(".urlRadio").on("change", function(e){
        var module = $(this).attr('module');
        var urltype = $(this).attr('urltype');
        var res = urlSettings[urltype];

        $(`#${module}URLSelect`).select2('destroy');
        $(`#${module}URLSelect`).html('');

        $(`#${module}URLSelect`).append(`<option value="">Select Option</option>`);
        res.forEach(element => {
            $(`#${module}URLSelect`).append(`<option value="${element.url}">${element.name}</option>`);
        });
        $(`#${module}URLSelect`).select2();
        $(`#${module}URLSelectArea`).show();
    });

    $(".urlSelect").on("change", function(e){
        var module = $(this).attr('module');
        var url = $(this).val();
        $(`#${module}URLInput`).val(url);
    });
});
