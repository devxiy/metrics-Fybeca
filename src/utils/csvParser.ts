import { SurveyRecord } from '../types';

export const parseCSV = (csvText: string): SurveyRecord[] => {
    const lines = csvText.split('\n');
    // const headers = lines[0].split(','); // Naive split, but sufficient if headers don't have commas

    // Helper to safely split CSV line handling quotes
    const splitLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    };

    const data: SurveyRecord[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check if the line has enough columns (basic validation)
        // The splitting might need to handle quoted values if they contain commas
        // The file provided seems to have quotes around text
        const currentRow = splitLine(line);

        // Filter out empty rows or trailing newlines
        if (currentRow.length < 5) continue;

        // Mapping by index based on file viewing (approximate)
        // 0: compras...
        // 1: has_comprado...
        // 2: asociacion...
        // 3: descripcion...
        // 4: comunicacion...
        // 5: aborda_problemas...
        // 6-12: preferences (options) - we can just store them if needed or skip
        // ...
        // Indices need to be mapped carefully. 
        // Let's assume the order matches the file view we did.

        const record: SurveyRecord = {
            compras_dermocosmetica: currentRow[0]?.trim(),
            compra_en_fybeca: currentRow[1]?.replace(/"/g, '').trim(),
            asociacion_fybeca: currentRow[2]?.trim(),
            descripcion_fybeca: currentRow[3]?.trim(),
            comunicacion_calidad: currentRow[4]?.replace(/"/g, '').trim(),
            aborda_problemas_reales: currentRow[5]?.replace(/"/g, '').trim(),

            // ... mapping other fields ...
            // Price is around index 12
            percepcion_precios: currentRow[12]?.trim(),

            // Decision factors 13-17
            influencia_totalmente_desacuerdo: currentRow[13]?.replace(/"/g, '').trim(),
            influencia_desacuerdo: currentRow[14]?.replace(/"/g, '').trim(),
            influencia_neutro: currentRow[15]?.replace(/"/g, '').trim(),
            influencia_acuerdo: currentRow[16]?.replace(/"/g, '').trim(),
            influencia_totalmente_acuerdo: currentRow[17]?.replace(/"/g, '').trim(),

            confianza_experta: currentRow[18]?.replace(/"/g, '').trim(),
            asesoria_adecuada: currentRow[19]?.replace(/"/g, '').trim(),

            // 20-25 trust factors

            mejora_para_elegir: currentRow[26]?.replace(/"/g, '').trim(),
            ciudad: currentRow[currentRow.length - 1]?.trim() // Last column is always city (Quito/Guayaquil)
        };

        // Normalize city
        if (record.ciudad && (record.ciudad.toLowerCase().includes('quito') || record.ciudad.toLowerCase().includes('uio'))) {
            record.ciudad = 'Quito';
        } else if (record.ciudad && (record.ciudad.toLowerCase().includes('guayaquil') || record.ciudad.toLowerCase().includes('gye'))) {
            record.ciudad = 'Guayaquil';
        }

        data.push(record);
    }

    return data;
};
