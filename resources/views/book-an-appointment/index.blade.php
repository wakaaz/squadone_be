@extends('layouts.master')
@section('content')
@section('data-sidebar')
@include('book-an-appointment.detail')
@endsection
<div class="container">

  <div class="row mt-2 mb-3">
    <div class="col-lg-6 col-md-6 col-sm-6">
      <h2 class="_head01">Booked <span>Appointments</span></h2>
    </div>

    <div class="col-lg-6 col-md-6 col-sm-6">
      <ol class="breadcrumb">
        <li><a href="#"><span>Appointments </span></a></li>
        <li><span>List</span></li>
      </ol>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="header">
          <h2>Appointments <span>List</span></h2>
        </div>
        <div class="body">
          <table class="table table-hover dt-responsive nowrap" id="example" style="width:100%">
            <thead>
              <tr>
                <th>id</th>
                <th>Telephone</th>
                <th>Email</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>

              @foreach ($data as $appointment)
              <tr>
                <td>{{$appointment->id}}</td>
                <td>{{$appointment->mobile_number}}</td>
                <td>{{$appointment->email}}</td>
                <td><button onclick="getAppointmentDetails({{$appointment->id}})" class="btn btn-default btn-line mb-0" data-toggle="modal" data-target="#exampleModal">View Detail</button></td>
              </tr>
              @endforeach
            </tbody>
          </table>

        </div>



      </div>

    </div>


  </div>



  <footer class="sticky-footer">
    <div class="container my-auto">
      <div class="copyright text-center my-auto">
        2019 Sell3sixty All rights reserved
      </div>
    </div>
  </footer>

</div>
<script>
  function getAppointmentDetails(id) {

    $.ajax({
      url: `get-appointment-detail/${id}`,
      type: 'GET',
      success: function(response) {
        if (response) {
          appointment = JSON.parse(response);
          var html = `<div class="col-4 pr-0">
                <div class="_boxgray"><strong>Name:</strong><br> ${appointment.name}</div>
              </div>

              <div class="col-4 pr-0">
                <div class="_boxgray"><strong>Mobile Number:</strong><br> ${appointment.mobile_number}</div>
              </div>

              <div class="col-4 pr-0">
                <div class="_boxgray"><strong>Email ID:</strong><br>${appointment.email}</div>
              </div>

              <div class="col-4 pr-0">
                <div class="_boxgray  mt-3"><strong>Message:</strong><br>${appointment.message}</div>
              </div>
              <div class="col-4">
              <div class="_boxgray  mt-3"><strong>Vehicle:</strong><br>${appointment.car_make_and_model}</div>
            </div>
            `;

          $('#detail').html(html);
        }
      }
    })

  }
</script>
@endsection