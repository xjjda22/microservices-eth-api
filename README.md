3![](microservice.png)

# Ready to use Node.js microservice

## Features
- **Framework**: Express
- **Authentication**: JWT with public/private key file
- **Database**: MongoDB (Native), PostgreSQL (Sequelize)
- **Code**: ESLint, Prettier, Husky
- **Debuging**: Debug, VS Code configurations
- **Logging**: Winston
- **Testing**: Jest, SuperTest, AutoCannon
- **Continuous Integration**: GitHub Actions + Docker Compose
- **Other**: PM2, DotEnv
- Well structured
- API versioning
- Request Validation

## Getting Started
```shell
git clone https://github.com/harryranakl/microservices-eth-api
cd microservice

# Create environment variables from example
mv .env.example .env

# Generate JWT keys
ssh-keygen -t rsa -b 2048 -q -N '' -m PEM -f private.key \
&& rm private.key.pub \
&& openssl rsa -in private.key -pubout -outform PEM -out public.key

# Install all dependencies
npm install

# Run on port 3000
npm start
```


## Running SQL database migrations
```shell
npx sequelize db:migrate
```

## Start with PM2
```shell
pm2 start process.json
```

## Start with Docker
```shell
# Generate JWT keys
ssh-keygen -t rsa -b 2048 -q -N '' -m PEM -f private.key \
&& rm private.key.pub \
&& openssl rsa -in private.key -pubout -outform PEM -out public.key

# Build image
docker build -t app/microservice:v1 .

# Run on port 4000
docker run -p 3000:3000 -d --name microservice app/microservice:v1

# Run on host network
docker run -d --name microservice --network=host app/microservice:v1
```


## Environment variables

Name | Value
------------ | -------------
PORT|4000
LOG_LEVEL|info
DEBUG|*
MONGO_HOST|127.0.0.1
MONGO_PORT|27017
MONGO_DB|test
MONGO_USER|
MONGO_PASS|
MONGO_URL|
SQL_HOST|127.0.0.1
SQL_HOST_READ|127.0.0.1
SQL_HOST_WRITE|127.0.0.1
SQL_PORT|5432
SQL_DB|test
SQL_USER|postgres
SQL_PASS|
SQL_DIALECT|postgres
SQL_POOL_LIMIT|100
JWT_JTI|******
JWT_SECRET|******
JWT_EMAIL|test@example.com
ETHSCANAPI_TOKEN|******
ETHWEB3API_URL|https://rinkeby.infura.io/v3/*****

## Structure

```
.
├── config                  # App configuration files
│   ├── sequelize.js        # sequelize config
│   └── ...                 # Other configurations
├── db                      # Data access stuff
│   ├── migrations          # Migrations
│   ├── models              # Models
│   ├── seeds               # Seeds
│   └── mongo.js            # MongoDB instantiation
│   └── sequelize.js        # Sequelize (PostgresSQL/MySQL) instantiation
├── docs                    # Documentation
├── helpers                 # Helpers (formats, validation, etc)
├── routes                  
│   ├── controllers         # Request managers
│   ├── middlewares         # Request middlewares
│   └── routes.js           # Define routes and middlewares here
├── scripts                 # Standalone scripts for dev uses
├── services                # External services implementation   
│   ├── serviceOne
│   └── serviceTwo
├── tests                   # Testing
├── .env                    # Environment variables
├── .sequelizerc            # Sequelize CLI config
├── app.js                  # App starting point
├── Dockerfile              # Dockerfile
├── process.json            # pm2 init
├── package.json
├── private.key             # Sign tokens
├── public.key              # Validate tokens
└── README.md         
```

```
Case: healthcheck
Method:Get 
EndPoint:http://localhost:3000/healthcheck
Body:{
}
Response:{
    "uptime": 8,
    "message": "OK",
    "timestamp": 1585998099585,
    "mongodb": true
}

Case: Create User
Method:Post
EndPoint:http://localhost:3000/v1/users
Body:{
  "email":"test@example.com"
}
Response:{
    "token": "eyJhbGciO...zSA8sQ"
}

Case: Update User
Method:Put
EndPoint:http://localhost:3000/v1/users/test@example.com
Body:{
  "email":"test@example.com"
}
Response:{
    "token": "eyJhbGciO...zSA8sQ"
}

Case: Delete User
Method:Delete
EndPoint:http://localhost:3000/v1/users/test@example.com
Body:{
}
Response:{
    
}
Case: Get Ether Balance
Method:Get
Body:{
}
EndPoint:http://localhost:3000/v1/getBalance/0x70DeFb7B30D575758ea0405ff26C3646CcCa0E10
Response:{
    "balance": "2.010307"
}

Case: Send Ether Transaction
Method:Post
EndPoint:http://localhost:3000/v1/transaction/
Body:{
  "privatekey":"41af8c6ec3e353b13de8fb1011a8d1f6b9bbd344990e5752baeda83f9d4d1bf0", 
  "destination":"0x00ac8fbedd57107adbbb8a23d56cbf791bf0093e", 
  "amount":"0.02",
  "send":false
}
Response:{
    "ethGasPrices": {
        "low": 2,
        "medium": 2.8,
        "high": 8
    },
    "transactionId": "0x8c2e8d33859bc823894dd4f4c262c91e973f5ac66c3c6b8c241454086c85679f"
    "transactionUrl": "https://rinkeby.etherscan.io/tx/0x8c2e8d33859bc823894dd4f4c262c91e973f5ac66c3c6b8c241454086c85679f"
    "getSenderAddress": "0x2d0e6fbef8e7322e59fb666be326a3ad88704718"
}

Case: Read Ether Transaction Details
Method:Get
EndPoint:http://localhost:3000/v1/transactionDetails/0x8c2e8d33859bc823894dd4f4c262c91e973f5ac66c3c6b8c241454086c85679f
Body:{
 
}
Response:{
    "blockHash": "0x5a045171d692fb4c7d5b65a3493a67cf5f01d2c2b359eae9c8276187b6152cae",
    "blockNumber": 6074465,
    "fromAddress": "0x2d0e6fbef8e7322e59fb666be326a3ad88704718",
    "toAddress": "0x00ac8fbedd57107adbbb8a23d56cbf791bf0093e",
    "amount": "0.02",
    "gas": 21000,
    "gasPrice": "1000000000"
}

Case: Read Ether Address Transaction List
Method:Get
EndPoint:http://localhost:3000/v1/transactionList/0x8c2e8d33859bc823894dd4f4c262c91e973f5ac66c3c6b8c241454086c85679f
Body:{
 
}
Response:{
    "status": "1",
    "message": "OK",
    "result": [
        {
            "blockNumber": "2179691",
            "timeStamp": "1524765424",
            "hash": "0x11bb319aea22a09b215ddd210c0be39762cd1f44eefb8c53bdadab031bc3119d",
            "nonce": "7",
            "blockHash": "0x66aeb484bd032136523b60d661e822eda0d26f64d4cf68fc42ac442f6c3ae2a9",
            "transactionIndex": "15",
            "from": "0x70defb7b30d575758ea0405ff26c3646ccca0e10",
            "to": "0x00ac8fbedd57107adbbb8a23d56cbf791bf0093e",
            "value": "200000000000000000",
            "gas": "21000",
            "gasPrice": "1000000000",
            "isError": "0",
            "txreceipt_status": "1",
            "input": "0x",
            "contractAddress": "",
            "cumulativeGasUsed": "7392572",
            "gasUsed": "21000",
            "confirmations": "4076727"
        }
    ]
}
```