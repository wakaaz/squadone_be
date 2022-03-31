<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainCategory extends Model
{
    use HasFactory;
    protected $guarded          =   [];
    public function sub_category(){
        return $this->hasMany('App\Models\SubCategory', 'main_category_id');
    }
}
