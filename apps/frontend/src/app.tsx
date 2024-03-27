import './app.css';
import useStuff from './hooks/use-stuff';

function App() {
  const { stuff, addNewThing, error, isLoading } = useStuff();

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
