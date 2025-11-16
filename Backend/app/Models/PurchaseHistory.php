<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseHistory extends Model
{
    use HasFactory;

    protected $table = 'purchase_history';

    protected $fillable = [
        'car_id',
        'purchase_date',
        'purchase_amount',
        'foreign_amount',
        'bdt_amount',
        'govt_duty',
        'cnf_amount',
        'miscellaneous',
        'lc_date',
        'lc_number',
        'lc_bank_name',
        'lc_bank_branch_name',
        'lc_bank_branch_address',
        'total_units_per_lc',
        'bill_of_lading',
        'invoice_number',
        'export_certificate',
        'export_certificate_translated',
        'bill_of_exchange_amount',
        'custom_duty_copy_3pages',
        'cheque_copy',
        'certificate',
        'custom_one',
        'custom_two',
        'custom_three',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'purchase_amount' => 'decimal:2',
        'foreign_amount' => 'decimal:2',
        'bdt_amount' => 'decimal:2',
        'cnf_amount' => 'decimal:2',
        'lc_date' => 'date',
    ];

    // Always include keys in API responses
    protected $appends = [
        'foreign_amount',
        'bdt_amount',
    ];

    public function getForeignAmountAttribute(): mixed
    {
        return array_key_exists('foreign_amount', $this->attributes)
            ? $this->attributes['foreign_amount']
            : null;
    }

    public function getBdtAmountAttribute(): mixed
    {
        return array_key_exists('bdt_amount', $this->attributes)
            ? $this->attributes['bdt_amount']
            : null;
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
