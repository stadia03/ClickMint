import { Link } from "react-router-dom";
import { useUserStore } from "../store";

const Navbar = () => {
  function handleLogout(){
    localStorage.removeItem('token');
    useUserStore.getState().setAuth(false);
  }
  return (
    <nav className="bg-black  text-white px-6 py-4 flex items-center justify-between ">
      {/* Logo */}
      <div className="flex items-center ">
         <img className="h-16 mx-2" src="./assets/logo.png" alt="Logo" />
      <div className="text-4xl font-semibold">
        <span className="text-white">Click</span>
        <span className="text-purple-500">Mint</span>
        <span className="text-slate-400 text-xl mx-1">V{import.meta.env.VITE_VERSION}</span>
      </div> 
      </div>
    
      
      {/* Navigation Links */}
      <div className="flex space-x-6 text-xl">
        <Link to="/home" className="hover:text-purple-400 transition-colors">
          Home
        </Link>
        <Link to="/tasks" className="hover:text-purple-400 transition-colors">
          View Tasks
        </Link>
      </div>
      
      {/* Buttons */}
      <div className="flex items-center space-x-4 gap-2">
      <button onClick={()=>{
          alert(`USER ADDRESS: ${localStorage.getItem("userAddress")}`);
        }} className="bg-purple-500 hover:bg-purple-600 text-white text-xl px-5 py-3 rounded-md transition">
          USER
        </button>
        <div onClick={handleLogout} className="my-6 bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-purple-800 ">
       <img src="./assets/logout.png" className="h-8 pl-1 "></img>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
