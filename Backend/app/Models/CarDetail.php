<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarDetail extends Model
{
    use HasFactory;

    protected $table = 'car_details';

    protected $fillable = [
        'car_id',
        'short_title',
        'full_title',
        'description',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
    ];

    // Relationships
    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    // Accessors
    public function getImagesArrayAttribute()
    {
        return is_array($this->images) ? $this->images : [];
    }

    // Mutators
    public function setImagesAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['images'] = json_encode($value);
        } else {
            $this->attributes['images'] = $value;
        }
    }

    public function subDetails()
    {
        return $this->hasMany(CarSubDetails::class);
    }
}
