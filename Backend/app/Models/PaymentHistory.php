<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentHistory extends Model
{
    use HasFactory;

    protected $table = 'payment_history';

    protected $fillable = [
        'car_id',
        'showroom_name',
        'wholesaler_address',
        'purchase_amount',
        'purchase_date',
        'nid_number',
        'tin_certificate',
        'customer_address',
        'contact_number',
        'email',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'purchase_amount' => 'decimal:2',
    ];

    // Relationships
    public function car()
    {
        return $this->belongsTo(Car::class, 'car_id');
    }

    public function installments()
    {
        return $this->hasMany(Installment::class, 'payment_history_id');
    }
}
