import { Profil, ProfilFamily } from '../types/profil';

// Importation directe des fichiers JSON générés
import IPE_DATA from '../../../profiles-json/IPE.json';
import HEA_DATA from '../../../profiles-json/HEA.json';
import HEB_DATA from '../../../profiles-json/HEB.json';
import UPN_DATA from '../../../profiles-json/UPN.json';
import IPN_DATA from '../../../profiles-json/IPN.json';

const CATALOGUE: Record<string, ProfilFamily> = {
  IPE: IPE_DATA as ProfilFamily,
  HEA: HEA_DATA as ProfilFamily,
  HEB: HEB_DATA as ProfilFamily,
  UPN: UPN_DATA as ProfilFamily,
  IPN: IPN_DATA as ProfilFamily,
};

export class CatalogueProfils {
  /**
   * Récupère tous les profilés d'une famille donnée (ex: 'IPE')
   */
  static getFamille(nomFamille: string): Profil[] {
    const data = CATALOGUE[nomFamille.toUpperCase()];
    if (!data) {
      throw new Error(`Famille de profilés ${nomFamille} introuvable.`);
    }
    return data.profils;
  }

  /**
   * Récupère un profilé spécifique par sa désignation (ex: 'IPE 200')
   */
  static getProfil(designation: string): Profil | undefined {
    // Extrait la famille depuis la désignation (ex: "IPE 200" -> "IPE")
    const famille = designation.split(' ')[0].toUpperCase();
    const profils = this.getFamille(famille);
    
    return profils.find(p => p.designation.toUpperCase() === designation.toUpperCase());
  }

  /**
   * Trouve le profilé le plus léger d'une famille satisfaisant des critères donnés
   */
  static trouverProfilOptimal(
    famille: string, 
    criteres: {
      minWy?: number; // Module de flexion élastique min selon l'axe fort (cm3)
      minWz?: number; // Module de flexion élastique min selon l'axe faible (cm3)
      minIy?: number; // Inertie min selon l'axe fort (cm4) pour critère de flèche
    }
  ): Profil | null {
    const profils = this.getFamille(famille);
    
    // On parcourt les profilés dans l'ordre du fichier JSON 
    // (ils sont généralement triés du plus petit au plus grand)
    for (const profil of profils) {
      let satisfait = true;
      
      if (criteres.minWy && profil.axe_fort_y.Wely_cm3 < criteres.minWy) {
        satisfait = false;
      }
      if (criteres.minWz && profil.axe_faible_z.Welz_cm3 < criteres.minWz) {
        satisfait = false;
      }
      if (criteres.minIy && profil.axe_fort_y.Iy_cm4 < criteres.minIy) {
        satisfait = false;
      }
      
      if (satisfait) {
        return profil;
      }
    }
    
    return null; // Aucun profilé ne satisfait les critères
  }
}
