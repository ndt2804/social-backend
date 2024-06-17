const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
