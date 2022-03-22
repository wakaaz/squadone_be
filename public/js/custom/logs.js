http = function(type, url, formData){
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
                console.log(err);
                if (err.status == 422 || err.status == 500) {
                    self.notification('error', 'Some Error Occured, please try again.');
                }

                $("#promotionForm").show();
                $("#tblLoader").hide();
            }
        });
    });
}
$('.table').dataTable();

function LogDetail(type, filename){
    // http('GET', `/frontend-logs/${filename}`).done(()=>{

    // });
    if(type=='frontend'){
        window.location = `/frontend-logs/${filename}`;
    }
    if(type=='backend'){
        window.location = `/backend-logs/${filename}`;
    }
}
