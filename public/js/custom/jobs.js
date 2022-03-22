$(document).ready(function () {
   $('.required').on('click',function(){
      $(".required").each(function () {
         if ($(this).val()) {
            $(this).css("border", "0px");
         }
      });
   })
   $('#submit_job').on('click', function () {
      var validation = false;
      $(".required").each(function () {
         if (!$(this).val() || $(this).val() == '' || $(this).val() == ' ') {
            $(this).css("border", "1px solid red");
            validation = true;
         }
      });
      if($('#number_of_positions').val() == 0){
         $(this).css("border", "1px solid red");
         $("#notifDiv").fadeIn();
         $("#notifDiv").css("background", "red");
         $("#notifDiv").text(
            "Please provide all the required information (*)"
         );
         setTimeout(() => {
            $("#notifDiv").fadeOut();
         }, 3000);
         return;
      }
      if($('#number_of_positions').val() == 0){
         $(this).css("border", "1px solid red");
         $("#notifDiv").fadeIn();
         $("#notifDiv").css("background", "red");
         $("#notifDiv").text(
            "Please provide all the required information (*)"
         );
         setTimeout(() => {
            $("#notifDiv").fadeOut();
         }, 3000);
         return;
      }
      var emp_type = $('#employment_type').find(":selected").val();
      if(emp_type == 0){
         $("#notifDiv").fadeIn();
         $("#notifDiv").css("background", "red");
         $("#notifDiv").text(
            "Please Select Employment Type"
         );
         setTimeout(() => {
            $("#notifDiv").fadeOut();
         }, 3000);
         return;
      }
      if (validation) {
         $("#notifDiv").fadeIn();
         $("#notifDiv").css("background", "red");
         $("#notifDiv").text(
            "Please provide all the required information (*)"
         );
         setTimeout(() => {
            $("#notifDiv").fadeOut();
         }, 3000);
         return;
      } else {
         var ajaxUrl = "/post-job";
         if($('#job_id').val() != ''){
            var id = $('#job_id').val()
            ajaxUrl = `/post-job/${id}`
         }
        $('#form_submit').ajaxSubmit({
            url : ajaxUrl,
            success : function(e){
               window.location = '/view-jobs';
            }
        })
      }
   })
})

