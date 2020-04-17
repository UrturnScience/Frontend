import * as firebase from "firebase";
import Axios from "axios";
import { BACKEND_URL } from 'react-native-dotenv';

const httpUrl = "http://127.0.0.1:3000";
const wsUrl = "ws://127.0.0.1:3000";

export async function getRoomMessages(roomId) {
  const res = await Axios.get(`${httpUrl}/message/room/${roomId}`);
  return res.data.messages;
}

export async function getUserRoom(userId) {
  const res = await Axios.get(`${httpUrl}/roomuser/user/${userId}`);
  return res.data.roomUsers && res.data.roomUsers[0];
}

export async function joinRoom(userId, roomId) {
  const roomUser = await Axios.post(
    `${httpUrl}/roomuser/add/${roomId}/${userId}`
  );
  return roomUser;
}

export async function createAndJoinRoom(userId) {
  const roomRes = await Axios.post(`${httpUrl}/room/create`);
  const roomId = roomRes.data.room._id;
  await joinRoom(userId, roomId);
  return roomId;
}

export { httpUrl, wsUrl };