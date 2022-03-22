function ProductContent(){

}

ProductContent.prototype.http = function(type, url, formData){
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
                reject(err);
            }
        });
    });
}

var PC = new ProductContent();

$(".body").show();
$("#tblLoader").hide();

$(".listTable").dataTable();


$(document).ready(function () {
    $("#sortable").sortable({
        connectWith: '#sortable',
        items: '.sortable-moves',
        handle: '.summernote-handler',
        tolerance: 'pointer',
        // revert: true,
        // start: function(){ $('.summernote-content').toggle(); },
        // stop: function(){ $('.summernote-content').toggle(); }
    });
    // $("#sortable").disableSelection();
  });



$(document).ready(function() {
    $('#contentSummernoteAdd').summernote(SummerNoteSetting);
    $('.content-summernote').summernote(SummerNoteSetting);
});

function removeProductSection(id){
    $(`#product-section-row-${id}`).remove();
}

function add_new_section(){
    if(!$("#collapsePOCdetail").hasClass('show')){
        $('#collapsePOCdetail').collapse("show");
        return false;
    }
    var counter = $("#counter").val();
    var isCollapsed = 0;
    if($('#isCollapsedAdd').is(':checked')){
        isCollapsed = 1;
    }
    var formData = new FormData();
    formData.append('title', $("#add-title").val());
    formData.append('content', $("#contentSummernoteAdd").val());
    formData.append('counter', counter);
    formData.append('is_collapsed', isCollapsed);
    PC.http('POST', '/add-product-content-section', formData).then((e)=>{
        $("#sortable").append(e);
        $("#counter").val(parseInt(counter)+1);
        $('#collapsePOCdetail').collapse("hide");
        $("#add-title").val('');
        $("#add-content").val('');
        $('#contentSummernoteAdd').summernote('reset');
    });

}
