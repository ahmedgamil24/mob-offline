import { db } from "../lib/db";
import { supabase } from "../lib/supabase";

export const pullTodos = async (refresh?: () => void) => {
  try {
    const { data, error } = await supabase.from("todos").select("*");

    if (error) {
      console.log("Pull error", error);
      return;
    }

    for (const todo of data) {
      // update sqlite
      db.runSync(
        `INSERT OR REPLACE INTO todos (id, name, is_completed, synced)
         VALUES (?, ?, ?, 1)`,
        [todo.id, todo.name, todo.is_completed]
      );
    }

    console.log("Pull done");

    refresh && refresh()
  } catch (err) {
    console.log("Pull crash", err);
  }
};