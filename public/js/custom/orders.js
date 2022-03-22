


// function Order(){
//     this.data = [];
// }


// Order.prototype.http = function(type, url, formData){
//     return new Promise(function (resolve, reject) {
//         $.ajax({
//             headers: {
//                 'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
//             },
//             url: url,
//             type: type,
//             cache: false,
//             contentType: false,
//             processData: false,
//             data: formData,
//             success: function(e){
//                 resolve(e);
//             },
//             error: function(err) {
//                 // self.notification('error', 'Failed to load Wholesalers at the moment');
//                 // if (err.status == 422) {
//                 //     $.each(err.responseJSON.errors, function(i, error) {
//                 //         var el = $(document).find('[name="' + i + '"]');
//                 //         el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
//                 //     });
//                 // }
//                 reject(err);
//             }
//         });
//     });
// }

// Order.prototype.notification = function(type, message){
//     var bgColor = (type=='error')? 'red' : 'green' ;
//     var el = $('#notifDiv');
//     el.fadeIn();
//     el.css('background', bgColor);
//     el.text (message);
//     setTimeout(() => {
//         el.fadeOut();
//     }, 3000);
// }

// Order.prototype.cart_total_html = function(order){
//     var html = `<tr>
//         <td align="left"
//         style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:600;">Total
//         Price:</td>
//         <td align="right" style="font-family:Exo, sans-serif; font-size:18px; color:#e1001e; font-weight:600;"> £${order.cart_total_price}
//         </td>
//     </tr>`;
//     return html;
// }

// Order.prototype.cart_summary_html = function(order){
//     var html = `<tr>
//         <td align="left"
//         style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:normal;">
//         Subtotal</td>
//         <td align="right"
//         style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:600;">£${order.cart_price}
//         </td>
//     </tr>
//     <tr>
//         <td colspan="2" height="10"></td>
//     </tr>
//     <tr>
//         <td align="left"
//         style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:normal;">
//         Discount</td>
//         <td align="right"
//         style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:600;">£${order.cart_discount}
//         </td>
//     </tr>
//     <tr>
//         <td colspan="2" height="10"></td>
//     </tr>
//     <tr>
//         <td align="left"
//         style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:normal;">
//         Shipping</td>
//         <td align="right" style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:600;">£0
//         </td>
//     </tr>
//     <tr>
//         <td colspan="2" height="10"></td>
//     </tr>
//     <tr>
//         <td align="left"
//         style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:normal;">VAT
//         </td>
//         <td align="right"
//         style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:600;">£${order.tax_price}
//         </td>
//     </tr>
//     <tr>
//         <td colspan="2" height="10" style="border-bottom:solid 1px #ededed"></td>
//     </tr>
//     <tr>
//         <td colspan="2" height="10"></td>
//     </tr>`;
//     return html;
// }

// Order.prototype.cart_product_html = function(order){
//     var html = '';
//     console.log(order);
//     if(order.items.length>0){
//         order.items.forEach(element => {
//             html += `<tr>
//                 <td colspan="2">
//                 <table width="100%" border="0" cellspacing="0" cellpadding="0">
//                     <tbody>
//                     <tr>
//                         <td width="80" align="left" valign="top" style="width:80px"><img
//                             style="width:70px; height:70px; border-radius: 8px; border: solid 1px #e3e3e3; margin-right:10px"
//                             src="${(element.product)? element.product.thumbnail : ''}" alt="" /></td>
//                         <td align="left" valign="top">
//                         <table width="100%" border="0" cellspacing="1" cellpadding="1">
//                             <tbody>
//                             <tr>
//                                 <td align="left"
//                                 style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:normal;">
//                                 ${(element.product)? element.product.name : ''}</td>
//                             </tr>
//                             <!--<tr>
//                                 <td align="left"
//                                 style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:normal;">
//                                 Short Fill E-Liquid x 1</td>
//                             </tr>
//                             <tr>
//                                 <td align="left"
//                                 style="font-family:Exo, sans-serif; font-size:14px; color:#4c4c4c; font-weight:normal;">
//                                 50ml</td>
//                             </tr>-->
//                             </tbody>
//                         </table>
//                         </td>
//                         <td align="right" valign="top"
//                         style="font-family:Exo, sans-serif; font-size:14px; color:#1f283b; font-weight:600;">
//                         £${element.price}</td>
//                     </tr>
//                     </tbody>
//                 </table>
//                 </td>
//             </tr>
//             <tr>
//                 <td colspan="2" height="10" style="border-bottom:solid 1px #ededed"></td>
//             </tr>
//             <tr>
//                 <td colspan="2" height="10"></td>
//             </tr>`;
//         });
//     }

//     return html;
// }

