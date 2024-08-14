import { oc_orderRepository } from "orders-etl/dao/oc_orderRepository";

export function onMessage(message: any) {
    const repository = new oc_orderRepository();
    const openCartOrders = repository.findAll();

    message.setBody(openCartOrders);
    return message;
}
