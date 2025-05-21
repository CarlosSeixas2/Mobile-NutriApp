export interface UserRegister {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  avatar?: string;
  genero: string;
  profissionalId?: string;
  pacienteId?: string;
}

export interface UserLogin {
  email: string;
  senha: string;
}

export interface UserUpdate {
  nome?: string;
  email?: string;
  senha?: string;
  cpf?: string;
  telefone?: string;
  avatar?: string;
  genero?: string;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  profile: string;
  professionalId?: string;
  pacientId?: string;
}
