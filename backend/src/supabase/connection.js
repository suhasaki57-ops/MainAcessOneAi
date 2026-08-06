import supabase from './client.js';

export const checkDatabaseConnection = async () => {
  const rawUrl = process.env.SUPABASE_URL || '';
  if (!rawUrl || rawUrl.includes('your-supabase-project') || rawUrl.includes('placeholder')) {
    console.log('ℹ️ Operating in High-Speed Local In-Memory Fallback Mode (Supabase URL unconfigured)');
    return false;
  }

  try {
    const { error } = await supabase.from('Users').select('count', { count: 'exact', head: true });
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
