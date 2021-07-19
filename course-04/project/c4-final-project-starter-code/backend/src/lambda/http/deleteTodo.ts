import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { deleteTodoImage, deleteToDoItem, isTodoUsers } from '../../data/repository'
import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const isTodoYours = await isTodoUsers(todoId, userId)

  if (isTodoYours){
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
