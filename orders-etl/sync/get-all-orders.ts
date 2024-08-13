export function onMessage(message: any) {
    const body: any = message.getBody();

    console.log("Executing logic in the handler get-all-orders.ts");

    message.setBody(body);
    return message;
}
