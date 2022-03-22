// console.log($('.body-summernote'));
$(document).ready(function(){
    if($('.body-summernote').length>0){
        SummerNoteSetting.height = 350;
        $('.body-summernote').summernote(SummerNoteSetting);
    }

    if($('.listTable').length>0){
        $('.listTable').dataTable();
    }

    $(`#user_id`).select2();
})

