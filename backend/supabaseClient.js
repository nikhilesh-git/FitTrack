const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL; // Add your Supabase project URL in .env
const SUPABASE_KEY = process.env.SUPABASE_KEY; // Add your anon/public key in .env

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
