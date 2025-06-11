<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ms_category table
        Schema::create('ms_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Income, Expense
            $table->timestamps();
        });

        // transaction_header table
        Schema::create('transaction_headers', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->string('code')->unique();
            $table->double('rate_euro');
            $table->timestamp('date_paid'); // Changed to timestamp for date and time
            $table->timestamps();
        });

        // transaction_detail table
        Schema::create('transaction_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('transaction_headers')->onDelete('cascade');
            $table->foreignId('transaction_category_id')->constrained('ms_categories'); // Link to ms_categories
            $table->string('name'); // Nama transaksi
            $table->double('value_idr');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_details');
        Schema::dropIfExists('transaction_headers');
        Schema::dropIfExists('ms_categories');
    }
};