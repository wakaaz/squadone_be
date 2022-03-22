<?php

namespace App\Http\Controllers;

use App\Models\MainCategory;
use App\Models\SubCategory;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehiclesController extends Controller
{
    public function vehicles()
    {
        $vehicles = Vehicle::all();
        return response()->json([
            "message"=>"200",
             "data"=> $vehicles
        ]);
    }
    public function main_categories(){
        $main_categories = MainCategory::all();
        return response()->json([
            "code"=>200,
            "data"=> $main_categories
        ]);
    }
    public function sub_categories(){
        $sub_categories = SubCategory::with('main_cat')->get();
        return response()->json([
            "code"=>200,
            "data"=> $sub_categories
        ]);
    }
}
