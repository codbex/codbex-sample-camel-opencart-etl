# codbex-sample-camel-opencart-etl
A sample application for ETL

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

