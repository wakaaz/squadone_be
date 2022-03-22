<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use DB;
use Auth;
use App\AccessRights as AR;
use App\Models\ControllersList as CL;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Core\AccessRightsAuth;

class Admin extends AccessRightsAuth
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $allRoutes = CL::orderBy('parent_module_priority', 'asc')->get()->toArray();
        $data = array_values($this->unique_multidim_array($allRoutes, 'parent_module'));
        
        foreach ($data as $key => $value) {
            $data[$key]['sub_mods'] = array_values(array_filter($allRoutes, function($item) use($value){
                return $value['parent_module'] == $item['parent_module'];
            }));

            array_multisort(array_column($data[$key]['sub_mods'], 'sub_module_priority'), SORT_ASC, $data[$key]['sub_mods']);
        }

        return view('admin.settings', [ 'data' => $data ]);
    }

    public function SaveSubMod(Request $request){
        $icon = "";
        $parentMod = DB::table('controllers')->where('parent_module', $request->parent)->first();
        if($request->hasFile('icon')){
            $completeFileName = $request->file('icon')->getClientOriginalName();
            $fileNameOnly = pathinfo($completeFileName, PATHINFO_FILENAME);
            $extension = $request->file('icon')->getClientOriginalExtension();
            $iconPath = str_replace(' ', '_', $fileNameOnly).'-'. rand() .'_'.time().'.'.$extension;
            $path = $request->file('icon')->storeAs('public/icons', $iconPath);
            $icon = $iconPath;
        }
        $cl = new CL;
        if($request->item_id)
            $cl = CL::find($request->item_id);
            
        $cl->controller = $request->route;
        $cl->made_up_name = $request->made_up_name;
        $cl->sub_module = $request->module_name;
        $cl->show_in_sub_menu = $request->show_in_sub_menu;
        $cl->sub_menu_icon = $icon;
        $cl->parent_module = $request->parent;
        $cl->sub_module_priority = $request->priority;
        $cl->parent_module_priority = $parentMod->parent_module_priority;
        $cl->save();
        return [ 'code' => 200 ];
    }

    public function UpdateSubModPriority(Request $request){
        foreach ($request->data as $key => $item) {
            $cl = CL::find($item['id']);
            $cl->sub_module_priority = $item['priority'];
            $cl->save();
        }
        return [ 'code' => 200 ];
    }

    public function DeleteSubNavItem(Request $request){
        CL::find($request->id)->delete();
    }
    
    public function UpdateParentMod(Request $request){
        CL::where('parent_module', $request['old_parent_mod'])->update(['parent_module' => $request['parentMod']]);
    }

    public function UpdateParentModPriority(Request $request){
        foreach ($request->data as $key => $item) {
            CL::where('parent_module', $item['module'])->update(['parent_module_priority' => $item['priority']]);
        }
        return [ 'code' => 200 ];
    }

    public function SaveParentMod(Request $request){
        $icon = "";
        $parent_icon = "";

        if($request->hasFile('parent_icon')){
            $existingIcon = CL::where('parent_module', $request->parent_module_name_update)->first();
            if($existingIcon){
                if(Storage::exists('public/icons/'.$existingIcon->logo)){
                    Storage::delete('public/icons/'.$existingIcon->logo);
                }
            }
            $completeFileName = $request->file('parent_icon')->getClientOriginalName();
            $fileNameOnly = pathinfo($completeFileName, PATHINFO_FILENAME);
            $extension = $request->file('parent_icon')->getClientOriginalExtension();
            $iconPath = str_replace(' ', '_', $fileNameOnly).'-'. rand() .'_'.time().'.'.$extension;
            $path = $request->file('parent_icon')->storeAs('public/icons', $iconPath);
            $parent_icon = $iconPath;
        }

        if($request->hasFile('icon')){
            $completeFileName = $request->file('icon')->getClientOriginalName();
            $fileNameOnly = pathinfo($completeFileName, PATHINFO_FILENAME);
            $extension = $request->file('icon')->getClientOriginalExtension();
            $iconPath = str_replace(' ', '_', $fileNameOnly).'-'. rand() .'_'.time().'.'.$extension;
            $path = $request->file('icon')->storeAs('public/icons', $iconPath);
            $icon = $iconPath;
        }
        
        $cl = new CL;
        if($request->parent_module_name_update){
            if($parent_icon){
                CL::where('parent_module', $request->parent_module_name_update)->update([ 'parent_module' => $request->parent_module_name, 'logo' => $parent_icon, 'show_in_sidebar' => $request->show_in_sidebar ]);
            }else{
                CL::where('parent_module', $request->parent_module_name_update)->update([ 'parent_module' => $request->parent_module_name, 'show_in_sidebar' => $request->show_in_sidebar ]);
            }
            return [ 'code' => 200 ];
        }
            
        $cl->controller = $request->route;
        $cl->made_up_name = $request->made_up_name;
        $cl->sub_module = $request->module_name;
        $cl->show_in_sidebar = $request->show_in_sidebar;
        $cl->sub_menu_icon = $icon;
        $cl->logo = $parent_icon;
        $cl->parent_module = $request->parent_module_name;
        $cl->sub_module_priority = 1;
        $cl->parent_module_priority = $request->priority;
        $cl->save();
        return [ 'code' => 200 ];
    }

    public function DeleteParentMod(Request $request){
        CL::where('parent_module', $request->parent_module)->delete();
    }
    
}
