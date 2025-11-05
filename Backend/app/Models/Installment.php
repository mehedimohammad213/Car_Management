<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Installment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_history_id',
        'installment_date',
        'description',
        'amount',
        'payment_method',
        'bank_name',
        'cheque_number',
        'balance',
        'remarks',
    ];

    protected $casts = [
        'installment_date' => 'date',
        'amount' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    // Relationships
    public function paymentHistory()
    {
        return $this->belongsTo(PaymentHistory::class, 'payment_history_id');
    }
}

