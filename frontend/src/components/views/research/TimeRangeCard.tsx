import { Card, Stack, Typography } from "@mui/material";

interface propTypes {
  selectedTimeRange: string;
  onClick: () => void;
  title: string;
  type: string;
}

const TimeRangeCard = ({
  selectedTimeRange,
  onClick,
  title,
  type,
}: propTypes) => {
  return (
    <Card
      onClick={onClick}
      className={`${
        selectedTimeRange === type
          ? "border-2 border-primary !bg-primary/10"
          : "border-2 border-gray-700 !bg-white/5"
      } cursor-pointer !transition-all w-full`}
    >
      <Stack padding="6px 0px" justifyContent="center" width="100%" gap="8px">
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

export default TimeRangeCard;
