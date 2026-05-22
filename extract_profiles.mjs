import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

const EXCEL_FILE = path.resolve('../down1.xlsx');
const OUTPUT_DIR = path.resolve('./src/data/profiles');

console.log(`Lecture du fichier Excel : ${EXCEL_FILE}`);

try {
  // Read the workbook
  const workbook = xlsx.readFile(EXCEL_FILE);
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    // Convert to JSON, using the first row as headers
    const rawData = xlsx.utils.sheet_to_json(sheet, { defval: null });
    
    if (rawData.length > 0) {
      const result = {
        type: sheetName,
        profiles: rawData
      };
      
      const outPath = path.join(OUTPUT_DIR, `${sheetName}.json`);
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
      console.log(`✅ Export réussi : ${sheetName}.json (${rawData.length} profilés)`);
    } else {
      console.log(`⚠️ Ignoré : La feuille "${sheetName}" est vide.`);
    }
  });

  console.log('\nTous les profilés ont été extraits avec succès !');

} catch (error) {
  console.error('Erreur lors de l\'extraction :', error.message);
  console.log('\nAssurez-vous que le fichier down1.xlsx n\'est pas ouvert dans Excel.');
}
