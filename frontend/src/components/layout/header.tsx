import { Box, Container, Stack } from "@mui/material";
import HeaderButton from "./headerButton";
import { ROUTES } from "../../config";
import Logo from "../common/logo";

const Header = () => {
  return (
    <Box
      width="100%"
      position="sticky"
      top="0"
      padding="16px 0px"
      className="border-b-2 border-gray-100/10 backdrop-blur-sm z-50"
    >
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between">
          <Logo />
          <Stack direction="row" gap={5}>
            <HeaderButton title="Leaderboard" path={ROUTES.LEADERBOARD} />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Header;
