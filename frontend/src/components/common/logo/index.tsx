import { Stack, Typography } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../config";

interface propTypes {
  iconSize?: string;
  fontSize?: any;
}

const Logo = ({ fontSize, iconSize }: propTypes) => {
  const navigate = useNavigate();
  return (
    <Stack
      direction="row"
      gap={1}
      onClick={() => navigate(ROUTES.LEADERBOARD)}
      className="cursor-pointer"
    >
      <ShieldOutlinedIcon
        className={`text-primary ${iconSize}`}
        fontSize="large"
      />
      <Typography
        className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent"
        variant={fontSize ?? "h5"}
        fontWeight={700}
      >
        VerifyInfluencers
      </Typography>
    </Stack>
  );
};

export default Logo;
