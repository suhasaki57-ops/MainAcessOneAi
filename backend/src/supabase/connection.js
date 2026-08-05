import supabase from './client.js';

export const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('Users').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      console.warn('⚠️ Supabase Connection Alert:', error.message);
      return false;
    }
    console.log('✅ Supabase PostgreSQL Database Connected Successfully');
    return true;
  } catch (err) {
    console.warn('⚠️ Supabase connection warning:', err.message);
    return false;
  }
};