// Order.prototype.cart_detail_html = function(order){
//     var cartTotalHtml = this.cart_total_html(order);
//     var cartSummaryHtml = this.cart_summary_html(order);
//     var cartProductHtml = this.cart_product_html(order);
//     var html = `<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
//         <tbody>
//         ${cartProductHtml}
//         ${cartSummaryHtml}
//         ${cartTotalHtml}
//         </tbody>
//     </table>`;
//     return html;
// }

// Order.prototype.order_detail = function(OrderId){
//     var order = this.data.find(x=>x.id==OrderId);
//     var cartDetailHtml = this.cart_detail_html(order);
//     var ShippingAddress = JSON.parse(order.shipping_address);
//     var BillingAddress = JSON.parse(order.billing_address);
//     $('#OrderDetailModal').find('.modal-content').html(`<div class="modal-header">
//         <h5 class="modal-title w-100" id="OrderDetailModalLabel">Order Detail <span class="float-right font15">Order#
//             <strong>${order.order_id}</strong></span></h5>
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span
//             aria-hidden="true">&times;</span> </button>
//     </div>
//     <div class="modal-body2">
//         <div class="row">
//         <div class="col-12">
//             <table class="table1 main-table" width="100%" align="center" border="0" cellspacing="0" cellpadding="0">
//             <tr>
//                 <td>
//                 ${cartDetailHtml}
//                 </td>
//             </tr>
//             <tr>
//                 <td height="30"></td>
//             </tr>
//             <tr>
//                 <td>
//                 <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0"
//                     style="margin: 0 auto;">
//                     <tr>
//                     <td align="left" style="font-family:Exo, sans-serif; font-size:16px; color:#1f283b; font-weight:600;">Billing & Shipping Information</td>
//                     </tr>
//                     <tr>
//                     <td style="font-family:Barlow, sans-serif; font-size:14px; color:#4c4c4c; font-weight:normal;">
//                         <table class="table1-2" align="left" border="0" cellspacing="1" cellpadding="1"
//                         style="margin: 0 auto;">
//                         <tr>
//                             <td height="10"></td>
//                         </tr>
//                         <tr>
//                             <td align="left" style="font-family:Exo, sans-serif; font-weight:600;">Billing</td>
//                         </tr>
//                         <tr>
//                             <td align="left">${BillingAddress.name}</td>
//                         </tr>
//                         <tr>
//                             <td align="left">${BillingAddress.address1}&nbsp;${BillingAddress.city},&nbsp;${BillingAddress.state}</td>
//                         </tr>
//                         <tr>
//                             <td align="left">${BillingAddress.postal_code}</td>
//                         </tr>
//                         <tr>
//                             <td align="left">${BillingAddress.email}</td>
//                         </tr>
//                         <tr>
//                             <td height="10"></td>
//                         </tr>
//                         <tr>
//                             <td align="left" style="font-family:Exo, sans-serif; font-weight:600;">Payment Method
//                             </td>
//                         </tr>
//                         <tr>
//                             <td align="left">Visa **** **** ****</td>
//                         </tr>
//                         </table>
//                         <table class="table1-2" align="left" border="0" cellspacing="1" cellpadding="1"
//                         style="margin: 0 auto;">
//                         <tr>
//                             <td height="10"></td>
//                         </tr>
//                         <tr>
//                             <td align="left" style="font-family:Exo, sans-serif; font-weight:600;">Shipping</td>
//                         </tr>
//                         <tr>
//                             <td align="left">${ShippingAddress.email}</td>
//                         </tr>
//                         <tr>
//                             <td align="left">${ShippingAddress.address1}&nbsp;${ShippingAddress.city},&nbsp;${ShippingAddress.state}</td>
//                         </tr>
//                         <tr>
//                             <td align="left">${ShippingAddress.postal_code}</td>
//                         </tr>
//                         <tr>
//                             <td align="left">${ShippingAddress.email}</td>
//                         </tr>
//                         <tr>
//                             <td height="10"></td>
//                         </tr>
//                         <tr>
//                             <td align="left" style="font-family:Exo, sans-serif; font-weight:600;">Shipping Method
//                             </td>
//                         </tr>
//                         <tr>
//                             <td align="left">Standard Shipping</td>
//                         </tr>
//                         </table>
//                     </td>
//                     </tr>
//                 </table>
//                 </td>
//             </tr>
//             </table>
//         </div>
//         </div>
//     </div>`);
//     $('#OrderDetailModal').modal('show');

// }

// Order.prototype.customer_detail = function(OrderId){
//     var order = this.data.find(x=>x.id==OrderId);
//     if(!order.customer){
//         $('#OrderCustomerDetail').find('.modal-content').html('No Customer Found...');
//     }else{
//         $('#OrderCustomerDetail').find('.modal-content').html(`<button type="button" class="close close-bt" data-dismiss="modal" aria-label="Close"> <span
//             aria-hidden="true">&times;</span> </button>
//         <div class="modal-body cus-info">
//         <div class="col-12">
//             <img class="cus-img" src="${(order.customer.profile_pic)? order.customer.profile_pic : 'images/avatar.svg'}" alt="">
//         </div>

