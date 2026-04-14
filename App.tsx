import "react-native-get-random-values";
import NetInfo from "@react-native-community/netinfo";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { db, initDB } from "./src/lib/db";
import { v4 as uuidv4 } from "uuid";
import { startNetworkListener } from "./src/services/network";
import { syncTodos } from "./src/services/sync";

export default function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // get from SQLite
  const getTodos = () => {
    const data = db.getAllSync("SELECT * FROM todos");
    setTodos(data || []);
  };

  useEffect(() => {
    initDB();
    getTodos();
    startNetworkListener()
    syncTodos()
  }, []);

  // add (offline)
  const addTodo = async () => {
    if (!input) return;

    const id = uuidv4();

    db.runSync(
      "INSERT INTO todos (id, name, synced) VALUES (?, ?, ?)",
      [id, input, 0]
    );

    setInput("");
    getTodos();

    // sync if add in online mode
    const state = await NetInfo.fetch();
    if (state.isConnected){syncTodos()}
  };

  // update (offline)
  const updateTodo = async (id: string) => {
    if (editValue.trim().length === 0) return;

    db.runSync(
      "UPDATE todos SET name = ?, synced = 0 WHERE id = ?",
      [editValue, id]
    );

    setEditingId(null);
    setEditValue("");
    getTodos();

    // sync if edit in online mode
    const state = await NetInfo.fetch();
    if (state.isConnected){syncTodos()}
  };

  // delete (offline)
  const deleteTodo = (id: string) => {
    db.runSync("DELETE FROM todos WHERE id = ?", [id]);
    getTodos();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ marginTop: 20 }}>Todo App (Offline)</Text>

      <TextInput
        placeholder="Enter todo..."
        value={input}
        onChangeText={setInput}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />

      <Button title="Add Todo" onPress={addTodo} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
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

                  <Button
                    title="Delete"
                    onPress={() => deleteTodo(item.id)}
                  />
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}