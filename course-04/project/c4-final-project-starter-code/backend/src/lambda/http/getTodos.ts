import 'source-map-support/register'
import { getUserId } from '../utils'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { loggers } from 'winston'
import { createLogger } from '../../utils/logger'
import { getUsersTodos } from '../../data/repository'


const logger = createLogger('getToDo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)

  const result = await getUsersTodos(userId)

  const items = result.Items
  logger.info('result item', items)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}
