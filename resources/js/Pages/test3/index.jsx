import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function fibonacci({ result }) {
    const { data, setData, post, processing, errors } = useForm({
        n1: '',
        n2: '',
      });
    
      const handleSubmit = (e) => {
        e.preventDefault();
        post(route('test3.calculate'));
      };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Test 3" />

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} >
                                <div className="mt-3">
                                    <InputLabel htmlFor="n1" value="Bilangan ke-n1" />
                                    <TextInput
                                        type="number"
                                        id="n1"
                                        name="n1"
                                        value={data.name}
                                        className="mt-1 block"
                                        autoComplete="n1"
                                        isFocused={true}
                                        onChange={(e) => setData('n1', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.n1} className="mt-2" />
                                </div>

                                <div className="mt-3">
                                <InputLabel htmlFor="n2" value="Bilangan ke-n2" />
                                    <TextInput
                                        type="number"
                                        id="n2"
                                        name="n2"
                                        value={data.name}
                                        className="mt-1 block"
                                        autoComplete="n2"
                                        isFocused={true}
                                        onChange={(e) => setData('n2', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.n2} className="mt-2" />
                                </div>

                                <div className="mt-3">
                                    <PrimaryButton type="submit" className="btn btn-primary" disabled={processing}>
                                        Hitung
                                    </PrimaryButton>
                                </div>
                                
                            </form>

                            {result && (
                            <div className="alert alert-success mt-4">
                                <p>Fb({result.n1}) = {result.fib1}</p>
                                <p>Fb({result.n2}) = {result.fib2}</p>
                                <hr />
                                <h5>Hasil Penjumlahan: {result.sum}</h5>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
