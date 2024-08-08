import { DataAsync } from "vike/types";
import { Todo } from "@prisma/client";
import { redirect } from "vike/abort";
import { prismaClient } from "#app/db/prismaClient";

export type Data = { todos: Todo[] };

export const data: DataAsync<Data> = async (pageContext) => {
  console.log("getting data!");
  const { user } = pageContext;
  if (!user) throw redirect("/");
  const todos = await prismaClient.todo.findMany({
    where: { userId: user.id },
  });
  return { todos };
};
