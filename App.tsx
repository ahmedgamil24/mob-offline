import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { supabase } from "./src/lib/supabase";

export default function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // get
  const getTodos = async () => {
    const { data } = await supabase.from("todos").select();
    setTodos(data || []);
  };

  useEffect(() => {
    getTodos();
  }, []);

  // add
  const addTodo = async () => {
    if (!input) return;

    await supabase.from("todos").insert([{ name: input }]);

    setInput("");
    getTodos(); // refresh
  };

  // update
  const updateTodo = async (id: string) => {
    if (editValue.trim().length === 0) return;

    await supabase.from("todos").update({ name: editValue }).eq("id", id);

    setEditingId(null);
    setEditValue("");
    getTodos();
  };

  // delete
  const deleteTodo = async (id: string) => {
    await supabase.from("todos").delete().eq("id", id);

    getTodos();
  };

  console.log(todos);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ marginTop: 20 }}>Todo App</Text>

      <TextInput
        placeholder="Enter todo..."
        value={input}
        onChangeText={setInput}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />

      <Button title="Add Todo" onPress={addTodo} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 12,
              padding: 10,
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            {editingId === item.id ? (
              <>
                <TextInput
                  value={editValue}
                  onChangeText={setEditValue}
                  style={{ borderWidth: 1, padding: 6, marginBottom: 8 }}
                />

                <Button title="Save" onPress={() => updateTodo(item.id)} />

                <Button title="Cancel" onPress={() => setEditingId(null)} />
              </>
            ) : (
              <>
                <Text style={{ marginBottom: 8 }}>{item.name}</Text>

                <View style={{ flexDirection: "column", gap: 10 }}>
                  <Button
                    title="Edit"
                    onPress={() => {
                      setEditingId(item.id);
                      setEditValue(item.name);
                    }}
                  />

                  <Button title="Delete" onPress={() => deleteTodo(item.id)} />
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}
