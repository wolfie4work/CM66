import { Profil } from '../types/profil';

export interface PannesInput {
  portee: number;       // Portée de la panne L (m)
  entraxe: number;      // Entraxe entre pannes (m)
  pente: number;        // Pente de la toiture (degrés)
  
  // Charges surfaciques (daN/m² ou kN/m²) - on va utiliser le daN/m² qui est très courant en CM66
  G: number;            // Charges permanentes (couverture, isolant, etc.)
  Q_neige: number;      // Surcharge de neige
  Q_vent: number;       // Pression dynamique du vent (perpendiculaire au versant)
  
  fy: number;           // Limite d'élasticité de l'acier (ex: 235 MPa pour S235)
}

export interface PannesResult {
  M_y_daNm: number;
  M_z_daNm: number;
  contrainte_max_MPa: number;
  fleche_mm: number;
  fleche_admissible_mm: number;
  verifie: boolean;
}

export function calculerSollicitationsPannes(input: PannesInput, poidsPropreProfil_kg_m: number = 0) {
  // Conversion de la pente en radians
  const alpha = (input.pente * Math.PI) / 180;
  
  // 1. Descente de charge linéique sur la panne (daN/m)
  const g_lineique = (input.G * input.entraxe) + poidsPropreProfil_kg_m;
  const q_neige_lineique = input.Q_neige * input.entraxe;
  const q_vent_lineique = input.Q_vent * input.entraxe;

  // 2. Décomposition selon les axes locaux du profilé
  // L'axe fort (y-y) reprend les charges perpendiculaires au versant (direction z local)
  // L'axe faible (z-z) reprend les charges parallèles au versant (direction y local)
  
  // Combinaison la plus défavorable selon CM66 (art 3.3)
  // Souvent : 4/3 G + 3/2 Q (On fait un exemple simple pour la trame)
  
  const q_z_ELU = (1.33 * g_lineique + 1.5 * q_neige_lineique) * Math.cos(alpha) + 1.5 * q_vent_lineique;
  const q_y_ELU = (1.33 * g_lineique + 1.5 * q_neige_lineique) * Math.sin(alpha);
  
  const q_z_ELS = (g_lineique + q_neige_lineique) * Math.cos(alpha) + q_vent_lineique;

  // 3. Calcul des moments fléchissants maximaux (pour une poutre sur 2 appuis simples)
  // M = q * L^2 / 8
  const L = input.portee;
  
  const My_daNm = (q_z_ELU * Math.pow(L, 2)) / 8; // Flexion axe fort
  const Mz_daNm = (q_y_ELU * Math.pow(L, 2)) / 8; // Flexion axe faible

  return {
    My_daNm,
    Mz_daNm,
    q_z_ELS_daN_m: q_z_ELS
  };
}

export function verifierProfilPanne(profil: Profil, input: PannesInput): PannesResult {
  // 1. Sollicitations avec le poids propre exact du profilé
  const sollicitations = calculerSollicitationsPannes(input, profil.G_kg_ml);
  
  // 2. Calcul des contraintes (CM66) : sigma = (My / Wy) + (Mz / Wz)
  // Attention aux unités : My en daN.m, W en cm3. 
  // 1 daN.m = 1000 daN.cm
  // sigma = daN/cm² puis converti en MPa (1 MPa = 10 daN/cm²)
  const sigma_y_daN_cm2 = (sollicitations.My_daNm * 100) / profil.axe_fort_y.Wely_cm3;
  const sigma_z_daN_cm2 = (sollicitations.Mz_daNm * 100) / profil.axe_faible_z.Welz_cm3;
  
  const sigma_max_MPa = (sigma_y_daN_cm2 + sigma_z_daN_cm2) / 10;
  
  // 3. Vérification de la flèche (axe fort)
  // f = 5 * q * L^4 / (384 * E * Iy)
  const E_daN_cm2 = 2100000; // Module de Young acier
  const q_z_daN_cm = sollicitations.q_z_ELS_daN_m / 100;
  const L_cm = input.portee * 100;
  
  const fleche_cm = (5 * q_z_daN_cm * Math.pow(L_cm, 4)) / (384 * E_daN_cm2 * profil.axe_fort_y.Iy_cm4);
  const fleche_mm = fleche_cm * 10;
  
  const fleche_admissible_mm = (input.portee * 1000) / 200; // Flèche limite L/200

  // 4. Bilan
  const verifie = (sigma_max_MPa <= input.fy) && (fleche_mm <= fleche_admissible_mm);

  return {
    M_y_daNm: Math.round(sollicitations.My_daNm * 100) / 100,
    M_z_daNm: Math.round(sollicitations.Mz_daNm * 100) / 100,
    contrainte_max_MPa: Math.round(sigma_max_MPa * 100) / 100,
    fleche_mm: Math.round(fleche_mm * 100) / 100,
    fleche_admissible_mm: Math.round(fleche_admissible_mm * 100) / 100,
    verifie
  };
}
