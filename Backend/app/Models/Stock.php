<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    use HasFactory;

    /** Matches car Location & Status options + inventory outcomes. */
    public const STATUSES = [
        'pending',
        'available',
        'sold',
        'reserved',
        'in_transit',
        'preorder',
        'damaged',
        'lost',
        'stolen',
    ];

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
            'pending' => 'bg-slate-100 text-slate-800',
            'available' => 'bg-green-100 text-green-800',
            'sold' => 'bg-red-100 text-red-800',
            'reserved' => 'bg-yellow-100 text-yellow-800',
            'in_transit' => 'bg-sky-100 text-sky-800',
            'preorder' => 'bg-violet-100 text-violet-800',
            'damaged' => 'bg-orange-100 text-orange-800',
            'lost' => 'bg-gray-100 text-gray-800',
            'stolen' => 'bg-red-100 text-red-800',
        ];

        $color = $statusColors[$this->status] ?? 'bg-gray-100 text-gray-800';
        $label = str_replace('_', ' ', (string) $this->status);
        return '<span class="px-2 py-1 text-xs font-medium rounded-full ' . $color . '">' . ucwords($label) . '</span>';
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
