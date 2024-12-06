import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import QuoteListPage from "./Pages/QuoteListPage";
import CreateQuotePage from "./Pages/CreateQuotePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/quotes" element={<QuoteListPage />} />
        <Route path="/create-quote" element={<CreateQuotePage />} />
      </Routes>
    </Router>
  );
}

export default App;
