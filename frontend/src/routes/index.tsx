import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "../config";
import Layout from "../layout";
import Leaderboard from "../views/leaderboard";
import Research from "../views/research";
import Detail from "../views/detail";

const MainRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
          <Route path={ROUTES.RESEARCH} element={<Research />} />
          <Route path={ROUTES.DETAIL} element={<Detail />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRouter;
