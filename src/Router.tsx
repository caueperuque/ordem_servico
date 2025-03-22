import { Route, Routes } from "react-router-dom";
import FormOrdemServico from "./pages/OrdemServico";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<FormOrdemServico />} />
    </Routes>
  );
};

export default Router;