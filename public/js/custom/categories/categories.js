


var lastOp = "";
var all_main_cat = [];
var all_sub_cat = [];
var all_assignments = [];
var all_properties = [];
var deleteRef = '';
var base_url;
var propsSelect2Setting = {
    tags: true,
    createTag: function (newTag) {
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
var property_green_label = $("#property_green_label").select2(propsSelect2Setting);
var property_below_name = $("#property_below_name").select2(propsSelect2Setting);
var sub_cat_property = $("#sub_cat_property").select2(propsSelect2Setting);
var sub_cat_attribute = $("#sub_cat_attribute").select2();

$(document).ready(function () {

    var segments = location.href.split('/');
    var action = segments[3];
    if (action == "SubCategories") {
        fetchSubCategories();
    } else if (action == 'Categories') {
        fetchMainCategories();
    } else if (action == 'attr_assignment') {
        fetchAssignments();
    } else if (action == 'properties') {
        fetchProperties();
    }

    $(document).on('click', '.openDataSidebarForAddingSubCat', function () {

        $('.dz-image-preview').remove();
        $('#saveSubCatForm').trigger('reset');
        $('.dz-default').show();
        $('#categoryThumbnail').empty();
        $('#categoryThumbnail').html(`<input type="file" id="image_for_sub_category" name="thumbnail" placeholder="Drop Image Here">`);
        $('#image_for_sub_category').dropify({
            messages: {
                'default': 'Add Thumbnail'
            }
        });
        $('#mobile_banner').empty();
        $('#mobile_banner').html(`<input type="file" id="image_for_mobile_banner" name="mobile_background" placeholder="Drop Image Here">`);
        $('#image_for_mobile_banner').dropify({
            messages: {
                'default': 'Add Mobile Background'
            }
        });
        $('#desktop_banner').empty();
        $('#desktop_banner').html(`<input type="file" id="image_for_desktop_banner" name="desktop_background" placeholder="Drop Image Here">`);
        $('#image_for_desktop_banner').dropify({
            messages: {
                'default': 'Add Desktop Background'
            }
        });
        $('#tab_banner').empty();
        $('#tab_banner').html(`<input type="file" id="image_for_tab_banner" name="tab_background" placeholder="Drop Image Here">`);
        $('#image_for_tab_banner').dropify({
            messages: {
                'default': 'Add Tab Background'
            }
        });
        if (lastOp == "update") {
            $('input[name="category_name"]').val("");
            $('input[name="category_name"]').blur();
        }
        $('#key-feature-area').empty();
        lastOp = 'add';

        if ($('#saveMainCatForm input[name="_method"]').length) {
            $('#saveMainCatForm input[name="_method"]').remove();
        }


        main_category_id.select2('destroy');
        main_category_id.val(0);
        main_category_id.select2();
        // assign_select_values(main_category_id, 0);

        property_green_label.select2('destroy');
        property_green_label.val(0);
        property_green_label.select2(propsSelect2Setting);
        // assign_select_values(property_green_label, 0);

        property_below_name.select2('destroy');
        property_below_name.val(0);
        property_below_name.select2(propsSelect2Setting);
        // assign_select_values(property_below_name, 0);

        sub_cat_property.select2('destroy');
        sub_cat_property.val(0);
        sub_cat_property.select2(propsSelect2Setting);
        // assign_select_values(sub_cat_property, 0);

        sub_cat_attribute.select2('destroy');
        sub_cat_attribute.val(0);
        sub_cat_attribute.select2();
        // assign_select_values(sub_cat_attribute, 0);

        // $('[name="main_category_id"]').val(0).trigger('change');
        // $('[name="sub_cat_property"]').val('-1').trigger('change');
        // $('[name="sub_cat_attribute"]').val('-1').trigger('change');

        $('#SubCategorySummernote').summernote('code', ``);

        $('input[id="operation"]').val('add');
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForAddingMainCat', function () {
        $('input[name="main_cat_id"]').val("");

        $('.dz-image-preview').remove();
        $('.dz-default').show();
        if (lastOp == "update") {
            $('input[name="category_name"]').val("");
            $('input[name="thumbnail_background_color"]').val("");
            $('input[name="category_name"]').blur();
            $('input[name="thumbnail_background_color"]').blur();
        }
        lastOp = 'add';

        if ($('#saveMainCatForm input[name="_method"]').length) {
            $('#saveMainCatForm input[name="_method"]').remove();
        }

        $('input[id="operation"]').val('add');


        $('#categoryThumbnail').empty()
        $('#categoryThumbnail').append('<input type="file" name="thumbnail" id="thumbnail" />');
        $('#thumbnail').dropify({
            messages: {
                'default': 'Add Thumbnail'
            }
        });
        $('#desktop_banner').empty()
        $('#desktop_banner').append('<input type="file" name="desktop_banner" id="d_banner" />');
        $('#d_banner').dropify({
            messages: {
                'default': 'Add Desktop Background'
            }
        });
        $('#mobile_banner').empty()
        $('#mobile_banner').append('<input type="file" name="mobile_banner" id="m_banner" />');
        $('#m_banner').dropify({
            messages: {
                'default': 'Add Mobile Background'
            }
        });
        $('#tab_banner').empty()
        $('#tab_banner').append('<input type="file" name="tab_banner" id="t_banner" />');
        $('#t_banner').dropify({
            messages: {
                'default': 'Add Tab Background'
            }
        });


        $('#CategorySummernote').summernote('code', ``);

        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForAddingAssignment', function () {
        $('input[name="assignment_id"]').val("");

        if (lastOp == "update") {
            $('input[name="attr_value"]').val("");
            $('input[name="attr_value"]').blur();

            // $('select[name="attribute_id"]').val(0).trigger('change');
        }
        lastOp = 'add';

        $('input[id="operation"]').val('add');
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForAddingProperty', function () {
        $('input[name="property_id"]').val("");

        if (lastOp == "update") {
            $('input[name="property_name"]').val("");
            $('input[name="property_name"]').blur();

            // $('select[name="placement_id"]').val(0).trigger('change');
        }
        lastOp = 'add';
        $('#PropertyDescription').summernote('code', ``);
        $('input[id="operation"]').val('add');
        openSidebar();
    });




    $(document).on('click', '.openDataSidebarForUpdateSubCat', function () {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[id="sub_cat_id"]').val(id);
        var data = JSON.parse(JSON.stringify(all_sub_cat.find(x => x.id == id)));

        $('#dataSidebarLoader').hide();
        $('._cl-bottom').show();
        $('.pc-cartlist').show();

        $('input[name="category_name"]').focus();
        $('input[name="category_name"]').val(data.category_name);
        $('input[name="category_name"]').blur();

        $('input[name="title_tag"]').focus();
        $('input[name="title_tag"]').val(data.title_tag);
        $('input[name="title_tag"]').blur();


        main_category_id.select2('destroy');
        main_category_id.val(data.main_category_id);
        main_category_id.select2();
        // assign_select_values(main_category_id, data.main_category_id);
        property_green_label.select2('destroy');
        property_green_label.val(data.property_green_label);
        property_green_label.select2(propsSelect2Setting);
        // assign_select_values(sub_cat_attribute, attribute_ids);
        $(`input[name=is_active][value='${data.is_active}']`).prop("checked", true);
        var descriptionHtml = '<p></p>';
        if (data.description) {
            descriptionHtml = JSON.parse(data.description);
        }
        $('#SubCategorySummernote').summernote('code', `${descriptionHtml}`);

        $('#show_images').prop('checked', false);
        if (data.show_images) {
            $('#show_images').prop('checked', true);
        }
        base_url = $("#base_url").val();
        $('#categoryThumbnail').empty();
        $('#categoryThumbnail').html(`<input type="file" id="image_for_sub_category" name="thumbnail" placeholder="Drop Image Here" data-default-file="${base_url}${data.thumbnail}">`);
        $('#image_for_sub_category').dropify({
            messages: {
                'default': 'Add Thumbnail'
            }
        });
        $('#mobile_banner').empty();
        $('#mobile_banner').html(`<input type="file" id="image_for_mobile_banner" name="mobile_background" placeholder="Drop Image Here" data-default-file="${base_url}${data.desktop_background}">`);
        $('#image_for_mobile_banner').dropify({
            messages: {
                'default': 'Add Mobile Background'
            }
        });
        $('#desktop_banner').empty();
        $('#desktop_banner').html(`<input type="file" id="image_for_desktop_banner" name="desktop_background" placeholder="Drop Image Here" data-default-file="${base_url}${data.mobile_background}">`);
        $('#image_for_desktop_banner').dropify({
            messages: {
                'default': 'Add Desktop Background'
            }
        });
        $('#tab_banner').empty();
        $('#tab_banner').html(`<input type="file" id="image_for_tab_banner" name="tab_background" placeholder="Drop Image Here" data-default-file="${base_url}${data.tab_background}">`);
        $('#image_for_tab_banner').dropify({
            messages: {
                'default': 'Add Tab Background'
            }
        });
        if (data.seo) {
            var seo_data = JSON.parse(data.seo);
            $('input[name="seo_page_title"]').val(seo_data.page_title ? seo_data.page_title : "");
            $('input[name="seo_meta_tag_name"]').val(seo_data.meta_tag_name ? seo_data.meta_tag_name : "");
            $('input[name="seo_meta_keywords"]').text(seo_data.meta_keywords ? seo_data.meta_keywords : "");
            $('input[name="seo_meta_description"]').text(seo_data.meta_description ? seo_data.meta_description : "");
        }

        if (data.services) {
            if (data.services != "") {
                data.services = JSON.parse(data.services);
                var html = "";
                data.services.forEach((element, count) => {
                    html += `<div class="alert fade show alert-color _add-secon" role="alert" id="key-feature-1">${element}
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="remove_key_feature(${count})"> <span aria-hidden="true">×</span> </button>
                                <input type="hidden" value="${element}" name="key_features[]" id="key-feature-input-1">
                                </div>`;

                });
                $('#key-feature-area').empty();
                $('#key-feature-area').append(html);
            }
            if (data.services == "" || data.services == null) {
                $('#key-feature-area').empty();
            }
        }
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateMainCat', function () {
        $('#categoryThumbnail').empty()
        $('#categoryThumbnail').append('<input type="file" name="thumbnail" id="thumbnail"/>');

        $('#desktop_banner').empty()
        $('#desktop_banner').append('<input type="file" name="desktop_banner" id="d_banner" />');

        $('#mobile_banner').empty()
        $('#mobile_banner').append('<input type="file" name="mobile_banner" id="m_banner" />');

        $('#tab_banner').empty()
        $('#tab_banner').append('<input type="file" name="tab_banner" id="t_banner" />');



        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').hide();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="main_cat_id"]').val(id);

        if (!$('#saveMainCatForm input[name="_method"]').length) {
            $('#saveMainCatForm').append('<input name="_method" value="POST" hidden />');
        }
        var data = all_main_cat.find(x => x.id == id);
        $('._cl-bottom').show();
        $('.pc-cartlist').show();

        $('input[name="category_name"]').focus();
        $('input[name="category_name"]').val(data.category_name);
        $('input[name="category_name"]').blur();

        $('input[name="thumbnail_background_color"]').focus();
        $('input[name="thumbnail_background_color"]').val(data.thumbnail_background_color);
        $('input[name="thumbnail_background_color"]').blur();

        $('input[name="seo_page_title"]').val(JSON.parse(data.seo).page_title);
        $('input[name="seo_meta_tag_name"]').val(JSON.parse(data.seo).meta_tag_name);
        $("#seo_meta_keywords").val(JSON.parse(data.seo).meta_keywords);
        $("#seo_meta_description").val(JSON.parse(data.seo).meta_description);



        if (data.thumbnail) {
            var base_url = $("#base_url").val();
            var imgUrl = base_url + data.thumbnail;
            $("#thumbnail").attr("data-height", '100px');
            $("#thumbnail").attr("data-default-file", imgUrl);
        }
        $('#thumbnail').dropify({
            messages: {
                'default': 'Add Thumbnail'
            }
        });
        if (data.desktop_banner) {
            var desktop_banner = base_url + data.desktop_banner;
            $("#d_banner").attr("data-height", '100px');
            $("#d_banner").attr("data-default-file", desktop_banner);
        }
        $('#d_banner').dropify({
            messages: {
                'default': 'Add Desktop Background'
            }
        });
        if (data.mobile_banner) {
            var mobile_banner = base_url + data.mobile_banner;
            $("#m_banner").attr("data-height", '100px');
            $("#m_banner").attr("data-default-file", mobile_banner);
        }
        $('#m_banner').dropify({
            messages: {
                'default': 'Add Mobile Background'
            }
        });
        if (data.tab_banner) {
            var tab_banner = base_url + data.tab_banner;
            $("#t_banner").attr("data-height", '100px');
            $("#t_banner").attr("data-default-file", tab_banner);
        }
        $('#t_banner').dropify({
            messages: {
                'default': 'Add Mobile Background'
            }
        });


        var descriptionHtml = '<p></p>';
        if (data.description) {
            descriptionHtml = JSON.parse(data.description);
        }
        $('#CategorySummernote').summernote('code', `${descriptionHtml}`);

        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateAssignment', function () {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').hide();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="assignment_id"]').val(id);

        var data = all_assignments.find(x => x.id == id);
        $('._cl-bottom').show();
        $('.pc-cartlist').show();

        $('input[name="attr_value"]').focus();
        $('input[name="attr_value"]').val(data.value);
        $('input[name="attr_value"]').blur();

        $('select[name="attribute_id"]').val(data.attribute_id).trigger('change');

        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateProperty', function () {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').hide();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="property_id"]').val(id);

        var data = all_properties.find(x => x.id == id);
        $('._cl-bottom').show();
        $('.pc-cartlist').show();

        $('input[name="property_name"]').focus();
        $('input[name="property_name"]').val(data.name);
        $('input[name="property_name"]').blur();

        $('select[name="placement_id"]').val(data.placement).trigger('change');

        var descriptionHtml = '<p></p>';
        if (data.description) {
            descriptionHtml = JSON.parse(data.description);
        }
        $('#PropertyDescription').summernote('code', `${descriptionHtml}`);

        $('#IconArea').empty();
        $('#IconArea').html(`<label class="font12 mb-5">Add Picture</label>
        <div class="upload-pic"></div>
        <input type="file" id="input-file-icon" name="icon" class="dropify" data-default-file="${data.icon}" />`);
        $('#input-file-icon').dropify();

        openSidebar();
    });




    $(document).on('click', '#saveMainCat', function () {

        if (!$('input[name="category_name"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('#saveMainCat').attr('disabled', 'disabled');
        $('#cancelMainCat').attr('disabled', 'disabled');
        $('#saveMainCat').text('Processing..');

        var ajaxUrl = "/save-category";
        if ($('#operation').val() !== "add") {
            ajaxUrl = "/save-category/" + $('input[name="main_cat_id"]').val();
        }

        $('#saveMainCatForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#saveMainCatForm').serialize(),
            cache: false,
            success: function (response) {
                if (JSON.parse(response) == "success") {
                    fetchMainCategories();
                    $('#saveMainCat').removeAttr('disabled');
                    $('#cancelMainCat').removeAttr('disabled');
                    $('#saveMainCat').text('Save');
                    $('#pl-close').click();

                    $('#notifDiv').text('Category have been updated successfully');
                    if ($('#operation').val() !== "update") {
                        $('#saveMainCatForm').find("input[name='category_name']").val("");
                        $('#saveMainCatForm').find("select").val("0").trigger('change');
                        $('#notifDiv').text('Category have been added successfully');
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
            error: function (err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });

    });

    $(document).on('click', '#saveSubCat', function () {
        if (
            !$('input[name="category_name"]').val() ||
            !$('select[name="main_category_id"]').val()
        ) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('#saveSubCat').attr('disabled', 'disabled');
        $('#cancelSubCat').attr('disabled', 'disabled');
        $('#saveSubCat').text('Processing..');

        var ajaxUrl = "/SaveSubCategory";

        if ($('#operation').val() !== "add") {
            ajaxUrl = "/SaveSubCategory/" + $('input[id="sub_cat_id"]').val();
        }
        //check1
        $('#saveSubCatForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: {
                attr_ids: $('select[name="sub_cat_attribute"]').val(),
                prop_ids: $('select[name="sub_cat_property"]').val(),
                property_green_label: $('select[name="property_green_label"]').val(),
                property_below_name: $('select[name="property_below_name"]').val(),
                title_tag: $('select[name="title_tag"]').val(),
                is_active: $('select[name="is_active"]').val()
            },
            cache: false,
            success: function (response) {
                if (JSON.parse(response) == "success") {
                    fetchSubCategories();
                    $('#saveSubCat').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveSubCat').text('Save');
                    $('#pl-close').click();
                    $('#notifDiv').text('Category have been updated successfully');
                    if ($('#operation').val() !== "update") {
                        $('#saveSubCatForm').find("input[name='category_name']").val("");
                        $('#notifDiv').text('Category have been added successfully');
                        $('#pl-close').click();
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#saveSubCat').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveSubCat').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add category at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function (err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });

    });

    $(document).on('click', '#saveAssignment', function () {
        if (!$('input[name="attr_value"]').val() || !$('select[name="attribute_id"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        $('#cancelAssignment').attr('disabled', 'disabled');
        thisRef.text('Processing..');

        var ajaxUrl = "/save_assignment";
        // if ($('#operation').val() !== "add") {
        //     ajaxUrl = "/update_assignment/" + $('input[name="assignment_id"]').val();
        // }

        $('#saveAssignmentForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#saveAssignmentForm').serialize(),
            cache: false,
            success: function (response) {
                thisRef.removeAttr('disabled');
                $('#cancelAssignment').removeAttr('disabled');
                thisRef.text('Save');
                if (JSON.parse(response) == "success") {
                    fetchAssignments();
                    $('#notifDiv').text('Assignment have been updated successfully');
                    if ($('#operation').val() !== "update") {
                        $('#saveAssignmentForm').find("input[name='attr_value']").val("");
                        $('#saveAssignmentForm').find("select").val("0").trigger('change');
                        $('#notifDiv').text('Assignment have been added successfully');
                        $('#pl-close').click();
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else if (JSON.parse(response) == "already_exist") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Already Exist!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add assignment at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function (err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });

    });

    $(document).on('click', '#saveProperty', function () {
        if (!$('input[name="property_name"]').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please provide all the required information (*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        $('#cancelProperty').attr('disabled', 'disabled');
        thisRef.text('Processing..');

        var ajaxUrl = "/save_property";
        var formData = new FormData($('#savePropertyForm')[0]);


        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            success: function (response) {
                thisRef.removeAttr('disabled');
                $('#cancelProperty').removeAttr('disabled');
                thisRef.text('Save');
                if (JSON.parse(response) == "success") {
                    fetchProperties();
                    $('#notifDiv').text('Property have been updated successfully');
                    if ($('#operation').val() !== "update") {
                        $('#savePropertyForm').find("input[name='property_name']").val("");

                        $('select[name="placement_id"]').val(0).trigger('change');
                        $('#notifDiv').text('Property have been added successfully');
                        $('#pl-close').click();
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else if (JSON.parse(response) == "already_exist") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Already Exist!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add property at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function (err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            },
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
            },
        });



        // $('#savePropertyForm').ajaxSubmit({
        //     type: "POST",
        //     url: ajaxUrl,
        //     data: $('#savePropertyForm').serialize(),
        //     cache: false,
        //     success: function(response) {
        //         thisRef.removeAttr('disabled');
        //         $('#cancelProperty').removeAttr('disabled');
        //         thisRef.text('Save');
        //         if (JSON.parse(response) == "success") {
        //             fetchProperties();
        //             $('#notifDiv').text('Property have been updated successfully');
        //             if ($('#operation').val() !== "update") {
        //                 $('#savePropertyForm').find("input[name='property_name']").val("");

        //                 $('select[name="placement_id"]').val(0).trigger('change');
        //                 $('#notifDiv').text('Property have been added successfully');
        //                 $('#pl-close').click();
        //             }

        //             $('#notifDiv').fadeIn();
        //             $('#notifDiv').css('background', 'green');
        //             setTimeout(() => {
        //                 $('#notifDiv').fadeOut();
        //             }, 3000);
        //         } else if(JSON.parse(response) == "already_exist"){
        //             $('#notifDiv').fadeIn();
        //             $('#notifDiv').css('background', 'red');
        //             $('#notifDiv').text('Already Exist!');
        //             setTimeout(() => {
        //                 $('#notifDiv').fadeOut();
        //             }, 3000);
        //         }else {
        //             $('#notifDiv').fadeIn();
        //             $('#notifDiv').css('background', 'red');
        //             $('#notifDiv').text('Failed to add property at the moment');
        //             setTimeout(() => {
        //                 $('#notifDiv').fadeOut();
        //             }, 3000);
        //         }
        //     },
        //     error: function(err) {
        //         if (err.status == 422) {
        //             $.each(err.responseJSON.errors, function(i, error) {
        //                 var el = $(document).find('[name="' + i + '"]');
        //                 el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
        //             });
        //         }
        //     }
        // });

    });




    // $(document).on('click', '.delete_btn', function () {
    //     var id = $(this).attr('id');
    //     glob_type = $(this).attr('name');
    //     $('.confirm_delete').attr('id', id);
    //     $('.confirm_delete').attr('name', glob_type);
    //     deleteRef = $(this);
    //     $('#hidden_btn_to_open_modal').click();
    // });

    $(document).on('click', '.confirm_delete', function () {
        var id = $(this).attr('id');
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        var url = segments[3] == 'SubCategories' ? '/DelSubCat/' + id : (segments[3] == 'Categories' ? '/delete_category/' + id : (segments[3] == 'attr_assignment' ? '/DelAssignment/' + id : '/DelProperty/' + id));
        $.ajax({
            type: "get",
            url: url,
            success: function (response) {
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
function fetchMainCategories() {
    all_main_cat = [];
    $.ajax({
        type: 'GET',
        url: '/GetCategories',
        success: function (response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap mainCatsListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Image</th><th>Category</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.mainCatsListTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            all_main_cat = response;
            var base_url = $("#base_url").val();
            response.forEach(element => {
                var ImageHTMl = '';
                if (element.thumbnail) {
                    ImageHTMl = `<img src="${base_url + element.thumbnail}" width="50">`;
                }
                var text = element.status ? 'Deactive' : 'Active';
                $('.mainCatsListTable tbody').append('<tr><td>' + sNo++ + '</td><td>' + ImageHTMl + '</td><td>' + element['category_name'] + '</td><td><button type="button" id="category-status-btn-' + element['id'] + '" class="btn btn-default btn-line" onclick="change_category_status(' + element.id + ')">' + text + '</button><button id="' + element['id'] + '" class="btn btn-default btn-line openDataSidebarForUpdateMainCat">Edit</button><button type="button" id="' + element['id'] + '" class="btn btn-default red-bg delete_btn" title="Delete">Delete</button></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.mainCatsListTable').DataTable();
        }
    });
}

function change_category_status(id) {
    $.ajax({
        type: 'POST',
        url: '/categories/change-category-status',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
        },
        data: { id: id },
        success: function (e) {
            var d = JSON.parse(e);
            var text = d.status ? 'Deactive' : 'Active';
            var status = d.status ? 'Active' : 'Deactive';
            $(`#category-status-btn-${id}`).replaceWith(`<button type="button" id="category-status-btn-${id}" class="btn btn-default btn-line" onclick="change_category_status(${id})">${text}</button>`);
            $(`#dt-status-text-${id}`).text(status);
        }
    });
}

function fetchSubCategories() {
    var seg = location.href.split('/');
    let base_url = seg[0] + seg[2] + '/';
    all_sub_cat = [];
    $.ajax({
        type: 'GET',
        url: '/GetSubCategories',
        success: function (response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Category</th><th>Main Category</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.subCatsListTable tbody').empty();
            var sNo = 1;
            all_sub_cat = response;
            response.forEach(element => {
                $('.subCatsListTable tbody').append('<tr><td>' + sNo++ + '</td><td>' + element['category_name'] + '</td><td>' + element.main_category.category_name + '</td><td><button id="' + element['id'] + '" class="btn btn-default btn-line openDataSidebarForUpdateSubCat">Edit</button><button type="button" id="' + element['id'] + '" class="btn btn-default red-bg delete_btn" title="Delete">Delete</button></td></tr>');
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.subCatsListTable').DataTable();
        }
    });
}

function fetchAssignments() {
    all_assignments = [];
    $.ajax({
        type: 'GET',
        url: '/GetAssignments',
        success: function (response) {
            $('.body_assignment').empty();
            $('.body_assignment').append('<table class="table table-hover dt-responsive nowrap" id="AssignmentTable" style="width:100%;"><thead><tr><th>ID</th><th>Attribute Name</th><th>Value</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#AssignmentTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            all_assignments = response;
            response.forEach(element => {
                $('#AssignmentTable tbody').append(`<tr><td>${element['id']}</td><td>${element['attribute_name']}</td><td>${element['value']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateAssignment">Edit</button><button type="button" id="${element['id']}" class="btn btn-default red-bg delete_btn" name="attributes_assignment" title="Delete">Delete</button></td></tr>`);
            });
            $('#tblLoader').hide();
            $('.body_assignment').fadeIn();
            $('#AssignmentTable').DataTable();
        }
    });
}

function fetchProperties() {
    all_properties = [];
    $.ajax({
        type: 'GET',
        url: '/GetProperties',
        success: function (response) {
            $('.body_property').empty();
            $('.body_property').append('<table class="table table-hover dt-responsive nowrap" id="PropertyTable" style="width:100%;"><thead><tr><th>ID</th><th>Property Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#PropertyTable tbody').empty();
            var response = JSON.parse(response);
            var sNo = 1;
            all_properties = response;
            response.forEach(element => {
                $('#PropertyTable tbody').append(`<tr><td>${element['id']}</td><td>${element['name']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateProperty">Edit</button><button type="button" id="${element['id']}" class="btn btn-default red-bg delete_btn" name="property" title="Delete">Delete</button></td></tr>`);
            });
            $('#tblLoader').hide();
            $('.body_property').fadeIn();
            $('#PropertyTable').DataTable();
        }
    });
}

$(document).ready(function () {
    $('#categoryThumbnail').empty()
    $('#categoryThumbnail').append('<input type="file" name="thumbnail" id="thumbnail" />');
    $('#thumbnail').dropify({
        messages: {
            'default': 'Add Thumbnail'
        }
    });

    $('#desktop_banner').empty()
    $('#desktop_banner').append('<input type="file" name="desktop_background" id="d_banner" />');
    $('#d_banner').dropify({
        messages: {
            'default': 'Add Desktop Background'
        }
    });
    $('#mobile_banner').empty()
    $('#mobile_banner').append('<input type="file" name="mobile_background" id="m_banner" />');
    $('#m_banner').dropify({
        messages: {
            'default': 'Add Mobile Background'
        }
    });
    $('#tab_banner').empty()
    $('#tab_banner').append('<input type="file" name="tab_background" id="t_banner" />');
    $('#t_banner').dropify({
        messages: {
            'default': 'Add Tab Background'
        }
    });
});

function sub_cat_property_select(values) {
    var below_name = $("#property_below_name").val();
    var green_label = $("#property_green_label").val();
    if (values.indexOf(below_name) != -1) {
        values.splice(values.indexOf(below_name), 1);
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('This property is already added in Green Label OR Below Name.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
    }
    if (values.indexOf(green_label) != -1) {
        values.splice(values.indexOf(green_label), 1);
        $('#notifDiv').fadeIn();
        $('#notifDiv').css('background', 'red');
        $('#notifDiv').text('This property is already added in Green Label OR Below Name.');
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
    }
    sub_cat_property.select2('destroy');
    sub_cat_property.val(values);
    sub_cat_property.select2(propsSelect2Setting);
}

$(document).ready(function () {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
});




$(document).ready(function () {
    $('#CategorySummernote').summernote(SummerNoteSetting);
    $('#SubCategorySummernote').summernote(SummerNoteSetting);
    $('#PropertyDescription').summernote(SummerNoteSetting);
});

$('#image_for_sub_category').dropify();
function add_key_feature() {
    var counter, html, el, input;
    el = $("#key-feature-counter");
    input = $("#key-feature-input");
    counter = parseInt(el.val());
    html = `<div class="alert fade show alert-color _add-secon" role="alert" id="key-feature-${counter}">${input.val()}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="remove_key_feature(${counter})"> <span aria-hidden="true">×</span> </button>
        <input type="hidden" value="${input.val()}" name="key_features[]" id="key-feature-input-${counter}">
    </div>`;
    $(`#key-feature-area`).append(html);
    el.val(counter + 1);
    input.val('');
}
function remove_key_feature(id) {
    $(`#key-feature-${id}`).remove();
}