var segments = location.href.split('/');
var last_operation = 'add';
var opp_name = '';

var all_attributes = [];
var all_properties = [];
var all_brands = [];

var glob_type = '';
var deleteRef = '';


$('#dataSidebarLoader').hide();
$(document).ready(function() {
    fetchAllData();

    $(document).on('click', '.openDataSidebarForAddingDesignation', function(){
        if(last_operation == 'update'){
            $('input[name="designation_name"]').val('');
            $('input[name="designation_name"]').blur();

            $('.custom_checkbox').prop('checked', false);
        }
        $('#opp_name').text('Designation');
        $('.designation_form_div').show();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();
        openSidebar();
        last_operation = 'add';
        opp_name = 'designation';
        $('#operation').val('add');
        $('#opp_name_input').val('designation');
    });

    $(document).on('click', '.openDataSidebarForAddingDepartment', function(){
        if(last_operation == 'update'){
            $('input[name="department_name"]').val('');
            $('input[name="department_name"]').blur();
        }
        $('#opp_name').text('Department');
        $('.designation_form_div').hide();
        $('.department_form_div').show();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();
        openSidebar();
        last_operation = 'add';
        opp_name = 'department';
        $('#operation').val('add');
        $('#opp_name_input').val('department');
    });

    $(document).on('click', '.openDataSidebarForAddingDocument', function(){
        if(last_operation == 'update'){
            $('input[name="document_type"]').val('');
            $('input[name="document_type"]').blur();
        }
        $('#opp_name').text('Document Type');
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').show();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();
        openSidebar();
        last_operation = 'add';
        opp_name = 'document';
        $('#operation').val('add');
        $('#opp_name_input').val('document');
    });

    $(document).on('click', '.openDataSidebarForAddingMainCat', function() {

        if (last_operation == "update") {
            $('input[name="category_name"]').val("");
            $('input[name="category_name"]').blur();
        }
        $('#opp_name').text('Main Category');
        last_operation = 'add';

        $('#operation').val('add');
        $('#opp_name_input').val('main_cat');
        $('#opp_name').text('Main Category');
        opp_name = 'main_cat';

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').show();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForAddingSubCat', function() {

        if (last_operation == "update") {
            $('input[name="sub_category_name"]').val("");
            $('input[name="sub_category_name"]').blur();

            $('#main_category_id').val('-1').trigger('change');
            $('[name="sub_cat_property"]').val('-1').trigger('change');
            $('[name="sub_cat_attribute"]').val('-1').trigger('change');
        }
        $('#opp_name').text('Sub Category');
        last_operation = 'add';
        opp_name = 'sub_cat';

        $('#operation').val('add');
        $('#opp_name_input').val('sub_cat');

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').show();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForAddingAttribute', function() {
        if (last_operation == "update") {
            $('input[name="attribute_name"]').val("");
            $('input[name="attribute_name"]').blur();

            $('input[name="coloumn_name"]').val("");
            $('input[name="coloumn_name"]').blur();

            $('select[name="placement_id"]').val(0).trigger('change')
        }
        $('#opp_name').text('Attribute');
        last_operation = 'add';
        opp_name = 'attributes';

        $('#operation').val('add');
        $('#opp_name_input').val('attributes');

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').show();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForAddingAssignment', function() {
        if (last_operation == "update") {
            $('select[name="attribute_id"]').val(-1).trigger('change');

            $('input[name="attribute_value"]').val("");
            $('input[name="attribute_value"]').blur();
        }
        $('#opp_name').text('Attribute Assignment');
        last_operation = 'add';
        opp_name = 'attributes_assignment';

        $('#operation').val('add');
        $('#opp_name_input').val('attributes_assignment');

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').show();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForAddingProperty', function() {
        if (last_operation == "update") {
            $('input[name="property_name"]').val("");
            $('input[name="property_name"]').blur();
        }
        $('#opp_name').text('Property');
        last_operation = 'add';
        opp_name = 'property';

        $('#operation').val('add');
        $('#opp_name_input').val('property');

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').show();
        $('.brands_form_div').hide();
        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForAddingBrand', function() {
        if (last_operation == "update") {
            $('input[name="brand_name"]').val("");
            $('input[name="brand_name"]').blur();
        }
        $('#opp_name').text('Brand');
        last_operation = 'add';
        opp_name = 'brand';

        $('#operation').val('add');
        $('#opp_name_input').val('brand');

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').show();

        $('#brandDescription').summernote('code', ``);

        var dropifyBrand = $('.dropifyBrand').dropify();
        dropifyBrand = dropifyBrand.data('dropify');
        dropifyBrand.resetPreview();
        dropifyBrand.clearElement();

        openSidebar();
    });



    $(document).on('click', '.openDataSidebarForUpdateDesignation', function(){
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();
        $('#opp_name').text('Designation');
        $('#opp_id').val(id);
        $('.custom_checkbox').prop('checked', false);
        openSidebar();
        last_operation = 'update';
        opp_name = 'designation';
        $('#operation').val('update');
        $('#opp_name_input').val('designation');
        $.ajax({
            type: 'GET',
            url: '/GetDesignation/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="designation_name"]').focus();
                $('input[name="designation_name"]').val(response.designation);
                $('input[name="designation_name"]').blur();

                if(response.designation_rights){
                    $('.custom_checkbox').each(function() {
                        if(JSON.parse(response.designation_rights).includes($(this).attr('id'))){
                            $(this).prop('checked', true);
                        }
                    });
                }

                $('.designation_form_div').show();
                $('.department_form_div').hide();
                $('.documentType_form_div').hide();
                $('.mainCat_form_div').hide();
                $('.subCat_form_div').hide();
                $('.attribute_form_div').hide();
                $('.attribute_assignment_form_div').hide();
                $('.properties_form_div').hide();
                $('.brands_form_div').hide();
            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdatedepartment', function(){
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();
        $('#opp_name').text('Department');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'department';
        $('#operation').val('update');
        $('#opp_name_input').val('department');
        $.ajax({
            type: 'GET',
            url: '/GetDepartment/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="department_name"]').focus();
                $('input[name="department_name"]').val(response.department);
                $('input[name="department_name"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').show();
                $('.documentType_form_div').hide();
                $('.mainCat_form_div').hide();
                $('.subCat_form_div').hide();
                $('.attribute_form_div').hide();
                $('.attribute_assignment_form_div').hide();
                $('.properties_form_div').hide();
                $('.brands_form_div').hide();
            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdatedocument', function(){
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();
        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();
        $('#opp_name').text('Document Type');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'document';
        $('#operation').val('update');
        $('#opp_name_input').val('document');
        $.ajax({
            type: 'GET',
            url: '/GetDocument/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="document_type"]').focus();
                $('input[name="document_type"]').val(response.document_name);
                $('input[name="document_type"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.documentType_form_div').show();
                $('.mainCat_form_div').hide();
                $('.subCat_form_div').hide();
                $('.attribute_form_div').hide();
                $('.attribute_assignment_form_div').hide();
                $('.properties_form_div').hide();
                $('.brands_form_div').hide();
            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdateMainCat', function() {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();

        $('#opp_name').text('Main Category');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'main_cat';
        $('#operation').val('update');
        $('#opp_name_input').val('main_cat');

        $.ajax({
            type: 'GET',
            url: '/Categories/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="category_name"]').focus();
                $('input[name="category_name"]').val(response.category_name);
                $('input[name="category_name"]').blur();

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.documentType_form_div').hide();
                $('.mainCat_form_div').show();
                $('.subCat_form_div').hide();
                $('.attribute_form_div').hide();
                $('.attribute_assignment_form_div').hide();
                $('.properties_form_div').hide();
                $('.brands_form_div').hide();
            }
        });
    });

    $(document).on('click', '.openDataSidebarForUpdateSubCat', function() {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').show();

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();

        $('#opp_name').text('Sub Category');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'sub_cat';
        $('#operation').val('update');
        $('#opp_name_input').val('sub_cat');

        $('[name="sub_cat_property"]').val(0).trigger('change');
        $('[name="sub_cat_attribute"]').val(0).trigger('change');

        $.ajax({
            type: 'GET',
            url: '/getSubCat/' + id,
            success: function(response) {
                var response = JSON.parse(response);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                $('input[name="sub_category_name"]').focus();
                $('input[name="sub_category_name"]').val(response.category_name);
                $('input[name="sub_category_name"]').blur();


                $('[name="main_category_id"]').val(response.main_category_id).trigger('change');
                $('[name="sub_cat_property"]').val(response.property_id ? response.property_id.split(',') : 0).trigger('change');
                $('[name="sub_cat_attribute"]').val(response.attribute_id ? response.attribute_id.split(',') : 0).trigger('change');

                $('.designation_form_div').hide();
                $('.department_form_div').hide();
                $('.documentType_form_div').hide();
                $('.mainCat_form_div').hide();
                $('.subCat_form_div').show();
                $('.attribute_form_div').hide();
                $('.attribute_assignment_form_div').hide();
                $('.properties_form_div').hide();
                $('.brands_form_div').hide();
            }
        });

        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateAttribute', function() {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').hide();

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').show();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();

        $('#opp_name').text('Attribute');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'attributes';
        $('#operation').val('update');
        $('#opp_name_input').val('attributes');

        var data = all_attributes.find(x => x.id == id);
        $('._cl-bottom').show();
        $('.pc-cartlist').show();

        $('input[name="attribute_name"]').focus();
        $('input[name="attribute_name"]').val(data.name);
        $('input[name="attribute_name"]').blur();

        $('input[name="coloumn_name"]').focus();
        $('input[name="coloumn_name"]').val(data.coloumn_name);
        $('input[name="coloumn_name"]').blur();

        $('select[name="placement_id"]').val(data.placement).trigger('change');

        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateAssignment', function() {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').hide();

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').show();
        $('.properties_form_div').hide();
        $('.brands_form_div').hide();

        $('#opp_name').text('Attribute');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'attributes';
        $('#operation').val('update');
        $('#opp_name_input').val('attributes');

        var data = all_assignments.find(x => x.id == id);
        $('._cl-bottom').show();
        $('.pc-cartlist').show();

        $('input[name="attribute_value"]').focus();
        $('input[name="attribute_value"]').val(data.value);
        $('input[name="attribute_value"]').blur();

        $('select[name="attribute_id"]').val(data.attribute_id).trigger('change');


        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateProperty', function() {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').hide();

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').show();
        $('.brands_form_div').hide();

        $('#opp_name').text('Property');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'property';
        $('#operation').val('update');
        $('#opp_name_input').val('property');

        var data = all_properties.find(x => x.id == id);
        $('._cl-bottom').show();
        $('.pc-cartlist').show();

        $('input[name="property_name"]').focus();
        $('input[name="property_name"]').val(data.name);
        $('input[name="property_name"]').blur();

        openSidebar();
    });

    $(document).on('click', '.openDataSidebarForUpdateBrand', function() {
        var id = $(this).attr('id');
        $('#dataSidebarLoader').hide();

        $('.designation_form_div').hide();
        $('.department_form_div').hide();
        $('.documentType_form_div').hide();
        $('.mainCat_form_div').hide();
        $('.subCat_form_div').hide();
        $('.attribute_form_div').hide();
        $('.attribute_assignment_form_div').hide();
        $('.properties_form_div').hide();
        $('.brands_form_div').show();

        $('#opp_name').text('Brand');
        $('#opp_id').val(id);
        openSidebar();
        last_operation = 'update';
        opp_name = 'brand';
        $('#operation').val('update');
        $('#opp_name_input').val('brand');

        var data = all_brands.find(x => x.id == id);
        $('._cl-bottom').show();
        $('.pc-cartlist').show();

        $('input[name="brand_name"]').focus();
        $('input[name="brand_name"]').val(data.name);
        $('input[name="brand_name"]').blur();

        var descriptionHtml = '<p></p>';
        if(data.description){
            descriptionHtml = JSON.parse(data.description);
        }
        $('#brandDescription').summernote('code', `${descriptionHtml}`);

        // $('textarea[name="brand_description"]').text(data.description);

        $('input[name="brand_site_url"]').focus();
        $('input[name="brand_site_url"]').val(data.site_url);
        $('input[name="brand_site_url"]').blur();

        var dropifyBrand = $('.dropifyBrand').dropify();
        dropifyBrand = dropifyBrand.data('dropify');
        dropifyBrand.resetPreview();
        dropifyBrand.clearElement();
        dropifyBrand.settings['defaultFile'] = data.logo;
        dropifyBrand.destroy();
        dropifyBrand.init();
        openSidebar();
    });




    $(document).on('click', '#saveBtn', function(){
        var invalidSave = [];
        var designation_rights = [];
        if(opp_name == 'designation'){
            $('.required_designation').each(function() {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
            $('.custom_checkbox').each(function() {
                if ($(this).prop('checked')) {
                    designation_rights.push($(this).attr('id'));
                }
            });
        }else if(opp_name == 'department'){
            $('.required_department').each(function() {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        }else if(opp_name == 'document'){
            $('.required_document_type').each(function() {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        }else if(opp_name == 'main_cat'){
            if (!$('input[name="category_name"]').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                invalidSave.push(true);
            }else{
                invalidSave.push(false);
            }
        }else if(opp_name == 'sub_cat'){
            if (!$('input[name="sub_category_name"]').val() || !$('select[name="main_category_id"]').val()) {
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'red');
                $('#notifDiv').text('Please provide all the required information (*)');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
                invalidSave.push(true);
            }else{
                invalidSave.push(false);
            }
        }else if(opp_name == 'attributes'){
            $('.required_attribute').each(function() {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        }else if(opp_name == 'attributes'){
            $('.required_assignment').each(function() {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        }else if(opp_name == 'property'){
            $('.required_property').each(function() {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        }else if(opp_name == 'brand'){
            $('.required_brand').each(function() {
                if (!$(this).val()) {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Please provide all the required information (*)');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    invalidSave.push(true);
                } else {
                    invalidSave.push(false);
                }
            });
        }

        if (invalidSave.includes(true))
            return;

        $('#saveBtn').attr('disabled', 'disabled');
        $('#btn-cancel').attr('disabled', 'disabled');
        $('#saveBtn').text('Processing..');

        $('#saveSettingsForm').ajaxSubmit({
            type: "POST",
            url: '/save_settings',
            data: {
                designation_rights: designation_rights,
                attr_ids: $('select[name="sub_cat_attribute"]').val(),
                prop_ids: $('select[name="sub_cat_property"]').val()
            },
            cache: false,
            success: function(response) {
                $('#saveBtn').removeAttr('disabled');
                $('#btn-cancel').removeAttr('disabled');
                $('#saveBtn').text('Save');

                if (JSON.parse(response) == "success") {
                    fetchAllData();
                    $('#notifDiv').text('Saved Successfully!');
                    if ($('#operation').val() == "add") {
                       $('input[name="designation_name"]').val('');
                       $('input[name="department_name"]').val('');
                       $('input[name="document_type"]').val('');
                       $('input[name="discount"]').val('');
                       $('input[name="category_name"]').val('');
                       $('input[name="sub_category_name"]').val('');
                       $('input[name="attribute_name"]').val('');
                       $('input[name="attribute_value"]').val('');
                       $('input[name="property_name"]').val('');
                       $('input[name="brand_name"]').val('');
                       $('.custom_checkbox').prop('checked', false);
                       $('#main_category_id').val('-1').trigger('change');
                       $('select[name="attribute_id"]').val('-1').trigger('change');
                       $('select[name="sub_cat_attribute"]').val(0).trigger('change');
                       $('select[name="sub_cat_property"]').val(0).trigger('change')
                       $('select[name="placement_id"]').val(0).trigger('change')
                       $('#pl-close').click();
                    }

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else if(JSON.parse(response) == "already_exist"){
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Already Exist!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to save at the moment');
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
        // if(glob_type == 'main_cat' || glob_type == 'sub_cat'){
        //     $('.confirm_delete').click();
        // }else{
        //     $('#hidden_btn_to_open_modal').click();
        // }
        $('#hidden_btn_to_open_modal').click();
    });

    $(document).on('click', '.confirm_delete', function(){
        var type = $(this).attr('name');
        var id = $(this).attr('id');
        var thisRef = $(this);
        thisRef.attr('disabled', 'disabled');
        thisRef.text('Processing...');
        $.ajax({
            type: "POST",
            url: '/delete_from_settings',
            data: {
                _token: $('meta[name="csrf_token"]').attr('content'),
                'type': type,
                'id': id
            },
            cache: false,
            success: function(response) {
                thisRef.removeAttr('disabled');
                thisRef.text('Delete');

                if (JSON.parse(response) == "success") {

                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Deleted successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    deleteRef.parent().parent().remove();
                    $('.cancel_delete_modal').click();
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add delete at the moment');
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

});

function fetchAllData(){
    $('.loader').show();
    $('.body_designations').hide();
    $('.body_departments').hide();
    $('.body_documents').hide();
    $('.body_main_cat').hide();
    $('.body_sub_cat').hide();
    $('.body_attributes').hide();
    $('.body_assignment').hide();
    $('.body_property').hide();
    $('.body_brand').hide();
    $('.body_currency').hide();
    $('.body_customer_reward').hide();
    $('.body_free_category').hide();
    all_attributes = [];
    all_properties = [];
    all_brands = [];
    all_currencies = [];
    $.ajax({
        type: 'GET',
        url: '/GetSettingsData',
        success: function(response) {
            var response = JSON.parse(response);
            $('.body_designations').empty();
            $('.body_designations').append('<table class="table table-hover dt-responsive nowrap" id="designationsTable" style="width:100%;"><thead><tr><th>ID</th><th>Designation</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#designationsTable tbody').empty();
            response.designations.forEach(element => {
                $('#designationsTable tbody').append(`<tr><td>${element['id']}</td><td>${element['designation']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateDesignation">Edit</button></td></tr>`);
            });
            $('.body_designations').fadeIn();
            $('#designationsTable').DataTable();


            $('.body_departments').empty();
            $('.body_departments').append('<table class="table table-hover dt-responsive nowrap" id="departmentsTable" style="width:100%;"><thead><tr><th>ID</th><th>Department</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#departmentsTable tbody').empty();
            response.departments.forEach(element => {
                $('#departmentsTable tbody').append(`<tr><td>${element['id']}</td><td>${element['department']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdatedepartment">Edit</button></td></tr>`);
            });
            $('.body_departments').fadeIn();
            $('#departmentsTable').DataTable();


            $('.body_documents').empty();
            $('.body_documents').append('<table class="table table-hover dt-responsive nowrap" id="documentTypeTable" style="width:100%;"><thead><tr><th>ID</th><th>Document</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#documentTypeTable tbody').empty();
            response.documents.forEach(element => {
                $('#documentTypeTable tbody').append(`<tr><td>${element['id']}</td><td>${element['document_name']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdatedocument">Edit</button></td></tr>`);
            });
            $('.body_documents').fadeIn();
            $('#documentTypeTable').DataTable();


            $('.body_attributes').empty();
            $('.body_attributes').append('<table class="table table-hover dt-responsive nowrap" id="AttributeTable" style="width:100%;"><thead><tr><th>ID</th><th>Attribute Name</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#AttributeTable tbody').empty();
            $('select[name="attribute_id"]').empty();
            $('select[name="attribute_id"]').append('<option value="-1" selected disabled>Select Attribute</option>');
            $('select[name="sub_cat_attribute"]').empty();
            var attri = '';
            response.attributes.forEach(element => {
                $('#AttributeTable tbody').append(`<tr><td>${element['id']}</td><td>${element['name']}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateAttribute">Edit</button></td></tr>`);
                //<button type="button" id="${element['id']}" class="btn btn-default red-bg delete_btn" name="attributes" title="Delete">Delete</button>
                all_attributes = response.attributes;
                $('select[name="attribute_id"]').append(`<option value="${element['id']}">${element['name']}</option>`);
                $(new Option(element['name'], element['id'])).appendTo('select[name="sub_cat_attribute"]');
            });
            $('.body_attributes').fadeIn();
            $('#AttributeTable').DataTable();


            $('.body_brand').empty();
            $('.body_brand').append('<table class="table table-hover dt-responsive nowrap" id="BrandTable" style="width:100%;"><thead><tr><th>ID</th><th>Logo</th><th>Brand Name</th><th>Site Url</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('#BrandTable tbody').empty();
            response.brands.forEach(element => {
                var brand_site_url = (element['site_url'])? element['site_url'] : '' ;
                $('#BrandTable tbody').append(`<tr><td>${element['id']}</td><td><img class="brandLogo_img" src='${element['logo']}'/></td><td>${element['name']}</td><td>${brand_site_url}</td><td><button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdateBrand">Edit</button><button type="button" id="${element['id']}" class="btn btn-default red-bg delete_btn" name="brand" title="Delete">Delete</button></td></tr>`);
                all_brands = response.brands;
            });
            $('.body_brand').fadeIn();
            $('#BrandTable').DataTable();

            $('.body_currency').empty();
            var currencyHtml = `<select class="form-control" id="currency-select"><option value="">Select Currency</option>`;
            response.currencies.forEach(element => {
                currencyHtml += `<option value="${element.id}">${element.name}&nbsp;(${element.symbol})</option>`;
            });
            currencyHtml += `</select>`;
            $('.body_currency').html(currencyHtml);
            $('.body_currency').fadeIn();
            $('#currency-select').select2();

            if(response.selectedCurrency){
                $(`#currency-select option[value="${response.selectedCurrency.setting_value}"]`).attr('selected', true).trigger('change');
            }



            $('.body_free_category').empty();
            var freeCategoryHtml = `<div class="row"><div class="col-md-4"><select class="form-control" id="free-category-select"><option value="">Select Category</option>`;
            response.categories.forEach(element => {
                freeCategoryHtml += `<option value="${element.id}">${element.category_name}</option>`;
            });
            freeCategoryHtml += `</select></div></div>`;
            $('.body_free_category').html(freeCategoryHtml);
            $('.body_free_category').fadeIn();
            $('#free-category-select').select2();

            if(response.selectedFreeCategory){
                $(`#free-category-select option[value="${response.selectedFreeCategory.setting_value}"]`).attr('selected', true).trigger('change');
            }

            $('.loader').hide();
        }
    });
}


$('.saveCurrency').on('click', function(){
    var id = $('#currency-select').val();
    $.ajax({
        type: "POST",
        url: '/save-currency',
        data: {
            _token: $('meta[name="csrf_token"]').attr('content'),
            'id': id
        },
        cache: false,
        success: function(response) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'green');
            $('#notifDiv').text('Currency Changed successfully');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
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


$('.saveFreeCategory').on('click', function(){
    var id = $('#free-category-select').val();
    $.ajax({
        type: "POST",
        url: '/save-free-category',
        data: {
            _token: $('meta[name="csrf_token"]').attr('content'),
            'id': id
        },
        cache: false,
        success: function(response) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'green');
            $('#notifDiv').text('Currency Changed successfully');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
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


// function update_reward_settings(){
//     var formData = new FormData($("#rewardForm")[0]);
//     $.ajax({
//         headers: {
//             'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
//         },
//         url: '/update-reward-settings',
//         type: 'POST',
//         cache: false,
//         contentType: false,
//         processData: false,
//         data: formData,
//         success: function(e){
//             if(e=='updated'){
//                 $('#notifDiv').fadeIn();
//                 $('#notifDiv').css('background', 'green');
//                 $('#notifDiv').text('Reward settings updated successfully.');
//                 setTimeout(() => {
//                     $('#notifDiv').fadeOut();
//                 }, 3000);
//             }
//         },
//         error: function(err) {
//             if (err.status == 422 || err.status == 500) {
//                 $('#notifDiv').fadeIn();
//                 $('#notifDiv').css('background', 'red');
//                 $('#notifDiv').text('Some Error Occured, please try again.');
//                 setTimeout(() => {
//                     $('#notifDiv').fadeOut();
//                 }, 3000);
//             }
//             // $("#organizationForm").show();
//             // $("#tblLoader").hide();
//         }
//     });
// }

// function set_reward_setting(reward){
//     if(!reward) return false;

//     $(`#reward_points`).val(reward.points);
//     $(`#reward_rate`).val(reward.rate);
//     $(`#reward_points`).val(reward.points);
//     $(`#reward_rounding_mode`).val(reward.rounding_mode);
//     $(`#reward_redemption_points`).val(reward.redemption_points);
//     $(`#reward_redemption_rate`).val(reward.redemption_rate);
//     $(`#reward_minimum_points_discount`).val(reward.minimum_points_discount);
//     $(`#reward_maximum_points_discount`).val(reward.maximum_points_discount);
//     $(`#reward_maximum_product_point_discount`).val(reward.maximum_product_point_discount);
//     $(`#reward_points_singular_label`).val(reward.points_singular_label);
//     $(`#reward_points_plural_label`).val(reward.points_plural_label);
//     $(`#reward_single_product_page_message`).val(reward.single_product_page_message);
//     $(`#reward_variable_product_page_message`).val(reward.variable_product_page_message);
//     $(`#reward_earn_points_cart_checkout_message`).val(reward.earn_points_cart_checkout_message);
//     $(`#reward_redeem_points_cart_checkout_perpage_message`).val(reward.redeem_points_cart_checkout_perpage_message);
//     $(`#reward_thankyou_message`).val(reward.thankyou_message);
//     $(`#reward_points_for_signup`).val(reward.points_for_signup);
//     $(`#reward_points_earned_for_review`).val(reward.points_earned_for_review);
// }



$(document).ready(function() {
    $('#brandDescription').summernote(SummerNoteSetting);
});
