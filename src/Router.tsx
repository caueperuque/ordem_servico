import { Route, Routes } from "react-router-dom";
import { OrdemServico } from "./pages/OrdemServico";
import { DefaultLayout } from "./DefaultLayout";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<OrdemServico />} />
      </Route>
    </Routes>
  );
};

export default Router;
