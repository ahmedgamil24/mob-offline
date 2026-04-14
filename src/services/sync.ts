import { db } from "../lib/db";
import { supabase } from "../lib/supabase";
import { Todo } from "../types/todo";

export const syncTodos = async () => {
  try {
    // 
    const unsynced = db.getAllSync(
      "SELECT * FROM todos WHERE synced = 0"
    ) as Todo[];

    for (const todo of unsynced) {
      const { error } = await supabase.from("todos").upsert({
        id: todo.id,
        name: todo.name,
        is_completed: todo.is_completed,
      });

      if (!error) {
        //
        db.runSync(
          "UPDATE todos SET synced = 1 WHERE id = ?",
          [todo.id]
        );
      }
    }

    console.log("Sync done......");
  } catch (err) {
    console.log("Sync error", err);
  }
};