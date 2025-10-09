export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: number;
  password: string;
  role: 'student' | 'admin';
  favorites: string[]; // module ids
}