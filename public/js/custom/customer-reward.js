function CustomerReward() {
    this.data = null;
}

CustomerReward.prototype.http = function(type, url, formData) {
    var self = this;
    return new Promise(function(resolve, reject) {
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
            success: function(e) {
                resolve(e);
            },
            error: function(err) {
                console.log(err);
                if (err.status == 422 || err.status == 500) {
                    self.notification('error', 'Some Error Occured, please try again.');
                }
                self.loader('hide');
            }
        });
    });
}

CustomerReward.prototype.notification = function(type, message) {
    var bgColor = (type == 'error') ? 'red' : 'green';
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text(message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

CustomerReward.prototype.loader = function(action) {
    if (action == 'show') {
        $('#tblLoader').show();
        $('.body').hide();
    } else if (action == 'hide') {
        $('#tblLoader').hide();
        $('.body').show();
    }
}

CustomerReward.prototype.set_form = function() {
    if (!this.data) return false;


    $('#conversion_rate_points').val(this.data.conversion_rate_points);
    $('#conversion_rate_amount').val(this.data.conversion_rate_amount);
    $('#points_rounding_mode').val(this.data.points_rounding_mode);
    $('#redemption_conversion_rate_points').val(this.data.redemption_conversion_rate_points);
    $('#redemption_conversion_rate_amount').val(this.data.redemption_conversion_rate_amount);
    $('#redemption_conversion_rate').val(this.data.redemption_conversion_rate);
    $('#is_partial_conversion_rate').val(this.data.is_partial_conversion_rate);
    $('#minimum_points_discount').val(this.data.minimum_points_discount);
    $('#maximum_points_discount').val(this.data.maximum_points_discount);
    $('#maximum_product_point_discount').val(this.data.maximum_product_point_discount);
    $('#point_label_singular').val(this.data.point_label_singular);
    $('#point_label_plural').val(this.data.point_label_plural);
    $('#points_expire_after').val(this.data.points_expire_after);
    $('#points_signup').val(this.data.points_signup);
    $('#points_writing_review').val(this.data.points_writing_review);
    $('#single_product_page_message').val(this.data.single_product_page_message);
    $('#variable_product_page_message').val(this.data.variable_product_page_message);
    $('#earn_points_checkout_page_message').val(this.data.earn_points_checkout_page_message);
    $('#redeem_points_checkout_page_message').val(this.data.redeem_points_checkout_page_message);
    $('#thank_you_order_page_message').val(this.data.thank_you_order_page_message);
    $('input[name=first_order_discount_percentage]').val(this.data.first_order_discount_percentage);
    $("input[name=is_first_order_discount][value=" + this.data.is_first_order_discount + "]").prop('checked', true);

    if (this.data.is_partial_conversion_rate) {
        $('#is_partial_conversion_rate').prop('checked', true);
    } else {
        $('#is_partial_conversion_rate').prop('checked', false);
    }
}

var customer_reward = new CustomerReward();

customer_reward.http('POST', '/get-reward-setting').then((e) => {
    if (e) {
        customer_reward.data = JSON.parse(e);
        customer_reward.set_form();
    }

    customer_reward.loader('hide');
});

function Save() {
    customer_reward.loader('show');
    var formData = new FormData($("#rewardForm")[0]);
    customer_reward.http('POST', '/store-reward-settings', formData).then((e) => {
        customer_reward.loader('hide');
        customer_reward.data = JSON.parse(e);
        customer_reward.set_form();
        customer_reward.notification('success', 'Reward Setting Updated Successfully!');
    });
}