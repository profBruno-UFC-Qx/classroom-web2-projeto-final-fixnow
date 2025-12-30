export const enum userRole {
  ADMIN = 'ADMIN',
  CLIENTE = 'CLIENTE',
  TECNICO = 'TECNICO',
}

export interface User {
  name: string;
  email: string;
  role: userRole;
}