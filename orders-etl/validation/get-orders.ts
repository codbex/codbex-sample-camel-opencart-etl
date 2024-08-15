import { sql, database, query } from "sdk/db";
import { response } from "sdk/http";

printAllOrders();

function printAllOrders() {
    const connection = database.getConnection();
    try {
        const sqlQuery = sql.getDialect(connection).select().from("ORDERS").build();
        const resultSet = query.execute(sqlQuery);

        response.println(sqlQuery);
        response.println(JSON.stringify(resultSet, null, 2));
    } finally {
        connection.close();
    }
}