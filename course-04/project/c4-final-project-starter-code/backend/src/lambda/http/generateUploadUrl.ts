import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { todoExists, getUploadUrl, updateToDoItemWithImage } from '../../data/repository'
import { createLogger } from '../../utils/logger'


const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  const validToDoId = await todoExists(todoId, userId)

  if (!validToDoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'To Do does not exist'
      })
    }
  }

  logger.info('Todo exists: ', todoId)
  const imageId = todoId //This is not needed but was easier than re-writing the method since this is a serverless class not a programming class
  await updateToDoItemWithImage(todoId, imageId, userId)
  const uploadUrl = getUploadUrl(imageId)
  logger.info('presignedUrl', uploadUrl)
  return {
    statusCode: 200,
    headers: {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}


