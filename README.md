# codbex-sample-camel-opencart-etl
A sample application for ETL

## Steps

### Configure OpenCart
- Start OpenCart instance
```shell
export DOCKER_COMPOSE_PATH='~/work/git/codbex-sample-camel-opencart-etl/opencart/docker-compose.yml'
docker-compose -f "$DOCKER_COMPOSE_PATH" down -v

export OPENCART_USERNAME='myuser'
export OPENCART_PASSWORD='myuser'
export OPENCART_DATABASE_PORT_NUMBER='3306'
export OPENCART_DATABASE_USER='bn_opencart'
export OPENCART_DATABASE_PASSWORD='bitnami'
export OPENCART_DATABASE_NAME='bitnami_opencart'
docker-compose -f "$DOCKER_COMPOSE_PATH" up -d 
```
- Access the instance at [http://localhost/](http://localhost/)

- Access the admin UI at [http://localhost/admin](http://localhost/admin) - use user `myuser` and password `myuser`

