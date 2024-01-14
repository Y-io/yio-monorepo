import { useState } from "react";
import { Button } from "@yio/ui";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Button>测试一下</Button>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
