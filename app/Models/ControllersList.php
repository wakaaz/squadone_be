<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControllersList extends Model
{
    use HasFactory;
    protected $table = "controllers";
    public $timestamps = false;
}
