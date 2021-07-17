import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
//import * as AWS  from 'aws-sdk'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
import { createToDoAccess } from '../../data/repository'


//const toDoTable = process.env.TODOS_TABLE
//const docClient = new AWS.DynamoDB.DocumentClient()

const logger = createLogger('getToDo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
  const userId = getUserId(event)

  const newItem = await createToDo(newTodo, userId)
  logger.info('new item is', newItem)
  const item = newItem

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}


async function createToDo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {

  const itemId = uuid.v4()

  return await createToDoAccess({
    todoId: itemId,
    userId: userId,
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: ""
  })
}

//async function createToDoAccess(newToDo: TodoItem): Promise<TodoItem> {
//  await docClient.put({
//    TableName: toDoTable,
//    Item: newToDo
//  }).promise()
//
//  return newToDo
//}

