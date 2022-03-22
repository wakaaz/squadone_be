@extends('layouts.master')
@section('content')
<input type="text" id="vehicle_id" hidden value="{{$id}}">
<input type="text" id="base_url" hidden value="{{$base_url}}">
<div class="col-md-12 PT-10">
<textarea id="product-images" cols="30" rows="10" style="display:none">@php if($vehicle){echo json_encode($vehicle->media);} @endphp</textarea>
    <label class="font12 mb-5">Add Images</label>
    <form action="#" class="dropzone" id="product-images-dropzone">
        <div class="fallback">
            <input type="file" multiple name="images[]" id="images" />
            <img>
        </div>
    </form>
</div>
<div class="col-12 PT-20 PB-20 text-right">
    <button type="button" onclick="submitImages()" class="btn btn-primary" name="product_form">Save</button>
    <button type="button" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">Cancel</button>
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
@endsection