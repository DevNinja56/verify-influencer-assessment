import { Box } from "@mui/material";
import Header from "../components/layout/header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box
      className="bg-secondary"
      display="flex"
      flexDirection="column"
      gap="40px"
      minHeight="100vh"
    >
      <Header />
      <Outlet />
    </Box>
  );
};

export default Layout;
