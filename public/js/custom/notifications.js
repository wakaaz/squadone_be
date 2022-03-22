$(document).ready(function() {
    var segments = location.href.split('/');
    var action = segments[3];
    var notifications = [];
    var notif_ids = [];

    if (action !== "" && action !== "home") {
        // $('.notifications_list_all').each(function() {
        //     notif_ids.push($(this).attr('id'));
        // });

        // $.ajax({
        //     type: 'POST',
        //     url: '/read_notif_four',
        //     data: {
        //         _token: $('input[name="_token"]').val(),
        //         notif_ids: notif_ids
        //     },
        //     success: function(response) {
        //         var response = JSON.parse(response);
        //         //console.log(response);
        //     }
        // });
    }

    $(document).on('change', '#employee_id', function() {
        $('#table_notif').show();
        $('#update_emp_pref').attr('disabled', 'disabled');
        $('.consignment_box').attr('disabled', 'disabled');
        $('.complains_box').attr('disabled', 'disabled');
        $('.suggestions_box').attr('disabled', 'disabled');
        $('#update_emp_pref').text('Processing..');
        $('.check_box').prop('checked', false);
        var id = $('#employee_id').val();
        $.ajax({
            type: 'GET',
            url: '/Notifications/' + id,
            success: function(response) {
                $('#update_emp_pref').removeAttr('disabled');
                $('.consignment_box').removeAttr('disabled');
                $('.complains_box').removeAttr('disabled');
                $('.suggestions_box').removeAttr('disabled');
                $('#update_emp_pref').text('Save');
                var response = JSON.parse(response);
                notifications = [];
                response.forEach(element => {
                    $('input[id="' + element['notification_code_id'] + '"]').each(function() {
                        if ($(this).val() == "email") {
                            $(this).prop('checked', (element['email'] == "1" ? true : false));
                            if (element["email"] == "1") {
                                notifications.push({
                                    code: element['notification_code_id'],
                                    properties: ["email"]
                                });
                            }
                        } else {
                            $(this).prop('checked', (element['web'] == "1" ? true : false));
                            if (element["web"] == "1") {
                                notifications.push({
                                    code: element['notification_code_id'],
                                    properties: ["web"]
                                });
                            }
                        }
                    });
                });
            }
        });
    });

    $(document).on('click', '.check_box', function() {
        var id = $(this).attr('id');
        var value = $(this).val();
        if (notifications.find(x => x["code"] == id)) {
            notifications.find(x => {
                if (x["code"] == id) {
                    if (x["properties"].includes(value)) {
                        x["properties"].splice(x["properties"].indexOf(value), 1);
                    } else {
                        x["properties"].push(value);
                    }
                }
            });
        } else {
            notifications.push({
                code: id,
                properties: [$(this).val()]
            });
        }
    });

    $(document).on('click', '#update_emp_pref', function() {

        if ($('#employee_id').val() == 0 || $('#employee_id').val() == null) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please select Employee');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        if (notifications == "") {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Check Notification First');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        var emp_id = $('#employee_id').val();

        $('#update_emp_pref').attr('disabled', 'disabled');
        $('.consignment_box').attr('disabled', 'disabled');
        $('.complains_box').attr('disabled', 'disabled');
        $('.suggestions_box').attr('disabled', 'disabled');
        $('#update_emp_pref').text('Processing..');
        $.ajax({
            type: 'POST',
            url: '/Notifications',
            data: {
                _token: $('input[name="_token"]').val(),
                emp_id: emp_id,
                notifications: notifications
            },
            success: function(response) {
                if (JSON.parse(response) == "success") {
                    $('#update_emp_pref').removeAttr('disabled');
                    $('.consignment_box').removeAttr('disabled');
                    $('.complains_box').removeAttr('disabled');
                    $('.suggestions_box').removeAttr('disabled');
                    $('#update_emp_pref').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Saved Successfully');
                    $('#employee_id').val(0).trigger('change');
                    $('.check_box').prop('checked', false);
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#update_emp_pref').removeAttr('disabled');
                    $('.consignment_box').removeAttr('disabled');
                    $('.complains_box').removeAttr('disabled');
                    $('.suggestions_box').removeAttr('disabled');
                    $('#update_emp_pref').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to save at the moment!');
                    $('#employee_id').val(0).trigger('change');
                    $('.check_box').prop('checked', false);
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }

            }
        });
    });


});