import { createClient } from '@supabase/supabase-js';

// Load environment variables for Supabase connection / Cargar variables de entorno para la conexion
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Faltan las credenciales de Supabase en el archivo .env');
}

// Export Supabase authenticated client / Exportar cliente autenticado de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);