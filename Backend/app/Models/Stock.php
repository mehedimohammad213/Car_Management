<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    use HasFactory;

    protected $table = 'stocks';

    protected $fillable = [
        'car_id',
        'quantity',
        'price',
        'status',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'status' => 'string',
    ];

    // Relationships
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    // Accessors
    public function getFormattedPriceAttribute(): string
    {
        return $this->price ? '$' . number_format($this->price, 2) : 'N/A';
    }

    public function getStatusBadgeAttribute(): string
    {
        $statusColors = [
            'available' => 'bg-green-100 text-green-800',
            'sold' => 'bg-red-100 text-red-800',
            'reserved' => 'bg-yellow-100 text-yellow-800',
            'damaged' => 'bg-orange-100 text-orange-800',
            'lost' => 'bg-gray-100 text-gray-800',
            'stolen' => 'bg-red-100 text-red-800',
        ];

        $color = $statusColors[$this->status] ?? 'bg-gray-100 text-gray-800';
        return '<span class="px-2 py-1 text-xs font-medium rounded-full ' . $color . '">' . ucfirst($this->status) . '</span>';
    }

    // Scopes for filtering
    public function scopeByStatus($query, $status)
    {
        if ($status) {
            return $query->where('status', $status);
        }
        return $query;
    }

    public function scopeByPriceRange($query, $minPrice, $maxPrice)
    {
        if ($minPrice !== null) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice !== null) {
            $query->where('price', '<=', $maxPrice);
        }
        return $query;
    }

    public function scopeByQuantityRange($query, $minQuantity, $maxQuantity)
    {
        if ($minQuantity !== null) {
            $query->where('quantity', '>=', $minQuantity);
        }
        if ($maxQuantity !== null) {
            $query->where('quantity', '<=', $maxQuantity);
        }
        return $query;
    }

    public function scopeSearchByCar($query, $search)
    {
        if ($search) {
            return $query->whereHas('car', function ($q) use ($search) {
                $q->where('make', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('ref_no', 'like', "%{$search}%");
            });
        }
        return $query;
    }
}
