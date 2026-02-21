import { BrowserRouter,Routes,Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App(){
  return(
    <BrowserRouter>
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login/>}/>

      {/* Protected */}

      <Route  path="/"
      element={
        <Layout>
          <Home/>
        </Layout>
      
      }/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;