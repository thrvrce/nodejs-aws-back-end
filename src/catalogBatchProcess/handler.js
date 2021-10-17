'use strict';
const { Client } = require('pg');
const AWS = require("aws-sdk");

const { PG_HOST, PG_PORT, PG_DAABASE, PG_USERNAME, PG_PASSWORD, SNS_ARN } = process.env;
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

const catalogBatchProcess = async (event) => {
  const newProducts = event?.Records.map(({ body }) => body);
  let statusCode = 200;
  const importResults = {
    status: 'ok',
    errorMessages: [],
    imported: 0,
    ignored: 0,
  };
  console.log('newProducts',newProducts);
  if (newProducts && newProducts.length) {

    const queryStrings = newProducts.map((productToParse) => {
      const {
        title,
        description,
        price,
        imageUrl = ' ',
        count,
      } = JSON.parse(productToParse);

      if (title && description && price !== undefined && count !== undefined) {
        return (
          `
            insert into products
              (title, description, price, "imageUrl")
            values
              ('${title}', '${description}', ${price}, '${imageUrl}');

            insert into stocks
              (product_id, count)
            values
              ((select id from products where products.title = '${title}' limit 1 ), ${count});
          `);
      } else {
        return ''
      }
    }).filter(queryString => !!queryString);
    console.log('queryStrings', queryStrings);
    if (queryStrings.length) {

      const client = new Client(dbOptions);
      const sns = new AWS.SNS({region: 'eu-west-1'})
      try {
        await client.connect();
        const results = await Promise.all(
          queryStrings.map((queryString) => client.query(queryString)));
        console.log('Import results',results);
      } catch (err) {
        console.log(err)
        statusCode = 500;
        importResults.status = err.message;
      }
      finally {
        client.end();
        await sns.publish({
          Subject: 'Products import was finished',
          Message: 'Products import was finished',
          TopicArn: SNS_ARN
        }).promise()
      }
    }
  }

  return {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PATCH, PUT',
    },
    body: JSON.stringify({ statusCode, importResults, }),
  }
};
module.exports = {
  catalogBatchProcess,
}
