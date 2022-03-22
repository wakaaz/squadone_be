<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;
    protected $guarded          =   [];
    public function media(){
        return $this->hasMany('App\Models\Media', 'module_id')->where('module', 'products')->where('type','detail');
    }
    public function slider_media(){
        return $this->hasMany('App\Models\Media', 'module_id')->where('module', 'products')->where('type','slider');
    }

}
