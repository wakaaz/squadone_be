var sell360_AllContacts = [];
var sell360_AllRequests = [];
var sell360_AllCareers = [];
var url = '';
$(document).ready(function () {
    var segments = location.href.split('/');
    if (segments[3] == 'sell360') {
        fetchSell360Data();
    }

    $(document).on('click', '.view_detail', function(){
        var thisRef = $(this);
        var web = thisRef.attr('web');
        var id = thisRef.attr('id');
        var type = thisRef.attr('type');
        $('.type_name_heading').text(type);
        if(web == 'sell360'){ 
            if(type == 'Contact Us'){
                $('.contact_sell360_detail').show()
                $('.request_sell360_detail').hide() 
                $('.career_sell360_detail').hide() 
                jQuery.map(sell360_AllContacts, function(n, i){
                    if(n.id == id){
                        $('.name_contact_sell360').val(n.name);
                        $('.phone_contact_sell360').val(n.phone);
                        $('.email_contact_sell360').val(n.email);
                        $('.subject_contact_sell360').val(n.subject);
                        $('.message_contact_sell360').val(n.message);
                    }
                });
            }else if(type == "Request Demo"){
                $('.contact_sell360_detail').hide()
                $('.request_sell360_detail').show() 
                $('.career_sell360_detail').hide() 
                jQuery.map(sell360_AllRequests, function(n, i){
                    if(n.id == id){
                        $('.name_request_sell360').val(n.name);
                        $('.companyName_request_sell360').val(n.company_name);
                        $('.phone_request_sell360').val(n.phone);
                        $('.email_request_sell360').val(n.email);
                        $('.industry_request_sell360').val(n.industry);
                        $('.personnels_request_sell360').val(n.num_of_personnels);
                        $('.city_request_sell360').val(n.city);
                        $('.message_request_sell360').val(n.message);
                    }
                });
            }else{
                $('.contact_sell360_detail').hide()
                $('.request_sell360_detail').hide() 
                $('.career_sell360_detail').show() 
                jQuery.map(sell360_AllCareers, function(n, i){
                    if(n.id == id){
                        $('.fName_career_sell360').val(n.fName);
                        $('.lName_career_sell360').val(n.lName);
                        $('.email_career_sell360').val(n.email);
                        $('.phone_career_sell360').val(n.phone);
                        $('.linkedin_career_sell360').val(n.linkedin);
                        $('.career_career_sell360').val(n.career);
                        $('.intro_career_sell360').val(n.intro);
                        $('.attachment_career_sell360').attr('href', url+n.resume);
                        $('.attachment_career_sell360').text(n.resume); 
                    }
                });
            }
        }
    })
})

function fetchSell360Data(){
    $.ajax({
        type: 'GET',
        url: '/fetchSell360Data',
        success: function (response) {
            var response = JSON.parse(response);
            sell360_AllContacts = response.contact_us;
            sell360_AllRequests = response.request_demo;
            sell360_AllCareers = response.career;
            url = response.url;

            $('.count_sell360_contact').text(response.contact_us.length);
            $('.count_sell360_request').text(response.request_demo.length);
            $('.count_sell360_career').text(response.career.length);
            
            $('.body_sell360_contact').empty();
            $('.body_sell360_request').empty();
            $('.body_sell360_career').empty();

            $('.body_sell360_contact').append('<table class="table table-hover dt-responsive nowrap" id="contactUs" style="width:100% !important"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Subject</th><th>Action</th></tr></thead><tbody></tbody></table>');
            $('.body_sell360_request').append('<table class="table table-hover dt-responsive nowrap" id="requestDemo" style="width:100% !important"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>NOP</th><th>Action</th></tr></thead><tbody></tbody></table>');

            $('.body_sell360_career').append('<table class="table table-hover dt-responsive nowrap" id="Career" style="width:100% !important"><thead><tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Phone</th><th>Action</th></tr></thead><tbody></tbody></table>'); 
 
            response.contact_us.forEach(element => {
                $('#contactUs tbody').append(`<tr><td>${element['name']}</td><td>${element['email']}</td><td>${(element['phone'])}</td><td>${element['subject']}</td><td><button data-toggle="modal" data-target=".WebsitesDetailModal" class="btn btn-default btn-line view_detail" type="Contact Us" web="sell360" id="${element['id']}">Detail</button></td></tr>`);
            });
            response.request_demo.forEach(element => {
                $('#requestDemo tbody').append(`<tr><td>${element['name']}</td><td>${element['email']}</td><td>${(element['phone'])}</td><td>${element['num_of_personnels']}</td><td><button data-toggle="modal" data-target=".WebsitesDetailModal" class="btn btn-default btn-line view_detail" type="Request Demo" web="sell360" id="${element['id']}">Detail</button></td></tr>`);
            });
            response.career.forEach(element => {
                $('#Career tbody').append(`<tr><td>${element['fName']}</td><td>${element['lName']}</td><td>${(element['email'])}</td><td>${element['phone']}</td><td><button data-toggle="modal" data-target=".WebsitesDetailModal" class="btn btn-default btn-line view_detail" type="Career" web="sell360" id="${element['id']}">Detail</button></td></tr>`);
            });

            
            $("#contactUs").DataTable();
            $("#requestDemo").DataTable();
            $("#Career").DataTable();
            $('.tblLoader').hide();
        }
    });
}