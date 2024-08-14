import { oc_orderRepository } from "orders-etl/dao/oc_orderRepository";

export function onMessage(message: any) {
    const repository = new oc_orderRepository();
    const openCartOrders = repository.findAll();
    message.setBody(openCartOrders);

    const exchangeRate = getUsdToEuroExchangeRate();
    message.setExchangeProperty("currencyExchangeRate", exchangeRate);

    return message;
}

function getUsdToEuroExchangeRate() {
    // todo get rates from API
    return 0.92;
}