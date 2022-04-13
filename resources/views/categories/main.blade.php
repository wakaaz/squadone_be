@extends('layouts.master')
@section('page-style')
<style>
    .sortable-moves {
        font-size: 14px;
        padding: 6px;
        list-style-type: none;
        position: relative;
        cursor: move;
        background-color: #fff;
        border: solid 1px #001e35;
        margin: 10px 0;
    }

    .sortable-moves:hover {
        border: solid 1px #f12300;
    }

    .sortable-moves h2 {
        font-size: 13px;
        margin: 0
    }

    .modal-backdrop {
        z-index: 998 !important;
    }

    .link-dialog>.modal-dialog {
        font-size: 13px !important;
    }
</style>
@endsection
@section('data-sidebar')
<div id="product-cl-sec">
    <a href="#" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">New <span>Category</span></div>
    <div style="min-height: 400px" id="dataSidebarLoader" style="display: none">
        <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
    </div>
    <input type="hidden" id="base_url" value="{{$base_url}}">
    @php
    $page_title = '';
    $meta_tag_name = '';
    $meta_keywords = '';
    $meta_description = '';
    if(isset($product) && $product->seo!=null){
    $seo = json_decode($product->seo);
    $page_title = $seo->page_title;
    $meta_tag_name = $seo->meta_tag_name;
    $meta_keywords = $seo->meta_keywords;
    $meta_description = (isset($seo->meta_description))? $seo->meta_description : '' ;
    }
    @endphp
    <div class="pc-cartlist">
        <div class="overflow-plist">
            <div class="plist-content">
                <div class="_left-filter pt-0">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <form style="display: block;" id="saveMainCatForm">
                                    @csrf
                                    <input type="text" id="operation" hidden>
                                    <input type="text" name="main_cat_id" hidden>
                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%">
                                        <h2 class="_head03">Category <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Category Name*</label>
                                                        <input type="text" name="category_name" class="form-control" required>
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Thumbnail Background Color*</label>
                                                        <input type="text" name="thumbnail_background_color" class="form-control" required>
                                                    </div>
                                                </div>

                                                <div class="col-md-12">
                                                    <label class="control-label mb-10">Category Image</label>
                                                    <div class="form-wrap pt-19 PB-10" id="categoryThumbnail">
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <label class="control-label mb-10">Category Mobile Banner</label>
                                                    <div class="form-wrap pt-19 PB-10" id="mobile_banner">
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <label class="control-label mb-10">Category Desktop Banner</label>
                                                    <div class="form-wrap pt-19 PB-10" id="desktop_banner">
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <label class="control-label mb-10">Category Tab Banner</label>
                                                    <div class="form-wrap pt-19 PB-10" id="tab_banner">
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <label class="control-label mb-10">Description</label>
                                                    <textarea id="CategorySummernote" cols="30" rows="10" name="description"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <h2 class="_head04 font18 PB-10 mt-30 mb-15">SEO <span>Information</span></h2>
                                        <div class="row Addpro-form">
                                            <div class="col-12">
                                                <div class="form-group row">
                                                    <label for="" class="col-sm-3 col-form-label">Page Title*</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" class="form-control required" name="seo_page_title" value="">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="form-group row">
                                                    <label for="" class="col-sm-3 col-form-label">Meta Tag Name*</label>
                                                    <div class="col-sm-9">
                                                        <input type="text" class="form-control required" name="seo_meta_tag_name" value="">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 mb-30">
                                                <div class="form-group row">
                                                    <label for="" class="col-sm-3 col-form-label">Meta Keywords* <small>(Separate by commas)</small>
                                                    </label>
                                                    <div class="col-sm-9">
                                                        <textarea class="proTextarea required" name="seo_meta_keywords" id="seo_meta_keywords"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 mb-30">
                                                <div class="form-group row">
                                                    <label for="" class="col-sm-3 col-form-label">Meta Description*</small>
                                                    </label>
                                                    <div class="col-sm-9">
                                                        <textarea class="proTextarea required" name="seo_meta_description" id="seo_meta_description"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="_cl-bottom">
        <button type="submit" class="btn btn-primary mr-2" id="saveMainCat">Save</button>
        <button id="pl-close" type="submit" class="btn btn-cancel mr-2" id="cancelMainCat">Cancel</button>
    </div>
</div>
@endsection
@section('content')
<div class="row mt-2 mb-3">
    <div class="col-lg-6 col-md-6 col-sm-6">
        <h2 class="_head01">Services <span>Management</span></h2>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-6">
        <ol class="breadcrumb">
            <li><a href="#"><span>Main Services</span></a></li>
            <li><span>Active</span></li>
        </ol>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="header">
            
                <a class="btn add_button openDataSidebarForAddingMainCat"><i class="fa fa-plus"></i> New Category</a>
                <h2>Main Services List</h2>
            </div>
            <div style="min-height: 400px" id="tblLoader">
                <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
            </div>
            <div class="body" style="display: none">
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">


        <div class="modal-content  top_border">
            <form action="{{ route('/update-navigation-bar') }}" method="POST">
                @csrf
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Navigation Bar Sequence<span></span></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
                </div>
                <div class="modal-body AddDetailPR">
                    <div class="row">
                        <div class="col-md-12" id="sortable">
                            @if ($collection->count()>0)
                            @foreach ($collection as $item)
                            <div class="sortable-moves">
                                <h2>{{$item->category_name}}</h2>
                                <input type="hidden" name="sequence[]" value="{{$item->id}}">
                            </div>
                            @endforeach
                            @endif
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0" style="background-color: #f6f6f6">
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button type="button" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">Cancel</button>
                </div>
            </form>
        </div>

    </div>
</div>
@endsection