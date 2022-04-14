@extends('layouts.master')
@section('data-sidebar')
<style>
    .textarea-st {
        line-height: normal;
        font-size: 13px;
        padding: 5px;
        letter-spacing: 1px;
    }
</style>
<div id="product-cl-sec">
    <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">New <span>FAQ</span></div>

    <div class="pc-cartlist">

        <div class="overflow-plist">

            <div class="plist-content">

                <div class="_left-filter pt-0">

                    <div class="container">

                        <div class="row">

                            <div class="col-12">
                                <div id="floating-label" class="card p-20 top_border mb-3">

                                    <h2 class="_head03">FAQs <span>Details</span></h2>

                                    <div class="form-wrap p-0 PT-10">

                                        <div class="row">
                                            <div class="col-12">
                                                <div class="form-group">
                                                    <label class="control-label mb-10">Questions?</label>
                                                    <input type="text" id="question" class="form-control" placeholder="">
                                                </div>
                                            </div>

                                            <div class="col-12 pt-9">
                                                <label class="font12 mb-5">Answer</label>
                                                <textarea class="textarea-st" id="awnser" rows="6"></textarea>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>



                </div>


            </div>

        </div>
    </div>


    <div class="_cl-bottom">

        <button type="button" id="save_faq" class="btn btn-primary mr-2" onclick="save_faq()">Save</button>
        <button id="pl-close" type="button" class="btn btn-cancel mr-2">Cancel</button>

    </div>



</div>
@endsection
@section('content')
<div class="container">
    <div class="row mt-2 mb-3">
        <div class="col-lg-6 col-md-6 col-sm-6">
            <h2 class="_head01">FAQs <span>List</span></h2>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-6">
            <ol class="breadcrumb">
                <li><a href="#"><span>FAQs </span></a></li>
                <li><span>Add</span></li>
            </ol>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="header">
                    <a id="productlist01" href="#" class="btn add_button"><i class="fa fa-plus"></i> <span>Add FAQ</span></a>
                    <h2>FAQ <span>List</span></h2>
                </div>
                <div class="body" id="data_table">
                    <table class="table table-hover dt-responsive nowrap" id="example" style="width:100%">
                        <thead>
                            <tr>
                                <th>FAQ</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($faqs as $faq)
                            <tr>
                                <td>{{$faq->question}}</td>
                                <td>
                                    <button class="btn btn-default btn-line" onclick="get_faq_detail({{$faq->id}})">Edit</button>
                                    <button class="btn btn-default red-bg" onclick="delete_faq({{$faq->id}})">Delete</button>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>

                </div>



            </div>

        </div>


    </div>
</div>

@endsection