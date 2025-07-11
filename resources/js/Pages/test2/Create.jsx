import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutTest2';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

export default function CreateTransaction({ categories }) {
    const { flash, errors: pageError } = usePage().props;

    const { data, setData, post, processing, reset, errors } = useForm({
        description: '',
        code: '',
        rate_euro: '',
        date_paid: new Date().toISOString().slice(0, 10), 
        transactionBlocks: [
            {
                id: uuidv4(), 
                type: 'income',
                items: [{ name: '', nominal: '' }] 
            }
        ],
    });

    const handleHeaderChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const addTransactionBlock = () => {
        setData('transactionBlocks', [
            ...data.transactionBlocks,
            {
                id: uuidv4(),
                type: 'expense', 
                items: [{ name: '', nominal: '' }]
            }
        ]);
    };

    const handleBlockTypeChange = (blockId, value) => {
        setData('transactionBlocks', data.transactionBlocks.map(block =>
            block.id === blockId ? { ...block, type: value.toLowerCase() } : block
        ));
    };

    const removeTransactionBlock = (blockId) => {
        if (confirm('Apakah Anda yakin ingin menghapus blok transaksi ini beserta isinya?')) {
            setData('transactionBlocks', data.transactionBlocks.filter(block => block.id !== blockId));
        }
    };

    const addBlockItem = (blockId) => {
        setData('transactionBlocks', data.transactionBlocks.map(block =>
            block.id === blockId
                ? { ...block, items: [...block.items, { name: '', nominal: '' }] }
                : block
        ));
    };

    const removeBlockItem = (blockId, itemIndex) => {
        if (confirm('Apakah Anda yakin ingin menghapus baris transaksi ini?')) {
            setData('transactionBlocks', data.transactionBlocks.map(block =>
                block.id === blockId
                    ? { ...block, items: block.items.filter((_, i) => i !== itemIndex) }
                    : block
            ));
        }
    };

    const handleBlockItemChange = (blockId, itemIndex, field, value) => {
        setData('transactionBlocks', data.transactionBlocks.map(block =>
            block.id === blockId
                ? {
                    ...block,
                    items: block.items.map((item, i) =>
                        i === itemIndex ? { ...item, [field]: value } : item
                    )
                }
                : block
        ));
    };

    const submit = (e) => {
        e.preventDefault();
    
        console.log("1. Fungsi submit terpicu!");
    
        const formattedIncomes = [];
        const formattedExpenses = [];
    
        // Loop melalui transactionBlocks untuk memisahkan income dan expense
        data.transactionBlocks.forEach(block => {
            const blockType = block.type ? block.type.toLowerCase() : '';
            if (blockType !== 'income' && blockType !== 'expense') {
                console.warn(`Blok transaksi dengan ID ${block.id} tidak memiliki tipe yang valid: ${block.type}. Akan dilewati.`);
                return; // Lewati blok ini jika tipenya kosong atau tidak valid
            }
    
            block.items.forEach(item => {
                // Konversi nominal menjadi angka float yang bersih sebelum validasi dan pengiriman
                const rawNominal = item.nominal ? item.nominal.toString().replace(/[^0-9,-]/g, '').replace(',', '.') : '';
                const nominalValue = parseFloat(rawNominal);
    
                // Filter baris kosong sepenuhnya sebelum dikirim
                // Hanya kirim jika nama terisi ATAU nominal lebih dari 0
                if (item.name.trim() !== '' || (!isNaN(nominalValue) && nominalValue > 0)) {
                    if (block.type === 'income') {
                        formattedIncomes.push({
                            name: item.name,
                            nominal: nominalValue, // Pastikan ini angka
                        });
                    } else if (block.type === 'expense') {
                        formattedExpenses.push({
                            name: item.name,
                            nominal: nominalValue, // Pastikan ini angka
                        });
                    }
                }
            });
        });
    
        // Ini adalah data yang HARUS dikirim ke backend
        // Struktur ini harus cocok dengan apa yang divalidasi dan disimpan oleh Laravel Anda
        const dataToSubmit = {
            description: data.description,
            code: data.code,
            rate_euro: data.rate_euro,
            date_paid: data.date_paid,
            incomes: formattedIncomes,   // <--- Array incomes
            expenses: formattedExpenses, // <--- Array expenses
        };
    
        // PENTING: Mengirim dataToSubmit LANGSUNG sebagai payload kedua ke `post`
        // BUKAN di dalam object literal seperti `{ data: dataToSubmit }`
        post(route('test2.store'), { ...dataToSubmit }, { // <--- PERBAIKAN PENTING DI SINI!
            onSuccess: () => {
                reset({
                    description: '',
                    code: '',
                    rate_euro: '',
                    date_paid: new Date().toISOString().slice(0, 10),
                    transactionBlocks: [
                        {
                            id: uuidv4(),
                            type: 'income', // Reset default type ke 'income'
                            items: [{ name: '', nominal: '' }]
                        }
                    ],
                });
                if (flash && flash.success) {
                    alert(flash.success);
                }
            },
            onError: (formErrors) => {
                console.error("4. Error dari backend (validasi atau lainnya):", formErrors);
                if (Object.keys(formErrors).length > 0) {
                    alert("Terdapat kesalahan validasi. Silakan periksa formulir Anda.");
                }
            },
            onFinish: () => {
                console.log("5. Permintaan POST selesai (berhasil/gagal).");
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Input Data Transaksi" />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">INPUT DATA TRANSAKSI</h1>

                <form onSubmit={submit}>
                    {/* Header Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="md:col-span-1 mb-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={handleHeaderChange}
                                className="mt-1 text-left block w-full h-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                            <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
                            <input
                                type="text"
                                id="code"
                                name="code"
                                value={data.code}
                                onChange={handleHeaderChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                            </div>
                            <div>
                            <label htmlFor="rate_euro" className="block text-sm font-medium text-gray-700">Rate Euro</label>
                            <input
                                type="number"
                                step="0.01"
                                id="rate_euro"
                                name="rate_euro"
                                value={data.rate_euro}
                                onChange={handleHeaderChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            {errors.rate_euro && <p className="text-red-500 text-xs mt-1">{errors.rate_euro}</p>}
                            </div>
                        <div>
                            <label htmlFor="date_paid" className="block text-sm font-medium text-gray-700">Date Paid</label>
                            <input
                                type="date"
                                id="date_paid"
                                name="date_paid"
                                value={data.date_paid}
                                onChange={handleHeaderChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            {errors.date_paid && <p className="text-red-500 text-xs mt-1">{errors.date_paid}</p>}
                        </div>
                        </div>
                        
                    </div>

                    {/* BLOK UTAMA: DATA TRANSAKSI */}
                    <div className="mb-8 p-4 border border-gray-200 rounded-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">DATA TRANSAKSI</h2>

                        {data.transactionBlocks.map((block, blockIndex) => (
                            <div key={block.id} className="mb-6 p-4 border border-gray-300 rounded-md bg-gray-50 relative">
                                {/* Tombol Hapus Blok */}
                                {data.transactionBlocks.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeTransactionBlock(block.id)}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 p-1 rounded-full bg-white transition duration-150 ease-in-out"
                                        title="Hapus Blok Transaksi Ini"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                )}

                                {/* Dropdown Tipe Kategori untuk Blok Ini */}
                                <div className="mb-4">
                                    <label htmlFor={`block-type-${block.id}`} className="block text-sm font-medium text-gray-700">Category Type</label>
                                    <select
                                        id={`block-type-${block.id}`}
                                        value={block.type}
                                        onChange={(e) => handleBlockTypeChange(block.id, e.target.value)}
                                        className="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required // <--- INI SANGAT PENTING
                                    >
                                        <option value="">-- Pilih Tipe --</option> {/* Opsi default kosong */}
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                    {/* Validasi error untuk tipe blok */}
                                    {errors[`transactionBlocks.${blockIndex}.type`] && <p className="text-red-500 text-xs mt-1">{errors[`transactionBlocks.${blockIndex}.type`]}</p>}
                                </div>

                                {/* Item-item Transaksi di dalam Blok Ini */}
                                <h3 className="text-md font-medium mb-3 text-gray-700">Detail Item Transaksi:</h3>
                                {block.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end">
                                        {/* Nama Transaksi Item */}
                                        <div>
                                            <label htmlFor={`item-name-${block.id}-${itemIndex}`} className="block text-sm font-medium text-gray-700">Nama Transaksi</label>
                                            <input
                                                type="text"
                                                id={`item-name-${block.id}-${itemIndex}`}
                                                value={item.name}
                                                onChange={(e) => handleBlockItemChange(block.id, itemIndex, 'name', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                            {errors[`transactionBlocks.${blockIndex}.items.${itemIndex}.name`] && <p className="text-red-500 text-xs mt-1">{errors[`transactionBlocks.${blockIndex}.items.${itemIndex}.name`]}</p>}
                                        </div>
                                        {/* Nominal Item */}
                                        <div>
                                            <label htmlFor={`item-nominal-${block.id}-${itemIndex}`} className="block text-sm font-medium text-gray-700">Nominal (IDR)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                id={`item-nominal-${block.id}-${itemIndex}`}
                                                value={item.nominal}
                                                onChange={(e) => handleBlockItemChange(block.id, itemIndex, 'nominal', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                            {errors[`transactionBlocks.${blockIndex}.items.${itemIndex}.nominal`] && <p className="text-red-500 text-xs mt-1">{errors[`transactionBlocks.${blockIndex}.items.${itemIndex}.nominal`]}</p>}
                                        </div>
                                        {/* Tombol Aksi Item */}
                                        <div className="flex justify-end items-center">
                                            {block.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeBlockItem(block.id, itemIndex)}
                                                    className="text-red-600 hover:text-red-900 p-2 rounded-md transition duration-150 ease-in-out"
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            )}
                                            {itemIndex === block.items.length - 1 && ( // Tambah hanya di baris terakhir
                                                <button
                                                    type="button"
                                                    onClick={() => addBlockItem(block.id)}
                                                    className="text-blue-600 hover:text-blue-900 p-2 rounded-md transition duration-150 ease-in-out ml-2"
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {/* Jika tidak ada item dalam blok, tampilkan tombol tambah item */}
                                {block.items.length === 0 && (
                                    <button
                                        type="button"
                                        onClick={() => addBlockItem(block.id)}
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Tambah Item Transaksi
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Tombol Tambah Blok Transaksi Baru */}
                        <button
                            type="button"
                            onClick={addTransactionBlock}
                            className="mt-6 bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center w-full"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Tambah Blok Transaksi Baru
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}