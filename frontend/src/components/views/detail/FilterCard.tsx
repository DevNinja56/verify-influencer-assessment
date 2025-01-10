import { Chip, Divider, Stack, Typography } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { CLAIMS_TYPE } from "../../../types";
import { VERIFICATION_STATUS } from "../../../enums/enums";
import moment from "moment";

interface propTypes {
  item: CLAIMS_TYPE;
  index: number;
  length: number;
}

const FilterCard = ({ item, index, length }: propTypes) => {
  return (
    <Stack gap={5}>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack gap={1.5}>
          <Stack flexDirection="row" alignItems="center" gap={2}>
            <Chip
              label={
                item?.verificationStatus && item?.verificationStatus !== ""
                  ? item?.verificationStatus
                  : "--"
              }
              variant="filled"
              className={`${
                VERIFICATION_STATUS.VERIFIED === item?.verificationStatus
                  ? "!bg-primary/40 !text-primary"
                  : VERIFICATION_STATUS.QUESTIONABLE ===
                    item?.verificationStatus
                  ? "!bg-yellow-500/40 !text-yellow-500"
                  : "!bg-red-400/40 !text-red-400"
              }  font-bold !cursor-pointer`}
            />
            <Stack flexDirection="row" alignItems="center" gap={1}>
              <CalendarTodayOutlinedIcon className="text-grayColor !text-base" />
              <Typography className="text-grayColor" variant="body2">
                {item?.createdAt && item?.createdAt !== ""
                  ? moment(item?.createdAt).format("l")
                  : "--"}
              </Typography>
            </Stack>
          </Stack>
          <Typography className="text-white" variant="body1" fontWeight={600}>
            {item?.content && item?.content !== "" ? item?.content : "--"}
          </Typography>
          <Stack
            flexDirection="row"
            alignItems="center"
            gap={1}
            className="cursor-pointer"
          >
            <Typography
              className="text-primary"
              variant="body2"
              fontWeight={600}
            >
              View Source
            </Typography>
            <OpenInNewOutlinedIcon className="text-primary !text-base" />
          </Stack>
        </Stack>
        <Stack gap={1} alignItems="end">
          <Typography
            className={
              item?.confidenceScore >= 80
                ? "text-primary"
                : item?.confidenceScore >= 50
                ? "text-yellow-500"
                : "text-red-400"
            }
            variant="h6"
            fontWeight={600}
          >
            {item?.confidenceScore ? item?.confidenceScore + "%" : "--"}
          </Typography>
          <Typography className="text-grayColor" variant="body2">
            Total Score
          </Typography>
        </Stack>
      </Stack>
      <Stack gap={1.5}>
        <Stack flexDirection="row" alignItems="center" gap={1}>
          <LanguageOutlinedIcon className="text-primary !text-base" />
          <Typography className="text-white" variant="body2" fontWeight={600}>
            All Analysis
          </Typography>
        </Stack>
        <Typography className="text-grayColor" variant="body2">
          Viewing sunlight within 30-60 minutes of waking enhances critical
          release
        </Typography>
        <Stack
          flexDirection="row"
          alignItems="center"
          gap={1}
          className="cursor-pointer"
        >
          <Typography className="text-primary" variant="body2" fontWeight={600}>
            View Research
          </Typography>
          <OpenInNewOutlinedIcon className="text-primary !text-base" />
        </Stack>
      </Stack>
      {index !== length && <Divider className="!border-2 !border-gray-700" />}
    </Stack>
  );
};

export default FilterCard;
