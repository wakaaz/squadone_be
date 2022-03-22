// const { indexOf } = require("lodash");

// const { get } = require("jquery");
var imagesDropZone = new Dropzone("#product-images-dropzone", {
    addRemoveLinks: true,
    // maxFiles: 4,
    acceptedFiles: 'image/*',
    // maxFilesize: 5,
    autoProcessQueue: false,
    removedfile: function (file) {
        var _ref;
        removeFileFromFilesOfArrayInDropzone(file);
        return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
    }
});
var operation = "";
var exhibition_id = null;
var base_url = window.location.origin;

fetchExhibitions();
function fetchExhibitions() {

    all_participations = [];
    $.ajax({
        type: 'GET',
        url: '/exhibitions',
        success: function (result) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;"><thead><tr><th>Start Date</th><th>End Date</th><th>Type</th><th>Participation</th><th>Country</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.subCatsListTable tbody').empty();
            var response = result;
            var sNo = 1;
            all_sub_cat = response;
            response.forEach(element => {
                $('.subCatsListTable tbody').append('<tr><td>' + element.start_date + '</td><td>' + element.end_date + '</td><td>' + element.event_type + '</td><td>' + element.participation.name + '</td><td>' + element.country + '</td><td><button onclick="getExhibitionToUpdate(' + element.id + ')" id="' + element.id + '" class="btn btn-default btn-line openSidebar">Edit</button><button onclick="deletExhibition(' + element.id + ')" type="button" id="' + element.id + '" class="btn btn-default red-bg delete_btn" title="Delete">Delete</button></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.subCatsListTable').DataTable();

        }
    });
}
function storeData(type, url) {


    if (

        $('#participation').val() == 0 ||
        $('#event_type').val() == 'select' ||
        $('#datepicker').val() == '' ||
        $('#country').val() == 'select'

    ) {
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('Please provide all the required information (*)');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return;
    }

    var formdata = new FormData();
    var participation_id = $('#participation').val();
    var event_type = $('#event_type').val();
    var country = $('#country').val();
    var timeSlots = [];
    var timeSlots = $('#time_slots_div_select').val();


    // var dateObj = new Date($('#datepicker').val());
    var dateObj = $('#datepicker').val();
    dateArr = dateObj.split("-");
    var startDate = dateArr[0];
    // startDate = startDate.replace("/", "-");
    // startDate = startDate.replace("/", "-");
    var endDate = dateArr[1];
    // endDate = endDate.replace("/", "-");
    // endDate = endDate.replace("/", "-");

    // formatiing date
    // var dateObj = new Date($('#datepicker').val());
    // var month = dateObj.getUTCMonth() + 1; //months from 1-12.
    // if(operation!="update"){
    //   var day = dateObj.getUTCDate() + 1;
    // }
    // if(operation == "update"){
    //   var day = dateObj.getUTCDate();
    // }
    // var year = dateObj.getUTCFullYear();
    // var newdate = year + "-" + month + "-" + day;

    formdata.append('participation_id', participation_id);
    formdata.append('event_type', event_type);
    formdata.append('country', country);


    if (timeSlots.length > 0) {
        timeSlots.forEach((i, k) => {
            formdata.append('time_slots[]', timeSlots[k]);
        });
    }

    formdata.append('start_date', startDate);
    formdata.append('end_date', endDate);

    if (imagesDropZone.files.length > 0) {
        imagesDropZone.files.forEach((i, k) => {
            formdata.append('images[]', imagesDropZone.files[k]);
        });
    }
    test = formdata;



    if ($('#save').text() == 'Update') {


        $.ajax({
            url: `/exhibitions/${exhibition_id}`,
            type: 'post',
            data: formdata,
            async: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
            },
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == "updated") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('record updated successfully');

                    $('#name').val("");
                    $('#description').val("");
                    $('#image').val(null);
                    $('.dropify-preview').attr('style', 'disply:none');
                }
            },

        });
        setTimeout(() => {
            $('#notifDiv').fadeOut(), 3000
        })
        $('#pl-close').click();
        fetchExhibitions();

        $('#save').text('Save');
        operation = "";
        emptyDropZone();
        $('#time_slots_div').hide()
        return;

    }
    if ($('#save').text() == 'Save') {
        emptyDropZone();


        $.ajax({
            url: url,
            type: type,
            data: formdata,
            async: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
            },
            contentType: false,
            processData: false,
            success: function (response) {
                if (!response) {


                    $('#participation').val(0).change();
                    $('#event_type').val('select').change();
                    $('#country').val('select').change();
                    $('#product-images-dropzone').empty();
                    $('#product-images-dropzone').text('drop files here');

                    $('#datepicker').val('');
                    $('.dropify-preview').attr('style', 'disply:none');
                }
            },

        });
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'green');
        $('#notifDiv').text('Exhibition added successfully');
        setTimeout(() => {
            $('#notifDiv').fadeOut(), 3000
        })
        $('#pl-close').click();
        fetchExhibitions();
        emptyDropZone();
    }
    $('#time_slots_div').hide()


}
// function getExhibitionToUpdate(id){

