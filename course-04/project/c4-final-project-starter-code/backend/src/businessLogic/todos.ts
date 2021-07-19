import { createToDoAccess } from "../data/repository"
import { TodoItem } from "../models/TodoItem"
import { CreateTodoRequest } from "../requests/CreateTodoRequest"
import * as uuid from 'uuid'



export async function createToDo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {

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