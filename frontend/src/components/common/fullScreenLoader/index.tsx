import React from "react";
import { Modal, CircularProgress, Box } from "@mui/material";

// Define the type for props (just open in this case)
interface FullScreenLoaderProps {
  open: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ open }) => {
  return (
    <Modal
      open={open}
      aria-labelledby="loading-modal"
      aria-describedby="loading-modal-description"
      closeAfterTransition
      disableAutoFocus
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent dark background
          backdropFilter: "blur(10px)", // Glass effect
          zIndex: 9999, // Ensure it's on top
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: "rgb(51, 208, 151)", // Custom color for the loader
          }}
        />
      </Box>
    </Modal>
  );
};

export default FullScreenLoader;
