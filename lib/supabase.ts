import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Vote = {
  id?: string;
  session_id: string;
  category_id: string;
  nominee_id: string;
  created_at?: string;
};

export type VoteResult = {
  category_id: string;
  nominee_id: string;
  vote_count: number;
};
