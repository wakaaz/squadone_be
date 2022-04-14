<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return redirect('/home');
});
Auth::routes();
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/Admin',[App\Http\Controllers\Admin::class, 'index']);
Route::get('/logout', [App\Http\Controllers\Auth\LoginController::class, 'logout']);
// admin routes
Route::post('/Admin/SaveSubMod', [App\Http\Controllers\Admin::class, 'SaveSubMod']);
Route::post('/Admin/DeleteSubNavItem', [App\Http\Controllers\Admin::class, 'DeleteSubNavItem']);
Route::post('/Admin/UpdateSubModPriority', [App\Http\Controllers\Admin::class, 'UpdateSubModPriority']);
Route::post('/Admin/UpdateParentMod',  [App\Http\Controllers\Admin::class, 'UpdateParentMod']);
Route::post('/Admin/UpdateParentModPriority', [App\Http\Controllers\Admin::class, 'UpdateParentModPriority']);
Route::post('/Admin/SaveParentMod', [App\Http\Controllers\Admin::class, 'SaveParentMod']);
Route::post('/Admin/DeleteParentMod',[App\Http\Controllers\Admin::class, 'DeleteParentMod']);
// admin routes

// vehicle managment routes
Route::get('/manage_vehicles', [App\Http\Controllers\VehicleController::class, 'manage_vehicles'])->name('manage_vehicles');
Route::get('/product-form/{id?}',[App\Http\Controllers\VehicleController::class, 'create'])->name('product-form');
Route::get('vehicle-images/{id}', [App\Http\Controllers\VehicleController::class, 'vehicle_images'])->name('vehicle-images');
Route::post('save-images-for-vehicle', [App\Http\Controllers\VehicleController::class, 'save_vehicle_images'])->name('save-images-for-vehicle');
Route::get('/delete-image-from-media/{id}',[App\Http\Controllers\VehicleController::class, 'delete_image'])->name('deletePhotoFromMedia');
Route::post('/store-product',[App\Http\Controllers\VehicleController::class, 'store_product'])->name('store-product');
Route::post('/update-product',[App\Http\Controllers\VehicleController::class, 'update_product'])->name('update-product');
Route::post('/delete-product-media', [App\Http\Controllers\VehicleController::class, 'delete_vehicle_media'])->name('delete-product-media');
Route::get('/Categories', [App\Http\Controllers\CategoriesController::class, 'index'])->name('categories');
Route::post('/update-navigation-bar', [App\Http\Controllers\CategoriesController::class, 'update_navigation_bar'])->name('/update-navigation-bar');
Route::get('/GetCategories', [App\Http\Controllers\CategoriesController::class, 'getMainCategories'])->name('GetCategories');
Route::post('/save-category/{id?}', [App\Http\Controllers\CategoriesController::class, 'save_category'])->name('save-category');
Route::get('/SubCategories',  [App\Http\Controllers\CategoriesController::class, 'sub_categories_view'])->name('SubCategories');
Route::get('/GetSubCategories',  [App\Http\Controllers\CategoriesController::class, 'ListSubCategories'])->name('GetSubCategories');
Route::post('/SaveSubCategory/{id?}',  [App\Http\Controllers\CategoriesController::class, 'StoreSubCat'])->name('SaveSubCategory');
Route::post('/DelSubCat/{id}',  [App\Http\Controllers\CategoriesController::class, 'DelSubCat'])->name('DelSubCat');
// Route::post('/updateSubCat/{id}',  [App\Http\Controllers\CategoriesController::class, 'updateSubCat'])->name('updateSubCat');

// book an appointment
Route::get('/book-an-appointment',  [App\Http\Controllers\BookAnAppointmentController::class, 'index'])->name('book-an-appointment');
Route::get('/get-appointment-detail/{id}',  [App\Http\Controllers\BookAnAppointmentController::class, 'show'])->name('get-appointment-detail');

// delete a categoty
Route::get('/delete_category/{id}',  [App\Http\Controllers\CategoriesController::class, 'delete_category'])->name('delete_category');

// frequently asked questions
Route::get('/frequently-asked-questions', [App\Http\Controllers\FAQController::class,'index'])->name('frequently-asked-questions');

Route::post('/add-frequently-asked-question/{id?}', [App\Http\Controllers\FAQController::class,'store'])->name('frequently-asked-questions');
Route::get('/get-all-faqs', [App\Http\Controllers\FAQController::class,'faqs'])->name('get-all-faqs');
Route::get('/get-faq/{id}',[App\Http\Controllers\FAQController::class,'get_faq'])->name('get-faq');
Route::get('/delete-faq/{id}', [App\Http\Controllers\FAQController::class,'delete_faq'])->name('delete-faq');





