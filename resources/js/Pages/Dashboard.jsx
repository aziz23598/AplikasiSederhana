import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 mt-4 flex items-center justify-center">
                            <PrimaryButton className="ms-4">
                                <Link
                                    href={route('test1')}
                                    className="rounded-md text-sm text-white-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    Test 1
                                </Link>
                            </PrimaryButton>
                            <PrimaryButton className="ms-4">
                                <Link
                                    href={route('test2.index')}
                                    className="rounded-md text-sm text-white-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    Test 2
                                </Link>
                            </PrimaryButton>
                            <PrimaryButton className="ms-4">
                                <Link
                                    href={route('test3')}
                                    className="rounded-md text-sm text-white-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    Test 3
                                </Link>
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
