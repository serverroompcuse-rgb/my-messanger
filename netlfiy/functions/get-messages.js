const { createClient } = require('@supabase/supabase-js');

// We use environment variables for security (explained in Step 6)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    // Select all columns from 'messages', order by time, limit to 20
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify(data.reverse()), // Reverse so newest is at bottom
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};