import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS SDK
AWS.config.update({ region: process.env.region , credentials: { accessKeyId: process.env.accessKeyId, secretAccessKey: process.env.secretAccessKey } });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.productTableName;

export const getAllProducts: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const params = {
      TableName: TABLE_NAME
    };
    const data = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching products', error })
    };
  }
};

export const createProduct: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { name, price } = JSON.parse(event.body);
    const id = uuidv4();
    const params = {
      TableName: TABLE_NAME,
      Item: { id, name, price }
    };
    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ id, name, price })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating product', error })
    };
  }
};
