const { neon } = require('@neondatabase/serverless');
const sql = neon("postgresql://neondb_owner:npg_4Rau8fBFKnmd@ep-shiny-snow-ai19gour-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'usage_logs'`
    .then(res => console.log(res))
    .then(() => process.exit(0))
    .catch(console.error);
