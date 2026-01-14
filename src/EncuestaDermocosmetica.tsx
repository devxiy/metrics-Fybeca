import { useState, useEffect } from 'react';
import { parseCSV } from './utils/csvParser';
import { SurveyRecord } from './types';
import { CityTab } from './components/tabs/CityTab';
import { AnalysisTab } from './components/tabs/AnalysisTab';

// --- CSV DATA LOADING ---
// Ideally this comes from a file fetch. For this standalone file, we'll try to fetch it relative to root.
// If run in a strict env without public folder serving, this might fail unless data is embedded.
// We will assume the CSV is accessible via fetch at the root level as user requested adapting to the CSV.

const EncuestaLaboral = () => {
    const [activeTab, setActiveTab] = useState<'quito' | 'guayaquil' | 'analisis'>('quito');
    const [data, setData] = useState<SurveyRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Try fetching relatively. If this app is served from the folder, this works.
                const response = await fetch('./Encuesta_Fybeca_Quito_Guayaquil_Normalizada.csv');
                if (!response.ok) {
                    throw new Error('Failed to load CSV file. Ensure it is in the public directory.');
                }
                const text = await response.text();
                const parsed = parseCSV(text);
                setData(parsed);
            } catch (err) {
                console.error(err);
                setError("Error cargando los datos. Asegúrate de que el archivo CSV está en la misma carpeta.");

                // Fallback for demo purposes if fetch fails in some preview environments (optional)
                // setData([]); 
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-600">Cargando datos...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6 shadow-sm border border-indigo-50 flex flex-col md:flex-row items-center gap-6">
                    <img src="/metrics-logo.jpg" alt="Logo" className="h-20 w-auto rounded-lg shadow-sm mix-blend-multiply" />
                    <div>
                        <h1 className="text-4xl font-bold text-indigo-900 italic mb-2">Estudio Fybeca</h1>
                        <p className="text-indigo-700">Análisis de percepción y posicionamiento Fybeca</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[600px]">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab('quito')}
                                className={`px-8 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'quito'
                                    ? 'bg-indigo-600 text-white shadow-inner'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Quito
                            </button>
                            <button
                                onClick={() => setActiveTab('guayaquil')}
                                className={`px-8 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'guayaquil'
                                    ? 'bg-indigo-600 text-white shadow-inner'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Guayaquil
                            </button>
                            <button
                                onClick={() => setActiveTab('analisis')}
                                className={`px-8 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'analisis'
                                    ? 'bg-indigo-600 text-white shadow-inner'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Análisis Comparativo
                            </button>
                        </nav>
                    </div>

                    <div className="p-6 bg-gray-50/50">
                        {activeTab === 'quito' && <CityTab city="Quito" data={data} />}
                        {activeTab === 'guayaquil' && <CityTab city="Guayaquil" data={data} />}
                        {activeTab === 'analisis' && <AnalysisTab data={data} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EncuestaLaboral;
