import { React} from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Local imports
import Navbar from './sections/Navbar';
import CTEDemo from './pages/cte/CTEDemo'
import CTEStat from './pages/cte/CTEStat'
import InvoiceDemo from './pages/invoice/InvoiceDemo';
import ImgDemo from './pages/imgLab/ImgDemo'



function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<CTEDemo />} />
          <Route path="/cte/Demo" element={<CTEDemo />} />
          <Route path="/cte/Stat" element={<CTEStat />} />
          <Route path="/imageLabelling/Training" element={<ImgDemo />} />
          <Route path="/invoiceReader/Demo" element={<InvoiceDemo />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;

