import AuthenticatedLayoutTest1 from '@/Layouts/AuthenticatedLayoutTest1';
import { Head } from '@inertiajs/react';

export default function Test1() {
    return (
        <AuthenticatedLayoutTest1
            header={
                <section class="hero-image flex items-center justify-center text-white">
                <div class="w-full md:full flex-shrink-0 h-48 bg-gray-200 flex items-center justify-center text-gray-600 mb-4 md:mb-0 rounded-md">
                    Gambar
                </div>
            </section>
            }
        >
        
            <Head title="Dashboard" />
            <section class="hero-image flex items-center justify-center text-white">
            </section>

            <section class="container mx-auto px-4 py-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white p-6 border border-gray-200 rounded-lg text-center shadow-sm">
                        <h1 class="text-lg font-semibold text-gray-800 mb-2">Google AdWords</h1>
                    </div>
                    <div class="bg-white p-6 border border-gray-200 rounded-lg text-center shadow-sm">
                        <h1 class="text-lg font-semibold text-gray-800 mb-2">Facebook Ads</h1>
                    </div>
                    <div class="bg-white p-6 border border-gray-200 rounded-lg text-center shadow-sm">
                        <h1 class="text-lg font-semibold text-gray-800 mb-2">SEO</h1>
                    </div>
                    <div class="bg-white p-6 border border-gray-200 rounded-lg text-center shadow-sm">
                        <h1 class="text-lg font-semibold text-gray-800 mb-2">Training</h1>
                    </div>
                </div>
            </section>

            <section class="container mx-auto px-4 py-8">
                <div class="bg-white flex flex-col md:flex-row items-start md:space-x-8 mb-10 p-6 border border-gray-200 rounded-lg shadow-sm">
                    <div class="w-full md:w-1/3 flex-shrink-0 h-48 bg-gray-200 flex items-center justify-center text-gray-600 mb-4 md:mb-0 rounded-md">
                        Gambar
                    </div>
                    <div class="bg-white w-full md:w-2/3">
                        <h3 class="text-xl font-semibold text-gray-800 mb-3">Google AdWords</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <a href="#" class="block text-right text-blue-600 hover:text-blue-800 font-semibold">Read More</a>
                    </div>
                </div>

                <div class="bg-white flex flex-col md:flex-row-reverse items-start md:space-x-reverse md:space-x-8 mb-10 p-6 border border-gray-200 rounded-lg shadow-sm">
                    <div class="w-full md:w-1/3 flex-shrink-0 h-48 bg-gray-200 flex items-center justify-center text-gray-600 mb-4 md:mb-0 rounded-md">
                        Gambar
                    </div>
                    <div class="bg-white w-full md:w-2/3">
                        <h3 class="text-xl font-semibold text-gray-800 mb-3">Google AdWords</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <a href="#" class="block text-right text-blue-600 hover:text-blue-800 font-semibold">Read More</a>
                    </div>
                </div>

                <div class="bg-white flex flex-col md:flex-row items-start md:space-x-8 p-6 border border-gray-200 rounded-lg shadow-sm">
                    <div class="w-full md:w-1/3 flex-shrink-0 h-48 bg-gray-200 flex items-center justify-center text-gray-600 mb-4 md:mb-0 rounded-md">
                        Gambar
                    </div>
                    <div class="bg-white w-full md:w-2/3">
                        <h3 class="text-xl font-semibold text-gray-800 mb-3">Google AdWords</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <a href="#" class="block text-right text-blue-600 hover:text-blue-800 font-semibold">Read More</a>
                    </div>
                </div>
            </section>
        </AuthenticatedLayoutTest1>
    );
}
