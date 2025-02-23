import { Client, Account, Databases } from 'appwrite';

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID
export const COLLECTION_ID_MESSAGES = import.meta.env.VITE_COLLECTION_ID_MESSAGES

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") 
    .setProject("67bb26870022c15ea9a1");    

export const account = new Account(client);
export const databases = new Databases(client)

export default client;