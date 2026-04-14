import NetInfo from "@react-native-community/netinfo";
import { syncTodos } from "./sync";

export const startNetworkListener = () => {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      console.log("Online is syncing...");
      syncTodos();
    }
  });
};