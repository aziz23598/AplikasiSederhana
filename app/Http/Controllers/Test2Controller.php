<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TransactionHeader;
use App\Models\TransactionDetail;
use App\Models\MsCategory;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class Test2Controller extends Controller
{
    public function index(Request $request) {

        try {
            $request->validate([ 
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'search' => 'nullable|string|max:255',
                'category' => 'nullable|string',
                'sort_by' => ['nullable', 'string', Rule::in(['description', 'code', 'rate_euro', 'date_paid', 'category', 'name', 'value_idr'])],
                'sort_direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
                'view' => ['nullable', 'string', Rule::in(['index','list', 'rekap'])], 
            ]);
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }

        $viewParam = $request->input('view'); 
        $viewComponent = 'test2/Index'; 

        if ($viewParam === 'list') { 
            $viewComponent = 'test2/List';
        } elseif ($viewParam === 'rekap') {
            $viewComponent = 'test2/Rekap';
        } 

        $query = TransactionDetail::with(['header', 'category']);

        // Filtering
        if ($request->has('search') && $request->input('search') != '') {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                // Mencari di kolom header (description, code)
                $q->whereHas('header', function ($sq) use ($search) {
                    $sq->where('description', 'like', '%' . $search . '%')
                       ->orWhere('code', 'like', '%' . $search . '%')
                       ->orWhere('rate_euro', 'like', '%' . $search . '%');
                })
                // Atau mencari di kolom detail (name)
                ->orWhere('name', 'like', '%' . $search . '%')
                ->orWhere('value_idr', 'like', '%' . $search . '%');
            });
        }

        $startDate = $request->input('start_date');

        $endDate = $request->input('end_date');

        if ($startDate) {
            $query->whereHas('header', function ($q) use ($startDate) {
                $q->whereDate('date_paid', '>=', $startDate);
            });
        }

        if ($endDate) {
                $query->whereHas('header', function ($q) use ($endDate) {
                    $q->whereDate('date_paid', '<=', $endDate);
                });
            }

        if ($request->has('category') && $request->input('category') != '') {
            $categoryName = $request->input('category');
            $query->whereHas('category', function ($q) use ($categoryName) {
                $q->where('name', $categoryName);
            });
        }

        // Sorting
        $sortColumn = $request->input('sort_by', 'date_paid'); 
        $sortDirection = $request->input('sort_direction', 'desc');

        // Logic untuk sorting:
        if ($sortColumn === 'description' || $sortColumn === 'code' || $sortColumn === 'rate_euro' || $sortColumn === 'date_paid') {
            $query->join('transaction_headers as th', 'transaction_details.transaction_id', '=', 'th.id')
                  ->orderBy('th.' . $sortColumn, $sortDirection)
                  ->select('transaction_details.*'); 
        } elseif ($sortColumn === 'category') {
            $query->join('ms_categories as mc', 'transaction_details.transaction_category_id', '=', 'mc.id')
                  ->orderBy('mc.name', $sortDirection)
                  ->select('transaction_details.*'); 
        } else {
            $query->orderBy('transaction_details.' . $sortColumn, $sortDirection);
        }

        $query->orderBy('transaction_details.transaction_id', 'asc')
              ->orderBy('transaction_details.id', 'asc');


        $transactions = $query->paginate(10)->withQueryString(); 

        $categories = MsCategory::all(); 

        return Inertia::render($viewComponent, [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'start_date', 'end_date', 'category', 'sort_by', 'sort_direction', 'view']),
            'categories' => $categories,
        ]);
    }
    

    public function create() {
        $categories = MsCategory::all();
        return Inertia::render('test2/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request) {
        try {
            // Validasi Server-Side
            $incomesData = collect($request->input('transactionBlocks', []))
                            ->where('type', 'income')
                            ->flatMap(fn($block) => $block['items'] ?? [])
                            ->toArray();

            $expensesData = collect($request->input('transactionBlocks', []))
                            ->where('type', 'expense')
                            ->flatMap(fn($block) => $block['items'] ?? [])
                            ->toArray();

            $validator = \Validator::make([
                'description' => $request->description,
                'code' => $request->code,
                'rate_euro' => $request->rate_euro,
                'date_paid' => $request->date_paid,
                'incomes' => $incomesData, 
                 'expenses' => $expensesData, 
             ], [
                'description' => 'required|string|max:255',
                'code' => 'required|string|max:255|unique:transaction_headers,code',
                'rate_euro' => 'required|numeric|min:0',
                'date_paid' => 'required|date',
                'incomes' => 'nullable|array',
                'incomes.*.name' => 'required_with:incomes|string|max:255',
                'incomes.*.nominal' => 'required_with:incomes|numeric|min:0',
                 'expenses' => 'nullable|array',
                 'expenses.*.name' => 'required_with:expenses|string|max:255',
                'expenses.*.nominal' => 'required_with:expenses|numeric|min:0',
            ]);
                
            $validatedData = $validator->validate(); 
                
            DB::transaction(function () use ($validatedData) { 
                $header = TransactionHeader::create([
                    'description' => $validatedData['description'],
                    'code' => $validatedData['code'],
                    'rate_euro' => $validatedData['rate_euro'],
                    'date_paid' => $validatedData['date_paid'],
            ]);
                
            $incomeCategoryObj = MsCategory::where('name', 'Income')->first();
            $expenseCategoryObj = MsCategory::where('name', 'Expense')->first();
                
            if (!$incomeCategoryObj || !$expenseCategoryObj) {
                Log::error('Kategori "Income" atau "Expense" tidak ditemukan (harusnya sudah di-seed).');
                throw new \Exception('Konfigurasi: Kategori Income/Expense tidak ada.');
            }
                
            $incomeCategoryId = $incomeCategoryObj->id;
            $expenseCategoryId = $expenseCategoryObj->id;
            
            // Save Incomes
            if (isset($validatedData['incomes']) && is_array($validatedData['incomes'])) {
                foreach ($validatedData['incomes'] as $income)  {
                    if (!empty($income['name']) || (isset($income['nominal']) && $income['nominal'] !== null && $income['nominal'] !== '')) {
                        $header->details()->create([
                            'transaction_category_id' => $incomeCategoryId,
                            'name' => $income['name'],
                            'value_idr' => (float) $income['nominal'],
                        ]);
                    }
                }
            }
                
            // Save Expenses
            if (isset($validatedData['expenses']) && is_array($validatedData['expenses'])) {
                foreach ($validatedData['expenses'] as $expense) {
                    if (!empty($expense['name']) || (isset($expense['nominal']) && $expense['nominal'] !== null && $expense['nominal'] !== '')) {
                        $header->details()->create([
                            'transaction_category_id' => $expenseCategoryId,
                            'name' => $expense['name'],
                            'value_idr' => (float) $expense['nominal'],
                        ]);
                    }
                }
            }
        });
                
        return redirect()->route('test2.list', ['view' => 'list'])->with('success', 'Transaksi berhasil ditambahkan!');
                
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {    
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan transaksi: ' . $e->getMessage())->withInput();
        }
    }


    public function edit(TransactionHeader $test2) 
    {
        $test2->load(['details.category']);

        $categories = MsCategory::all();

        // Pisahkan incomes dan expenses
        $incomes = $test2->details->filter(fn($detail) =>
            $detail->category && strtolower($detail->category->name) === 'income' 
        );
        $expenses = $test2->details->filter(fn($detail) =>
            $detail->category && strtolower($detail->category->name) === 'expense' 
        );

        return Inertia::render('test2/Edit', [
            'transaction' => $test2, 
            'incomes' => $incomes->values()->all(),
            'expenses' => $expenses->values()->all(),
            'categories' => $categories
        ]);
    }


    public function update(Request $request, TransactionHeader $test2) 
    {
        try {
            $validatedData = $request->validate([
                'description' => 'required|string|max:255',
                'code' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('transaction_headers', 'code')->ignore($test2->id),
                ],
                'rate_euro' => 'required|numeric|min:0',
                'date_paid' => 'required|date',
                'incomes' => 'nullable|array',
                'incomes.*.id' => 'nullable|exists:transaction_details,id',
                'incomes.*.name' => 'nullable|string|max:255', 
                'incomes.*.nominal' => 'nullable|numeric|min:0', 

                'expenses' => 'nullable|array',
                'expenses.*.id' => 'nullable|exists:transaction_details,id',
                'expenses.*.name' => 'nullable|string|max:255', 
                'expenses.*.nominal' => 'nullable|numeric|min:0', 
            ]);

            DB::transaction(function () use ($request, $test2, $validatedData) {
                $test2->update([
                    'description' => $validatedData['description'],
                    'code' => $validatedData['code'],
                    'rate_euro' => $validatedData['rate_euro'],
                    'date_paid' => $validatedData['date_paid'],
                ]);

                $this->syncDetails($test2, $validatedData['incomes'] ?? [], 'Income');
                $this->syncDetails($test2, $validatedData['expenses'] ?? [], 'Expense');

            });

            return redirect()->route('test2.list', ['view' => 'list'])->with('success', 'Transaksi berhasil diperbarui!');

        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memperbarui transaksi: ' . $e->getMessage() . ' (' . $e->getLine() . ')')->withInput();
        }
    }

    protected function syncDetails(TransactionHeader $test2, array $detailsData, string $categoryName)
    {
        $category = MsCategory::where('name', $categoryName)->first();
        if (!$category) {
            return; 
        }
        $categoryId = $category->id;

        $existingDetailIds = $test2->details()
                                         ->where('transaction_category_id', $categoryId)
                                         ->pluck('id')
                                         ->toArray();

        
        $incomingDetailIds = [];
        foreach ($detailsData as $detailData) {
        if (!empty($detailData['name']) || (!empty($detailData['nominal']) && $detailData['nominal'] !== '')) {
            $nominalValue = (float) $detailData['nominal'];

            $detailId = isset($detailData['id']) ? (int) $detailData['id'] : null; 
            if ($detailId && in_array($detailId, $existingDetailIds)) {
                $updated = $test2->details()->where('id', $detailId)->update([
                    'name' => $detailData['name'],
                    'value_idr' => $nominalValue,
                    'transaction_category_id' => $categoryId,
                ]);
                $incomingDetailIds[] = $detailId;
            } else {
                $newDetail = $test2->details()->create([
                    'transaction_id' => $test2->id,
                    'name' => $detailData['name'],
                    'value_idr' => $nominalValue,
                    'transaction_category_id' => $categoryId,
                ]);
                $incomingDetailIds[] = $newDetail->id;
            }
        } else {
        }
    }
        $detailsToDelete = array_diff($existingDetailIds, $incomingDetailIds);
        if (!empty($detailsToDelete)) {
            $test2->details()->whereIn('id', $detailsToDelete)->delete();
        }
    }
    
    public function destroy(TransactionHeader $test2) {
        try {
            DB::transaction(function () use ($test2) {
                $deletedDetailsCount = $test2->details()->delete();
                $test2->delete();
            });

            return redirect()->route('test2.list', ['view' => 'list'])->with('success', 'Transaksi berhasil dihapus!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus transaksi: ' . $e->getMessage());
        }
    }
}