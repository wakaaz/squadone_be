var codes = [];

$(document).ready(function () {

    var segments = location.href.split('/');
    var notifications = [];
    GetCodes();

    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
    });

    var lastOp = "add";

    $(document).on('click', '.openSidebarToAddCode', function () {
        if (lastOp == "update") {
            $('#product-cl-sec input').not('[name="_token"]').val("").blur();
            $('#product-cl-sec select').val(0).trigger('change');
        }
        lastOp = 'add';
        $('#operation').val('add');
        openSidebar();
    });

    $(document).on('click', '.openSidebarToUpdateCode', function () {
        $('#operation').val('update');
        lastOp = 'update';

        var id = $(this).attr('id');
        $('input[name="code_id"]').val(id)

        let code = codes.find(x => x.id == id)
        $("[name='amount_percent']").val(code.amount).focus().blur()
        $("[name='type']").val(code.type).trigger('change')
        $("[name='coupon_code']").val(code.coupon_code).focus().blur()
        $("[name='start_date']").datepicker('destroy').val(code.start_date).datepicker({
            format: 'yyyy-mm-dd'
        })
        $("[name='end_date']").datepicker('destroy').val(code.end_date).datepicker({
            format: 'yyyy-mm-dd'
        })
        $("[name='customer_id']").val(code.customer_id).trigger('change')
        $("[name='limit']").val(code.transactions_allowed).focus().blur()
        $("[name='min_order']").val(code.min_order).focus().blur();
        console.log(code);

        openSidebar();
    });

    $(document).on('click', '.updateStatus', function () {
        if (!window.confirm('Are you sure you want to update the status of this coupon?'))
            return;

        $(this).attr('disabled', 'disabled').text('UPDATING..')
        $.ajax({
            type: "POST",
            url: `/Code/UpdateStatus/${$(this).attr('id')}/${$(this).attr('status') == 0 ? 1 : 0}`,
            data: {
                _token: csrfToken
            },
            success: function () {
                GetCodes()
            }.bind($(this))
        });
    });

    $(document).on('click', '.deleteCouponCode', function () {
        if (!window.confirm('Are you sure you want to delete this code?'))
            return;

        $(this).attr('disabled', 'disabled').text('DELETING..')
        $.ajax({
            type: "DELETE",
            url: `/Code/Delete/${$(this).attr('id')}`,
            data: {
                _token: csrfToken
            },
            success: function () {
                GetCodes()
            }.bind($(this))
        });
    });

    $(document).on('click', '#saveCode', function () {
        let dirty = false
        $('.required').each(function () {
            if (!$(this).val() || $(this).val() == '' || $(this).val() == '0')
                dirty = true
        })
        if (dirty) {
            $('#notifDiv').css('background', 'red').text('Please provide all the required information (*)').fadeIn();
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        if (($('[name="start_date"]').val() > $('[name="end_date"]').val())) {
            $('#notifDiv').css('background', 'red').text('Expiry date can not be before start date').fadeIn();
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        if (parseFloat($('[name="transactions_allowed"]').val()) <= '0') {
            $('#notifDiv').css('background', 'red').text('Transaction limit cannot be zero').fadeIn();
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        debugger
        if (codes.find(x => x.id != $('[name="code_id"]').val() && x.coupon_code.toLowerCase() == $.trim($('input[name="coupon_code"]').val()).toLowerCase())) {
            $('#notifDiv').css('background', 'red').text('Please do not add duplicate codes').fadeIn();
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        $('#saveCode').attr('disabled', 'disabled').text('Processing..');
        $('#cancelCode').attr('disabled', 'disabled');

        var ajaxUrl = "/Code/Store";

        if ($('#operation').val() !== "add")
            ajaxUrl = `/Code/Update/${$('input[name="code_id"]').val()}`;

        $('#saveCodeForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#saveCodeForm').serialize(),
            cache: false,
            success: function (response) {
                if (response.code == 200) {
                    $('#product-cl-sec input').not('[name="_token"]').val("").blur();
                    $('#product-cl-sec select').val(0).trigger('change');
                    GetCodes()
                    $('#notifDiv').css('background', 'green').text(`Code have been ${$('#operation').val() !== "add" ? 'updated' : 'added'} successfully`).fadeIn()
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('#saveCode').removeAttr('disabled').text('Save');
                    closeSidebar();
                } else {
                    $('#notifDiv').css('background', 'red').text('Failed to add the Code').fadeIn()
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('#saveCode').removeAttr('disabled').text('Save');
                }
            }
        });
    });

});

function GetCodes() {
    $.ajax({
        type: 'POST',
        url: '/GetCodes',
        data: {
            _token: csrfToken
        },
        success: function (response) {
            $('.body').empty();
            $('.body').append('<table class="table table-hover dt-responsive nowrap codesTbl" style="width:100%"><thead><tr><th>SN.</th><th>Coupon Code</th><th>Type</th><th>Customer</th><th>Discount</th><th>TRX. Remaining/Limit</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.codesTbl tbody').empty();
            codes = JSON.parse(response);
            codes.forEach((x, idx) => {

                $('.codesTbl tbody').append(`
                    <tr>
                        <td>${ idx+1 }</td>
                        <td>${ x.coupon_code }</td>
                        <td>${ x.customer_id ? 'User Specific' : 'Store Wide' }</td>
                        <td>${ x.customer_id ? x.customer : 'All Customers' }</td>
                        <td>${ x.type == 1 ? '$'+x.amount : x.amount+'%' }</td>
                        <td>${ x.transactions_remaining+'/'+x.transactions_allowed }</td>
                        <td>${ x.start_date }</td>
                        <td>${ x.end_date }</td>
                        <td>${ x.active ? 'Active' : 'Deactive' }</td>
                        <td>
                            <button id="${x.id}" class="btn btn-default btn-line openSidebarToUpdateCode">Edit</button>
                            ${ x.transactions_remaining > 0 ?
                                '<button id="'+x.id+'" status="'+x.active+'" class="btn btn-default btn-line updateStatus">'+ (x.active ? 'Deactivate' : 'Activate') +'</button>'
                                : '<button class="btn btn-default btn-line" disabled>Expired</button>'
                            }
                            <button id="${x.id}" class="btn btn-default btn-line deleteCouponCode">Delete</button>
                        </td>
                    </tr>`);
            });
            $('#tblLoader').hide();
            $('.body').fadeIn();
            $('.codesTbl').DataTable();
        }
    });
}

$('#dataSidebarLoader').hide();
