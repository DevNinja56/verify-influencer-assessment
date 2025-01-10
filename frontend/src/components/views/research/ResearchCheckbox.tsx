import { Stack, Switch, Typography } from "@mui/material";

interface propTypes {
  title: string;
  heading: string;
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}

const ResearchCheckbox = ({
  title,
  heading,
  isChecked,
  setIsChecked,
}: propTypes) => {
  return (
    <Stack
      width="100%"
      alignItems="center"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Stack gap={1}>
        <Typography className="text-white" fontWeight={600}>
          {heading}
        </Typography>
        <Typography variant="body2" className="text-grayColor">
          {title}
        </Typography>
      </Stack>
      <Switch
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#29a077",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#29a077",
          },
          "& .MuiSwitch-track": {
            backgroundColor: "#29a077",
          },
        }}
      />
    </Stack>
  );
};

export default ResearchCheckbox;
