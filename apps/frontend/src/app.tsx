import { useEffect, useRef, useState } from 'react';
import './app.css';
import useStuff from './hooks/use-stuff';
import { Socket, io } from 'socket.io-client';

function App() {
  const { stuff, addNewThing, error, isLoading } = useStuff();
  const [messages, setMessages] = useState<{ user: string; message: string }[]>(
    [],
  );

  const [message, setMessage] = useState('');
  const socketRef = useRef<Socket>(null!);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);

    socket.on('ping', () => {
      console.log('pong!');
    });

    socket.on('message', (id: string, message: string) => {
      setMessages((m) => [...m, { user: id, message }]);
    });

    socketRef.current = socket;

    // cleanup function: disconnect socket
    return () => {
      socket.disconnect();
    };
  }, [setMessages]);

  return (
    <>
      <div className="card">
        <button type="button" onClick={addNewThing}>
          Hello, backend!
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <input
          type="text"
          onChange={(evt) => setMessage(evt.target.value)}
          value={message}
        />
        <button
          type="button"
          onClick={() => {
            socketRef.current.emit('message', message);
          }}
        >
          Send!
        </button>
        <ul>
          {messages.map(({ user, message }) => (
            <li key={`${user}-${message}`}>
              {user}: {message}
            </li>
          ))}
        </ul>
      </div>
      <ul>
        {error && <div>Something went wrong</div>}
        {isLoading && <div>Loading...</div>}
        {stuff &&
          Object.entries(stuff.things).map(([key, value]) => (
            <li key={key}>
              key: {key}, value: {value}
            </li>
          ))}
      </ul>
    </>
  );
}

export default App;
