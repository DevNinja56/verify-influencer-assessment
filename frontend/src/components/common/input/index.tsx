import {
  InputAdornment,
  Stack,
  TextareaAutosize,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import React from "react";

type CustomInputProps = TextFieldProps & {
  fieldLabel?: string;
  placeHolder?: string;
  StartIcon?: React.ReactElement;
  type?: string;
  isTextArea?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomInput: React.FC<CustomInputProps> = ({
  fieldLabel,
  placeHolder,
  StartIcon,
  type,
  isTextArea = false,
  onChange,
  ...rest
}) => {
  return (
    <Stack gap={1}>
      {fieldLabel && (
        <Typography className="text-white" fontWeight={600}>
          {fieldLabel}
        </Typography>
      )}

      {isTextArea ? (
        <TextareaAutosize
          onChange={onChange}
          placeholder={placeHolder}
          className="bg-secondary !text-white py-2 px-3 rounded-md w-full border border-grayColor bg-transparent"
          minRows={3}
        />
      ) : (
        <TextField
          {...rest}
          onChange={onChange}
          size="small"
          type={type}
          placeholder={placeHolder}
          variant="outlined"
          className="bg-secondary !text-white"
          slotProps={{
            input: {
              startAdornment: StartIcon ? (
                <InputAdornment position="start">{StartIcon}</InputAdornment>
              ) : null,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#828995",
              },
              "&:hover fieldset": {
                borderColor: "#828995",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#828995",
              },
            },
            "& .MuiInputBase-input": {
              color: "#fff",
            },
          }}
        />
      )}
    </Stack>
  );
};

export default CustomInput;
