$("#tblLoader").hide();
$(".body").show();
$(".listTable").dataTable();

function open_delete_modal(id){
    $("#promotion-delete-id").val(id);
    $("#deletePromotion").modal('show');
}

function delete_promotion(){
    var id = $("#promotion-delete-id").val();
    $("#tblLoader").show();
    $(".body").hide();
    $("#deletePromotion").modal('hide');
    $(`#row-${id}`).remove();
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
        },
        url: `/delete-promotion/${id}`,
        type: 'DELETE',
        cache: false,
        contentType: false,
        processData: false,
        data: {},
        success: function(e){
            $("#tblLoader").hide();
            $(".body").show();
            notification('success', 'You have deleted a promotion successfully.');
            setTimeout(function(){ location.reload(); }, 500);
        },
        error: function(err) {
            if (err.status == 422 || err.status == 500) {
                notification('error', 'Some Error Occured, please try again.');
            }
            $(".body").show();
            $("#tblLoader").hide();
        }
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


function open_restore_confim_modal(id){
    $("#promotion-restore-id").val(id);
    $("#restorePromotion").modal('show');
}


function restore_promotion(){
    var id = $("#promotion-restore-id").val();
    $("#restorePromotion").modal('hide');
    $("#tblLoader").show();
    $(".body").hide();
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
        },
        url: `/restore-promotion/${id}`,
        type: 'GET',
        cache: false,
        contentType: false,
        processData: false,
        data: {},
        success: function(e){
            $("#tblLoader").hide();
            $(".body").show();
            notification('success', 'You have restore a promotion successfully.');
            setTimeout(function(){ location.reload(); }, 500);
        },
        error: function(err) {
            if (err.status == 422 || err.status == 500) {
                notification('error', 'Some Error Occured, please try again.');
            }
            $(".body").show();
            $("#tblLoader").hide();
        }
    });
}
