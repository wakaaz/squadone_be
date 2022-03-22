var lastOp = "";
var all_main_cat = [];
var all_sub_cat = [];
var all_assignments = [];
var all_properties = [];
var deleteRef = '';
var propsSelect2Setting = {
    tags: true,
    createTag: function(newTag) {
        return {
            id: 'new:' + newTag.term,
            text: newTag.term + ' <strong style="">Add</strong>'
        };
    },
    insertTag: function (data, tag) {
        console.log('insert here');
        // Insert the tag at the end of the results
        data.push(tag);
    }
};
var main_category_id = $("#main_category_id").select2();


$(document).ready(function() {

    var segments = location.href.split('/');
    var action = segments[3];
    if (action == "ebrochures") {
        fetchMainBrochures();
    }

    $(document).on('click', '.openDataSidebarForAddingBrochure', function() {
        $('input[name="ebrochure_title"]').val("");

        $('#category_id').empty();
        fetchMainCat();

        $('.dz-image-preview').remove();
        $('.dz-default').show();
        if (lastOp == "update") {
            $('input[name="ebrochure_title"]').val("");
            $('input[name="ebrochure_title"]').blur();
        }
        lastOp = 'add';

        if ($('#saveMainCatForm input[name="_method"]').length) {
            $('#saveMainCatForm input[name="_method"]').remove();
        }

        $('input[id="operation"]').val('add');


        $('#ebrochureThumbnail').empty()
        $('#ebrochureThumbnail').append('<input type="file" name="ebrochurePDF" id="ebrochurePDF" accept="application/pdf"/>');
        $('#ebrochureThumbnail').dropify();

        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateBrochure', function() {
        var id = $(this).attr('id');
        $('#category_id').empty();
         fetchAssignCat(id);
        $('#ebrochureThumbnail').empty();
        //$('#category_id').empty();
        $('#ebrochureThumbnail').append('<input type="file" name="ebrochurePDF" id="ebrochurePDF" accept="application/pdf"/>');

        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').hide();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();


        $('input[name="main_cat_id"]').val(id);

        if (!$('#saveMainCatForm input[name="_method"]').length) {
            $('#saveMainCatForm').append('<input name="_method" value="PUT" hidden />');
        }
        var data = all_main_cat.find(x => x.id == id);
        //console.log(data);
        $('._cl-bottom').show();
        $('.pc-cartlist').show();

        $('input[name="ebrochure_title"]').focus();
        $('input[name="ebrochure_title"]').val(data.ebrochure_title);
        $('input[name="ebrochure_title"]').blur();

        if(data.ebroucher){
            var base_url = $("#base_url").val();
            var imgUrl = base_url + data.ebrochure;
            $("#ebrochureThumbnail").attr("data-height", '100px');
            $("#ebrochureThumbnail").attr("data-default-file", imgUrl);
        }
        $('#ebrochureThumbnail').dropify();
        openSidebar();
    });


    $(document).on('click', '#saveMainCat', function() {
        if (!$('input[name="ebrochure_title"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        if ($('#operation').val() == "add") {
            const file = document.getElementById('ebrochurePDF');
            // Check if any file is selected.
            if (!file.files.length > 0) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please upload file');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                return;
            }
        }


        $('#saveMainCat').attr('disabled', 'disabled');
        $('#cancelMainCat').attr('disabled', 'disabled');
        $('#saveMainCat').text('Processing..');

        var ajaxUrl = "/ebrochures";
        if ($('#operation').val() !== "add") {
            ajaxUrl = "/ebrochures/" + $('input[name="main_cat_id"]').val();
        }

        $('#saveMainCatForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#saveMainCatForm').serialize(),
            cache: false,
            success: function(response) {
                //console.log(response);
                if (JSON.parse(response) == "success") {
                    fetchMainBrochures();
                    $('#saveMainCat').removeAttr('disabled');
                    $('#cancelMainCat').removeAttr('disabled');
                    $('#saveMainCat').text('Save');

                    $('#notifDiv').text('Ebrochure have been updated successfully');
                    if ($('#operation').val() !== "update") {
                        $('#saveMainCatForm').find("input[name='ebrochure_title']").val("");
                        //$('#saveMainCatForm').find("select").val("0").trigger('change');
                        $('#notifDiv').text('Ebrochure have been added successfully');
                        $('#pl-close').click();
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#saveMainCat').removeAttr('disabled');
                    $('#cancelMainCat').removeAttr('disabled');
                    $('#saveMainCat').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add category at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function(err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function(i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });

    });


    $(document).on('click', '.delete_btn', function () {
        var id = $(this).attr('id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        $('.confirm_delete').attr('name', glob_type);
        deleteRef = $(this);
        $('#hidden_btn_to_open_modal').click();
    });

    $(document).on('click', '.confirm_delete', function() {
        var id = $(this).attr('id');
        var thisRef = $(this);

        thisRef.attr('disabled', 'disabled');
        var url = '/DelEbrochure/' + id;
        $.ajax({
            type: "POST",
            url: url,
            data: {
                _token: $('meta[name="csrf_token"]').attr('content'),
            },
            cache: false,
            success: function(response) {
                //console.log(response);return false;
                thisRef.removeAttr('disabled');
                if (response) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Deleted Successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    deleteRef.parent().parent().remove();
                    $('.cancel_delete_modal').click();
                } else {
                    document.write(response);
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to delete at this moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            }
        });
    });
});
$('#dataSidebarLoader').hide();
function fetchMainBrochures() {
    all_main_cat = [];
    $.ajax({
        type: 'GET',
        url: '/GetEbrochures',
        success: function(response) {

            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap mainCatsListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Title</th><th>Category</th><th>Status</th><th>PDF</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.mainCatsListTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            all_main_cat = response;

            var base_url = $("#base_url").val();


            response.forEach(element => {
                var ImageHTMl = '';
                if(element.ebrochure){
                    ImageHTMl = `<a href="${base_url+element.ebrochure}" target="_blank"><img src="images/pdf-icon-dz.png" alt="Image" width="20"/></a>`;
                    //ImageHTMl = `<img src="${base_url+element.ebrochure}" width="50">`;
                }
                var text = element.status? 'Deactive' : 'Active' ;
                var status = element.status? 'Active' : 'Deactive' ;

                var slug = (element.slug)? element.slug : '';
                $('.mainCatsListTable tbody').append('<tr><td>' + sNo++ + '</td><td>' + element['ebrochure_title'] + '</td><td>' + element['category_id'] + '</td><td><label class="label label-success" id="dt-status-text-'+element.id+'">'+status+'</label></td><td>'+ImageHTMl+'</td><td><button id="' + element['id'] + '" class="btn btn-default btn-line openDataSidebarForUpdateBrochure">Edit</button><button type="button" id="' + element['id'] + '" class="btn btn-default red-bg delete_btn" title="Delete">Delete</button></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.mainCatsListTable').DataTable();
        }
    });
}

function fetchMainCat(){

    var ajaxUrl = "/GetMainCat";
    $.ajax({
        type: 'GET',
        url: ajaxUrl,
        success: function(response) {
            var response = JSON.parse(response);
            response.forEach(element => {
                $('#category_id').append(`<option value="${element['id']}" readonly="readonly">${element['category_name']}</option>`);
            });
        }
    });
}
function fetchAssignCat(id){

    var ajaxUrl = "/GetAssignCat/" + id;
    $.ajax({
        type: 'GET',
        url: ajaxUrl,
        success: function(response) {
            var response = JSON.parse(response);
            response.forEach(element => {
                $('#category_id').append(`<option value="${element['category_id']}" readonly="readonly">${element['category_name']}</option>`);
            });
        }
    });
}

$( document ).ready(function() {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
  });
$('#input-file-icon').dropify();
