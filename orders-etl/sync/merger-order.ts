import { oc_orderEntity } from "orders-etl/dao/oc_orderRepository";
import { database } from "sdk/db";

export function onMessage(message: any) {
    const openCartOrder: oc_orderEntity = message.getBody();

    console.log(`About to upsert Open cart order [${openCartOrder.order_id}]...`);
    upsertOrder(openCartOrder);
    console.log(`Upserted Open cart order [${openCartOrder.order_id}]`);

    return message;
}

const MERGE_SQL = `
    MERGE INTO ORDERS
        (ID, TOTAL, DATEADDED) 
    KEY(ID)
    VALUES (?, ?, ?)
`;

function upsertOrder(openCartOrder: oc_orderEntity) {
    // todo get rates from API
    const totalEuro = openCartOrder.total;

    const connection = database.getConnection();
    const statement = connection.prepareStatement(MERGE_SQL);
    try {
        statement.setLong(1, openCartOrder.order_id);
        statement.setDouble(2, totalEuro);
        statement.setTimestamp(3, openCartOrder.date_added);
        statement.executeUpdate();
    } finally {
        statement.close();
        connection.close();
    }

}