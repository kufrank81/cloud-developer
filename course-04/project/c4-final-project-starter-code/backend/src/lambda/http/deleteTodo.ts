import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'
import { deleteTodoImage, deleteToDoItem } from '../../data/repository'
//import { TodoItem } from '../../models/TodoItem'
//import { loggers } from 'winston'
import { createLogger } from '../../utils/logger'

//const toDoTable = process.env.TODOS_TABLE
//const indexName = process.env.INDEX_NAME
//const docClient = new AWS.DynamoDB.DocumentClient()
const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

    await deleteToDoItem(todoId, userId)
    logger.info('todo deleted: ', todoId)
    await deleteTodoImage(todoId)
    logger.info('image deleted: ', todoId)


    // TODO: Remove a TODO item by id
    return {
      statusCode: 200,
      headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Credentials': true
      },
      body: 'Item "${todoId}" was deleted.'
   }
  
  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: 
      'We are sorry this todo does not belong to you and therefore cannot be deleted.'
  }
}

//  async function deleteToDoItem(todoId: string, userId: string) {
//    await docClient.delete({
//      TableName: toDoTable,
//      Key:{
//        "todoId": todoId,
//        "userId": userId
//    }
//    }).promise()
//    
//  }
//
//  async function isTodoUsers(todoId: string, userId: string): Promise<boolean> {
//    const result = await docClient
//    .query({
//      TableName: toDoTable,
//      IndexName: indexName,
//      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
//      ExpressionAttributeValues: {
//        ':userId': userId,
//        ':todoId': todoId
//      }
//    })
//    .promise()
//  
//    return !!result
//  }

