<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'auth:sanctum'], function(){
    Route::get("/vehicles/{count?}",[App\Http\Controllers\VehiclesController::class,'vehicles']);
    Route::get("/mainCategories",[App\Http\Controllers\VehiclesController::class,'main_categories']);
    Route::get("/subCategories",[App\Http\Controllers\VehiclesController::class,'sub_categories']);
    Route::get("/vehicle_detail/{id}",[App\Http\Controllers\VehiclesController::class,'vehicle_detail']);
    Route::get("/main_category_detail/{id}",[App\Http\Controllers\VehiclesController::class,'main_category_detail']);
    Route::get("/sub_category_detail/{id}",[App\Http\Controllers\VehiclesController::class,'sub_category_detail']);
});
Route::post("login",[App\Http\Controllers\UserController::class,'login']);