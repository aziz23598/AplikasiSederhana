<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MsCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function transactionDetails() {
        return $this->hasMany(TransactionDetail::class, 'transaction_category_id');
    }
}