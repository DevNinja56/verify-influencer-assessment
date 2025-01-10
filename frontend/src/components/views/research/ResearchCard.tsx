import { Card, Stack, Typography } from "@mui/material";

interface propTypes {
  selectedCard: string;
  onClick: () => void;
  heading: string;
  title: string;
  type: string;
}

const ResearchCard = ({
  selectedCard,
  onClick,
  heading,
  title,
  type,
}: propTypes) => {
  return (
    <Card
      onClick={onClick}
      className={`${
        selectedCard === type
          ? "border-2 border-primary !bg-primary/10"
          : "border-2 border-gray-700 !bg-white/5"
      } cursor-pointer !transition-all`}
    >
      <Stack padding="20px 0px" justifyContent="center" width="100%" gap="8px">
        <Typography
          className="text-white"
          variant="body1"
          align="center"
          fontWeight={600}
        >
          {heading}
        </Typography>
        <Typography
          className="text-grayColor"
          variant="body2"
          align="center"
          fontWeight={500}
        >
          {title}
        </Typography>
      </Stack>
    </Card>
  );
};

export default ResearchCard;
