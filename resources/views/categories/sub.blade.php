@extends('layouts.master')
@section('page-style')
<style>
    .modal-backdrop {
        z-index: 998 !important;
    }

    .link-dialog>.modal-dialog {
        font-size: 13px !important;
    }
</style>
@endsection
@section('data-sidebar')
<input type="hidden" id="base_url" value="{{$base_url}}">
<div id="product-cl-sec">
    <a href="javascript:;" id="pl-close" class="close-btn-pl"></a>
    <div class="pro-header-text">New <span>Service</span></div>
    <div style="min-height: 400px" id="dataSidebarLoader" style="display: none">
        <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
    </div>
    <div class="pc-cartlist">
        <div class="overflow-plist">
            <div class="plist-content">
                <div class="_left-filter pt-0">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <form style="display: flex;" id="saveSubCatForm">
                                    @csrf
                                    <input type="text" id="operation" hidden>
                                    <input type="text" id="sub_cat_id" hidden>
                                    <div id="floating-label" class="card p-20 top_border mb-3" style="width: 100%">
                                        <h2 class="_head03">Service <span>Details</span></h2>
                                        <div class="form-wrap p-0">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <label class="control-label mb-10">Main Service*</label>
                                                    <div class="form-s2 pt-19">
                                                        <select name="main_category_id" class="form-control" id="main_category_id">
                                                            <option value="-1" selected disabled> Select Main Category
                                                            </option>
                                                            @foreach ($main as $item)
                                                            <option value="{{ $item->id }}">{{ $item->category_name }}</option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Service Name*</label>
                                                        <input type="text" name="category_name" class="form-control" required>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="control-label mb-10">Title Tag*</label>
                                                        <input type="text" name="title_tag" class="form-control" required>
                                                    </div>
                                                </div>


                                                <div class="col-md-6">
                                                    <div class="form-s2">
                                                        <input type="checkbox" name="show_images" id="show_images">
                                                        <label for="" class="m-b-5 font13">
                                                            Show Images On Detail Page
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="row assCatalogue-radio PT-10 PB-10" id="filters-area">
                                                        <div class="col-auto pr-400">
                                                            <div class="custom-control custom-radio">
                                                                <input class="custom-control-input" type="radio" name="is_active" id="filter1" value="1">
                                                                <label class="custom-control-label font13" for="filter1">Active</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-auto pr-400">
                                                            <div class="custom-control custom-radio">
                                                                <input class="custom-control-input" type="radio" name="is_active" id="filter2" value="0">
                                                                <label class="custom-control-label font13" for="filter2">Inactive</label>
                                                            </div>
                                                        </div>
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
                                                <div class="col-md-12 mt-20">
                                                    <label class="control-label mb-10">Description</label>
                                                    <textarea id="SubCategorySummernote" cols="30" rows="10" name="description"></textarea>
                                                </div>
                                                <div class="row m-0 mt-30 col-12">
                                                    <div class="col pr-0">
                                                        <input type="text" class="form-control" placeholder="" id="key-feature-input">
                                                        @php $keyFeatureCounter = isset($product)? collect(json_decode($product->services))->count()+1 : 1; @endphp
                                                        <input type="hidden" id="key-feature-counter" value="{{$keyFeatureCounter}}">
                                                    </div>
                                                    <div class="col-auto pl-0">
                                                        <button type="button" class="btn btn-primary" onclick="add_key_feature()">Add</button>
                                                    </div>
                                                </div>
                                                <div class="row m-0">
                                                    <div class="col-12" id="key-feature-area">
                                                       
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
        <button type="submit" class="btn btn-primary mr-2" id="saveSubCat">Save</button>
        <button id="pl-close" type="submit" class="btn btn-cancel mr-2" id="cancelSubCat">Cancel</button>
    </div>
</div>
@endsection
@section('content')
<div class="row mt-2 mb-3">


    <div class="col-lg-6 col-md-6 col-sm-6">
        <h2 class="_head01">Categories <span>Management</span></h2>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-6">
        <ol class="breadcrumb">
            <li><a href="javascript:;"><span>Sub Categories</span></a></li>
            <li><span>Active</span></li>
        </ol>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="header">
                <a class="btn add_button openDataSidebarForAddingSubCat"><i class="fa fa-plus"></i> New Category</a>
                <h2>Sub Categories List</h2>
            </div>
            <div style="min-height: 400px" id="tblLoader">

                <img src="/images/loader.gif" width="30px" height="auto" style="position: absolute; left: 50%; top: 45%;">
            </div>
            <div class="body" style="display: none">
            </div>
        </div>
    </div>
</div>
@endsection