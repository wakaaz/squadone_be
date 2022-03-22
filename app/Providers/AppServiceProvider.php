<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Auth;
use DB;
use App\AccessRights as AR;
use App\Models\ControllersList as CL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        
        Schema::defaultStringLength('191');
        app('view')->composer('layouts.master', function ($view) {
            $action = app('request')->route()->getAction();
            $controller = class_basename($action['controller']);
            list($controller, $action) = explode('@', $controller);
            $userPermissions = array();
       
            $allControllers = CL::orderBy('parent_module_priority')->get();
            $notif_data = array();
            $all_notifications = array();

            $this->get_notif_data($notif_data, $all_notifications);
            if(Auth::check()){
                if(Auth::user()->super){
                    foreach(CL::all() as $controllers)
                    {
                        $userPermissions[] =  $controllers->controller;
                      
                    }
                }else{
                    foreach(DB::table('access_rights')->select('controller_right')->where('employee_id', Auth::user()->id)->get() as $object)
                    {
                        $userPermissions[] =  $object->controller_right;
                    }
                }
            }

            //$tasks = C::where('assigned_to', Auth::user()->id)->get();
            //$customersFromProvider = \App\Customer::all();
            $empsForCentralizedTask = \App\Models\User::all();
            // dd($action);
            $view->with(compact('controller', 'action', 'userPermissions', 'notif_data', 'all_notifications', 'allControllers', 'empsForCentralizedTask'));
        });

        app('view')->composer('home', function ($view) {
            $notif_data = array();
            $all_notifications = array();
            $this->get_notif_data($notif_data, $all_notifications);
            $view->with(compact('notif_data'));
        });

        app('view')->composer('notifications.viewAll', function ($view) {
            $notif_data = array();
            $all_notifications = array();
            $this->get_notif_data($notif_data, $all_notifications);
            $view->with(compact('all_notifications'));
        });
    }
    public function get_notif_data(&$notif_data, &$all_notification){
        $check = DB::table('subscribed_notifications as sn')->selectRaw('GROUP_CONCAT(notification_code_id) as notifications_codes')->whereRaw('web = 1 AND emp_id = '. Auth::user()->id)->first();
        //echo $check; die;
        if($check->notifications_codes){

            //Show only four notifications
            $notif_data = DB::table('notifications_list as nlist')->selectRaw('id, code, message, customer_id, order_id, supplier_id, prospect_customer_id, created_at')->whereRaw('code IN ('.DB::table('subscribed_notifications as sn')->selectRaw('GROUP_CONCAT(notification_code_id) as notifications_codes')->whereRaw('web = 1 AND emp_id = '. Auth::user()->id)->first()->notifications_codes.') AND id NOT IN (Select notif_id from notification_read_status where emp_id = "'.Auth::user()->id.'")')->orderBy('id','DESC')->take(5)->get();

            //Show all notifications
            $all_notification = DB::table('notifications_list as nlist')->selectRaw('id, code, message, order_id, customer_id, supplier_id, prospect_customer_id, created_at')->whereRaw('code IN ('.DB::table('subscribed_notifications as sn')->selectRaw('GROUP_CONCAT(notification_code_id) as notifications_codes')->whereRaw('web = 1 AND emp_id = '. Auth::user()->id)->first()->notifications_codes.')')->orderBy('id','DESC')->get();

        }else{
            $this->notif_data = array();
            $this->all_notification = array();
        }
    }
}
