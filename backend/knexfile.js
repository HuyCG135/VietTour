import "dotenv/config";

const base = {
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "db_viet_tour",
    },
    pool: { min: 0, max: 10 },
    migrations: {
        directory: "./db/migrations",
        extension: "js",
    },
    seeds: {
        directory: "./db/seeds",
        extension: "js",
    },
};

export default {
    development: base,
    production: base,
};
