<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TransactionHeader extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'code',
        'rate_euro',
        'date_paid',
    ];

    protected $casts = [
        'date_paid' => 'datetime',
        'rate_euro' => 'double',
    ];

    protected $appends = [
        'formatted_date_paid', 
    ];

    public function details() {
        return $this->hasMany(TransactionDetail::class, 'transaction_id');
    }

    public function getFormattedDatePaidAttribute() {
        return $this->date_paid ? $this->date_paid->format('d/m/Y') : null;
    }
}