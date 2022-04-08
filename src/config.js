require('dotenv').config()

const env = process.env;
const config = {
    db: { /* do not put password or any sensitive info here, done only for demo */
      host: env.PG_HOST,
      port: env.PG_PORT,
      user: env.PG_USER,
      password: env.PG_PASSWORD,
      database: env.PG_NAME,
    },
};
