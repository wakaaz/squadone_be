@extends('layouts.master')
@section('data-sidebar')
@endsection

@section('content')

<div class="row mt-2 mb-3">
    <div class="col-lg-6 col-md-6 col-sm-6">
        <h2 class="_head01">Manage <span>Vehicles</span></h2>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-6">
        <ol class="breadcrumb">
            <li><a href="#"><span>Manage</span></a></li>
            <li><span>Vehicles</span></li>
        </ol>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="card">
            <div class="header p-0">
                <div class="row">
                    <div class="col-lg-12">
                        <a href="{{ route('product-form') }}" class="btn add_button"><i class="fa fa-plus"></i> <span class="opp_name"> New Vehicle</span></a>
                    </div>
                </div>
            </div>
            <br><br>
            <div class="body">
                <table class="table table-hover dt-responsive nowrap listTable" style="width:100%">
                    <thead>
                        <tr>
                            <th>Vehicle ID</th>
                            <th>Name</th>
                            <th>Sku</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody class='listTableBody'>
                        @if($products->count()>0)
                        @foreach($products as $key=>$product)
                        <tr id="row-{{$product->id}}">
                            <td>{{$product->id}}</td>
                            <td>{{$product->vehicle_name}}</td>
                            <td>{{$product->sku}}</td>
                            <td>
                            <a href="{{ route('vehicle-images', $product->id) }}" class="btn btn-default btn-line edit-btn">Detail Images</a><a href="{{ route('product-form', $product->id) }}" class="btn btn-default btn-line edit-btn">Edit</a>
                            </td>
                        </tr>
                        @endforeach
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
