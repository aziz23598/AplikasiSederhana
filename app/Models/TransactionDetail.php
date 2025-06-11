<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TransactionDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'transaction_category_id',
        'name',
        'value_idr',
    ];

    protected $casts = [
        'value_idr' => 'double',
    ];

    public function header(){
        return $this->belongsTo(TransactionHeader::class, 'transaction_id');
    }

    public function category(){
        return $this->belongsTo(MsCategory::class, 'transaction_category_id');
    }
}