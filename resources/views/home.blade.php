@extends('layouts.master')
@section('content')
<style>
    @import url('https://fonts.googleapis.com/css2?family=Rationale&display=swap');

    ._head01 {
        font-size: 22px;
        color: #282828;
        font-weight: 600;
    }

    .R-Heading {
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        font-size: 22px;
        letter-spacing: 5px;
        padding-left: 10px;
        line-height: 1;
        width: 347px;
        position: absolute;
        left: -155px;
        top: 200px
    }

    .open-Report,
    .open-ReportHOVER {
        font-size: 18px;
        text-align: center;
        color: #fff !important;
        padding: 10px 8px 18px 8px;
        display: block
    }

    .RB_bar {
        color: #fff;
        height: 100vh;
        width: 40px;
        background: linear-gradient(90deg, #2aa4d3 0%, #001e35 100%);
        position: absolute
    }

    ._left-filter {
        padding-top: 0
    }

    .FU-history {
        margin-top: 0
    }

    .seabinReport {
        padding-bottom: 15px
    }

    .seabinReport .card {
        background-color: #fff;
        border: none;
        padding: 10px 15px;
        margin: 15px 0px;
        border-radius: 0px;
        position: relative;
        box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
        background-image: url(images/bg-for-states-g.jpg);
        background-position: bottom left;
        background-repeat: no-repeat;
        background-size: auto;
        height: 110px
    }

    .seabinReport .card:before {
        background: #f12300;
        position: absolute;
        width: 2px;
        height: 35px;
        left: 0px;
        top: 14px;
        content: '';
    }

    .seabinReport h2 {
        font-size: 18px;
        padding-top: 15px;
        margin-bottom: 15px;
        display: block
    }

    .seabinReport h4 {
        font-size: 20px;
        padding: 0;
        margin: 0;
        color: #001e35;
        letter-spacing: 1px
    }

    .seabinReport h4 span {
        display: block;
        font-size: 15px;
        color: #888888;
        padding-top: 0px;
        position: relative;
        margin-top: 0px
    }

    .seabinReport .digit {
        font-size: 35px;
        font-weight: normal;
        line-height: normal;
        color: #282828;
        margin-bottom: 0;
        padding-bottom: 0;
        line-height: 1;
        font-family: 'Rationale', sans-serif !important;
        position: absolute;
        bottom: 10px;
        right: 15px
    }

    .seabinReport .head-font {
        font-size: 16px
    }

    .seabinReport .card .cardicon {
        width: 50px;
        position: absolute;
        top: 15px;
        right: 15px
    }

    ._user_Pimage {
        border: solid 1px #001e35;
    }

    .TopTagItem {
        background-color: #fff;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-bottom: 30px;
        box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
    }

    .TopTagItem h2 {
        margin-bottom: 15px;
        line-height: 1;
        color: #001e35;
        font-size: 16px;
        padding-top: 10px;
        font-weight: 600;
    }

    .TopTagItem .digit {
        font-size: 22px;
        font-weight: normal;
        line-height: normal;
        line-height: 1;
        font-family: 'Rationale', sans-serif !important;
        color: #282828;
        padding-bottom: 10px
    }

    .Vdigit {
        font-size: 35px;
        color: #001e35;
        display: block;
        padding-bottom: 10px
    }

    .TopTagItem h3 {
        color: #fff;
        font-size: 13px;
        letter-spacing: 1px;
        text-align: center;
        padding: 5px;
        background-color: #001e35;
        margin-bottom: 0
    }

    .TopTagItem h3 span {
        font-family: 'Rationale', sans-serif !important;
        font-size: 17px;
        font-weight: normal
    }

    .TopTagItem .row {
        margin-left: 10px;
        margin-right: 10px
    }

    .TopTagItem .col {
        padding-left: 5px;
        padding-right: 5px;
        ;
        padding-top: 10px;
        text-align: center;
        border-right: solid 1px #e3e3e3;
        max-width: 225px;
    }

    ._dashTOP {
        padding-top: 0
    }

    .btnActivView {
        border: solid 1px #001e35;
        font-size: 13px;
        padding: 1px 10px;
        margin: 10px 0 5px 0px;
        border-radius: 0;
        background: #001e35;
        color: #fff;
        letter-spacing: 1px;
        display: inline-block
    }

    .btnActivView:HOVER {
        border: solid 1px #282828;
        background: #282828;
        color: #fff;
        text-decoration: none
    }

    .view-all-EA:HOVER {
        background: linear-gradient(90deg, #282828 0%, #282828 100%);
        border: solid 1px #282828
    }

    .HomeHead {
        font-size: 20px;
        border-bottom: solid 2px #e3e3e3;
        padding-bottom: 10px;
        margin-bottom: 15px;
    }

    .NoAct .btn-primary {
        border: none
    }

    .DashHomeLink,
    .DashHomeLink:HOVER {
        text-decoration: none;
        display: block;
        transition: all 0.2s ease-in-out;
    }

    .DashHomeLink:HOVER .card {
        box-shadow: 2px 2px 15px 0 rgba(79, 79, 79, .5);

    }

    .DashHomeLink:HOVER {
        margin-top: -5px;
        transition: all 0.2s ease-in-out;
    }

    .follow_action {
        background-image: url(images/dash-card-bg.png);
        background-position: top right;
        background-repeat: no-repeat;
        background-size: 70%;
        background-color: rgba(255, 255, 255, 0.8);
        border-top: 3px solid #fff;
        padding: 15px;
        border-radius: 0px;
        text-align: center;
        margin-bottom: 40px;
        -webkit-box-shadow: 2px 2px 10px 0 rgba(79, 79, 79, .2);
        -moz-box-shadow: 2px 2px 10px 0 rgba(79, 79, 79, .2);
        box-shadow: 2px 2px 10px 0 rgba(79, 79, 79, .2);
        display: block;
        font-size: 15px;
        color: #282828;
        -webkit-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
        width: 100%;
        height: 200px;
        font-weight: 600;
        float: left
    }

    .follow_action:HOVER {
        border-top: 3px solid #001e35;
        color: #001e35;
        text-decoration: none;
        -webkit-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
        -webkit-box-shadow: 2px 2px 20px 0 rgba(79, 79, 79, .3);
        -moz-box-shadow: 2px 2px 20px 0 rgba(79, 79, 79, .3);
        box-shadow: 2px 2px 20px 0 rgba(79, 79, 79, .3);
        background-position: top right;
        margin-top: -5px
    }

    .follow_action span {
        margin: auto;
        width: 100%
    }

    .follow_action .img-svg img {
        width: 60px;
        height: auto;
        display: block;
        margin: auto;
        margin-bottom: 10px
    }

    ._user-TS {
        margin-bottom: 15px;
    }

    ._dashTOP {
        padding-bottom: 15px;
        padding-right: 0;
        padding-top: 15px
    }

    ._dashTOP ._head01 {
        font-size: 22px;
        padding-top: 7px;
        margin-bottom: 10px;
        margin-top: 0
    }

    ._dashTOP span {
        color: #001e35
    }

    ._dashTOP p {
        margin: 0;
        display: block
    }

    ._user_Pimage {
        width: 38px;
        height: 38px;
        border: solid 1px #f12300;
        background-color: #FFF;
        padding: 1px;
        border-radius: 50%;
        float: left;
        margin-right: 10px
    }

    .seabinReport .todaysale {
        margin: 0;
        padding: 0;
        position: absolute;
        letter-spacing: 0.5px;
        top: 12px;
        right: 15px;
        font-family: 'Rationale', sans-serif;
        font-size: 22px;
    }

    .seabinReport .todaysale span {
        color: #001e35;
        font-size: 16px;
    }

    .seabinReport .todaysale .grayc,
    .grayc {
        color: #7f7f7f !important;
        font-size: 22px !important;
        font-weight: 200 !important
    }

    .TopTagItem img {
        width: 75%;
        height: auto;
        margin-bottom: 10px;
    }

    .TopTagItem .grayc {
        padding-left: 10px;
        padding-right: 10px;
    }
</style>
<?php
$hour = date('H');
$greetings = '';
if ($hour >= 20) {
    $greetings = 'Good Night';
} elseif ($hour > 17) {
    $greetings = 'Good Evening';
} elseif ($hour > 11) {
    $greetings = 'Good Afternoon';
} elseif ($hour < 12) {
    $greetings = 'Good Morning';
} ?>
<div class="row _user-TS">
    <div class="col-md-12 _dashTOP">
        <img class="_user_Pimage" src="{{ Auth::user()->picture ? $base_url . Auth::user()->picture : '/images/avatar.svg' }}" alt="">
        <h2 class="_head01">{{ $greetings }}, {{ Auth::user()->name }}</h2>

    </div>
</div>

<div class="seabinReport">
    <div class="row">


        {{-- amount collected --}}

        {{-- visited customers --}}


    </div>

</div>
<div class="row">
    <div class="col-lg-12 PB-20">
        <h2 class="_head01 HomeHead">Recent Product Added<span></span></h2>
    </div>
    <div class="col-md-12">
        <div class="TopTagItem">
            <div class="row">

               





            </div>
        </div>


        {{-- <div class="TopTagItem">
            <div class="row">
                <div class="col-12 text-center"><img style="width: 220px; height: auto; display: block; margin: auto"
                        src="/images/no-order.svg" alt="">
                <div class="col-12 text-center">
                    <h2>No Order Today</h2>
                </div>

            </div>
        </div> --}}

    </div>
</div>

<div class="row PB-30">


    <div class="col-lg-12 col-md-12 col-sm-12">
        <h2 class="_head01 HomeHead">Shortcuts <span></span></h2>
    </div>


    <div class="col-md-12">
        <div class="row">

            <div class="col-6">
                <a href="/manage_product" class="follow_action d-flex align-content-center flex-wrap"><span class="img-svg"><img src="/images/add-product-icon.svg" alt="">Add New Product</span></a>
            </div>

            <div class="col-6">
                <a href="#" class="follow_action d-flex align-content-center flex-wrap"><span class="img-svg"><img src="/images/new-order.svg" alt="">View New Category</span></a>
            </div>
        </div>
    </div>
</div>
@endsection