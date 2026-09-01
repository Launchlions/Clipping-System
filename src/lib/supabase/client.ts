import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bdygpbsoxuwttmgqhuai.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_xgfW8qEtxcPKw5X_8-ug8Q_jmwuab1I';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
