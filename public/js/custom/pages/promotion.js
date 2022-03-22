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

                $("#promotionSettingForm").show();
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

$("#tblLoader").hide();
$("#promotionpageSettingForm").show();


function submitForm(){
    $("#tblLoader").show();
    $("#promotionpageSettingForm").hide();
    var formData = new FormData($(`#promotionpageSettingForm`)[0]);
    http('POST', 'update-promotion-settings', formData).then((e)=>{
        $("#tblLoader").hide();
        $("#promotionpageSettingForm").show();
        notification('success', 'Promotion page setting updated successfully.');
        setTimeout(() => {
            location.reload();
        }, 2000);
    });
}

var dropifyUpload = $(".dropify-promotionpage").dropify();
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
    $("#promotionSettingForm").hide();

    var id = $("#banner-delete-id").val();
    var url = $("#banner-delete-url").val();

    var formData = new FormData();
    formData.append('url', url);

    $("#deleteBanner").modal("hide");

    http('POST', '/delete-promotion-image', formData).then((e)=>{
        deleteRequest = true;
        $(`#${id}`).next('button').trigger("click");
        $("#tblLoader").hide();
        $("#promotionSettingForm").show();
    });
}

function add_promotion_section(){
    var counter = $("#counter").val();
    var promotion_section_title = $("#promotion-list-section-input");
    var promotion_section_select = $("#promotion-list-section-select");
    var promotion_type = promotion_section_select.find('option:selected').attr('type');
    if(promotion_section_title.val()=='' || promotion_section_select.val()==''){
        notification('error', 'Please fill all information');
        return false;
    }
    counter = parseInt(counter);
    var html = `<div class="sortable-moves">
        <div class="col-12">
            <div class="alert alert-secondary fade show" role="alert">
                <div class="row">
                    <div class="col-5"><strong>Title: </strong> ${promotion_section_title.val()} <input type="hidden" value="${promotion_section_title.val()}" name="promotion_section_title[]"></div>
                    <div class="col"><strong>Type:</strong> ${promotion_type}<input type="hidden" value="${promotion_section_select.val()}" name="promotion_section_id[]"></div>
                    <div class="col-auto">
                        <div class="custom-control custom-checkbox mr-sm-2 PageCheckbox float-right font13">
                            <input type="checkbox" name="promotion_section_is_active[]" class="custom-control-input" value="1" id="deals_is_active-${counter}" checked="">
                            <label class="custom-control-label" for="deals_is_active-${counter}">Show on page</label>
                        </div>
                    </div>
                    <div class="col-auto"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <i class="fa fa-trash-alt"></i> </button></div>
                </div>
            </div>
        </div>
    </div>`;
    $("#sortable").append(html);
    promotion_section_title.val('');
    promotion_section_select.val('').trigger("change");
    $("#counter").val(counter+1);
}

$(document).ready(function() {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
});
