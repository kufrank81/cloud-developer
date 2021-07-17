import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
//import * as AWS  from 'aws-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { isTodoUsers, updateToDoItemWithRequest } from '../../data/repository'
import { createLogger } from '../../utils/logger'


//const toDoTable = process.env.TODOS_TABLE
//const indexName = process.env.INDEX_NAME
//const docClient = new AWS.DynamoDB.DocumentClient()
const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const userCanUpdateTodo: boolean = await isTodoUsers(todoId, userId)
  if(userCanUpdateTodo){
    await updateToDoItemWithRequest(todoId, updatedTodo, userId)
    logger.info('todo updated', todoId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        
      })
    }
  }
  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: 
      'We are sorry this todo does not belong to you and therefore cannot be updated.'
  }
}


//async function updateToDoItem(todoId: string, updatedTodo: UpdateTodoRequest, userId: string) {
//  await docClient.update({
//    TableName: toDoTable,
//    Key:{
//      "todoId": todoId,
//      "userId": userId
//  },
//    UpdateExpression: "set #n = :newName, #dD = :duDate, #d = :doneness",
//    ExpressionAttributeValues:{
//      ":newName": updatedTodo.name,
//      ":duDate": updatedTodo.dueDate,
//      ":doneness": updatedTodo.done
//  },
//  ExpressionAttributeNames:{
//    "#n": "name",
//    "#dD": "dueDate",
//    "#d": "done"
//  }
//  }).promise()
//  
//}
