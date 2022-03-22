function Gateway(){
    this.type = null;
    this.status = null;
    this.paypal = {
        mode:null,
        status:null,
        sandbox:{
            client_id:null,
            client_secret:null,
        },
        live:{
            client_id:null,
            client_secret:null,
        }
    };
    this.vivawallet = {
        mode:null,
        status:null,
        demo:{
            merchant_id:null,
            api_key:null,
            public_key:null,
            source_code:null
        },
        live:{
            merchant_id:null,
            api_key:null,
            public_key:null,
            source_code:null
        }
    };
    this.mandril = {
        mode:null,
        status:null,
        demo:{
            api_key:null,
            sender_name:null,
            sender_email:null
        },
        live:{
            api_key:null,
            sender_name:null,
            sender_email:null
        }
    };
    this.banktransfer = {
        mode:null,
        status:null,
        demo:{
            bank_name:null,
            branch_code:null,
            account_no:null
        },
        live:{
            bank_name:null,
            branch_code:null,
            account_no:null
        }
    };
    this.cod = {
        mode:null,
        status:null,
        live:{
            min_limit:null,
            api_key:null,
            sender_name:null,
            sender_email:null
        },
        demo:{
            min_limit:null,
            api_key:null,
            sender_name:null,
            sender_email:null
        }
    };
    this.royalmail = {
        mode:null,
        status:null,
        demo:{
            authorization_key:null,
            client_id:null,
            client_secret:null
        },
        live:{
            authorization_key:null,
            client_id:null,
            client_secret:null
        }
    };
    this.dpd = {
        mode:null,
        status:null,
        demo:{
            user_id:null,
            password:null
        },
        live:{
            user_id:null,
            password:null
        }
    };
    this.googleTag = {
        mode:null,
        status:null,
        live:{
            google_tag_header:null,
            google_tag_body:null
        }
    }
}

Gateway.prototype.http = function(type, url, formData){
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
                $("#MainContent").show();
                $("#tblLoader").hide();
            }
        });
    });
}

Gateway.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

Gateway.prototype.loader = function(action){
    if(action=='show'){
        $('#tblLoader').show();
        $('#MainContent').hide();
    }else if(action=='hide'){
        $('#tblLoader').hide();
        $('#MainContent').show();
    }
}

Gateway.prototype.set_result = function(){
    this.set_paypal_result();
    this.set_vivawallet_result();
    this.set_mailchimp_mandril_result();
    this.set_cod_result();
    this.set_bank_transfer_result();
    this.set_royalmail_result();
    this.set_dpd_result();
    this.set_google_tag_result();
}

Gateway.prototype.set_paypal_result = function(){

    // Live Fields
    $('input[name=paypal_live_client_id]').val(this.paypal.live.client_id);
    $('input[name=paypal_live_client_secret]').val(this.paypal.live.client_secret);

    // Sandbox Fields
    $('input[name=paypal_sandbox_client_id]').val(this.paypal.sandbox.client_id);
    $('input[name=paypal_sandbox_client_secret]').val(this.paypal.sandbox.client_secret);

    // Generic Fields
    $('select[name=paypal_status]').val(this.paypal.status).trigger('change');
    $(`input[name=paypal_mode][value='${this.paypal.mode}']`).prop("checked",true);
}

Gateway.prototype.set_vivawallet_result = function(){

    // Live Fields
    $('input[name=vivawallet_live_merchant_id]').val(this.vivawallet.live.merchant_id);
    $('input[name=vivawallet_live_api_key]').val(this.vivawallet.live.api_key);
    $('input[name=vivawallet_live_public_key]').val(this.vivawallet.live.public_key);
    $('input[name=vivawallet_live_source_code]').val(this.vivawallet.live.source_code);

    // Demo Fields
    $('input[name=vivawallet_demo_merchant_id]').val(this.vivawallet.demo.merchant_id);
    $('input[name=vivawallet_demo_api_key]').val(this.vivawallet.demo.api_key);
    $('input[name=vivawallet_demo_public_key]').val(this.vivawallet.demo.public_key);
    $('input[name=vivawallet_demo_source_code]').val(this.vivawallet.demo.source_code);

    // Generic Fields
    $('select[name=vivawallet_status]').val(this.vivawallet.status).trigger('change');
    $(`input[name=vivawallet_mode][value='${this.vivawallet.mode}']`).prop("checked",true);
}


