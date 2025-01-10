import React from "react";
import { Badge, Card, Stack, TextField } from "@mui/material";

interface propTypes {
  selectedJournals: string[];
  onClick: () => void;
  type: string;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

const AddJournalCard: React.FC<propTypes> = ({
  selectedJournals,
  onClick,
  type,
  onChange,
}) => {
  return (
    <Card
      className={`${
        selectedJournals.includes(type)
          ? "border-2 border-primary !bg-primary/10"
          : "border-2 border-gray-700 !bg-white/5"
      } !transition-all w-full`}
    >
      <Stack
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        gap="8px"
        flexDirection="row"
        padding="0px 20px 0px 0px"
      >
        <TextField
          onChange={onChange}
          size="small"
          type={type}
          variant="outlined"
          placeholder="Enter Journal"
          className="bg-transparent !text-white !p-0 w-full"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
            "& .MuiInputBase-input": {
              color: "#fff",
            },
          }}
        />
        <Badge
          onClick={onClick}
          variant="dot"
          color="success"
          sx={{
            "& .MuiBadge-dot": {
              height: "14px",
              width: "14px",
              borderRadius: "50%",
              backgroundColor: selectedJournals.includes(type)
                ? "#29a077"
                : "#9ca3af",
              cursor: "pointer",
            },
          }}
        ></Badge>
      </Stack>
    </Card>
  );
};

export default AddJournalCard;
