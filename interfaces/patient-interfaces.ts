export interface PatientCreate {
  dataNascimento: string;
  peso: number;
  altura: number;
  alergias?: string;
}

export interface PatientUpdate {
  dataNascimento?: string;
  peso?: number;
  altura?: number;
  alergias?: string;
}
