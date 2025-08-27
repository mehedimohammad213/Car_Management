<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model
{
    use HasFactory;
    
    protected $table = 'categories';
    
    protected $fillable = [
        'name',
        'image',
        'parent_category_id',
        'status',
        'short_des',
    ];

    protected $attributes = [
        'status' => 'active',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_category_id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_category_id');
    }

    public function cars()
    {
        return $this->hasMany(Car::class);
    }

    // Scopes
    public function scopeActive(Builder $query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive(Builder $query)
    {
        return $query->where('status', 'inactive');
    }

    public function scopeParentCategories(Builder $query)
    {
        return $query->whereNull('parent_category_id');
    }

    public function scopeChildCategories(Builder $query)
    {
        return $query->whereNotNull('parent_category_id');
    }

    public function scopeSearch(Builder $query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('short_des', 'like', "%{$search}%");
        });
    }

    // Accessors
    public function getFullNameAttribute()
    {
        return $this->parent ? $this->parent->name . ' > ' . $this->name : $this->name;
    }

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}
