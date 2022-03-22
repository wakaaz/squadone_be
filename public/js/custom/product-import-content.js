function ProductImportContent(){
    this.datatable1 = null;
    this.category_id = null;
    this.sub_category_id = null;
    this.data = [];
    // this.filename = null;
    // this.sheetname = null;
    // this.filepath = null;
    // this.foldername = null;
    // this.files = [];
    this.DOMErrors = {
        table: `<table class="table table-hover nowrap" id="ErrorsTable">
                    <thead></thead>
                    <tbody></tbody>
                </table>`
    }

    this.isValid = true;
    this.wizardSteps = false;
}

ProductImportContent.prototype.http = function(type, url, formData){
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
            xhr: function () {
				var xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener("progress", function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						percentComplete = parseInt(percentComplete * 100);
						$('.progress-span').text(percentComplete + '%');
						$('.progress-bar').css('width', percentComplete + '%');
					}
				}, false);
				return xhr;
			},
            success: function(e){
                resolve(e);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

ProductImportContent.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}


ProductImportContent.prototype.step_0_1 = function(){
    var category_id = $("#category_id").val();
    var sub_category_id = $("#sub_category_id").val();
    if(category_id=='' || sub_category_id==''){
        PI.notification('error', 'Please fill all mandatory fields.');
        return false;
    }
    this.category_id = category_id;
    this.sub_category_id = sub_category_id;
    return true;
}

ProductImportContent.prototype.step_1_0 = function(){
    return true;
}

ProductImportContent.prototype.step_1_2 = function(){
    if(!this.isValid){
        this.notification('error', 'Your file has some errors.');
        return false;
    }

    return true;
}

ProductImportContent.prototype.step_2_1 = function(){
    return true;
}

ProductImportContent.prototype.step_2_3 = function(){
    this.final_view();
    return true;
}

ProductImportContent.prototype.step_3_2 = function(){
    return false;
}

ProductImportContent.prototype.final_view = function(){
    $("#showFinalView").html(`<img src="/images/loader.gif" width="100">`);
    var formData = new FormData();
    formData.append('data', JSON.stringify(this.data));
    formData.append('category_id', this.category_id);
    formData.append('sub_category_id', this.sub_category_id);
    // formData.append('filename', this.filename);
    // formData.append('filepath', this.filepath);
    // formData.append('foldername', this.foldername);
    this.http('POST', '/product-import-content/step3', formData).then((e)=>{
        setTimeout(() => {
            $("#showFinalView").html(`<img src="/images/success-loader.gif" width="500">`);
        }, 2000);

    }, reason => {
        console.log(reason.responseJSON.message);
        $("#showFinalView").html(`<div class="alert alert-danger" role="alert" style="margin-bottom: 0px;padding:8px 10px; border-radius:0; line-height:normal">${reason.responseJSON.message}
       </div>`);
      });
}

ProductImportContent.prototype.upload_result = function(e){
    this.isValid = true;
    var result = JSON.parse(e);
    var DOMHtml = this.DOMErrors.table;
    // var data = result.result;

    var data = Object.values(result.result, []);
    if(result.status=='error' && result.status_type=="columns"){
        this.isValid = false;
        $("#errorMessages").html(DOMHtml);
        $("#ErrorsTable").find('thead').html(`<tr><td style="padding: 0px;" colspan="2"><div class="col-12" style="padding: 0px;">
        <div class="alert alert-danger" role="alert" style="margin-bottom: 0px;padding:8px 10px; border-radius:0; line-height:normal">Your file is missing with following columns, please add and reupload.
          <i class="fa fa-info-circle float-right"></i>
         </div>
        </div></td></tr>`);
        data.forEach((element, key) => {
            $('#ErrorsTable').find('tbody').append(`<tr><td>${key+1}</td><td class="error-bg-color">${element}</td></tr>`);
        });
    }

    if(this.isValid){
        $("#errorMessages").html(`<div class="col-12" style="text-align: center;">
        <div class="check_mark">
            <div class="sa-icon sa-success animate">
            <span class="sa-line sa-tip animateSuccessTip"></span>
            <span class="sa-line sa-long animateSuccessLong"></span>
            <div class="sa-placeholder"></div>
            <div class="sa-fix"></div>
            </div>
        </div>Congratulation! Your file is validated succesfully.
        </div>`);

        var resultData = result.result;
        this.data = resultData.data;
        // this.filename = resultData.filename;
        // this.sheetname = resultData.sheetname;

        this.set_content_html(e);
    }else{
        $("#ErrorsTable").dataTable();
    }



}

// ProductImportContent.prototype.upload_files_result = function(e){
//     var result = JSON.parse(e);
//     this.filepath = result.path;
//     this.files = result.data;
//     this.foldername = result.foldername;

