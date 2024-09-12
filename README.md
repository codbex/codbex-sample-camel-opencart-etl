# codbex-sample-camel-opencart-etl
An [Iapetus](https://www.codbex.com/products/iapetus/) sample project for ETL.<br>
More details about the project in [this blog](https://www.codbex.com/technology/2024/08/19/orders-etl/).

## Steps

### Configure OpenCart
- Start OpenCart instance
```shell
export DOCKER_COMPOSE_PATH='/codbex-sample-camel-opencart-etl/opencart/docker-compose.yml'

# Stops and removes all containers 
# add -v if you want to remove all volumes as well
docker-compose -f "$DOCKER_COMPOSE_PATH" down 

export OPENCART_USERNAME='myuser'
export OPENCART_PASSWORD='myuser'
export OPENCART_DATABASE_PORT_NUMBER='3306'
export OPENCART_DATABASE_USER='bn_opencart'
export OPENCART_DATABASE_PASSWORD='bitnami'
export OPENCART_DATABASE_NAME='bitnami_opencart'
docker-compose -f "$DOCKER_COMPOSE_PATH" up -d 
```
- Access the instance at [http://localhost:80/](http://localhost:80/)

- Access the admin UI at [http://localhost:80/admin](http://localhost:80/admin) - use user `myuser` and password `myuser`

### Start iapetus instance
```shell
WORKSPACE_DIR='/tmp/iapetus'
IMAGE_VERSION='0.20.0' # use version 0.20.0 or later

docker run --name codbex-iapetus --rm -p 8080:80 \
    --network opencart_network \
    -v "$WORKSPACE_DIR:/target/dirigible" \
    ghcr.io/codbex/codbex-iapetus:$IMAGE_VERSION

```
