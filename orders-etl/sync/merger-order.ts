import { oc_orderEntity } from "orders-etl/dao/oc_orderRepository";
import { OrderRepository } from "orders-etl/gen/orders-etl/dao/entities/OrderRepository";

export function onMessage(message: any) {
    const openCartOrder: oc_orderEntity = message.getBody();

    console.log("About to upsert Open cart order " + JSON.stringify(openCartOrder));

    // todo get rates from API
    const totalEuro = openCartOrder.total;

    const repository = new OrderRepository();
    repository.upsert({
        Id: openCartOrder.order_id,
        Total: totalEuro,
        DateAdded: openCartOrder.date_added
    });
    console.log("Upserted entity.");

    return message;
}