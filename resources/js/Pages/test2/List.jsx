import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutTest2';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faSortUp, faSortDown, faTimesCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';

export default function TransactionList({ transactions, filters, categories }) {
    const { flash = {} } = usePage().props;

    // Inisialisasi state dari props filters
    const [search, setSearch] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'date_paid');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');
    const [currentPage, setCurrentPage] = useState(transactions.current_page || 1);
    const [viewParam, setViewParam] = useState(filters.view || 'list');
    const isInitialMount = useRef(true);

    const applyFilters = debounce((pageNumber = 1) => { 
        const currentFilters = {
            page: pageNumber, 
            search: search,
            start_date: startDate,
            end_date: endDate,
            category: selectedCategory,
            sort_by: sortBy,
            sort_direction: sortDirection,
        };

        if (viewParam) {
            currentFilters.view = viewParam;
        }

        router.get(route('test2.index'), currentFilters, {
            preserveState: true, 
            replace: true, 
        });
    }, 300);

    // useEffect ini akan terpanggil setiap kali filter atau sort berubah
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // Ketika filter/sort berubah, reset ke halaman 1
            applyFilters(1); 
        }
    }, [search, startDate, endDate, selectedCategory, sortBy, sortDirection]);

    // Tambahkan useEffect untuk memperbarui currentPage ketika transactions.current_page berubah
    useEffect(() => {
        setCurrentPage(transactions.current_page || 1);
    }, [transactions.current_page]);


    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
        // applyFilters akan dipanggil oleh useEffect di atas
    };

    const resetFilters = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        setSelectedCategory('');
        setSortBy('date_paid');
        setSortDirection('desc');
        const resetParams = {};
        if (viewParam) { 
            resetParams.view = viewParam;
        }
        // Reset juga currentPage ke 1
        setCurrentPage(1); 
        router.get(route('test2.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const hasActiveFilters = search || startDate || endDate || selectedCategory;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            router.delete(route('test2.destroy', id), {
                onSuccess: () => {
                    // Setelah delete, reload halaman 
                    router.reload({ preserveState: true });
                },
                onError: (errors) => {
                    alert('Gagal menghapus transaksi: ' + Object.values(errors).join('\n'));
                }
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="List Data Transaksi" />

            <div className="bg-white p-6 rounded-lg shadow-md mx-auto max-w-7xl sm:px-6 lg:px-8">
                <h1 className="text-xl font-bold mb-6 text-gray-800">LIST DATA TRANSAKSI</h1>

                {/* Filter & Search Section (Sudah Anda perbaiki) */}
                <div className="mb-6 flex flex-col md:flex-row md:flex-wrap items-end gap-4 md:gap-4 justify-between">
                    {/* Tambah Transaksi Button */}
                    <div className="flex-1 w-full md:w-auto order-1 md:order-none">
                        <Link
                            href={route('test2.create')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center text-sm"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Tambah Transaksi
                        </Link>
                    </div>

                    {/* Filter Inputs (Date, Category, Search) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full md:w-auto flex-1 md:flex-none order-2 md:order-none">
                        {/* Dari Tanggal */}
                        <div className="w-full">
                            <label htmlFor="start_date" className="block text-sm font-normal text-gray-700 mb-1">Dari Tanggal:</label>
                            <input
                                type="date"
                                id="start_date"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        {/* Sampai Tanggal */}
                        <div className="w-full">
                            <label htmlFor="end_date" className="block text-sm font-normal text-gray-700 mb-1">Sampai Tanggal:</label>
                            <input
                                type="date"
                                id="end_date"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        {/* Kategori */}
                        <div className="w-full">
                            <label htmlFor="category" className="block text-sm font-normal text-gray-700 mb-1">Kategori:</label>
                            <select
                                id="category"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Semua</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="flex-1 w-full md:w-80 lg:w-96 order-3 md:order-none">
                        <label htmlFor="search" className="block text-xs font-normal text-gray-700 mb-1">Cari:</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm pr-10"
                                placeholder="Cari deskripsi, kode, atau nama transaksi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="w-full md:w-auto flex items-center justify-center bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4 md:mt-0 order-4 md:order-none"
                        >
                            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" /> Reset Filter
                        </button>
                    )}
                </div>


                {/* Transactions Table */}
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('description')}>
                                    Deskripsi
                                    {sortBy === 'description' && <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="ml-1" />}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('code')}>
                                    Code
                                    {sortBy === 'code' && <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="ml-1" />}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('rate_euro')}>
                                    Rate Euro
                                    {sortBy === 'rate_euro' && <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="ml-1" />}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date_paid')}>
                                    Date Paid
                                    {sortBy === 'date_paid' && <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="ml-1" />}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('category')}>
                                    Kategori
                                    {sortBy === 'category' && <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="ml-1" />}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                                    Nama Transaksi
                                    {sortBy === 'name' && <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="ml-1" />}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('value_idr')}>
                                    Nominal (IDR)
                                    {sortBy === 'value_idr' && <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="ml-1" />}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions && transactions.data && transactions.data.length > 0 ? (
                                transactions.data.map((detail, index) => (
                                    detail.header ? (
                                        <tr key={detail.id}>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                {transactions.from + index}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                {detail.header.description}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                {detail.header.code}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                {detail.header && detail.header.rate_euro !== undefined && detail.header.rate_euro !== null
                                                    ? detail.header.rate_euro.toLocaleString('id-ID')
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                {detail.header && detail.header.formatted_date_paid !== null
                                                    ? detail.header.formatted_date_paid
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                {detail.category ? detail.category.name : 'N/A'}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                {detail.name}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                                                {detail.value_idr ? detail.value_idr.toLocaleString('id-ID') : 'N/A'}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-right">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={route('test2.edit', detail.header.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        title="Edit"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(detail.header.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Hapus"
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={detail.id}>
                                            <td colSpan="10" className="px-3 py-2 text-center text-red-500 text-sm">
                                                Error: Detail transaksi ID {detail.id} tidak memiliki data header.
                                            </td>
                                        </tr>
                                    )
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="px-3 py-2 whitespace-nowrap text-center text-gray-500 text-sm">
                                        Tidak ada data transaksi ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {transactions && transactions.links && transactions.links.length > 3 && (
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
                        <div className="text-gray-600 mb-4 sm:mb-0">
                            Menampilkan {transactions.from} sampai {transactions.to} dari {transactions.total} data
                        </div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px flex-wrap justify-center" aria-label="Pagination">
                            {transactions.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ? buildPaginationLink(link.url, search, startDate, endDate, selectedCategory, sortBy, sortDirection) : '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-normal text-gray-700 hover:bg-gray-50
                                        ${link.active ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : ''}
                                        ${index === 0 ? 'rounded-l-md' : ''}
                                        ${index === transactions.links.length - 1 ? 'rounded-r-md' : ''}
                                        ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                        ${link.label.includes('Previous') || link.label.includes('Next') ? 'hidden sm:inline-flex' : ''}
                                    `}
                                    preserveScroll
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

// Fungsi helper untuk membangun link pagination dengan mempertahankan filter
const buildPaginationLink = (baseUrl, search, startDate, endDate, selectedCategory, sortBy, sortDirection, viewParam) => {
    const url = new URL(baseUrl);
    const params = url.searchParams;
    if (search) params.set('search', search);
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    if (selectedCategory) params.set('category', selectedCategory);
    params.set('sort_by', sortBy); 
    params.set('sort_direction', sortDirection);
    if (viewParam) params.set('view', viewParam);

    url.search = params.toString();
    return url.toString();
};