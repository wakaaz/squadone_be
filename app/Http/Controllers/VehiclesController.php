<?php

namespace App\Http\Controllers;

use App\Models\MainCategory;
use App\Models\SubCategory;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VehiclesController extends Controller
{
    public function vehicles($count = null)
    {

        $vehicles = [];
        if ($count) {
            $vehicles = DB::select("SELECT id,vehicle_name,sku,vehicle_transparent_thumbnail,vehicle_logo from vehicles LIMIT " . $count);
        }
        if ($count == null) {
            $vehicles = DB::select("SELECT id,vehicle_name,sku,vehicle_transparent_thumbnail,vehicle_logo from vehicles");
        }
        return response()->json([
            "message" => "200",
            "data" => $vehicles
        ]);
    }
    public function vehicle_detail($id)
    {
        $vehicle_detail = Vehicle::with('media')->with('slider_media')->get()->find($id);
        unset($vehicle_detail->created_at);
        unset($vehicle_detail->created_by);
        unset($vehicle_detail->updated_at);
        unset($vehicle_detail->updated_by);
        unset($vehicle_detail->deleted_at);
        unset($vehicle_detail->deleted_by);
        unset($vehicle_detail->status);
        unset($vehicle_detail->category_id);
        unset($vehicle_detail->sub_category_id);
        unset($vehicle_detail->banner_bg_color);
        unset($vehicle_detail->text_color);
        if (collect($vehicle_detail->media)->count() > 0) {
            foreach ($vehicle_detail->media as $media) {
                unset($media->created_at);
                unset($media->updated_at);
                unset($media->mime_type);
                unset($media->file_path);
                unset($media->file_name);
                unset($media->type);
                unset($media->module);
            }
        }
        if (collect($vehicle_detail->slider_media)->count() > 0) {
            foreach ($vehicle_detail->slider_media as $media) {
                unset($media->created_at);
                unset($media->updated_at);
                unset($media->mime_type);
                unset($media->file_name);
                unset($media->type);
                unset($media->module);
            }
        }
        return response()->json([
            "code" => 200,
            "data" => $vehicle_detail
        ]);
    }
    public function main_categories()
    {
        $main_categories = DB::select("SELECT id , category_name, thumbnail FROM main_categories");
        foreach($main_categories as $main_category){
            $sub_categories = DB::select("SELECT id , category_name,thumbnail  FROM sub_categories WHERE main_category_id = $main_category->id");
            $main_category->sub_categories = $sub_categories;
        }
        return response()->json([
            "code" => 200,
            "data" => $main_categories
        ]);
    }
    public function main_category_detail($id){
        $main_category = MainCategory::with('sub_category')->find($id);
        unset( $main_category->thumbnail_background_color);
        unset( $main_category->ebrochure);
        unset( $main_category->status);
        unset( $main_category->sequence);
        unset( $main_category->updated_at);
        if(collect($main_category->sub_category)->count() > 0){
            foreach($main_category->sub_category as $sub_category){
                unset($sub_category->is_active);
                unset($sub_category->updated_at);
                unset($sub_category->main_category_id);
                unset($sub_category->description);
                unset($sub_category->show_images);
                unset($sub_category->seo);
                unset($sub_category->desktop_background);
                unset($sub_category->mobile_background);
                unset($sub_category->tab_background);
                unset($sub_category->services);
                unset($sub_category->thumbnail);
            }
        }
        return response()->json([
            "code" => 200,
            "data" => $main_category
        ]);
    }
    public function sub_categories()
    {
        $sub_categories = DB::SELECT("SELECT id, category_name FROM sub_categories");
        return response()->json([
            "code" => 200,
            "data" => $sub_categories
        ]);
    }
    public function sub_category_detail($id){
        $sub_category = DB::select("SELECT * from sub_categories where id='$id'");
        if(collect($sub_category)->count() > 0){
            $sub_category = collect($sub_category)->first();
            unset($sub_category->updated_at);
            unset($sub_category->show_images);
            unset($sub_category->is_active);
        }
        return response()->json([
            "code" => 200,
            "data" => $sub_category
        ]);
    }
}
