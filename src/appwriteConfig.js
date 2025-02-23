import { Client, Account, Databases } from 'appwrite';


export const DATABASE_ID = "67bb288b0026aaa25528"
export const COLLECTION_ID_MESSAGES = "67bb28a9001a2c1f48ef"

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") 
    .setProject("67bb26870022c15ea9a1");    

export const account = new Account(client);
export const databases = new Databases(client)

export default client;