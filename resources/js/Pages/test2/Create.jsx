import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutTest2';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function CreateTransaction({ categories }) {
    const { flash, errors } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        description: '',
        code: '',
        rate_euro: '',
        date_paid: new Date().toISOString().slice(0, 10), 
        incomes: [{ name: '', nominal: '' }],
        expenses: [{ name: '', nominal: '' }],
    });

    const handleHeaderChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleDetailChange = (type, index, field, value) => {
        const updatedDetails = data[type].map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setData(type, updatedDetails);
    };

    const addDetailRow = (type) => {
        setData(type, [...data[type], { name: '', nominal: '' }]);
    };

    const removeDetailRow = (type, index) => {
        const updatedDetails = data[type].filter((_, i) => i !== index);
        setData(type, updatedDetails);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('test2.store'), {
            onSuccess: () => {
                reset(); 
            },
            onError: (formErrors) => {
                console.error("Validation Errors:", formErrors);
            },
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

                    {/* Transaction Details (Income) */}
                    <div className="mb-8 p-4 border border-gray-200 rounded-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">DATA TRANSAKSI (Income)</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category: Income</label>
                            {/* Category dropdown is hardcoded for Income */}
                        </div>

                        {data.incomes.map((income, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end">
                                <div>
                                    <label htmlFor={`income-name-${index}`} className="block text-sm font-medium text-gray-700">Nama Transaksi</label>
                                    <input
                                        type="text"
                                        id={`income-name-${index}`}
                                        value={income.name}
                                        onChange={(e) => handleDetailChange('incomes', index, 'name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors[`incomes.${index}.name`] && <p className="text-red-500 text-xs mt-1">{errors[`incomes.${index}.name`]}</p>}
                                </div>
                                <div>
                                    <label htmlFor={`income-nominal-${index}`} className="block text-sm font-medium text-gray-700">Nominal (IDR)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id={`income-nominal-${index}`}
                                        value={income.nominal}
                                        onChange={(e) => handleDetailChange('incomes', index, 'nominal', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors[`incomes.${index}.nominal`] && <p className="text-red-500 text-xs mt-1">{errors[`incomes.${index}.nominal`]}</p>}
                                </div>
                                {data.incomes.length > 1 && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeDetailRow('incomes', index)}
                                            className="text-red-600 hover:text-red-900 px-3 py-2 rounded-md transition duration-150 ease-in-out"
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addDetailRow('incomes')}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Tambah Income
                        </button>
                    </div>

                    {/* Transaction Details (Expense) */}
                    <div className="mb-8 p-4 border border-gray-200 rounded-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">DATA TRANSAKSI (Expense)</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category: Expense</label>
                            {/* Category dropdown is hardcoded for Expense */}
                        </div>

                        {data.expenses.map((expense, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end">
                                <div>
                                    <label htmlFor={`expense-name-${index}`} className="block text-sm font-medium text-gray-700">Nama Transaksi</label>
                                    <input
                                        type="text"
                                        id={`expense-name-${index}`}
                                        value={expense.name}
                                        onChange={(e) => handleDetailChange('expenses', index, 'name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors[`expenses.${index}.name`] && <p className="text-red-500 text-xs mt-1">{errors[`expenses.${index}.name`]}</p>}
                                </div>
                                <div>
                                    <label htmlFor={`expense-nominal-${index}`} className="block text-sm font-medium text-gray-700">Nominal (IDR)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id={`expense-nominal-${index}`}
                                        value={expense.nominal}
                                        onChange={(e) => handleDetailChange('expenses', index, 'nominal', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors[`expenses.${index}.nominal`] && <p className="text-red-500 text-xs mt-1">{errors[`expenses.${index}.nominal`]}</p>}
                                </div>
                                {data.expenses.length > 1 && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeDetailRow('expenses', index)}
                                            className="text-red-600 hover:text-red-900 px-3 py-2 rounded-md transition duration-150 ease-in-out"
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addDetailRow('expenses')}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Tambah Expense
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