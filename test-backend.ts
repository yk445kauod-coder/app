import { supabase } from './src/lib/supabase';
import { firestore } from './src/lib/firebase';

console.log('Supabase client initialized:', !!supabase);
console.log('Firestore client initialized:', !!firestore);
