<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarPhoto extends Model
{
    use HasFactory;

    protected $table = 'car_photos';

    protected $fillable = [
        'car_id',
        'url',
        'is_primary',
        'sort_order',
        'is_hidden',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_hidden'  => 'boolean',
        'sort_order' => 'integer',
    ];



    public function car()
    {
        return $this->belongsTo(Car::class);
    }



    public function scopeVisible($query)
    {
        return $query->where('is_hidden', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('is_primary', 'desc')
                     ->orderBy('sort_order', 'asc')
                     ->orderBy('id', 'asc');
    }

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    protected static function booted(): void
    {
        static::saving(function (CarPhoto $photo) {
            if ($photo->is_primary && $photo->car_id) {
                static::where('car_id', $photo->car_id)
                    ->where('id', '!=', $photo->id ?? 0)
                    ->update(['is_primary' => false]);
            }
        });
    }
}
