import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    async function fetchNames() {
      let { data, error } = await supabase.from("names").select("*");
      if (error) console.error("Error fetching names:", error);
      else setNames(data);
    }
    fetchNames();
  }, []);

  return (
    <div>
      <h1>Names List</h1>
      <ul>
        {names.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
