import { Box, Container, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ResearchContainer from "../../components/views/research/ResearchContainer";

const Research = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Stack
        direction="row"
        gap={2}
        mb={2}
        alignItems="center"
        marginBottom={4}
      >
        <Stack
          direction="row"
          gap={1}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
          alignItems="center"
        >
          <ArrowBackIcon className="text-primary" />
          <Typography className="text-primary" fontWeight={700}>
            Back
          </Typography>
        </Stack>
        <Typography className="text-white" variant="h5" fontWeight={700}>
          Research Tasks
        </Typography>
      </Stack>
      <Box
        padding="28px"
        borderRadius="8px"
        className="bg-white/5 border-2 border-gray-700"
        mb={4}
      >
        <Typography className="text-white" variant="h6" fontWeight={700} mb={4}>
          Research Configuration
        </Typography>
        <ResearchContainer />
      </Box>
    </Container>
  );
};

export default Research;
