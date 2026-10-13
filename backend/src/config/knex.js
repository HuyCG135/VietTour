import "dotenv/config";
import knex from "knex";

// Instance Knex dùng chung cho các model (query builder),
// tái sử dụng cấu hình kết nối giống knexfile (DB_*).
const db = knex({
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "db_viet_tour",
    },
    pool: { min: 2, max: 10 },
});

export default db;
