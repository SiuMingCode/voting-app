# Voting app

## Deployment
### Tested environment
* Docker 20.10.7
* Docker compose 1.29.2

```
# Please put the .env file I sent you by email under the projec root
sudo docker-compose --env-file .env up
```

## Testing
```
npm ci
npm test
```

## Development
```
cp .env.template .env
# fill in the values in .env
npm ci
node src/server.js
```
