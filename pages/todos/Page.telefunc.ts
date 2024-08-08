import { getContext, Abort } from "telefunc";
import { prismaClient } from "#app/db/prismaClient";
import { Todo } from "@prisma/client";

export async function onCreateTodo({
  text,
}: {
  text: string;
}): Promise<Todo[]> {
  const { user } = getContext();
  if (!user) {
    throw Abort({ userNotLoggedIn: true });
  }
  await prismaClient.todo.create({
    data: {
      userId: user.id,
      text,
      complete: false,
    },
  });
  return prismaClient.todo.findMany({ where: { userId: user.id } });
}
export async function onUpdateTodoComplete({
  id,
  complete,
}: {
  id: string;
  complete: boolean;
}): Promise<Todo> {
  const { user } = getContext();
  if (!user) {
    throw Abort({ userNotLoggedIn: true });
  }
  const todo = await prismaClient.todo.update({
    where: { userId: user.id, id },
    data: {
      complete,
    },
  });
  return todo;
}
