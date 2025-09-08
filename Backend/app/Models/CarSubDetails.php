<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarSubDetails extends Model
{
    protected $table = 'car_sub_details';

    protected $fillable = [
        'car_detail_id',
        'title',
        'description',
    ];
    
    public function carDetail()
    {
        return $this->belongsTo(CarDetail::class);
    }
}
