import logo from "./logo.svg";
import "./App.css";
import { HashRouter } from "react-router-dom";
import RoutesFile from "./Routes/RoutesFile";

function App() {
  return (
    <HashRouter>
      <RoutesFile />
    </HashRouter>
  );
}

export default App;
