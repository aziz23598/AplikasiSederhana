import AuthenticatedLayoutTest1 from '@/Layouts/AuthenticatedLayoutTest1';
import { Head } from '@inertiajs/react';
import heroBannerImage from '@/Image/Banner.png';
import contentImage1 from '@/Image/google.png';
import contentImage2 from '@/Image/facebook.png';
import contentImage3 from '@/Image/seo.png';

export default function Test1() {
    return (
        <AuthenticatedLayoutTest1
            header={
                <section className="w-full hero-image flex items-center justify-center text-white">
                <div className="w-full md:full flex-shrink-0 h-full bg-gray-200 flex items-center justify-center text-gray-600 mb-4 md:mb-0 rounded-md">
                <img
                    src={heroBannerImage}
                    alt="Hero Banner"
                    className="w-full h-full object-cover rounded-md" 
                />
                </div>
            </section>
            }
        >
        
            <Head title="Dashboard" />
            <section className="w-full hero-image flex items-center justify-center text-white">
            </section>

            <section className="w-full px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full md:full">
                    <div className="bg-white p-6 border border-gray-200 rounded-lg text-center shadow-sm">
                        <h1 className="text-lg font-semibold text-gray-800 mb-2">Google AdWords</h1>
                    </div>
                    <div className="bg-white p-6 border border-gray-200 rounded-lg text-center shadow-sm">
                        <h1 className="text-lg font-semibold text-gray-800 mb-2">Facebook Ads</h1>
                    </div>
                    <div className="bg-white p-6 border border-gray-200 rounded-lg text-center shadow-sm">
                        <h1 className="text-lg font-semibold text-gray-800 mb-2">SEO</h1>
                    </div>
                    <div className="bg-white p-6 border border-gray-200 rounded-lg text-center shadow-sm">
                        <h1 className="text-lg font-semibold text-gray-800 mb-2">Training</h1>
                    </div>
                </div>
            </section>

            <section className="w-full px-4 py-8">
                <div className="bg-white flex flex-col md:flex-row items-start md:space-x-8 mb-10 p-6 border border-gray-200 rounded-lg shadow-sm">
                    <div className="max-w-[448px] md:w-1/3 flex-shrink-0 h-48 bg-gray-200 flex items-center justify-center text-gray-600 mb-4 md:mb-0 rounded-md">
                        <img
                            src={contentImage1}
                            alt="Hero Banner"
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="bg-white w-full md:w-2/3">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Google AdWords</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">Google adwords adalah sebuah fitur yang berguna untuk bisa mengiklankan bisnis kamu di dalam halaman search engine pencarian Google dengan menggunakan suatu kata kunci tertentu yang sesuai dan relatif dengan bidang bisnis yang sedang kamu jalani, fitur ini tentunya diklaim bisa menjawab berbagai keresahan yang dirasakan para pebisnis mulai dari penjualan yang masih belum banyak hingga bisnis yang belum diketahui oleh banyak orang.</p>
                        <a href="#" className="block text-right text-blue-600 hover:text-blue-800 font-semibold">Read More</a>
                    </div>
                </div>

                <div className="bg-white flex flex-col md:flex-row-reverse items-start md:space-x-reverse md:space-x-8 mb-10 p-6 border border-gray-200 rounded-lg shadow-sm">
                    <div className="max-w-[448px] md:w-1/3 flex-shrink-0 h-48 bg-gray-200 flex items-center justify-center text-gray-600 mb-4 md:mb-0 rounded-md">
                        <img
                            src={contentImage2}
                            alt="Hero Banner"
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="bg-white w-full md:w-2/3">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Facebook Ads</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">Facebook Ads adalah layanan periklanan berbayar yang disediakan oleh Facebook (sekarang dikenal sebagai Meta) untuk mempromosikan produk, layanan, atau konten kepada pengguna Facebook dan Instagram. Iklan ini dapat muncul di berbagai lokasi di dalam platform, seperti feed berita, stories, marketplace, dan lainnya. Facebook Ads memungkinkan pengiklan untuk menargetkan audiens yang spesifik berdasarkan berbagai kriteria, termasuk lokasi, usia, minat, perilaku, dan banyak lagi. </p>
                        <a href="#" className="block text-right text-blue-600 hover:text-blue-800 font-semibold">Read More</a>
                    </div>
                </div>

                <div className="bg-white flex flex-col md:flex-row items-start md:space-x-8 p-6 border border-gray-200 rounded-lg shadow-sm">
                    <div className="max-w-[448px] md:w-1/3 flex-shrink-0 h-48 bg-gray-200 flex items-center justify-center text-gray-600 mb-4 md:mb-0 rounded-md">
                        <img
                            src={contentImage3}
                            alt="Hero Banner"
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="bg-white w-full md:w-2/3">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">SEO</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">SEO, singkatan dari Search Engine Optimization, adalah serangkaian praktik dan teknik yang bertujuan untuk meningkatkan visibilitas dan peringkat situs web di hasil pencarian mesin telusur (seperti Google). Dengan kata lain, SEO adalah upaya untuk membuat situs web lebih mudah ditemukan oleh pengguna internet ketika mereka melakukan pencarian online. </p>
                        <a href="#" className="block text-right text-blue-600 hover:text-blue-800 font-semibold">Read More</a>
                    </div>
                </div>
            </section>
        </AuthenticatedLayoutTest1>
    );
}