//         <div class="row pt-10">
//             <div class="col-12 text-center font16 PB-10 pt-10"><strong>${order.customer.first_name+' '+order.customer.last_name}</strong></div>
//             <div class="col-6 text-right"><i class="fa fa-mobile-alt"></i> 0325478741</div>
//             <div class="col-6" style="border-left: solid 1px #333 "><i class="fa fa-envelope"></i> ${order.customer.email}
//             </div>
//             <div class="col-12">
//             <hr class="mt-10 mb-10">
//             </div>
//         </div>

//         <div class="row">
//             <div class="col-12"><strong>Address:</strong> ${(order.street_address)? order.street_address: ''}</div>
//             <div class="col-12 pt-5"><strong>Postcode:</strong> ${(order.postal_code)? order.postal_code : ''}</div>
//             <div class="col-12 pt-5"><strong>Town/City:</strong> ${(order.city)? order.city : ''}</div>
//             <div class="col-12">
//                 <hr class="mt-10 mb-10">
//             </div>

//             <div class="col-12 font16"><strong>Order Notes:</strong></div>
//             <div class="col-12"></div>
//         </div>`);
//     }
//     $('#OrderCustomerDetail').modal('show');
// }


// var order = new Order();
// order.http('GET', '/get-orders').then((e)=>{
//     order.data = JSON.parse(e);
//     const capitalize = (s) => {
//         if (typeof s !== 'string') return ''
//         return s.charAt(0).toUpperCase() + s.slice(1)
//     }
//     order.data.forEach(element => {
//         var orderStatusClass = '';
//         if(element.status=='pending'){
//             orderStatusClass = 'warning';
//         }else if(element.status=='cancel'){
//             orderStatusClass = 'danger';
//         }else if(element.status=='completed'){
//             orderStatusClass = 'success';
//         }
//         $('.table').find('tbody').append(`<tr>
//         <td>${element.id}</td>
//         <td>${element.order_id}</td>
//         <td>${element.created_at}</td>
//         <td>${(element.customer)? element.customer.first_name+ ' '+element.customer.last_name : ''}</td>
//         <td>${(element.customer)? (element.customer.postal_code)? element.customer.postal_code : '' : ''}</td>
//         <td>${(element.customer)? (element.customer.street_address)? element.customer.street_address : '' : ''}</td>
//         <td>£${element.cart_total_price}</td>
//         <td class="text-${orderStatusClass}">${capitalize(element.status)}</td>
//         <td>
//           <button class="btn btn-default btn-line" onclick="order_detail(${element.id})">Order Detail</button>
//           <button class="btn btn-default" onclick="customer_detail(${element.id})">Customer Detail</button>
//         </td>
//       </tr>`);
//     });

//     $('.table').dataTable();
//     $('#tblLoader').hide();
//     $('.body').show();
// });


// function order_detail(orderId){ order.order_detail(orderId); }
// function customer_detail(orderId){ order.customer_detail(orderId); }



$('.table').dataTable({
    "order": [[ 1, "desc" ]]
});
$('#tblLoader').hide();
$('.body').show();

var http = function(type, url, formData){
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
                // self.notification('error', 'Failed to load Wholesalers at the moment');
                // if (err.status == 422) {
                //     $.each(err.responseJSON.errors, function(i, error) {
                //         var el = $(document).find('[name="' + i + '"]');
                //         el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                //     });
                // }
                reject(err);
            }
        });
    });
}


function OrderDetail(OrderId){
    http('GET', `/GetOrderDetailData/${OrderId}`, {}).then((e)=>{
        $('#OrderDetailModal').find('.modal-content').html(e);
        $('#OrderDetailModal').modal('show');
    });
}

function updateOrderStatus(OrderId, status){
    // alert(OrderId);
    http('GET', `/updateOrderStatus/${OrderId}/${status}`, {}).then((e)=>{
        if(e==1)
            $('#statusUpdate').text('Changed Successfully!');
        else
            $('#statusUpdate').text('Something went wrong!');
    });
}

function OrderBreakdown(OrderId){
    http('GET', `/GetOrderBreakdownData/${OrderId}`, {}).then((e)=>{
        $('#OrderOrderBreakdownModal').find('.modal-content').html(e);
        $('#OrderOrderBreakdownModal').modal('show');
        $('#OrderBreakDownDetailTable').dataTable({
            "scrollX": true,
            "paging":   false,
            "bFilter": false,
        });
    });
}

function GetOrderCustomerDetail(CustomerId, OrderId){
    http('GET', `/GetOrderCustomerDetail/${CustomerId}/${OrderId}`, {}).then((e)=>{
        $('#OrderCustomerDetailModal').find('.modal-content').html(e);
        $('#OrderCustomerDetailModal').modal('show');
    });
}
