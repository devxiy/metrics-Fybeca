import React, { useMemo } from 'react';
import { SurveyRecord } from '../../types';
import { GroupedBarChart } from '../shared/Charts';
import { BarChart3, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

interface AnalysisTabProps {
    data: SurveyRecord[];
}

export const AnalysisTab: React.FC<AnalysisTabProps> = ({ data }) => {
    const quitoData = useMemo(() => data.filter(d => d.ciudad === 'Quito'), [data]);
    const gyeData = useMemo(() => data.filter(d => d.ciudad === 'Guayaquil'), [data]);

    // Same configuration as CityTab for consistency
    const questionsAndFields: { label: string; question: string; field: keyof SurveyRecord }[] = [
        { label: "Asociación con la marca", question: "Cuando piensas en Fybeca, ¿qué tan asociada la percibes con productos de dermocosmética?", field: "asociacion_fybeca" },
        { label: "Percepción de Precios", question: "¿Cómo percibes los precios de Fybeca en dermocosmética?", field: "percepcion_precios" },
        { label: "Confianza como Experta", question: "¿Qué tanto confías en Fybeca como experta en el cuidado de la piel?", field: "confianza_experta" },
        { label: "Calidad de Comunicación", question: "La comunicación de Fybeca sobre dermocosmética es:", field: "comunicacion_calidad" },
        { label: "Descripción de la Marca", question: "¿Cuál de las siguientes palabras describe mejor a Fybeca en dermocosmética?", field: "descripcion_fybeca" },
        { label: "¿Aborda problemas reales?", question: "¿Sientes que la comunicación de Fybeca aborda problemas reales de la piel?", field: "aborda_problemas_reales" },
        { label: "¿Asesoría Adecuada?", question: "¿Crees que en Fybeca puedes recibir asesoría adecuada?", field: "asesoria_adecuada" }
    ];

    // Helper to get raw counts and then normalize
    const getNormalizedStats = (dataSet: SurveyRecord[], field: keyof SurveyRecord) => {
        const counts: Record<string, number> = {};
        dataSet.forEach(r => {
            let val = r[field]?.trim();
            if (!val || val.toLowerCase() === 'nan' || val.toLowerCase() === 'null' || val === '') return;
            val = val.replace(/^"|"$/g, '');
            counts[val] = (counts[val] || 0) + 1;
        });
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        return Object.entries(counts).map(([name, value]) => ({
            name,
            value,
            percent: total > 0 ? (value / total) * 100 : 0
        }));
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Análisis Comparativo Detallado</h2>
                <p className="text-blue-100">Comparativa directa Quito vs Guayaquil por pregunta clave</p>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {questionsAndFields.map((q, idx) => {
                    // Calculate stats for both cities
                    const qStats = getNormalizedStats(quitoData, q.field);
                    const gStats = getNormalizedStats(gyeData, q.field);

                    // Merge stats into a single array for the chart
                    // Get all unique answer keys
                    const allKeys = Array.from(new Set([...qStats.map(s => s.name), ...gStats.map(s => s.name)]));

                    const chartData = allKeys.map(key => {
                        const qVal = qStats.find(s => s.name === key)?.percent || 0;
                        const gVal = gStats.find(s => s.name === key)?.percent || 0;
                        return {
                            name: key,
                            Quito: qVal,
                            Guayaquil: gVal,
                            diff: Math.abs(qVal - gVal)
                        };
                    }).sort((a, b) => (b.Quito + b.Guayaquil) - (a.Quito + a.Guayaquil)); // Sort by total relevance

                    // Generate Insight
                    // Find largest difference
                    const maxDiffItem = chartData.reduce((prev, current) => (prev.diff > current.diff) ? prev : current, chartData[0]);

                    if (!maxDiffItem) return null;

                    const higherCity = maxDiffItem.Quito > maxDiffItem.Guayaquil ? 'Quito' : 'Guayaquil';
                    const diffVal = maxDiffItem.diff.toFixed(1);

                    return (
                        <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                            <div className="bg-gray-50 p-4 border-b border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <BarChart3 className="w-5 h-5 text-blue-800" />
                                    <h3 className="text-lg font-bold text-gray-800">{q.label}</h3>
                                </div>
                                <p className="text-sm text-gray-500 italic ml-7">"{q.question}"</p>
                            </div>

                            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 h-80">
                                    <GroupedBarChart
                                        data={chartData}
                                        title=""
                                        xKey="name"
                                        series1Key="Quito"
                                        series2Key="Guayaquil"
                                        icon={<span />}
                                    />
                                </div>

                                <div className="flex flex-col justify-center space-y-4">
                                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                                        <div className="flex items-start gap-3">
                                            <TrendingUp className="w-6 h-6 text-blue-700 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-blue-900 text-sm uppercase mb-1">Diferencia Clave</h4>
                                                <p className="text-gray-700 text-sm">
                                                    En la opción <strong>"{maxDiffItem.name}"</strong>, <span className="font-semibold text-blue-800">{higherCity}</span> supera a la otra ciudad por <span className="font-bold">{diffVal} puntos porcentuales</span>.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-6 h-6 text-orange-600 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-orange-900 text-sm uppercase mb-1">Análisis de Mercado</h4>
                                                <p className="text-gray-700 text-sm">
                                                    {(() => {
                                                        const item = maxDiffItem.name;
                                                        const city = higherCity;

                                                        switch (q.field) {
                                                            case 'asociacion_fybeca':
                                                                return `La brecha en "${item}" indica que ${city} ha logrado consolidar mejor la imagen de Fybeca como destino dermocosmético. Esto podría deberse a una mayor madurez del mercado local o a campañas pasadas que resonaron mejor en esta región.`;
                                                            case 'percepcion_precios':
                                                                if (item.toLowerCase().includes('altos')) return `Es una alerta que en ${city} se perciba precios más altos. Esto puede generar una barrera de entrada que podría estar desviando tráfico a competidores con mejor percepción de "value-for-money".`;
                                                                if (item.toLowerCase().includes('bajos')) return `Que ${city} destaque en esta percepción es positivo, sugiriendo que la estrategia de precios o promociones está siendo interpretada correctamente como competitiva en esta plaza.`;
                                                                return `La diferencia en la percepción de "${item}" sugiere que el posicionamiento de precio no es uniforme y requiere ajustes tácticos en la comunicación de ${city}.`;
                                                            case 'confianza_experta':
                                                                return `El liderazgo de ${city} en el nivel "${item}" valida la calidad del servicio en punto de venta. La confianza es el driver #1 en dermocosmética, por lo que esta plaza debe ser el modelo a seguir para la otra ciudad.`;
                                                            case 'comunicacion_calidad':
                                                                return `La comunicación en ${city} está siendo más efectiva para transmitir el mensaje (respuesta "${item}"). Es necesario auditar los canales y mensajes utilizados en la ciudad con menor desempeño para cerrar esta brecha.`;
                                                            case 'descripcion_fybeca':
                                                                return `Que los usuarios de ${city} asocien más a la marca con "${item}" revela el posicionamiento real en su "Top of Mind". Esta percepción debe ser alineada con los valores corporativos deseados.`;
                                                            case 'aborda_problemas_reales':
                                                                return `La percepción de que Fybeca "${item}" en ${city} indica una conexión emocional más fuerte. Muestra que la oferta de productos está resolviendo necesidades ("pains") reales del cliente local.`;
                                                            case 'asesoria_adecuada':
                                                                return `El diferencial en "${item}" apunta directamente a la capacitación del personal. ${city} tiene equipos de farmacia que están logrando cerrar mejor la venta consultiva.`;
                                                            default:
                                                                return `Esta diferencia significativa en "${item}" resalta un comportamiento de consumo distinto en ${city}, lo que justifica una segmentación regional en la estrategia de marketing y mix de productos.`;
                                                        }
                                                    })()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recomendación Actionable */}
                                    <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                                        <div className="flex items-start gap-3">
                                            <Lightbulb className="w-6 h-6 text-green-600 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-green-900 text-sm uppercase mb-1">Recomendación</h4>
                                                <p className="text-gray-700 text-sm">
                                                    {q.field === 'percepcion_precios' && `Implementar una campaña de "Precios Justos" focalizada en Quito para equilibrar la percepción de valor. Activar una pieza aon en la campaña de Pricing Dermo para reforzar el mensaje de "precios más bajos" y posicionar en el TOM de los clientes el mensaje de "Fybeca tiene precios más bajos que la competencia"`}
                                                    {q.field === 'asociacion_fybeca' && `Reforzar la presencia de marca en ${higherCity === 'Quito' ? 'Guayaquil' : 'Quito'} mediante activaciones BTL que vinculen a Fybeca con experto en piel.`}
                                                    {q.field === 'confianza_experta' && `Capacitar al personal en ${higherCity === 'Quito' ? 'Guayaquil' : 'Quito'} para mejorar la asesoría y elevar el nivel de confianza técnica.`}
                                                    {q.field === 'asesoria_adecuada' && ` Investigar a profundidad las barreras en Guayaquil y adaptar el mensaje publicitario para mejorar la compresión de las campañas con la cultura local.`}
                                                    {q.field === 'descripcion_fybeca' && `Reforzar en Guayaquil el atributo de confianza con mensajes claros y consistentes.`}
                                                    {q.field === 'aborda_problemas_reales' && `Reforzar mensajes que conecten con problemas reales de la piel, especialmente en Guayaquil.`}
                                                    {q.field === 'comunicacion_calidad' && `Ajustar el tono y la estructura del mensaje para mejorar la comprensión en Guayaquil.`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