Gateway.prototype.set_mailchimp_mandril_result = function(){
    // Live Fields
    $('input[name=mandril_live_api_key]').val(this.mandril.live.api_key);
    $('input[name=mandril_live_sender_name]').val(this.mandril.live.sender_name);
    $('input[name=mandril_live_sender_email]').val(this.mandril.live.sender_email);

    // Sandbox Fields
    $('input[name=mandril_demo_api_key]').val(this.mandril.demo.api_key);
    $('input[name=mandril_demo_sender_name]').val(this.mandril.demo.sender_name);
    $('input[name=mandril_demo_sender_email]').val(this.mandril.demo.sender_email);

    // Generic Fields
    $('select[name=mandril_status]').val(this.mandril.status).trigger('change');
    $(`input[name=mandril_mode][value='${this.mandril.mode}']`).prop("checked",true);
}

Gateway.prototype.set_bank_transfer_result = function(){
    // Live Fields
    $('input[name=bank_transfer_live_bank_name]').val(this.mandril.live.bank_name);
    $('input[name=bank_transfer_live_branch_code]').val(this.mandril.live.branch_code);
    $('input[name=bank_transfer_live_account_no]').val(this.mandril.live.account_no);

    // Sandbox Fields
    $('input[name=bank_transfer_demo_bank_name]').val(this.mandril.demo.bank_name);
    $('input[name=bank_transfer_demo_branch_code]').val(this.mandril.demo.branch_code);
    $('input[name=bank_transfer_demo_account_no]').val(this.mandril.demo.account_no);

    // Generic Fields
    $('select[name=bank_transfer_status]').val(this.mandril.status).trigger('change');
    $(`input[name=bank_transfer_mode][value='${this.mandril.mode}']`).prop("checked",true);
}

Gateway.prototype.set_cod_result = function(){
    // Live Fields
    $('input[name=cod_min_limit]').val(this.cod.live.min_limit);

    // Generic Fields
    $('select[name=cod_status]').val(this.cod.status).trigger('change');
    $(`input[name=cod_mode][value='${this.cod.mode}']`).prop("checked",true);
}

Gateway.prototype.set_royalmail_result = function(){
    // Live Fields
    $('input[name=royalmail_live_authorization]').val(this.royalmail.live.authorization_key);
    $('input[name=royalmail_live_client_id]').val(this.royalmail.live.client_id);
    $('input[name=royalmail_live_client_secret]').val(this.royalmail.live.client_secret);

    // Sandbox Fields
    $('input[name=royalmail_demo_authorization]').val(this.royalmail.demo.authorization_key);
    $('input[name=royalmail_demo_client_id]').val(this.royalmail.demo.client_id);
    $('input[name=royalmail_demo_client_secret]').val(this.royalmail.demo.client_secret);

    // Generic Fields
    $('select[name=royalmail_status]').val(this.royalmail.status).trigger('change');
    $(`input[name=royalmail_mode][value='${this.royalmail.mode}']`).prop("checked",true);
}

Gateway.prototype.set_dpd_result = function(){
    // Live Fields
    $('input[name=dpd_live_user_id]').val(this.dpd.live.user_id);
    $('input[name=dpd_live_password]').val(this.dpd.live.password);

    // Sandbox Fields
    $('input[name=dpd_demo_user_id]').val(this.dpd.demo.user_id);
    $('input[name=dpd_demo_password]').val(this.dpd.demo.password);

    // Generic Fields
    $('select[name=dpd_status]').val(this.dpd.status).trigger('change');
    $(`input[name=dpd_mode][value='${this.dpd.mode}']`).prop("checked",true);
}

