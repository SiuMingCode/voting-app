# Voting app
**Depends on your machine, you may need sudo for the docker commands**
## Tested environment
* Ubuntu 20.04 LTS
* Docker 20.10.7
* Docker compose 1.29.2
* Node 14.17.3
* npm 7.20.1
## Deployment
```
# Please put the .env file I sent you by email under the project root
docker-compose --env-file .env up -d
```
You may now use the API at http://localhost:8000 and browser the API doc at http://localhost:8080/.

In case you need to scale up, nginx and Docker DNS will load balance the traffic.
```
docker-compose --env-file .env up -d --scale voting-app=2
```
To remove everything:
```
docker-compose down --rmi local -v --remove-orphans
```

## Testing
```
# Please put the .env file I sent you by email under the project root
docker-compose --env-file .env up -d postgres # start the db
# change .env PGHOST to localhost
npm ci
npm test
```

## Development
```
cp .env.template .env
# fill in the values in .env
npm ci
npm start
```
