import { atom } from 'jotai';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const userAtom = atom<User | null>(null);