Gateway.prototype.set_google_tag_result = function(){
    // Live Fields
    $('textarea[name=google_tag_header]').val(this.googleTag.live.google_tag_header);
    $('textarea[name=google_tag_body]').val(this.googleTag.live.google_tag_body);

    // Generic Fields
    $('select[name=google_tag_status]').val(this.googleTag.status).trigger('change');
    // $(`input[name=dpd_mode][value='${this.dpd.mode}']`).prop("checked",true);
}


Gateway.prototype.save = function(){
    gateway.loader('show');
    var formData = new FormData();
    formData.append('type', this.type);
    formData.append('status', this.status);
    formData.append('setting', JSON.stringify(this[this.type]));

    this.http('POST', 'save-gateway-details', formData).then(()=>{
        gateway.loader('hide');
        this.get_detail();
        this.notification('success', 'Setting Saved Successfully!');
    });
}

Gateway.prototype.get_detail = function(){
    gateway.loader('show');
    this.http('GET', 'get-gateway-detail').then((e)=>{
        var result = JSON.parse(e);
        result.forEach(element => {
            if(element.type=='paypal') gateway.paypal = element.setting;
            if(element.type=='vivawallet') gateway.vivawallet = element.setting;
            if(element.type=='mandril') gateway.mandril = element.setting;
            if(element.type=='cod') gateway.cod = element.setting;
            if(element.type=='banktransfer') gateway.banktransfer = element.setting;
            if(element.type=='royalmail') gateway.royalmail = element.setting;
            if(element.type=='dpd') gateway.dpd = element.setting;
            if(element.type=='googleTag') gateway.googleTag = element.setting;
        });

        gateway.set_result();
        gateway.loader('hide');
    });
}

var gateway = new Gateway();
gateway.get_detail();

function SavePaypal() {
    gateway.type = 'paypal';

    // Live Fields
    gateway.paypal.live.client_id = $('input[name=paypal_live_client_id]').val();
    gateway.paypal.live.client_secret = $('input[name=paypal_live_client_secret]').val();

    // Sandbox Fields
    gateway.paypal.sandbox.client_id = $('input[name=paypal_sandbox_client_id]').val();
    gateway.paypal.sandbox.client_secret = $('input[name=paypal_sandbox_client_secret]').val();

    // Generic Fields
    gateway.paypal.status = $('select[name=paypal_status]').val();
    gateway.paypal.mode = $('input[name=paypal_mode]:checked').val();
    gateway.status = $('select[name=paypal_status]').val();

    gateway.save();
}

function SaveVivaWallet(){
    gateway.type = 'vivawallet';

    // Live Fields
    gateway.vivawallet.live.merchant_id = $('input[name=vivawallet_live_merchant_id]').val();
    gateway.vivawallet.live.api_key = $('input[name=vivawallet_live_api_key]').val();
    gateway.vivawallet.live.public_key = $('input[name=vivawallet_live_public_key]').val();
    gateway.vivawallet.live.source_code = $('input[name=vivawallet_live_source_code]').val();

    // Demo Fields
    gateway.vivawallet.demo.merchant_id = $('input[name=vivawallet_demo_merchant_id]').val();
    gateway.vivawallet.demo.api_key = $('input[name=vivawallet_demo_api_key]').val();
    gateway.vivawallet.demo.public_key = $('input[name=vivawallet_demo_public_key]').val();
    gateway.vivawallet.demo.source_code = $('input[name=vivawallet_demo_source_code]').val();

    //Generic Fields
    gateway.vivawallet.status = $('select[name=vivawallet_status]').val();
    gateway.vivawallet.mode = $('input[name=vivawallet_mode]:checked').val();
    gateway.status = $('select[name=vivawallet_status]').val();

    gateway.save();
}

function SaveMandril() {
    gateway.type = 'mandril';

    // Live Fields
    gateway.mandril.live.api_key = $('input[name=mandril_live_api_key]').val();
    gateway.mandril.live.sender_name = $('input[name=mandril_live_sender_name]').val();
    gateway.mandril.live.sender_email = $('input[name=mandril_live_sender_email]').val();

    // Demo Fields
    gateway.mandril.demo.api_key = $('input[name=mandril_demo_api_key]').val();
    gateway.mandril.demo.sender_name = $('input[name=mandril_demo_sender_name]').val();
    gateway.mandril.demo.sender_email = $('input[name=mandril_demo_sender_email]').val();

    // Generic Fields
    gateway.mandril.status = $('select[name=mandril_status]').val();
    gateway.mandril.mode = $('input[name=mandril_mode]:checked').val();
    gateway.status = $('select[name=mandril_status]').val();

    gateway.save();
}

