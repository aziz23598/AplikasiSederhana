import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout({ children }) {
    const { auth, flash = {}, url: inertiaUrl } = usePage().props;
    const { user } = auth;

    const url = inertiaUrl || window.location.href;

    const [isDataTransaksiOpen, setIsDataTransaksiOpen] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const [displayedSuccess, setDisplayedSuccess] = useState(null);
    const [displayedError, setDisplayedError] = useState(null);

    const sidebarWidth = '256px';

    useEffect(() => {
        if (flash.success) {
            setDisplayedSuccess(flash.success);
            const timer = setTimeout(() => {
                setDisplayedSuccess(null);
            }, 5000); // Pesan hilang setelah 5 detik
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    useEffect(() => {
        if (flash.error) {
            setDisplayedError(flash.error);
            const timer = setTimeout(() => {
                setDisplayedError(null);
            }, 5000); // Pesan hilang setelah 5 detik
            return () => clearTimeout(timer);
        }
    }, [flash.error]);


    const isActive = (routeName, routeParams = {}) => {
        const currentUrl = new URL(url, window.location.origin);
        const currentPath = currentUrl.pathname;
        const currentView = currentUrl.searchParams.get('view'); 

        const targetUrl = new URL(route(routeName, routeParams), window.location.origin);
        const targetPath = targetUrl.pathname;
        const targetView = targetUrl.searchParams.get('view'); 
        if (currentPath !== targetPath) {
            return false;
        }

        if (['test2.index', 'test2.list', 'test2.rekap'].includes(routeName)) {
            if (routeName === 'test2.index' && (routeParams.view === null || routeParams.view === undefined)) {
                const result = currentView === null || currentView === '';
                return result;
            }

            const result = currentView === targetView;
            return result;
        }
        return true; 
    };

    const toggleDataTransaksi = () => {
        setIsDataTransaksiOpen(!isDataTransaksiOpen);
    };

    const isDashboardActive = isActive('dashboard');
    const isDataTransaksiRouteActive =
        isActive('test2.create') ||
        isActive('test2.index') ||
        isActive('test2.list', { view: 'list' }) ||
        isActive('test2.rekap', { view: 'rekap' });

    useEffect(() => {
        if (isDashboardActive) {
            setIsDataTransaksiOpen(false);
        } else if (isDataTransaksiRouteActive) {
            setIsDataTransaksiOpen(true);
        }
        // }
    }, [url, isDashboardActive, isDataTransaksiRouteActive]); 

    return (
        <div className="min-h-screen bg-gray-100 flex ">
            {/* Sidebar */}
            <div className={`
                    w-64 bg-gray-800 text-white p-4
                    fixed top-0 left-0 h-screen z-40  // Tambahkan fixed, top, left, h-screen, z-index
                    transition-transform duration-300 ease-in-out
                    ${showingNavigationDropdown ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} // Untuk mobile
                    overflow-y-auto // Agar sidebar bisa discroll jika isinya banyak
                `}>
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
                        className={`flex items-center justify-between w-full py-2 px-4 rounded hover:bg-gray-700 focus:outline-none ${isDataTransaksiRouteActive ? 'bg-gray-700' : ''}`}
                    >
                        <span>Data Transaksi</span>
                            <FontAwesomeIcon icon={isDataTransaksiOpen ? faChevronUp : faChevronDown} className="ml-auto" />
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
            <div className="flex-1 p-3" style={{ marginLeft: sidebarWidth }}>
                {/* Flash Messages */}
                {displayedSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{displayedSuccess}</span>
                    </div>
                )}
                {displayedError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{displayedError}</span>
                    </div>
                )}
                {/* Validation Errors - Inertia handles this automatically via props.errors */}

                {children}
            </div>
        </div>
    );
}
