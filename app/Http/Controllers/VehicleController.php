<?php

namespace App\Http\Controllers;

use App\Models\MainCategory;
use App\Models\Media;
use App\Models\SubCategory;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use stdClass;
use Illuminate\Support\Facades\Auth;

class VehicleController extends Controller
{
    public function manage_vehicles()
    {

        $products = Vehicle::all();
        return view('vehicles.manage_vehicle', compact('products'));
    }

    public function create($productId = null)
    {
        $product = ($productId) ? Vehicle::findORFail($productId) : false;

        if ($product) {
            if ($product->hero_img) {
                $hero_img                  =    json_decode($product->hero_img);
                $product->h_img_for_mobile =    isset($hero_img->h_img_for_mobile) ? $hero_img->h_img_for_mobile :'';
                $product->h_img_for_tab    =    isset($hero_img->h_img_for_tab) ? $hero_img->h_img_for_tab :'';
                $product->h_img_for_laptop =    isset($hero_img->h_img_for_laptop) ? $hero_img->h_img_for_laptop : '';
            }
        }
        $attributes     = false;
        $base_url       = URL::to('/') . '/';

        return view('vehicles.create', compact('product', 'base_url', 'attributes'));
    }
    public function vehicle_images($id)
    {
        $vehicle    =   Vehicle::find($id);
        $base_url   =   URL::to('/') . '/';
        return view('vehicles.images', compact('id', 'vehicle', 'base_url'));
    }
    public function save_vehicle_images(Request $request)
    {
        if (collect($request->images)->count() > 0) {
            if (isset($request->images)) {
                $this->store_media('products', $request->vehicle_id, $request->images, $request,'detail');
            }
            return response()->json([
                'msg' => 'success',
                'code' => '200'
            ]);
        } else {
            return response()->json([
                'msg' => 'empty',
                'code' => '204'
            ]);
        }
    }
    public function store_media($module, $module_id, $files, $request,$type)
    {
        $path = 'public/products';
        if ($module == 'exhibitions') {
            $path = 'public/exhibitions';
        }
        if (!is_dir(storage_path('app/' . $path))) Storage::makeDirectory($path, 0777, true);
        $productKey = 1;
        if ($request->product_id) {
            $medias = Media::where('module', $module)->where('module_id', $module_id)->get();
            if ($medias->count() > 0) {
                $productKey = $medias->count() + 1;
            }
        }
        if ($request->file('images')) {
            foreach ($files as $key => $file) {
                if ($file != '[object Object]') {
                    $fullname               =   $file->getClientOriginalName();
                    $filename               =   pathinfo($fullname, PATHINFO_FILENAME);
                    $extension              =   pathinfo($fullname, PATHINFO_EXTENSION);
                    $filename               =   self::media_name($request, $extension, $productKey);
                    $filename               =   $filename . $fullname;
                    $full_path              =   $file->storeAs($path, $filename);
                    $media                  =   new Media();
                    $media->module          =   $module;
                    $media->type            =   $type;
                    $media->module_id       =   $module_id;
                    $media->name            =   $filename;
                    $media->file_name       =   $filename;
                    $media->file_path       =   $path . '/';
                    $media->full_path       =   str_replace('public/', 'storage/', $full_path);
                    $media->file_extension  =   $file->getClientOriginalExtension();
                    $media->mime_type       =   $file->getMimeType();
                    $media->file_size       =   $file->getSize();
                    $media->created_at      =   date('Y-m-d H:i:s');
                    $media->updated_at      =   date('Y-m-d H:i:s');
                    $media->save();
                }
                $productKey++;
            }
        }
    }
    public function media_name($request, $extension, $productKey)
    {
        $detail = 'detail';
        $imageName = $request->vehicle_id . '-' . $detail . '-' . $productKey . rand() . '.' . $extension;
        return $imageName;
    }
    public function delete_image($id)
    {
        if ($id) {
            $image          =   Media::find($id);
            if($image){
                $file_path      =   $image->file_path . $image->file_name;
                $image->delete();
                if (Storage::exists($file_path)) {
                    if (Storage::delete($file_path)) {
                        return response()->json([
                            'msg' => 'success',
                            'code' => '200',
                        ]);
                    }
                } else {
                    return response()->json([
                        'msg' => 'failed',
                        'code' => '204',
                    ]);
                }
            }
        }
    }
    public function store_product(Request $request)
    {
        $result = $this->store_update_product($request);
        echo json_encode($result);
    }
    public function update_product(Request $request){
        $result = $this->store_update_product($request);
        echo json_encode($result);
    }
    public static function store_update_product($request)
    {
        $result['action']           =   '';
        $result['status']           =   '';
        $result['data']             =   '';
        $data                       =   [];
        $data["sku"]                =   $request->sku;
        $data["vehicle_name"]       =   $request->vehicle_name;
        $data["intro_heading"]      =    $request->intro_heading;
        $data["intro_text"]         =    $request->intro_text;
        $data["services"]           =   $request->key_features;
        $hero_images                   =   new stdClass();
        //product default_thumbnail image upload

        if (isset($request->default_car_thumbnail) && $request->file('default_car_thumbnail')) {
            $data['default_car_thumbnail']  =   self::upload($request->default_car_thumbnail, $request);
        }
        //product bg_thumbnail image upload

        if (isset($request->bg_thumbnail) && $request->file('bg_thumbnail')) {
            $data['bg_thumbnail']    =  self::upload($request->bg_thumbnail, $request);
        } 
        // hero images
        if (isset($request->h_img_for_mobile) && $request->file('h_img_for_mobile')) {
            $hero_images->h_img_for_mobile = self::upload($request->h_img_for_mobile, $request);
        }
        if (isset($request->h_img_for_tab) && $request->file('h_img_for_tab')) {
            $hero_images->h_img_for_tab = self::upload($request->h_img_for_tab, $request);
        }
        if (isset($request->h_img_for_laptop) && $request->file('h_img_for_laptop')) {
            $hero_images->h_img_for_laptop = self::upload($request->h_img_for_laptop, $request);
        }
       
        //Product key features encoding if exists
        if (isset($data['services'])) {
            $data['services'] = json_encode($data['services']);
        }
        //Setting Product SEO encoding
        $seo = new stdClass();
        $seo->page_title        =   $request->seo_page_title;
        $seo->meta_tag_name     =   $request->seo_meta_tag_name;
        $seo->meta_keywords     =   $request->seo_meta_keywords;
        $seo->meta_description  =   $request->seo_meta_description;
        $data['seo']            =   json_encode($seo);
        /**
         * Check if show images on detail page
         */
        //Assigning remaining values to product data
        $data['category_id']    =   $request->sub_category_id;
        // $data['description'] =   $request->long_description;
        $data['created_by']     =   Auth::user()->id;
        $data['created_at']     =   date('Y-m-d');
        $data['updated_by']     =   Auth::user()->id;
        $data['updated_at']     =   date('Y-m-d');
        //check if request is add OR update
        $product = ($request->product_id) ? Vehicle::findORFail($request->product_id) : new Vehicle($data);
        if($request->product_id){
            $temp = json_decode($product->hero_img);
            if (isset($request->h_img_for_mobile) && $request->file('h_img_for_mobile')) {
                $temp->h_img_for_mobile =   $hero_images->h_img_for_mobile;
            } 
            if (isset($request->h_img_for_tab) && $request->file('h_img_for_tab')) {
                $temp->h_img_for_tab =   $hero_images->h_img_for_tab;
            }
            if (isset($request->h_img_for_laptop) && $request->file('h_img_for_laptop')) {
                $temp->h_img_for_laptop =   $hero_images->h_img_for_laptop;
            }
            $product->hero_img = json_encode($temp);
        }
        if(!$request->product_id){
            $product->hero_img = json_encode($hero_images);
        }
        //Saving and updating according to the request - add OR update
        ($request->product_id) ? $product->update($data) : $product->save();
        if (isset($request->images)) self::store_media('products', $product->id, $request->images, $request,'slider');
        $result['action']       =   'success';
        $result['status']       =   'product_added';
        $result['data']         = Vehicle::with('media')->find($product->id);
        if ($request->product_id) {
            $result['status']   = 'product_updated';
            $result['data']     = Vehicle::with('media')->find($product->id);
        }
        return $result;
    }
    public static function upload($file, $request)
    {
        if (!is_dir(storage_path('app/public/products'))) Storage::makeDirectory('/public/vehicles', 0777, true);
        $fullname               =    $file->getClientOriginalName();
        $filename               =   pathinfo($fullname, PATHINFO_FILENAME);
        $extension              =   pathinfo($fullname, PATHINFO_EXTENSION);
        $filename               =   self::image_thumbnail_name($request, $extension);
        $file                   =   $file->storeAs('public/products', $filename);
        $file                   =   str_replace('public/', './storage/', $file);
        return $file;
    }
    public static function image_thumbnail_name($request, $extension)
    {
        $productName            = str_replace(' ', '-', $request["name"]);
        $sku                    = $request["sku"];
        $thumbnail              = 'thumbnail';
        $imageName              = $productName . '-' . $sku . '-' . $thumbnail . '.' . $extension;
        return $imageName;
    }
    public static function delete_vehicle_media(Request $request){
        $result['action'] = 'success';
        $result['status'] = 'image_deleted';

        $type = $request->type;
        $id = $request->id;

        if($type=='image'){
            $media = Media::find($id);
            if(file_exists($media->full_path)){
                unlink($media->full_path);
            }
            $media->delete();
            $result['data'] = 'Product Image deleted successfully';
        }
        return $result;
    }
   
}