function SaveBankTransfer() {
    gateway.type = 'banktransfer';

    // Live Fields
    gateway.banktransfer.live.bank_name = $('input[name=bank_transfer_live_bank_name]').val();
    gateway.banktransfer.live.branch_code = $('input[name=bank_transfer_live_branch_code]').val();
    gateway.banktransfer.live.account_no = $('input[name=bank_transfer_live_account_no]').val();

    // Demo Fields
    gateway.banktransfer.demo.bank_name = $('input[name=bank_transfer_demo_bank_name]').val();
    gateway.banktransfer.demo.branch_code = $('input[name=bank_transfer_demo_branch_code]').val();
    gateway.banktransfer.demo.account_no = $('input[name=bank_transfer_demo_account_no]').val();

    // Generic Fields
    gateway.banktransfer.status = $('select[name=bank_transfer_status]').val();
    gateway.banktransfer.mode = $('input[name=bank_transfer_mode]:checked').val();
    gateway.status = $('select[name=bank_transfer_status]').val();

    gateway.save();
}

function SaveCOD() {
    gateway.type = 'cod';

    // Live Fields
    gateway.cod.live.min_limit = $('input[name=cod_min_limit]').val();

    // Demo Fields
    gateway.cod.demo.min_limit = $('input[name=cod_min_limit]').val();

    // Generic Fields
    gateway.cod.status = $('select[name=cod_status]').val();
    gateway.cod.mode = 'live';// $('input[name=mandril_mode]:checked').val();
    gateway.status = $('select[name=cod_status]').val();

    gateway.save();
}

function SaveRoyalmail() {
    gateway.type = 'royalmail';

    // Live Fields
    gateway.royalmail.live.authorization_key = $('input[name=royalmail_live_authorization]').val();
    gateway.royalmail.live.client_id = $('input[name=royalmail_live_client_id]').val();
    gateway.royalmail.live.client_secret = $('input[name=royalmail_live_client_secret]').val();

    // Demo Fields
    gateway.royalmail.demo.authorization_key = $('input[name=royalmail_demo_authorization]').val();
    gateway.royalmail.demo.client_id = $('input[name=royalmail_demo_client_id]').val();
    gateway.royalmail.demo.client_secret = $('input[name=royalmail_demo_client_secret]').val();

    // Generic Fields
    gateway.royalmail.status = $('select[name=royalmail_status]').val();
    gateway.royalmail.mode = $('input[name=royalmail_mode]:checked').val();
    gateway.status = $('select[name=royalmail_status]').val();

    gateway.save();
}

function SaveDPD() {
    gateway.type = 'dpd';

    // Live Fields
    gateway.dpd.live.user_id = $('input[name=dpd_live_user_id]').val();
    gateway.dpd.live.password = $('input[name=dpd_live_password]').val();

    // Demo Fields
    gateway.dpd.demo.user_id = $('input[name=dpd_demo_user_id]').val();
    gateway.dpd.demo.password = $('input[name=dpd_demo_password]').val();

    // Generic Fields
    gateway.dpd.status = $('select[name=dpd_status]').val();
    gateway.dpd.mode = $('input[name=dpd_mode]:checked').val();
    gateway.status = $('select[name=dpd_status]').val();

    gateway.save();
}


function SaveGoogleTag() {
    gateway.type = 'googleTag';

    // Live Fields
    gateway.googleTag.live.google_tag_header = $('textarea[name=google_tag_header]').val();
    gateway.googleTag.live.google_tag_body = $('textarea[name=google_tag_body]').val();

    // Generic Fields
    gateway.googleTag.status = $('select[name=google_tag_status]').val();
    gateway.status = $('select[name=google_tag_status]').val();

    gateway.save();
}
