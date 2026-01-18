export const enum userRole {
  ADMIN = 'ADMIN',
  CLIENTE = 'CLIENTE',
  TECNICO = 'TECNICO',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: userRole;
  profession?: string;
  [key: string]: any; // Permite outras propriedades dinâmicas do backend
}