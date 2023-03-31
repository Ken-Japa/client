import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import {logo} from './assets'
import {Home, Opcoes, Opt} from './pages';

const App = () => {
return(
<BrowserRouter>
<header className="w-full flex justify-between items-center bg-white  px-4 py-4 border-b border-b-[#e6ebf4]">
  <Link to="/">
    <img src={logo} alt="logo" className="w-28 object-contain" />
  </Link>
  <Link to="/opcoes" className="font-inter font-medium bg-blue-500 text-white px-4 py-2 rounded-md ">Opcoes</Link>
  </header>
  
  <main className=" m:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/opcoes" element={<Opcoes />}/>
    </Routes>
  </main>


</BrowserRouter>
)
}

export default App