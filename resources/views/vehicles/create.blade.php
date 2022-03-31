@extends('layouts.master')
@section('page-style')

@endsection
@section('data-sidebar')
{{-- <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css?v=1.0"> --}}


@endsection
@section('content')
<style>
  .input-error {
    border-color: #f12500 !important;
  }
</style>
<!-- 
{{-- <input type="text" id="summernote"> --}}

{{-- <button type="button" onclick="open_summer_note_modal()">test</button>
<div class="modal fade" id="summernoteModal" tabindex="-1" role="dialog" aria-labelledby="summernoteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="summernoteModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" id="summernoteModalBody">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div> --}} -->





<input type="hidden" id="base_url" value="{{$base_url}}">
<div class="overlay-blure"></div>
<div id="blureEffct" class="container">
  <div class="row mt-2 mb-3">
    <div class="col-lg-6 col-md-6 col-sm-6">
      <h2 class="_head01">Vehicle<span> Management</span></h2>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-6">
      <ol class="breadcrumb">
        <li><a href="#"><span>New</span></a></li>
        <li><span>Vehicle</span></li>
      </ol>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="header">
          <div class="row m-0">
            <div class="col pl-0">
              <h2 class="_head03 font18 border-0 pb-0">New <span>Vehicle</span></h2>
            </div>
          </div>
        </div>
        <div class="body p-0">
          <div class="row">
            <div class="col-9 AddPro-Leftinfo">
              <form enctype='multipart/form-data' id="product-form" onsubmit="return submit_form()">
                <input type="hidden" name="product_id" value="@php if($product){echo $product->id;} @endphp">
                <div class="row addproTop">
                  <div class="col-12">

                  </div>
                  <div class="col-12">
                  </div>
                </div>
                <div class="row Addpro-form">
                  <div class="col-6">
                    <div class="form-group row">
                      <label for="" class="col-sm-4 col-form-label">Product SKU*</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control required" name="sku" id="sku" value="@php if($product){echo $product->sku;} @endphp">
                      </div>
                    </div>
                  </div>
                  <div class="col-6" style="padding-top: 4px;">
                    <div class="custom-control custom-checkbox mr-sm-2">
                      <!-- <input type="checkbox" name="is_taxable" class="custom-control-input" id="is_taxable" @if($product && $product->is_taxable) checked="checked"  @endif>
                        <label class="custom-control-label" for="is_taxable">Is Taxable</label> -->
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="form-group row">
                      <label for="" class="col-sm-4 col-form-label">Product Name*</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control required" name="vehicle_name" id="name" value="@php if($product){echo $product->vehicle_name;} @endphp">
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="form-group row">
                      <div class="col-sm-8">

                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-group row">
                      <label for="" class="col-sm-2 col-form-label">Intro Heading*</label>
                      <div class="col-sm-10">
                        <textarea class="proTextarea required" name="intro_heading" id="short_description">@php if($product){echo $product->intro_heading;} @endphp</textarea>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-group row">
                      <label for="" class="col-sm-2 col-form-label">Intro Text </label>
                      <div class="col-sm-10">
                        <textarea class="proTextarea" style="height:120px" name="intro_text" id="long_description">@php if($product){echo $product->intro_text;} @endphp</textarea>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-group row">
                      <label for="" class="col-sm-2 col-form-label">Services Description</label>
                      <div class="col-sm-10">
                        <textarea class="proTextarea" style="height:120px" name="services_description" id="services_description">@php if($product){echo $product->services_description;} @endphp</textarea>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 PT-15">
                    <h2 class="_head04 font18 PB-10"> <span>Services</span></h2>
                    <div class="add-property">
                      <div class="row m-0">
                        <div class="col pr-0">
                          <input type="text" class="form-control" placeholder="" id="key-feature-input">
                          @php $keyFeatureCounter = ($product)? collect(json_decode($product->services))->count()+1 : 1; @endphp
                          <input type="hidden" id="key-feature-counter" value="{{$keyFeatureCounter}}">
                        </div>
                        <div class="col-auto pl-0">
                          <button type="button" class="btn btn-primary" onclick="add_key_feature()">Add</button>
                        </div>
                      </div>
                      <div class="row m-0">
                        <div class="col-12" id="key-feature-area">
                          @if($product)
                          @php $services = collect(json_decode($product->services)); @endphp
                          @if($services->count()>0)
                          @foreach($services as $featureKey=>$featureVal)
                          <div class="alert fade show alert-color _add-secon" role="alert" id="key-feature-{{$featureKey}}">{{$featureVal}}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="remove_key_feature({{$featureKey}})"> <span aria-hidden="true">×</span> </button>
                            <input type="hidden" value="{{$featureVal}}" name="services[]" id="key-feature-input-{{$featureKey}}">
                          </div>
                          @endforeach
                          @endif
                          @endif
                        </div>
                      </div>
                    </div>

                    <h2 class="_head04 font18 PB-10 mb-0 mt-30">Add <span>Background Thumbnail</span></h2>

                    <div class="col-12 p-0">

                      <div class="form-wrap p-0">
                        <label class="font12 mb-5"></label>

                        <div class="upload-pic"></div>
                        <input type="file" id="input-file-now" class="dropify" name="bg_thumbnail" @if($product) data-default-file="@php echo $base_url.$product->bg_thumbnail; @endphp" @endif />
                      </div>
                    </div>

                  </div>

                  @php
                  $page_title = '';
                  $meta_tag_name = '';
                  $meta_keywords = '';
                  $meta_description = '';
                  if($product && $product->seo!=null){
                  $seo = json_decode($product->seo);
                  $page_title = $seo->page_title;
                  $meta_tag_name = $seo->meta_tag_name;
                  $meta_keywords = $seo->meta_keywords;
                  $meta_description = (isset($seo->meta_description))? $seo->meta_description : '' ;
                  }
                  @endphp
                  <div class="col-12 PT-15">
                    <h2 class="_head04 font18 PB-10 mb-15">SEO <span>Information</span></h2>
                    <div class="row Addpro-form">
                      <div class="col-6">
                        <div class="form-group row">
                          <label for="" class="col-sm-4 col-form-label">Page Title*</label>
                          <div class="col-sm-8">
                            <input type="text" class="form-control required" name="seo_page_title" value="{{$page_title}}">
                          </div>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="form-group row">
                          <label for="" class="col-sm-4 col-form-label">Meta Tag Name*</label>
                          <div class="col-sm-8">
                            <input type="text" class="form-control required" name="seo_meta_tag_name" value="{{$meta_tag_name}}">
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-group row">
                          <label for="" class="col-sm-2 col-form-label">Meta Keywords* <small>(Separate by commas)</small>
                          </label>
                          <div class="col-sm-10">
                            <textarea class="proTextarea required" name="seo_meta_keywords">{{$meta_keywords}}</textarea>
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-group row">
                          <label for="" class="col-sm-2 col-form-label">Meta Description*</small>
                          </label>
                          <div class="col-sm-10">
                            <textarea class="proTextarea required" name="seo_meta_description">{{$meta_description}}</textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 PT-20 PB-20" style="display:none" id="progress-bar-area">
                    <div class="progress" style="height: 13px;">
                      <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" id='product-progress'>0%</div>
                    </div>
                  </div>
                  <div class="col-12 PT-20 PB-20 text-right">
                    <button type="submit" class="btn btn-primary" name="product_form">Save</button>
                    <button type="button" id="cancel_update_product" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
            <div class="col-3">
              <div class="Product-imgUpload">
                <h4>Product Images</h4>
                <div class="col-md-12 PT-10">
                  <div class="form-wrap p-0">
                    <label class="font12 mb-5">Add Default Thumbnail</label>
                    <div class="upload-pic"></div>
                    <input type="file" id="input-file-now" class="dropify" name="default_car_thumbnail" @if($product) data-default-file="@php echo $base_url.$product->default_car_thumbnail; @endphp" @endif />
                  </div>
                  <div class="form-wrap p-0">
                    <label class="font12 mb-5">Add Vehicle Transparent Thumbnail</label>
                    <div class="upload-pic"></div>
                    <input type="file" id="input-file-now" class="dropify" name="vehicle_transparent_thumbnail" @if($product) data-default-file="@php echo $base_url.$product->vehicle_transparent_thumbnail; @endphp" @endif />
                  </div>
                  <div class="form-wrap p-0">
                    <label class="font12 mb-5">Vehicle Logo</label>
                    <div class="upload-pic"></div>
                    <input type="file" id="input-file-now" class="dropify" name="vehicle_logo" @if($product) data-default-file="@php echo $base_url.$product->vehicle_logo; @endphp" @endif />
                  </div>
                  <div class="form-wrap p-0">
                    <label class="font12 mb-5">Add Hero Image For Mobile</label>
                    <div class="upload-pic"></div>
                    <input type="file" id="input-file-now" class="dropify" name="h_img_for_mobile" @if($product) data-default-file="{{$base_url.$product->h_img_for_mobile != "" ? $base_url.$product->h_img_for_mobile:""}}" @endif />
                  </div>
                  <div class="form-wrap p-0">
                    <label class="font12 mb-5">Add Hero Image For Tab</label>
                    <div class="upload-pic"></div>
                    <input type="file" id="input-file-now" class="dropify" name="h_img_for_tab" @if($product) data-default-file="{{$base_url.$product->h_img_for_tab != "" ? $base_url.$product->h_img_for_tab:""}}" @endif />
                  </div>
                  <div class="form-wrap p-0">
                    <label class="font12 mb-5">Add Hero Image For Laptop</label>
                    <div class="upload-pic"></div>
                    <input type="file" id="input-file-now" class="dropify" name="h_img_for_laptop" @if($product) data-default-file="{{$base_url.$product->h_img_for_laptop != "" ? $base_url.$product->h_img_for_laptop:""}}" @endif />
                  </div>
                </div>
                <div class="col-md-12 PT-10">
                  <textarea id="product-images" cols="30" rows="10" style="display:none">@php if($product){echo json_encode($product->slider_media);} @endphp</textarea>
                  <label class="font12 mb-5">Add Slider Images</label>
                  <form action="#" class="dropzone" id="product-images-dropzone">
                    <div class="fallback">
                      <input type="file" multiple name="images[]" id="images" />
                      <img>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<div class="modal fade" id="duplicateProductModal" tabindex="-1" role="dialog" aria-labelledby="duplicateProductModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content top-borderRed">
      <div class="modal-header">
        <h5 class="modal-title" id="duplicateProductModalLabel">Delete <span></span></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="col-md-12">
          <input type="hidden" id="product-copy-id">
          <p>Do you want to create a copy?</p>
        </div>

      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-primary" onclick="create_product_copy(1)">Yes</button>
        <button type="button" class="btn btn-cancel" onclick="create_product_copy(0)">No</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="deleteImages" tabindex="-1" role="dialog" aria-labelledby="deleteImagesLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content top-borderRed">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteImagesLabel">Delete <span></span></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="col-md-12">
          <input type="hidden" id="image-type">
          <input type="hidden" id="image-id">
          <p>Do you want to delete this image permanently?</p>
        </div>
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-primary" onclick="delete_product_media()">Yes</button>
        <button type="button" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">No</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content top-borderRed">
      <div class="modal-header">
        <h5 class="modal-title" id="alertModalLabel">Alert <span></span></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="col-md-12">
          <p id="alertModalText"></p>
        </div>
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">OK</button>
      </div>
    </div>
  </div>
</div>
@endsection

@section('page-scripts')
{{-- <script src="/js/bootstrap.min.js"></script> --}}




@endsection