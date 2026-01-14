export interface SurveyRecord {
    // Demographics
    ciudad: string;

    // Usage & Association (Usabilidad y Asociación)
    compras_dermocosmetica: string;
    compra_en_fybeca: string; // ¿has_comprado_...
    asociacion_fybeca: string; // cuando_piensas_en_fybeca...
    descripcion_fybeca: string; // cuál_de_las_siguientes_palabras...

    // Communication (Comunicación)
    comunicacion_calidad: string; // la_comunicación_de_fybeca_sobre_dermocosmética...
    aborda_problemas_reales: string; // ¿sientes_que_la_comunicación...

    // Preferences (what they want to see - multiple columns in CSV but mapped to easier access if needed)
    // We might aggregate these dynamically

    // Price perception
    percepcion_precios: string; // ¿cómo_percibes_los_precios...

    // Decision Factors (Agreed/Disagreed scales)
    influencia_totalmente_desacuerdo: string;
    influencia_desacuerdo: string;
    influencia_neutro: string;
    influencia_acuerdo: string;
    influencia_totalmente_acuerdo: string;

    // Trust & Confidence
    confianza_experta: string; // confianza como experta
    asesoria_adecuada: string;

    // Improvement areas (Full text)
    mejora_para_elegir: string;
}

export type City = 'Quito' | 'Guayaquil' | 'General';
