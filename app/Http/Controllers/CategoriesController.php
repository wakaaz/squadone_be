<?php

namespace App\Http\Controllers;

use App\Models\MainCategory;
use App\Models\Media;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage;

use DB;
use Illuminate\Database\Capsule\Manager;
use stdClass;
use Symfony\Component\Console\Command\DumpCompletionCommand;

class CategoriesController extends Controller
{
    public function index()
    {
        $base_url   = URL::to('/') . '/';
        $collection = MainCategory::where('status', 1)->orderBy('sequence', 'ASC')->get();

        return view('categories.main', compact('base_url', 'collection'));
    }
    public function getMainCategories()
    {
        echo json_encode(DB::table('main_categories')->get());
    }
    public function save_category(Request $request)
    {
        $imagesArray    =   array("svg" => "", "thumbnail" => "", "desktop_banner" => "", "mobile_banner" => "", "tab_banner" => "");
        foreach ($imagesArray as $key => $value) {
            if (isset($request[$key]) && $request->hasFile($key)) {
                $file               =   $request[$key];
                if (!is_dir(storage_path('app/public/categories'))) Storage::makeDirectory('/public/categories', 0777, true);
                $fullname           =   $file->getClientOriginalName();
                $filename           =   pathinfo($fullname, PATHINFO_FILENAME);
                $extension          =   pathinfo($fullname, PATHINFO_EXTENSION);
                $randomized         =   rand();
                $filename           =   str_replace(' ', '', $fullname) . '-' . $randomized . '' . time() . '.' . $extension;
                $file               =   $file->storeAs('public/categories', $filename);
                $imagesArray[$key]  =   str_replace('public/', '\/storage/', $file);
            }
        }
        $seo = new stdClass();
        $seo->page_title        =   $request->seo_page_title;
        $seo->meta_tag_name     =   $request->seo_meta_tag_name;
        $seo->meta_keywords     =   $request->seo_meta_keywords;
        $seo->meta_description  =   $request->seo_meta_description;
        $seo                    =   json_encode($seo);
        if (!$request->main_cat_id) {
            if (DB::table('main_categories')->insert([
                'category_name'                 =>  $request->category_name,
                'seo'                           =>  $seo,
                'thumbnail_background_color'    =>  $request->thumbnail_background_color,
                'thumbnail'                     =>  $imagesArray['thumbnail'],
                'desktop_banner'                =>  $imagesArray['desktop_banner'],
                'mobile_banner'                 =>  $imagesArray['mobile_banner'],
                'tab_banner'                    =>  $imagesArray['tab_banner'],
                'description'                   =>  json_encode($request->description)
            ])) {
                echo json_encode("success");
                die;
            }
            echo json_encode("failed");
        }
        if ($request->main_cat_id) {
            $main_cat = MainCategory::find($request->main_cat_id);
            if ($main_cat) {
                $main_cat->category_name    =   $request->category_name;
                $main_cat->seo              =   $seo;
                if ($imagesArray['thumbnail'] != "") {
                    $main_cat->thumbnail         =   $imagesArray['thumbnail'];
                }
                if ($imagesArray['desktop_banner'] != "") {
                    $main_cat->desktop_banner    =   $imagesArray['desktop_banner'];
                }
                if ($imagesArray['mobile_banner'] != "") {
                    $main_cat->desktop_banner    =   $imagesArray['mobile_banner'];
                }
                if ($imagesArray['tab_banner'] != "") {
                    $main_cat->desktop_banner    =   $imagesArray['tab_banner'];
                }
                $main_cat->description           =    json_encode($request->description);
                if ($main_cat->save()) {
                    echo json_encode("success");
                    die;
                }
                echo json_encode("failed");
            }
        }
    }
    public function sub_categories_view()
    {
        $main = DB::table('main_categories')->get();
        return view('categories.sub', ['main' => $main]);
    }

    public function ListSubCategories()
    {
        $subCategories = SubCategory::all();
        foreach($subCategories as $sub_cat){
            $sub_cat->main_category = $sub_cat->main_cat;
        }
        return $subCategories;
    }
    public function StoreSubCat(Request $request , $id=null)
    {
        $imagesArray    =   array("thumbnail" => "", "desktop_background" => "", "mobile_background" => "", "tab_background" => "");
        foreach ($imagesArray as $key => $value) {
            if (isset($request[$key]) && $request->hasFile($key)) {
                $file               =   $request[$key];
                if (!is_dir(storage_path('app/public/subcategories'))) Storage::makeDirectory('/public/subcategories', 0777, true);
                $fullname           =   $file->getClientOriginalName();
                $filename           =   pathinfo($fullname, PATHINFO_FILENAME);
                $extension          =   pathinfo($fullname, PATHINFO_EXTENSION);
                $randomized         =   rand();
                $filename           =   str_replace(' ', '', $fullname) . '-' . $randomized . '' . time() . '.' . $extension;
                $file               =   $file->storeAs('public/subcategories', $filename);
                $imagesArray[$key]  =   str_replace('public/', '\/storage/', $file);
            }
        }
        $seo = new stdClass();
        $seo->page_title        =   $request->seo_page_title;
        $seo->meta_tag_name     =   $request->seo_meta_tag_name;
        $seo->meta_keywords     =   $request->seo_meta_keywords;
        $seo->meta_description  =   $request->seo_meta_description;
        $seo                    =   json_encode($seo);
        if (!$id) {
            if (DB::table('sub_categories')->insert([
                'category_name'                 =>  $request->category_name,
                'seo'                           =>  $seo,
                'title_tag'                     =>  $request->title_tag,
                'main_category_id'              =>  $request->main_category_id,
                'description'                   =>  json_encode($request->description),
                'is_active'                     =>  $request->is_active,
                'show_images'                   => (isset($request->show_images)) ? 1 : 0,
                'thumbnail'                     =>  $imagesArray['thumbnail'],
                'desktop_background'            =>  $imagesArray['desktop_background'],
                'mobile_background'             =>  $imagesArray['mobile_background'],
                'tab_background'                =>  $imagesArray['tab_background'],
                'services'                      =>  isset($request->key_features)?json_encode($request->key_features) : null,
            ])) {
                echo json_encode("success");
                die;
            }
            echo json_encode("failed");
        }
        if ($id) {
         
            $sub_cat = SubCategory::find($id);
            if ($sub_cat) {
                $sub_cat->category_name    =   $request->category_name;
                $sub_cat->seo              =   $seo;
                if ($imagesArray['thumbnail'] != "") {
                    $sub_cat->thumbnail         =   $imagesArray['thumbnail'];
                }
                if ($imagesArray['desktop_background'] != "") {
                    $sub_cat->desktop_banner    =   $imagesArray['desktop_background'];
                }
                if ($imagesArray['mobile_background'] != "") {
                    $sub_cat->desktop_banner    =   $imagesArray['mobile_background'];
                }
                if ($imagesArray['tab_background'] != "") {
                    $sub_cat->desktop_banner    =   $imagesArray['tab_background'];
                }
                $sub_cat->description           =    json_encode($request->description);
                $sub_cat->is_active             =    $request->is_active;
                $sub_cat->show_images           =    (isset($request->show_images)) ? 1 : 0;
                $sub_cat->services              =     isset($request->key_features)?json_encode($request->key_features) : null;

                if ($sub_cat->save()) {
                    echo json_encode("success");
                    die;
                }
                echo json_encode("failed");
            }
        }
    }
    public function DelSubCat($id)
    {

        if (DB::table('sub_categories')->where('id', $id)->delete()) {
            echo json_encode("success");
            die;
        }
        echo json_encode("failed");
    }
}
