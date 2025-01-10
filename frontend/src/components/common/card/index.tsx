import { Card, CircularProgress, Stack, Typography } from "@mui/material";

interface propTypes {
  Icon: React.ReactElement;
  title: string;
  number: string | number;
  loading: boolean;
}

const StatsCard = ({ Icon, title, number, loading }: propTypes) => {
  return (
    <Card className="border-2 border-gray-700 !bg-white/5">
      <Stack direction="row" padding="20px" alignItems="center" gap="12px">
        {loading ? (
          <CircularProgress size="16px" color="primary" />
        ) : (
          <>
            {Icon}
            <Stack>
              <Typography variant="h5" className="text-white" fontWeight={700}>
                {number}
              </Typography>
              <Typography variant="body2" className="text-grayColor">
                {title}
              </Typography>
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default StatsCard;
