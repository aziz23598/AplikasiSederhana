import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function AuthenticatedLayout({ children }) {
    const { auth, flash = {}, url } = usePage().props;
    const { user } = auth;

    const [isDataTransaksiOpen, setIsDataTransaksiOpen] = useState(false);

    const isActive = (routeName, routeParams = {}) => {
        const currentUrl = new URL(url, window.location.origin);
        const targetUrl = new URL(route(routeName, routeParams), window.location.origin);

        // Bandingkan pathname dan parameter yang relevan
        if (currentUrl.pathname !== targetUrl.pathname) {
            return false;
        }

        // Khusus untuk test2.index yang bisa punya view berbeda
        if (routeName === 'test2.index') {
            const currentView = currentUrl.searchParams.get('view');
            const targetView = targetUrl.searchParams.get('view');
            return currentView === targetView;
        }

        return true; // Untuk route non-index/rekap
    };

    const toggleDataTransaksi = () => {
        setIsDataTransaksiOpen(!isDataTransaksiOpen);
    };

    const isAnyDataTransaksiActive =
        isActive('test2.create') ||
        isActive('test2.index', { view: null }) || 
        isActive('test2.list', { view: 'list' }) ||
        isActive('test2.rekap', { view: 'rekap' });


    // Efek untuk membuka dropdown 
    React.useEffect(() => {
        if (isAnyDataTransaksiActive && !isDataTransaksiOpen) {
            setIsDataTransaksiOpen(true);
        }
    }, [isAnyDataTransaksiActive, isDataTransaksiOpen]);

    return (
        <div className="min-h-screen bg-gray-100 flex ">
            {/* Sidebar */}
            <div className="w-55 bg-gray-800 text-white p-4 ">
            <nav className="mt-6 ">
                <Link
                    href={route('dashboard')}
                    className={`block py-3 px-4 rounded hover:bg-gray-700 ${isActive('dashboard') ? 'bg-gray-700' : ''}`}
                >
                    Dashboard
                </Link>
                <div>
                    <button
                        onClick={toggleDataTransaksi}
                        className={`flex items-center justify-between w-full py-2 px-4 rounded hover:bg-gray-700 focus:outline-none ${isAnyDataTransaksiActive ? 'bg-gray-700' : ''}`}
                    >
                        <Link
                            href={route('test2.index')}
                            className={`text-left block py-2 px-4 rounded hover:bg-gray-700 ${isActive('test2.index') ? 'bg-gray-700' : ''}`}
                        >
                            Data Transaksi
                        </Link>
                        <FontAwesomeIcon icon={isDataTransaksiOpen ? faChevronUp : faChevronDown} />
                    </button>
                    {isDataTransaksiOpen && (
                            <div className="ml-4 border-l border-gray-600 pl-2 py-1"> {/* Indentasi untuk submenu */}
                                <Link
                                    href={route('test2.create')}
                                    className={`text-right block py-2 px-4 rounded hover:bg-gray-700 ${isActive('test2.create') ? 'bg-gray-700' : ''}`}
                                >
                                    Tambah Data Transaksi
                                </Link>

                                <Link
                                    href={route('test2.list', { view: 'list' })}
                                    className={`text-right block py-2 px-4 rounded hover:bg-gray-700 ${isActive('test2.index', { view: 'list' }) ? 'bg-gray-700' : ''}`}
                                >
                                    List Data Transaksi
                                </Link>

                                <Link
                                    href={route('test2.rekap', { view: 'rekap' })}
                                    className={`text-right block py-2 px-4 rounded hover:bg-gray-700 ${isActive('test2.index', { view: 'rekap' }) ? 'bg-gray-700' : ''}`}
                                >
                                    Rekap Transaksi
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-3">
                {/* Flash Messages */}
                {flash && flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{flash.success}</span>
                    </div>
                )}
                {flash && flash.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{flash.error}</span>
                    </div>
                )}
                {/* Validation Errors - Inertia handles this automatically via props.errors */}

                {children}
            </div>
        </div>
    );
}