//   operation = "update";
//   exhibition_id = id;
//   $.ajax({
//     type: 'GET',
//     url: `/exhibitions/${id}`,
//     async:false,
//     success:function(responce){
//       console.log(responce);
//      var participation = JSON.parse(responce);
//       if(participation != ''){
//         var name = participation.name;

//         $('#product-images-dropzone').text("");
//           participation.images.forEach(element => {
//               $('#product-images-dropzone').append(`<img height="100" width="100" class = "mr-1" data-dz-thumbnail="" alt="" src="http://127.0.0.1:8000/./${element["full_path"]}">`);
//           });

//           document.querySelector('option[value="' + participation.exhibition.participation_id +'"]').selected = true;
//           $('#participation').select2({val:participation.exhibition.participation_id});
//           document.querySelector('option[value="' + participation.exhibition.event_type +'"]').selected = true;
//           $('#event_type').select2({val:participation.exhibition.event_type});
//           document.querySelector('option[value="' + participation.exhibition.country +'"]').selected = true;
//           $('#country').select2({val:participation.exhibition.country});





//           $('#datepicker').val(participation.exhibition.exhibition_date);

//           $('#save').text('Update');
//           openSidebar();
//       }
//     }

//   })
// }

////////////////////////
function getExhibitionToUpdate(id) {
    var base_url = window.location.origin;
    operation = "update";
    exhibition_id = id;
    $.ajax({
        type: 'GET',
        url: `/exhibitions/${id}`,
        async: false,
        success: function (responce) {
            var participation = JSON.parse(responce);
            if (participation != '') {
                var name = participation.name;

                $('#product-images-dropzone').text("");
                var productImages = $("#product-images-dropzone").html();
                $.each(participation.images, function (k, v) {
                    var productImage = v;
                    productImage.url = `${base_url + '/'}${v.full_path}`;
                    productImage.size = parseInt(v.file_size);
                    imagesDropZone.emit("addedfile", productImage);
                    imagesDropZone.emit("thumbnail", productImage, productImage.url);
                    imagesDropZone.files.push(productImage);
                });

                
                document.querySelector('option[value="' + participation.exhibition.participation_id + '"]').selected = true;
                $('#participation').select2({ val: participation.exhibition.participation_id });
                document.querySelector('option[value="' + participation.exhibition.event_type + '"]').selected = true;
                $('#event_type').select2({ val: participation.exhibition.event_type });
                document.querySelector('option[value="' + participation.exhibition.country + '"]').selected = true;
                $('#country').select2({ val: participation.exhibition.country });
                $('#datepicker').val(participation.exhibition.start_date + ' - ' + participation.exhibition.end_date);
                if (participation.exhibition.event_type == "Upcoming") {
                    $('#time_slots_div').show();
                    $('#time_slots_div_select').empty();


                    var optionsArray = [' <option value="9 to 12">9 to 12</option>', '  <option value="12 to 3">12 to 3</option>', '  <option value="3 to 6">3 to 6</option>'];
                    optionsArray.forEach((option, key) => {
                        if (participation.exhibition.time_slots && participation.exhibition.time_slots.length > 0 && option.includes(participation.exhibition.time_slots[key])) {
                            $('#time_slots_div_select').append(`<option selected value="${participation.exhibition.time_slots[key]}">${participation.exhibition.time_slots[key]}</option>`);
                        } else {
                            $('#time_slots_div_select').append(option);
                        }
                    })
                    $('#time_slots_div_select').fSelect();
                    //   (function($) {
                    //     $(function() {
                    //         window.fs_test = $('#time_slots_div_select').fSelect();
                    //     });
                    // })(jQuery);
                }
                $('#save').text('Update');
                openSidebar();
            }
        }

    });

}



