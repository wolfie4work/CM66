export interface ProfileDimensions {
  h_mm: number;
  b_mm: number;
  tw_mm: number;
  tf_mm: number;
  r_mm: number;
}

export interface ProfileSection {
  A_cm2: number;
  Avy_cm2: number;
  Avz_cm2: number;
}

export interface ProfileAxeFortY {
  Iy_cm4: number;
  Wely_cm3: number;
  Wply_cm3: number;
  iy_cm: number;
}

export interface ProfileAxeFaibleZ {
  Iz_cm4: number;
  Welz_cm3: number;
  Wplz_cm3: number;
  iz_cm: number;
}

export interface Profil {
  designation: string;
  G_kg_ml: number;
  dimensions: ProfileDimensions;
  section: ProfileSection;
  axe_fort_y: ProfileAxeFortY;
  axe_faible_z: ProfileAxeFaibleZ;
}

export interface ProfilFamily {
  famille: string;
  description: string;
  unite: Record<string, string>;
  profils: Profil[];
}