//     var data = this.data.map(x=>x.sku);
//     data = [...new Set(data)];
//     data.forEach(element => {
//         var product = this.data.find(x=>x.sku==element);
//         $("#productContentTable").find('tbody').append(`<tr>
//         <td>${product.sku}</td>
//         <td>${product.product_name}</td>
//         <td>
//             <button type="button" class="btn btn-default m-0" onclick="check_image('${product.sku}')">Check Images</button>
//         </td>
//     </tr>`);
//     });

//     $("#productContentTable").dataTable();

// }

ProductImportContent.prototype.set_content_html = function(e){
    this.destroy_datatable();
    $("#productContentTable").find('tbody').html('');
    // var result = JSON.parse(e);
    // this.filepath = result.path;
    // this.files = result.data;
    // this.foldername = result.foldername;

    var data = this.data.map(x=>x.sku);
    data = [...new Set(data)];
    data.forEach(element => {
        var product = this.data.find(x=>x.sku==element);
        $("#productContentTable").find('tbody').append(`<tr>
        <td>${product.sku}</td>
        <td>${product.product_name}</td>
        <td>
            <button type="button" class="btn btn-default m-0" onclick="check_content('${product.sku}')">Check Product Content</button>
        </td>
    </tr>`);
    });
    this.set_datatable();
    // $("#productContentTable").dataTable();
}


ProductImportContent.prototype.isDecimalORInt = function(value){
    function IsNumeric(input){
        return (input - 0) == input && (''+input).trim().length > 0;
    }

    if(IsNumeric(value) || Number.isInteger(value)){
        return true;
    }else{
        return false;
    }
}

// ProductImportContent.prototype.check_image = function(sku){
//     var products = this.data.filter(x=>x.sku==sku);
//     var product = products[0];
//     console.log(products);
//     $("#showProductImages").html('');
//     $("#showVariantDetailTable").find('tbody').html('');

//     $("#showProductSKU").html(`<strong>SKU: </strong><br> ${product.sku}`);
//     $("#showProductName").html(`<strong>Product Name: </strong><br> ${product.product_name}`);
//     $("#showProductImage").html(`<img class="img-th" src="https://via.placeholder.com/150/FFFFFF/808080%20?text=No%20Image" alt="">`);
//     var productThumbnail = product.thumbnail;
//     if(productThumbnail!=''){
//         productThumbnail = productThumbnail.split(',');
//         productThumbnail = productThumbnail[0];
//         productThumbnailURL = this.filepath+productThumbnail;
//         $("#showProductImage").html(`<img class="img-th" src="${productThumbnailURL}" alt="">`);
//     }

//     var productImages = product.product_images;
//     if(productImages!=''){
//         productImages = productImages.split(',');
//         productImages.forEach(productImage => {
//             var productImageURL = this.filepath+productImage.trim();
//             $("#showProductImages").append(`<div class="col-4"><img class="gl-img" src="${productImageURL}" alt="" width="100"></div>`);
//         });
//     }

//     if(products.length>0){
//         products.forEach(element => {

//             // var productThumbnail = product.thumbnail;
//             // var productThumbnail = productThumbnail.split(',');
//             // productThumbnail = productThumbnail[0];
//             // productThumbnailURL = this.filepath+productThumbnail;

//             variantImage = this.filepath+element.variant_image;

//             $("#showVariantDetailTable").find('tbody').append(`<tr>
//             <td><img class="variant-img" src="${variantImage}" alt=""></td>
//             <td>${element.variant_barcode}</td>
//             <td>${element.variant_sell_price}</td>
//             <td>${element.variant_cost_price}</td>
//             <td>${element.variant_wholesale_price}</td>
//           </tr>`);
//         });
//     }

//     openSidebar();

// }

ProductImportContent.prototype.check_content = function(sku){
    var products = this.data.filter(x=>x.sku==sku);
    var product = products[0];
    $('#ProductContentShowArea').html('');
    $('#ProductContentShowArea').append(`<div class="col-12 PB-5"><strong>Product SKU:</strong>&nbsp;&nbsp${product.sku}</div>`);
    $('#ProductContentShowArea').append(`<div class="col-12 PB-5"><strong>Product Name:</strong>&nbsp;&nbsp${product.name}</div>`);
    $('#ProductContentShowArea').append(`<div class="col-12"><strong>Brand Name:</strong>&nbsp;&nbsp${product.brand}</div>`);
    $('#ProductContentShowArea').append(`<div class="col-12 PB-5 _head03"><p class="">&nbsp;</p></div>`);
    $('#ProductContentShowArea').append(`<div class="col-12 PB-5"><strong>Short Description:</strong></div>`);
    $('#ProductContentShowArea').append(`<div class="col-12 PB-5">${(product.short_description)? product.short_description.replace(/\n/g, "<br />") : ''}</div>`);
    $('#ProductContentShowArea').append(`<div class="col-12 PB-5 _head03"><p class="">&nbsp;</p></div>`);
    $('#ProductContentShowArea').append(`<div class="col-12 PB-5"><strong>Long Description:</strong></div>`);
    $('#ProductContentShowArea').append(`<div class="col-12 PB-5">${(product.long_description)? product.long_description.replace(/\n/g, "<br />") : ''}</div>`);

    $('#ProductContentShowArea').append(`<div class="col-12 PB-5 _head03"><p class="">&nbsp;</p></div>`);
    $('#ProductContentShowArea').append(`<div class="col-12 PB-5"><strong>Key Features:</strong></div>`);
    $('#ProductContentShowArea').append(`<div class="col-12 PB-5">${product.key_features}</div>`);

    openSidebar();

}


