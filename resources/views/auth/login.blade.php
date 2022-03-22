<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>{{ config('app.name') }}</title>
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,600,700,800" rel="stylesheet">
    <link rel="stylesheet" href="/css/bootstrap.min.css">

    <!-- Custom fonts for this template-->
    <link href="/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="/css/style.css" rel="stylesheet">
</head>
<body class="bg_main">
    <div id="wrapper" class="EbobBGImg">
        <div class="log_con">
            <div class="container">
                <img class="Loging-Logo" src="/images/allomate-logow.svg" alt="" />
                <!-- Row -->
                <div class="table-struct full-width">
                    <div class="table-cell vertical-align-middle auth-form-wrap">
                        <div class="auth-form">
                            <div class="row m-0">
                                <div class="col-md-12 col-height">
                                    <div class="login-right">
                                        <div style="width: 310px; margin: auto">
                                            <h3 class="mb-20">LOG <span>IN </span></h3>
                                            {{-- <span class="invalid-feedback" role="alert">
                                                <strong>{{ $errors->first('username') }}</strong>
                                            </span> --}}
                                            <form method="POST" action="{{ route('login') }}">
                                                @csrf
                                                <div class="form-group">
                                                    <div class="user"> <span class="fa fa-user-alt"></span>
                                                        <input id="username" type="username" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="username" value="{{ old('email') }}" placeholder="Username" required autofocus>
                                                    </div>
                                                    @if ($errors->has('username'))
                                                    <span class="invalid-feedback" role="alert" style="display:block !important">
                                                        <strong>{{ $errors->first('username') }}</strong>
                                                    </span>
                                                    @endif
                                                </div>
                                                <div class="form-group">
                                                    <div class="clearfix"></div>
                                                    <div class="pass"> <span class="fa fa-unlock"></span>
                                                        <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" placeholder="password" required>

                                                        @if ($errors->has('password'))
                                                        <span class="invalid-feedback" role="alert">
                                                            <strong>{{ $errors->first('password') }}</strong>
                                                        </span>
                                                        @endif
                                                    </div>
                                                </div>
                                                @if (Route::has('password.request'))
                                                <a class="f_pass" href="{{ route('password.request') }}">Forgot
                                                    password?</a>
                                                @endif
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-info btn-login">LOG
                                                        <span>IN</span></button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Log_footer"> Copyright © 2020 Allomate Solutions All rights reserved.</div>
            </div>

        </div>
    </div>

    <script src="/js/jquery-3.3.1.slim.min.js"></script>
    <script src="/js/popper.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>

</body>

</html>