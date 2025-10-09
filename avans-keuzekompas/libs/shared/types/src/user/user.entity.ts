export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  password: string;
  role: 'student' | 'admin';
  favorites: string[]; // module ids
}