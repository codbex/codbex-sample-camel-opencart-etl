import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OrderEntity {
    readonly Id: number;
    Total: number;
    DateAdded: Date;
}

export interface OrderCreateEntity {
    readonly Total: number;
    readonly DateAdded: Date;
}

export interface OrderUpdateEntity extends OrderCreateEntity {
    readonly Id: number;
}

export interface OrderEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Total?: number | number[];
            DateAdded?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            Total?: number | number[];
            DateAdded?: Date | Date[];
        };
        contains?: {
            Id?: number;
            Total?: number;
            DateAdded?: Date;
        };
        greaterThan?: {
            Id?: number;
            Total?: number;
            DateAdded?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Total?: number;
            DateAdded?: Date;
        };
        lessThan?: {
            Id?: number;
            Total?: number;
            DateAdded?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            Total?: number;
            DateAdded?: Date;
        };
    },
    $select?: (keyof OrderEntity)[],
    $sort?: string | (keyof OrderEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OrderEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OrderEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OrderUpdateEntityEvent extends OrderEntityEvent {
    readonly previousEntity: OrderEntity;
}

export class OrderRepository {

    private static readonly DEFINITION = {
        table: "ORDER",
        properties: [
            {
                name: "Id",
                column: "ORDER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Total",
                column: "ORDER_TOTAL",
                type: "DECIMAL",
                required: true
            },
            {
                name: "DateAdded",
                column: "ORDER_DATEADDED",
                type: "TIMESTAMP",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OrderRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OrderEntityOptions): OrderEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OrderEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OrderCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "ORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "ORDER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OrderUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "ORDER",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "ORDER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OrderCreateEntity | OrderUpdateEntity): number {
        const id = (entity as OrderUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OrderUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "ORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "ORDER_ID",
                value: id
            }
        });
    }

    public count(options?: OrderEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "ORDER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OrderEntityEvent | OrderUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("orders-etl-entities-Order", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("orders-etl-entities-Order").send(JSON.stringify(data));
    }
}
