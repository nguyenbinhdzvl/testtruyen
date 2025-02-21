import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Components/Home';
import DetailPage from './Components/DetailPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Genre from './Components/Genre';
import Trending from './Components/Trending';
import Search from './Components/Search';


function App() {
  return (
    <Router> 
      <Routes> 
        <Route path="/" element={<Home />} /> {/* Sửa lỗi thiếu giá trị element */}
        <Route path="/comics/:slug" element={<DetailPage />} />
        <Route path="/genre/:slug" element={<Genre />} />
        <Route path="/trending/:slug" element={<Trending />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
