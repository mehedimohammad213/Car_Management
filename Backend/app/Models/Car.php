<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'subcategory_id',
        'ref_no',
        'make',
        'model',
        'model_code',
        'variant',
        'year',
        'reg_year_month',
        'mileage_km',
        'engine_cc',
        'transmission',
        'drive',
        'steering',
        'fuel',
        'color',
        'seats',
        'grade_overall',
        'grade_exterior',
        'grade_interior',
        'price_amount',
        'price_currency',
        'price_basis',
        'chassis_no_masked',
        'chassis_no_full',
        'location',
        'country_origin',
        'status',
        'notes',
    ];

    protected $casts = [
        'year' => 'integer',
        'mileage_km' => 'integer',
        'engine_cc' => 'integer',
        'seats' => 'integer',
        'grade_overall' => 'decimal:1',
        'price_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'price_currency' => 'USD',
        'status' => 'available',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function subcategory()
    {
        return $this->belongsTo(Category::class, 'subcategory_id');
    }

    public function photos()
    {
        return $this->hasMany(CarPhoto::class);
    }

    public function primaryPhoto()
    {
        return $this->hasOne(CarPhoto::class)->where('is_primary', true);
    }

    public function details()
    {
        return $this->hasMany(CarDetail::class);
    }

    public function detail()
    {
        return $this->hasOne(CarDetail::class);
    }

    // Scopes
    public function scopeSearch(Builder $query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('ref_no', 'like', "%{$search}%")
              ->orWhere('make', 'like', "%{$search}%")
              ->orWhere('model', 'like', "%{$search}%")
              ->orWhere('variant', 'like', "%{$search}%")
              ->orWhere('model_code', 'like', "%{$search}%")
              ->orWhere('chassis_no_masked', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%")
              ->orWhere('notes', 'like', "%{$search}%");
        });
    }

    public function scopeByStatus(Builder $query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByCategory(Builder $query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeBySubcategory(Builder $query, $subcategoryId)
    {
        return $query->where('subcategory_id', $subcategoryId);
    }

    public function scopeByMake(Builder $query, $make)
    {
        return $query->where('make', $make);
    }

    public function scopeByYear(Builder $query, $year)
    {
        return $query->where('year', $year);
    }

    public function scopeByYearRange(Builder $query, $minYear, $maxYear)
    {
        return $query->whereBetween('year', [$minYear, $maxYear]);
    }

    public function scopeByPriceRange(Builder $query, $minPrice, $maxPrice)
    {
        return $query->whereBetween('price_amount', [$minPrice, $maxPrice]);
    }

    public function scopeByMileageRange(Builder $query, $minMileage, $maxMileage)
    {
        return $query->whereBetween('mileage_km', [$minMileage, $maxMileage]);
    }

    public function scopeByTransmission(Builder $query, $transmission)
    {
        return $query->where('transmission', $transmission);
    }

    public function scopeByFuel(Builder $query, $fuel)
    {
        return $query->where('fuel', $fuel);
    }

    public function scopeByColor(Builder $query, $color)
    {
        return $query->where('color', $color);
    }

    public function scopeByDrive(Builder $query, $drive)
    {
        return $query->where('drive', $drive);
    }

    public function scopeBySteering(Builder $query, $steering)
    {
        return $query->where('steering', $steering);
    }

    public function scopeByCountry(Builder $query, $country)
    {
        return $query->where('country_origin', $country);
    }

    public function scopeAvailable(Builder $query)
    {
        return $query->where('status', 'available');
    }

    public function scopeSold(Builder $query)
    {
        return $query->where('status', 'sold');
    }

    public function scopeReserved(Builder $query)
    {
        return $query->where('status', 'reserved');
    }

    // Accessors
    public function getFullNameAttribute()
    {
        $name = $this->make . ' ' . $this->model;
        if ($this->variant) {
            $name .= ' ' . $this->variant;
        }
        return $name;
    }

    public function getFormattedPriceAttribute()
    {
        if (!$this->price_amount) {
            return null;
        }
        return $this->price_currency . ' ' . number_format($this->price_amount, 2);
    }

    public function getFormattedMileageAttribute()
    {
        if (!$this->mileage_km) {
            return null;
        }
        return number_format($this->mileage_km) . ' km';
    }

    public function getFormattedEngineAttribute()
    {
        if (!$this->engine_cc) {
            return null;
        }
        return number_format($this->engine_cc) . ' cc';
    }

    public function getPrimaryPhotoUrlAttribute()
    {
        $primaryPhoto = $this->primaryPhoto;
        return $primaryPhoto ? $primaryPhoto->image_url : null;
    }

    public function getPhotosCountAttribute()
    {
        return $this->photos()->count();
    }

    // Mutators
    public function setRefNoAttribute($value)
    {
        if (!$value) {
            $this->attributes['ref_no'] = 'CAR-' . strtoupper(uniqid());
        } else {
            $this->attributes['ref_no'] = $value;
        }
    }

    public function setPriceAmountAttribute($value)
    {
        $this->attributes['price_amount'] = $value ? (float) $value : null;
    }

    public function setMileageKmAttribute($value)
    {
        $this->attributes['mileage_km'] = $value ? (int) $value : null;
    }

    public function setEngineCcAttribute($value)
    {
        $this->attributes['engine_cc'] = $value ? (int) $value : null;
    }

    public function setSeatsAttribute($value)
    {
        $this->attributes['seats'] = $value ? (int) $value : null;
    }

    public function setYearAttribute($value)
    {
        $this->attributes['year'] = (int) $value;
    }
}
