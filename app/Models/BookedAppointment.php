<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookedAppointment extends Model
{
    protected $table            = 'booked_appointments';
    protected $guarded          =   [];
     public function exhibition()
     {
        return $this->hasOne('App\Models\Exhibition','id','exhibition_id');
     }
}
