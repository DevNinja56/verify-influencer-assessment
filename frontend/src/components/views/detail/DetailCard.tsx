import { Card, Stack, Typography } from "@mui/material";

interface propTypes {
  title: string;
  percentage: any;
  description: string;
  Icon: React.ReactElement;
}

const DetailCard = ({ percentage, title, description, Icon }: propTypes) => {
  return (
    <Card className="border-2 border-gray-700 !bg-white/5">
      <Stack
        direction="row"
        padding="24px 20px"
        alignItems="start"
        justifyContent="space-between"
        gap="12px"
      >
        <Stack gap={1.4}>
          <Typography variant="body1" className="text-white" fontWeight={700}>
            {title}
          </Typography>
          <Stack gap={1}>
            <Typography variant="h4" className="text-primary" fontWeight={700}>
              {percentage}
            </Typography>
            <Typography variant="body2" className="text-grayColor">
              {description}
            </Typography>
          </Stack>
        </Stack>
        {Icon}
      </Stack>
    </Card>
  );
};

export default DetailCard;
