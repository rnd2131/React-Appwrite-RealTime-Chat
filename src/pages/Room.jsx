import React, {useState, useEffect} from 'react'
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig'
import { ID, Query, Permission, Role} from 'appwrite';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';
import {Trash2} from 'react-feather'


const Room = () => {
    const [messageBody, setMessageBody] = useState('')
    const [messages, setMessages] = useState([])
    const {user} = useAuth()


    useEffect(() => {
        getMessages();
      
        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {

            if(response.events.includes("databases.*.collections.*.documents.*.create")){
                console.log('A MESSAGE WAS CREATED')
                setMessages(prevState => [response.payload, ...prevState])
            }

            if(response.events.includes("databases.*.collections.*.documents.*.delete")){
                console.log('A MESSAGE WAS DELETED!!!')
                setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
            }
        });

        console.log('unsubscribe:', unsubscribe)
      
        return () => {
          unsubscribe();
        };
      }, []);


    const getMessages = async () => {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(100),
            ]
        )
        console.log(response.documents)
        setMessages(response.documents)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('MESSAGE:', messageBody)

        const permissions = [
            Permission.write(Role.user(user.$id)),
          ]

        const payload = {
            user_id:user.$id,
            username:user.name,
            body:messageBody
        }

        const response = await databases.createDocument(
                DATABASE_ID, 
                COLLECTION_ID_MESSAGES, 
                ID.unique(), 
                payload,
                permissions
            )

        console.log('RESPONSE:', response)

        // setMessages(prevState => [response, ...prevState])

        setMessageBody('')

    }

    const deleteMessage = async (id) => {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id);
        //setMessages(prevState => prevState.filter(message => message.$id !== message_id))
     } 

return (
    <main className="container">
            
            <Header/>
            <div className="room--container">

            <div style={{display: 'flex', flexDirection: 'column-reverse',position: 'fixed', top: '50px',left:'20px', width: '70%'}}>
                    {messages.map(message => (
                            <div key={message.$id} className={"message--wrapper"}>
                                    <div className="message--header">
                                            <p> 
                                                    {message?.username ? (
                                                            <span> {message?.username}</span>
                                                    ): (
                                                            'Anonymous user'
                                                    )}
                                             
                                                    <small className="message-timestamp"> {new Date(message.$createdAt).toLocaleString()}</small>
                                            </p>

                                            {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                                                    <Trash2 className="delete--btn" onClick={() => {deleteMessage(message.$id)}}/>
                                                    
                                            )}
                                    </div>

                                    <div className={"message--body" + (message.user_id === user.$id ? ' message--body--owner' : '')}>
                                            <span>{message.body}</span>
                                            
                                    </div>
                                            
                    
                            </div>
                    ))}
            </div>
            <form id="message--form" onSubmit={handleSubmit} style={{width: '100dvw'}}>
                    <div>
                            <textarea 
                                    required 
                                    maxLength="250"
                                    style={{resize:'none', marginRight: '65dvw', height: '55px'}}
                                    placeholder="Say something..." 
                                    onChange={(e) => {setMessageBody(e.target.value)}}
                                    value={messageBody}
                                    ></textarea>
                    </div>

                    <div className="send-btn--wrapper" style={{position: 'relative', right: '10px', padding: '10px',height: '55px', width: '70px' ,borderRadius: '10px' ,backgroundColor: '#0088cc', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <input className="btn btn--secondary" type="submit" value="send"/>
                    </div>
            </form>
            </div>
    </main>
)
}

export default Room
