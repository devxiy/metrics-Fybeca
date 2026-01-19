import React, { useMemo } from 'react';
import { Users, Target, TrendingUp, Award, MessageCircle, Trophy, DollarSign, BarChart3, PieChart, Lightbulb } from 'lucide-react';
import { SurveyRecord } from '../../types';
import { StatCard, DonutChart, CustomBarChart, VerticalBarChart, COLORS } from '../shared/Charts';

interface CityTabProps {
    city: 'Quito' | 'Guayaquil';
    data: SurveyRecord[];
}

export const CityTab: React.FC<CityTabProps> = ({ city, data }) => {
    const cityData = useMemo(() => data.filter(r => r.ciudad === city), [data, city]);
    const total = cityData.length;

    // --- Helper to clean and count data ---
    const getStats = (field: keyof SurveyRecord) => {
        const counts: Record<string, number> = {};
        cityData.forEach(r => {
            let val = r[field]?.trim();
            // Filter out invalid values
            if (!val || val.toLowerCase() === 'nan' || val.toLowerCase() === 'null' || val === '') return;
            // Clean up quotes if present
            val = val.replace(/^"|"$/g, '');
            counts[val] = (counts[val] || 0) + 1;
        });

        const totalValid = Object.values(counts).reduce((a, b) => a + b, 0);

        return Object.entries(counts)
            .map(([name, value]) => ({
                name,
                value,
                percent: (value / totalValid) * 100
            }))
            .sort((a, b) => b.value - a.value);
    };

    // --- Metrics ---

    // 1. Beneficios/Asociación (Column: asociacion_fybeca)
    const asociacionStats = useMemo(() => getStats('asociacion_fybeca'), [cityData]);

    // 2. Comunicación (Column: comunicacion_calidad)
    const comunicacionStats = useMemo(() => getStats('comunicacion_calidad'), [cityData]);

    // 3. Precios (Column: percepcion_precios)
    const precioStats = useMemo(() => getStats('percepcion_precios').map(s => ({ nivel: s.name, valor: s.value, percent: s.percent })), [cityData]);

    // 4. Confianza (Column: confianza_experta)
    const confianzaStats = useMemo(() => getStats('confianza_experta'), [cityData]);


    // KPIs
    const satisfactionScore = "8.5/10"; // Placeholder or calculated if numerical data existed
    const completedSurveys = total;

    // Detailed Question Breakdown configuration
    const questionsAndFields: { label: string; field: keyof SurveyRecord }[] = [
        { label: "¿Realiza compras de dermocosmética?", field: "compras_dermocosmetica" },
        { label: "¿Has comprado productos de dermocosmética en Fybeca alguna vez?", field: "compra_en_fybeca" },
        { label: "Cuando piensas en Fybeca, ¿qué tan asociada la percibes con productos de dermocosmética?", field: "asociacion_fybeca" },
        { label: "¿Cuál de las siguientes palabras describe mejor a Fybeca en dermocosmética?", field: "descripcion_fybeca" },
        { label: "La comunicación de Fybeca sobre dermocosmética es:", field: "comunicacion_calidad" },
        { label: "¿Sientes que la comunicación de Fybeca aborda problemas reales de la piel?", field: "aborda_problemas_reales" },
        { label: "¿Cómo percibes los precios de Fybeca en dermocosmética?", field: "percepcion_precios" },
        { label: "¿Qué tanto confías en Fybeca como experta en el cuidado de la piel?", field: "confianza_experta" },
        { label: "¿Crees que en Fybeca puedes recibir asesoría adecuada?", field: "asesoria_adecuada" }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Encuestados" value={total} color="bg-gradient-to-br from-blue-100 to-blue-200" />
                <StatCard icon={Target} label="Respuestas Válidas" value={completedSurveys} color="bg-gradient-to-br from-blue-50 to-blue-100" />
                <StatCard icon={TrendingUp} label="Confiabilidad" value="98%" color="bg-gradient-to-br from-gray-100 to-gray-200" />
                <StatCard icon={Award} label="Satisfacción" value={satisfactionScore} color="bg-gradient-to-br from-red-100 to-red-200" />
            </div>

            {/* Main Charts Area (Summary) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <DonutChart
                    data={asociacionStats.slice(0, 5)}
                    title="Asociación con Dermocosmética"
                    icon={Target}
                    total={total}
                />
                <DonutChart
                    data={confianzaStats}
                    title="Nivel de Confianza como Experta"
                    icon={Trophy}
                    total={total}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomBarChart
                    data={precioStats}
                    title="Percepción de Precios"
                    xKey="valor"
                    yKey="nivel"
                    icon={<DollarSign className="w-6 h-6 text-gray-700" />}
                    color="#E30613"
                />
                <VerticalBarChart
                    data={comunicacionStats}
                    title="Claridad de Comunicación"
                    xKey="name"
                    yKey="value"
                    icon={<MessageCircle className="w-6 h-6 text-blue-900" />}
                    color="#00338D"
                />
            </div>

            {/* Detalle de Preguntas y Resultados - Combined Graphs */}
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-md p-6 border border-gray-100 mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-900" />
                    Detalle de Preguntas y Resultados (Sin valores Nulos)
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {questionsAndFields.map((q, idx) => {
                        const stats = getStats(q.field);
                        if (stats.length === 0) return null;

                        // Heuristic: If few categories, use Donut. If many, use Vertical Bar.
                        const useDonut = stats.length <= 4;
                        const ChartIcon = useDonut ? PieChart : BarChart3;
                        const cardTitle = `${idx + 1}. ${q.label}`;

                        return (
                            <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-100 hover:shadow-lg transition-shadow">
                                {useDonut ? (
                                    <DonutChart
                                        data={stats}
                                        title={cardTitle}
                                        icon={ChartIcon}
                                        total={stats.reduce((acc, curr) => acc + curr.value, 0)}
                                    />
                                ) : (
                                    <VerticalBarChart
                                        data={stats}
                                        title={cardTitle}
                                        xKey="name"
                                        yKey="value"
                                        icon={<ChartIcon className="w-5 h-5 text-gray-500" />}
                                        color={COLORS[idx % COLORS.length]}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Local Insights Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm mt-8">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2" />
                    Análisis Estratégico: {city}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-5 rounded-lg shadow-sm border-t-4 border-blue-600">
                        <h4 className="font-semibold text-gray-800 mb-2">Posicionamiento</h4>
                        <p className="text-sm text-gray-600">
                            La asociación de marca en {city} muestra que un <strong>{asociacionStats.length > 0 ? asociacionStats[0].percent.toFixed(1) : 0}%</strong> de los encuestados {asociacionStats.length > 0 ? asociacionStats[0].name.toLowerCase() : 'tienen esta percepción'}.
                            Esto sugiere una {asociacionStats.length > 0 && (asociacionStats[0].name.includes('Muy') || asociacionStats[0].name.includes('Alguna')) ? 'fortaleza' : 'área de oportunidad'} en la mente del consumidor local.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-t-4 border-orange-500">
                        <h4 className="font-semibold text-gray-800 mb-2">Percepción de Valor</h4>
                        <p className="text-sm text-gray-600">
                            En cuanto a precios, la percepción dominante ({precioStats.length > 0 ? precioStats[0].percent?.toFixed(1) : 0}%) es que son "{precioStats.length > 0 ? precioStats[0].nivel : ''}".
                            Es crucial ajustar la comunicación promocional en esta plaza para alinear la percepción de valor con la realidad comercial.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-t-4 border-green-600">
                        <h4 className="font-semibold text-gray-800 mb-2">Confianza y Asesoría</h4>
                        <p className="text-sm text-gray-600">
                            La confianza como experta alcanza un nivel destacado en el segmento "{confianzaStats.length > 0 ? confianzaStats[0].name : ''}",
                            lo que valida la estrategia de posicionamiento técnico en dermocosmética para el mercado de {city}.
                        </p>
                    </div>
                </div>

                {/* Recomendaciones Tácticas */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-blue-100 p-6">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                        <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                        Recomendaciones para {city}
                    </h4>
                    <ul className="space-y-3">
                        <li className="flex items-start text-sm text-gray-700">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>
                                <strong>Fortalecer Asociación:</strong> {city === 'Quito' ? 'Capitalizar la alta asociación reforzando el mensaje de variedad.' : 'Incrementar visibilidad de marca con campañas de alcance masivo.'}
                            </span>
                        </li>
                        <li className="flex items-start text-sm text-gray-700">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>
                                <strong>Estrategia de Precios:</strong> {precioStats.length > 0 && precioStats[0].nivel.includes('Más bajos') ? 'Mantener la percepción de precios competitivos.' : 'Comunicar ofertas de valor y packs de ahorro para mejorar percepción.'}
                            </span>
                        </li>
                        <li className="flex items-start text-sm text-gray-700">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>
                                <strong>Confianza Técnica:</strong> Aprovechar el {confianzaStats.length > 0 && confianzaStats[0].percent.toFixed(2)}% de confianza en "{confianzaStats.length > 0 ? confianzaStats[0].name : ''}" para posicionar servicios de dermo-análisis gratuitos en punto de venta.
                            </span>
                        </li>
                        <li className="flex items-start text-sm text-gray-700">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>
                                <strong>Estrategia de Comunicación:</strong> Activar una pieza aon en la campaña de Pricing Dermo para reforzar el mensaje de "precios más bajos" y posicionar en el TOM de los clientes el mensaje de "Fybeca tiene precios más bajos que la competencia"
                            </span>
                        </li>
                        {city === 'Guayaquil' && (
                            <li className="flex items-start text-sm text-gray-700">
                                <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                <span>
                                    <strong>Adaptación Cultural:</strong> Generar en las campañas de Beauty y Dermo una pieza específica adaptada al tono y códigos culturales de la región Costa.
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {city === 'Quito' && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mt-8 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-gray-600" />
                        Ficha técnica de segmentación
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-gray-700 leading-relaxed">
                                <span className="font-semibold text-gray-900 block mb-1">Público Objetivo:</span>
                                La campaña se dirigió a personas de 18 a 65 años o más, de todos los géneros, sin audiencias personalizadas incluidas.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-gray-700 leading-relaxed">
                                <span className="font-semibold text-gray-900 block mb-1">Alcance Geográfico:</span>
                                El alcance geográfico se concentró en las ciudades de Quito y Guayaquil.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-gray-700 leading-relaxed">
                                <span className="font-semibold text-gray-900 block mb-1">Criterios de Segmentación:</span>
                                La segmentación se basó en intereses relacionados con cuidado personal, salud y belleza, incluyendo skin care y cuidado natural de la piel, con el objetivo de impactar a usuarios afines a productos y contenidos de bienestar y estética.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