ProductImportContent.prototype.set_datatable = function(){
    this.datatable1 = $("#productContentTable").dataTable();
    // this.datatable2 = $("#PackingMaterialTable").dataTable();
}

ProductImportContent.prototype.destroy_datatable = function(){
    if(this.datatable1) this.datatable1.fnDestroy();
    // if(this.datatable2) this.datatable2.fnDestroy();
}


let PI = new ProductImportContent();

function check_content(sku){
    PI.check_content(sku);
}



function load_sub_cats(id){
    $("#product-import-sample-div").hide();
    PI.http('GET', `/get-sub-cat/${id}`, {}).then((e)=>{
        var subCats = JSON.parse(e);
        $('#sub_category_id').html('<option value="">Select Sub Category*</option>');
        subCats.forEach(element => {
            $('#sub_category_id').append(`<option value="${element.id}">${element.category_name}</option>`);
        });
    });
}

function active_download_sample(){
    if($("#sub_category_id").val()==''){
        $("#product-import-sample-div").hide();
    }else{
        $("#product-import-sample-div").show();
    }
}

$('body').bind("change").on('change', '#uploadImportFile', function(e){
    $("#import-progress-bar").show();
    $("#errorMessages").html('');
    var category_id = $("#category_id").val();
    var sub_category_id = $("#sub_category_id").val();
    var formData = new FormData($("#uploadImportFileForm")[0]);
    formData.append('category_id', category_id);
    formData.append('sub_category_id', sub_category_id);
    PI.http('POST', '/product-import-content/step2', formData).then((e)=>{
        PI.upload_result(e);
        $("#import-progress-bar").hide();
    });
    $("#uploadImportFile").val(null);
});


// $('body').bind("change").on('change', '#uploadImportZipFile', function(e){
//     $("#zip-import-progress-bar").show();
//     var category_id = $("#category_id").val();
//     var sub_category_id = $("#sub_category_id").val();
//     var formData = new FormData($("#uploadImportFileZipForm")[0]);
//     formData.append('category_id', category_id);
//     formData.append('sub_category_id', sub_category_id);
//     formData.append('filename', PI.filename);
//     formData.append('sheetname', PI.sheetname);
//     PI.http('POST', '/product-import/step3', formData).then((e)=>{
//         PI.upload_files_result(e);
//         $("#zip-import-progress-bar").hide();
//     });
//     $("#uploadImportZipFile").val(null);
// });


function download_file(){
    var category_id = $("#category_id").val();
    var sub_category_id = $("#sub_category_id").val();
    window.location = `/product-import-content/step1/${category_id}/${sub_category_id}`;
}

function creating_wizard(){
    PI.wizardSteps = $("#product-import-advanced-form").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        onInit: function(){
            $("#category_id").select2();
            $("#sub_category_id").select2();
        },
        onStepChanging: function (event, currentIndex, newIndex)
        {
            action = true;

            if(currentIndex==0 && newIndex==1){
                action = PI.step_0_1(event, currentIndex, newIndex);
            }

            if(currentIndex==1 && newIndex==0){
                action = PI.step_1_0(event, currentIndex, newIndex);
            }



            if(currentIndex==1 && newIndex==2){
                action = PI.step_1_2(event, currentIndex, newIndex);
            }

            if(currentIndex==2 && newIndex==1){
                action = PI.step_2_1(event, currentIndex, newIndex);
            }



            if(currentIndex==2 && newIndex==3){
                action = PI.step_2_3(event, currentIndex, newIndex);
            }

            if(currentIndex==3 && newIndex==2){
                action = PI.step_3_2(event, currentIndex, newIndex);
            }

            return action;
        },
        onFinishing: function (event, currentIndex)
        {
            return true;
        },
        onFinished: function (event, currentIndex)
        {
            location.reload();
        }
    });
}

setInterval(() => {
    if(PI.wizardSteps==false){
        creating_wizard();
    }
}, 500);
