<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BookedAppointment;

class BookAnAppointmentController extends Controller
{
    public function index(){
        $data = BookedAppointment::all();
        return view('book-an-appointment.index',compact('data'));
    }
    public function show($id){
        $bookedAppointment = BookedAppointment::find($id);
        return json_encode($bookedAppointment);
    }
    public function store(Request $request){
        $appointment = new BookedAppointment($request->all());
        if($appointment->save()){
            return response()->json(['code'=>'200','message'=>'success']);
        }
        else{
            return response()->json(['code'=>'403 ','message'=>'failed']);
        }

    }
}
