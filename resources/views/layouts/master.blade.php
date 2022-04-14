<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="csrf_token" content="{{ csrf_token() }}">

    <title>{{ config('app.name') }}</title>

    <link href="https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,600,700,800" rel="stylesheet">
    {{-- <link href="https://fonts.googleapis.com/css2?family=Rationale&display=swap" rel="stylesheet">  --}}
    {{-- @import url('https://fonts.googleapis.com/css2?family=Rationale&display=swap'); --}}
    <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css?v=1.0">
    <link href="/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="/css/datatables.min.css" />
    <link rel="stylesheet" type="text/css" href="/css/select2.min.css">
    <link rel="stylesheet" type="text/css" href="/css/select2-bootstrap4.css">
    <link rel="stylesheet" type="text/css" href="/css/dropify.min.css" />
    <link rel="stylesheet" type="text/css" href="/css/dropzone.css" />
    <link rel="stylesheet" type="text/css" href="/css/datepicker.css?v=1.1" />
    <link rel="stylesheet" href="/css/selectize.css?v=1.1">

    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/tag-editor/1.0.20/jquery.tag-editor.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/tag-editor/1.0.20/jquery.tag-editor.min.css.map" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Exo:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
        #notifDiv {
            display: none;
            background: red;
            color: white;
            font-weight: 400;
            font-size: 15px;
            width: 350px;
            position: fixed;
            top: 80%;
            left: 10%;
            z-index: 10000;
            padding: 10px 20px
        }

        #addMoreProductsInOrder:hover {
            color: white !important
        }

        #product-cl-sec {
            box-shadow: 0px 0px 100px 0px rgba(0, 0, 0, 0.5);
        }

        .overlay-for-sidebar {
            display: none;
            position: fixed;
            width: 100vw;
            height: 100vh;
            z-index: 998;
            opacity: 0;
        }

        .select2 {
            width: 100% !important;
            z-index: 999
        }

        .dz-image img {
            width: 100%;
            height: 100%;
        }

        .peventsDisabled {
            pointer-events: none
        }

        .datepicker-dropdown {
            z-index: 1060 !important;
        }

        #repDelayBtn:hover,
        #addProdBtn:hover,
        #markComplBtn:hover {
            color: white !important
        }

    </style>


    <!-- <script src="https://cdn.datatables.net/1.11.3/js/jquery.dataTables.min.js"></script> -->
   


    <link href="/css/wizard.css" rel="stylesheet" type="text/css" />
    <link href="/css/jquery.steps.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/css/style.css?v=2.0">
    <link rel="stylesheet" type="text/css" href="/css/product.css?v=2.0">
    <link rel="stylesheet" type="text/css" href="/css/menu.css?v=2.3" />
    <link rel="stylesheet" type="text/css" href="/css/dash-board.css?v=1.1" />
    <link rel="stylesheet" type="text/css" href="/css/dashboard-new.css?v=1.1" />
    <link rel="stylesheet" type="text/css" href="/css/jquery.mCustomScrollbar.css" />
    <link rel="stylesheet" href="/css/animate.css">
    <link href="/summernote/summernote-bs4.min.css" rel="stylesheet">
    <link href="/chosen_v1.8.7/chosen.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/css/fSelect.css"> 

    
    
    
   
 

    
     
    @yield('page-style')
</head>

