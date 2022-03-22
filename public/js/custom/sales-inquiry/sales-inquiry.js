function getInquiryDetails(id){
    
    $.ajax({
        url:`getInquiryDetail/${id}`,
        type:'GET',
        success:function(response){
            if(response){
                inquiry = JSON.parse(response);
                var html = `<div class="col-4 pr-0">
                <div class="_boxgray"><strong>Name:</strong><br> ${inquiry.name}</div>
              </div>

              <div class="col-4 pr-0">
                <div class="_boxgray"><strong>Mobile Number:</strong><br> ${inquiry.mobile_number}</div>
              </div>

              <div class="col-4">
                <div class="_boxgray"><strong>Email ID:</strong><br>${inquiry.email}</div>
              </div>

              <div class="col-12 PT-15">
                <div class="_boxgray"><strong>Category url:</strong>${inquiry.catagory_url}</div>
              </div>`;

              $('#detail').html(html);
              $('#detail_of_inquiry').text(`${inquiry.detail}`);
            }
        }
    })
}




