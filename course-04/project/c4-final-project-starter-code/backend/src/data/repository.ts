import * as AWS  from 'aws-sdk'
import { QueryOutput } from 'aws-sdk/clients/dynamodb'
import { DeleteObjectOutput } from 'aws-sdk/clients/s3'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const toDoTable = process.env.TODOS_TABLE
const indexName = process.env.INDEX_NAME
const bucketName = process.env.TODO_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION


const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })




export function getUploadUrl(imageId: string): string {
    const expiration: number = +urlExpiration
  
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: expiration
    })
  }

  export async function deleteTodoImage(imageId: string): Promise<DeleteObjectOutput> {
    
    return s3.deleteObject({ Bucket: bucketName, Key: imageId }).promise()
  }





  export async function getUsersTodos(userId: string): Promise<QueryOutput> {

    const result = await docClient.query({
        TableName: toDoTable,
        IndexName: indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

      return result
  }

 // export async function getToDoByIdAndUserId(todoId: string, userId: string): Promise<QueryOutput> {
//
 //   const result = await docClient
 //   .query({
 //     TableName: toDoTable,
 //     IndexName: indexName,
 //     KeyConditionExpression: 'userId = :userId and todoId = :todoId',
 //     ExpressionAttributeValues: {
 //       ':userId': userId,
 //       ':todoId': todoId
 //     }
 //   })
 //   .promise()
//
 //     return result
 // }
  

export async function createToDoAccess(newToDo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: toDoTable,
      Item: newToDo
    }).promise()
  
    return newToDo
  }

  export async function deleteToDoItem(todoId: string, userId: string): Promise<void> {

    await docClient.delete({
      TableName: toDoTable,
      Key:{
        "todoId": todoId,
        "userId": userId
    }
    }).promise()
    
  }

  export async function isTodoUsers(todoId: string, userId: string): Promise<boolean> {
    const result = await docClient
    .query({
      TableName: toDoTable,
      IndexName: indexName,
      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId
      }
    })
    .promise()
  
    return !!result
  }

  export async function updateToDoItemWithImage(todoId: string, imageId: string, userId: string): Promise<void> {
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
    await docClient.update({
      TableName: toDoTable,
      Key:{
        "todoId": todoId,
        "userId": userId
    },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues:{
        ":attachmentUrl": attachmentUrl
    }
    }).promise()
    
  }

  export async function todoExists(todoId: string, userId: string): Promise<boolean> {
    const result = await docClient
      .get({
        TableName: toDoTable,
        Key: {
          "todoId": todoId,
          "userId": userId
        }
      })
      .promise()
  
    console.log('Get todo: ', result)
    return !!result.Item
  }

  export async function updateToDoItemWithRequest(todoId: string, updatedTodo: UpdateTodoRequest, userId: string) {
    await docClient.update({
      TableName: toDoTable,
      Key:{
        "todoId": todoId,
        "userId": userId
    },
      UpdateExpression: "set #n = :newName, #dD = :duDate, #d = :doneness",
      ExpressionAttributeValues:{
        ":newName": updatedTodo.name,
        ":duDate": updatedTodo.dueDate,
        ":doneness": updatedTodo.done
    },
    ExpressionAttributeNames:{
      "#n": "name",
      "#dD": "dueDate",
      "#d": "done"
    }
    }).promise()
    
  }