<body id="page-top">

    <div id="notifDiv">
    </div>

    <button class="notAllowedError" style="display: none" data-toggle="modal"
        data-target=".supplierProductAssignmentModal"></button>

    <?php
        $uri_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri_segments = explode('/', $uri_path);
    ?>

    {{-- @include('includes.nav') --}}
    @include('includes.modals')
    <div id="wrapper">
        {{-- @include('includes.sidebar-menu') --}}
        @include('includes.nav-new')
        <div id="content-wrapper">
            <div class="overlay-blure"></div>
            <div class="overlay-for-sidebar" style="display: none"></div>
            @include('includes.alerts')
            <div class="container {{$uri_segments[1] == 'dashboard' ? '_dashboard' : ''}}">
                <div class="md-header-fixed">
                    <div class="MD__Logo"><img src="images/allomate.svg" alt="" /></div>
                    <button class="mobile__toggler" id="modalShow"><span></span></button>
                </div>
                @yield('data-sidebar')
                <div id="contentContainerDiv" class="blur-div">
                    @yield('content')
                </div>
            </div>
            @include('includes.footer')
        </div>
    </div>
   
    
    
    <script src="/js/jquery-3.3.1.slim.min.js"></script>
    <script src="/js/popper.min.js"></script>
    {{-- <script src="/js/bootstrap.min.js"></script> --}}
    <script src="/js/datatables.min.js"></script>
    <script src="/js/select2.min.js"></script>
    <script src="/js/dropify.min.js"></script>
    <script src="/js/form-file-upload-data.js"></script>
    <script src="/js/custom.js"></script>
    <script src="/js/jquery.form.min.js"></script>
    <script src="/js/selectize.min.js?v=1.1"></script>
    <!-- <script src="/js/chart.bundle.min.js"></script> -->
    <!-- <script src="/js/chartjs.js"></script> -->
    <!-- <script src="js/chartjs-plugin-labels.js"></script> -->
    <script src="/js/dashboard-data.js"></script>
    <script src="/js/echarts-en.min.js"></script>
    <script src="/js/echarts-liquidfill.min.js"></script>
    <script src="/js/jquery.nestable.js"></script>
    <script src="/js/AudioPlayer.js?v=1.0"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/jquery.mark.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="/js/daterangepicker.js?v=1.0"></script>
    <script src="/js/jquery.mCustomScrollbar.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/css/daterangepicker.css" />
    <script src="/js/bootstrap-datepicker.js?v=1.1"></script>
    <script src="/js/dropzone.js"></script>
    <script src="/summernote/summernote-bs4-customize.js"></script>
    <script src="/chosen_v1.8.7/chosen.jquery.min.js"></script>
    <!-- @if($controller !== 'Categories')
    <script src="/js/ffSelect.js"></script>
    @endif
    @if($controller == 'Categories' && $action !== 'index')
    <script src="/js/ffSelect.js"></script>
    @endif -->
    <script src="https://cdn.datatables.net/buttons/2.1.0/js/dataTables.buttons.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.1.0/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.1.0/js/buttons.print.min.js"></script>

    <script>
        var siteUrl = '{!! URL("/") !!}';
        var rightsGiven = JSON.parse('{!! json_encode($userPermissions) !!}');
        var allControllersData = JSON.parse('{!! json_encode($allControllers) !!}');
        var controller = '{!! $controller !!}';
        var currentSegment = '{!! Request::segment(1) !!}';
        var loggedInUser = '{!! json_encode(["user_id" => Auth::user()->id, "name" => Auth::user()->first_name, "picture" => Auth::user()->picture]) !!}';
        loggedInUser = JSON.parse(loggedInUser);
        $(".sortable").sortable();
        var csrfToken = $('[name="csrf_token"]').attr('content');
        var controllerAction = '{!! $action !!}';
        // var SummerNoteSetting = {
        //     fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Roboto', 'Exo'],
        //     fontNamesIgnoreCheck: ['Exo'],
        //     height: 250,
        //     callbacks: {
        //         onInit: function(e, a){
        //             setTimeout(() => {
        //                 CreatLinkDilogeSetting();
        //             }, 2000);
        //         },
        //         onImageUpload: function(image) {
        //             uploadSummernoteImage(image[0], $(this));
        //         },
        //         onMediaDelete : function(target) {
        //             deleteSummnernoteImage(target[0].src);
        //         }
        //     }
        // };
        var SummerNoteSetting = {
            fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Roboto', 'Exo', 'Extra-light 200'],
            fontSizes: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '20', '22' , '24', '28', '32', '36', '40', '48'],
            fontNamesIgnoreCheck: ['Exo'],
            height: 250,
            popover: {
                air: [
                ['color', ['color']],
                ['font', ['bold', 'underline', 'clear']]
                ]
            },
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview', 'help']],
            ],
            callbacks: {
                onInit: function(e, a){
                    setTimeout(() => {
                        CreatLinkDilogeSetting();
                    }, 2000);
                },
                onImageUpload: function(image) {
                    uploadSummernoteImage(image[0], $(this));
                },
                onMediaDelete : function(target) {
                    deleteSummnernoteImage(target[0].src);
                }
            }
        };
    </script>

    <script src="/js/master.js?v={{ time() }}"></script>

    <script src="/js/custom/nav.js?v=1.2.0"></script>
    @yield('page-scripts')

    @stack('js')    
</body>

</html>