//////////////////////
function deletExhibition(id) {
    $.ajax({
        type: 'GET',
        url: `/deletExhibition/${id}`,
        success: function (response) {
            var e = response;
            if (e == "deleted") {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('record deleted successfully');
                setTimeout(() => { $('#notifDiv').fadeOut(), 3000 })
            }
            fetchExhibitions();
        }
    })

}


$(document).ready(function () {
    $('#example').DataTable();

});


$(document).ready(function () {

    $('#pl-close, .overlay').on('click', function (e) {
        emptyDropZone();
        e.preventDefault();
        $('#product-cl-sec').removeClass('active');
        $('.overlay').removeClass('active');
        $('body').toggleClass('no-scroll')

        $('#participation').val(0).change();
        $('#event_type').val('select').change();
        $('#country').val('select').change();
        $('#product-images-dropzone').empty();
        $('#product-images-dropzone').text('');

        $('#datepicker').val('');
        $('.dropify-preview').attr('style', 'disply:none');
        $('#save').text('Save');
        $('#time_slots_div').hide();
        
    });
    $('#event_type').on('change', function () {
        var value = $('#event_type').val();
        if (value == "Upcoming") {
            $('#time_slots_div').show();
            (function ($) {
                $(function () {
                    window.fs_test = $('#time_slots_div_select').fSelect();
                });
            })(jQuery);

        }
        if (value == "Recent") {
            $('#time_slots_div').hide();
        }
    })

    $('#productlist01').on('click', function () {
        $('#product-cl-sec').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        $('body').toggleClass('no-scroll')
    });
    $('#save').on('click', function (e) {

        e.preventDefault();
        storeData('POST', '/exhibitions');
    })


});




$(document).ready(function () {
    $('#SN-close, .overlay-blure').on('click', function () {
        $('#_subNav-id').removeClass('active');
        $('#content-wrapper').removeClass('blur-div');
        $('body').removeClass('no-scroll')
        $('#name').val("");
        $('#description').val("");
        $('#image').val(null);
        $('.dropify-preview').attr('style', 'disply:none');
        $('#time_slots_div').hide()
        $('#save').text('Save');
    });
    $('#sidebar-menu').on('click', function () {
        $('#_subNav-id').addClass('active');
        $('#content-wrapper').addClass('blur-div');
        $('body').addClass('no-scroll')
    });
});


$('.form-control').on('focus blur', function (e) {
    $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
})
    .trigger('blur');
$(".formselect").select2();

$('.sd-type').select2({
    createTag: function (params) {
        var term = $.trim(params.term);

        if (term === '') {
            return null;
        }

        return {
            id: term,
            text: term,
            newTag: true // add additional parameters
        }
    }
});




// $('#tags').select2({
// 	tags: true,
//    // data: ["tag1","tag2"],
//     tokenSeparators: [','],
//     placeholder: "Add Tags",
//     /* the next 2 lines make sure the user can click away after typing and not lose the new tag */
//     selectOnClose: true,
//     closeOnSelect: false
// });
function removeFileFromFilesOfArrayInDropzone(file) {

    if (file.id) {
        $.ajax({
            url: `deletePhotoFromMedia/${file.id}`,
            type: 'GET',
            success: function (e) {

            }
        })
    }

}
function emptyDropZone() {
    if (imagesDropZone.files.length > 0) {
        while (imagesDropZone.files.length > 0) {
            imagesDropZone.files.pop();
        }
    }
}

$(function () {
    $('#datepicker').daterangepicker({
        format: 'yyyy-mm-dd'
    })

});
