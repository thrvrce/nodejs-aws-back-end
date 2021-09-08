'use strict';
const {Client} = require('pg');

const { PG_HOST, PG_PORT, PG_DAABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DAABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,

};

const getProductsList = async (event) => {
  let result = [];
  let statusCode = 200;
  let {
    resource = '',
    path = '',
    httpMethod=  '',
    queryStringParameters = {}
  } = event;
  console.log({ resource, path, httpMethod, queryStringParameters});
  const client = new Client(dbOptions);
  try {
    await client.connect();
   const {rows} = await client.query(`
    select products.*, stocks.count
    from products
    inner join stocks on stocks.product_id = products.id`);
   result = rows;
   console.log(result);
  } catch (err) {
    statusCode = 500;
  }
  finally {
    client.end();
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PATCH, PUT',
      },
      statusCode,
      body: JSON.stringify(result),
    }
  }
};
module.exports.getProductsList = getProductsList;
