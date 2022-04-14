
    var operation = "add";
    var id_of_faq_to_update;
    $(document).ready(function() {
        $('#pl-close, .overlay').on('click', function() {
            $('#product-cl-sec').removeClass('active');
            $('.overlay').removeClass('active');
            $('body').toggleClass('no-scroll')
            operation = 'add';
            id_of_faq_to_update = null;
            $('#question').val(' ');
            $('#awnser').val(' ');
        });

        $('#productlist01').on('click', function() {
            $('#product-cl-sec').addClass('active');
            $('.overlay').addClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
            $('body').toggleClass('no-scroll')
            $('#question').val('');
            $('#awnser').val('');
        });

        $('#SN-close, .overlay-blure').on('click', function() {
            $('#_subNav-id').removeClass('active');
            $('#content-wrapper').removeClass('blur-div');
            $('body').removeClass('no-scroll')
        });
        $('#sidebar-menu').on('click', function() {
            $('#_subNav-id').addClass('active');
            $('#content-wrapper').addClass('blur-div');
            $('body').addClass('no-scroll')
        });

    });

    function save_faq() {
        
        data = new FormData();
        var question = $('#question').val();
        var awnser = $('#awnser').val();
        data.append('question', question);
        data.append('awnser', awnser);
        url = 'add-frequently-asked-question';
        if(operation == 'edit'){
            url = `add-frequently-asked-question/${id_of_faq_to_update}`;
        }
        $.ajax({
            type: 'POST',
            url: url,
            contentType: false,
            processData: false,
            data: data,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
            },
            success: function(e) {
                if(e == 'success'){
                    notification('success','faq saved successfully');
                    $('#question').val(' ');
                    $('#awnser').val(' ');
                    $('#pl-close').click();
                    updateDatatabel();
                    operation = "add";
                    id_of_faq_to_update = null;
                }
            },
            error: function(e) {
                alert(e);
            }
        })
    }
    function updateDatatabel(){
        $.ajax({
            url:'get-all-faqs',
            success:function(e){
                if(e.length > 0 ){
                    $('#example body').empty();
                    if ($.fn.DataTable.isDataTable("#example")) {
                        $('#example').DataTable().clear().destroy();
                    }
                    $('#table_body').empty();
                    var table =`<table class="table table-hover dt-responsive nowrap" id="example" style="width:100%">
                        <thead>
                            <tr>
                                <th>FAQ</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                        </tbody>
                    </table>`;
                    $('#table_body').html(table);
                    e.forEach(element => {
                        var row =`<tr>
                                <td>${element.question}</td>
                                <td>
                                    <button class="btn btn-default btn-line" onclick="get_faq_detail(${element.id})">Edit</button>
                                    <button class="btn btn-default red-bg" onclick="delete_faq(${element.id})">Delete</button>
                                </td>
                            </tr>`;
                        $('#example').find('tbody').append(row);
                    });
                    $('#example').dataTable();
                }else{
                    $('#example body').empty();
                    if ($.fn.DataTable.isDataTable("#example")) {
                        $('#example').DataTable().clear().destroy();
                    }
                    $('#table_body').empty();
                    var table =`<table class="table table-hover dt-responsive nowrap" id="example" style="width:100%">
                        <thead>
                            <tr>
                                <th>FAQ</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                        </tbody>
                    </table>`;
                    $('#table_body').html(table);
                    $('#example').dataTable();
                }
            }
        })
    }
    function get_faq_detail(id){
        $.ajax({
            url:`get-faq/${id}`,
            success: function(e){
                if(e){
                    $('#productlist01').click();
                    $('#question').val(e.question);
                    $('#awnser').val(e.answer);
                    operation = 'edit';
                    id_of_faq_to_update = e.id;
                }
            },
            error : function (e){
                notification('error','something went wrong');
            }
        })
    }
    function delete_faq(id){
        $.ajax({
            url:`delete-faq/${id}`,
            success: function(e){
                if(e == 'success'){
                    notification('success','faq Deleted Successfully'); 
                    updateDatatabel()
                }
                if(e != 'success'){
                    notification('error','Something Went Wrong'); 
                }
            }
        })
    }


    $('.form-control').on('focus blur', function(e) {
            $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
        })
        .trigger('blur');