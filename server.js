'use strict';

const express = require('express');

const { CosmosClient } = require("@azure/cosmos");



const COSMOS_CONECTIONSTRING = "AccountEndpoint=https://corredordb.documents.azure.com:443/;AccountKey=1f6TyOnz41wcloDA1NtJs9k002RWt6yGv8wQn1V17SniHFIZdPZHu2mdLtRbrczT7oXes6lJLDaLACDbm0OzZA==;";


// Constants
const PORT = 3001;
const HOST = '0.0.0.0';

// App
const app = express();

// Provide required connection from environment variables


// Set Database name and container name with unique timestamp
const databaseName = 'seguros';
const containerName = 'clientes';

// Authenticate to Azure Cosmos DB
const cosmoClient = new CosmosClient(
    COSMOS_CONECTIONSTRING
);

console.log(cosmoClient);
// Query by SQL - more expensive `find`
// find all items with same Id (partitionKey)
const querySpec = {
    query: "select * from clientes",
    parameters: [
        {
            name: "@Id",
            value: 1
        }
    ]    
};


const clienteContainer= cosmoClient.database(databaseName).container('clientes');

// Get items
//const { resources } = await cosmosClient.database(databaseName).containers.query(querySpec).fetchAll();

app.use(express.json());

app.get('/', (req, res) => {
    resultSetClientes(res);

});

async function resultSetClientes(res ){
    const { resources } = await clienteContainer.items.query(querySpec).fetchAll();
    console.log(resources);
    for (const item of resources) {
        console.log(`${item.id}: ${item.nombre}, ${item.Version}`);
        res.send({
            itemId : item.id,
            Descripcion: item.nombre,
            Jsonversion : item.Version
        });
     }

}

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});







