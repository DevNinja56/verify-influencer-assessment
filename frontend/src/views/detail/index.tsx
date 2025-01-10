import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import DetailCard from "../../components/views/detail/DetailCard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import CustomInput from "../../components/common/input";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterCard from "../../components/views/detail/FilterCard";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import FilterListIcon from "@mui/icons-material/FilterList";
import { VERIFICATION_STATUS } from "../../enums/enums";
import { CLAIMS_TYPE, INFLUENCER_DETAIL } from "../../types";
import { Dayjs } from "dayjs";
import moment from "moment";
import api from "../../service";
import { useParams } from "react-router-dom";

const Detail = () => {
  const [selectedStatuses, setSelectedStatuses] = React.useState<string>("");

  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [searchVal, setSearchVal] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [influencer, setInfluencer] = React.useState<INFLUENCER_DETAIL>();
  const [filteredData, setFilteredData] = React.useState<CLAIMS_TYPE[]>([]);

  const { id } = useParams();

  const getInfluencer = async () => {
    setLoading(true);
    const response = await api.get(`/api/influencer/${id}`);
    if (response && response.status === 200) {
      setInfluencer(response?.data?.data);
      setFilteredData(response?.data?.data?.claimStats);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getInfluencer();
  }, []);

  const handleFilterData = () => {
    const filterData = influencer?.claimStats?.filter((item) => {
      const matchesStatus = item?.verificationStatus === selectedStatuses;
      const matchesDate =
        moment(item?.createdAt).format("l") ===
        moment(selectedDate?.toDate()).format("l");
      const matchesSearch = item?.content
        ?.toLowerCase()
        ?.includes(searchVal.toLowerCase());

      const isStatusValid = selectedStatuses ? matchesStatus : true;
      const isDateValid = selectedDate ? matchesDate : true;
      const isSearchValid = searchVal !== "" ? matchesSearch : true;

      return isStatusValid && isDateValid && isSearchValid;
    });

    setFilteredData(filterData as any);
  };

  return loading ? (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress size="24px" color="primary" />
    </Box>
  ) : (
    <Container maxWidth="lg">
      <Stack gap={4} mb={5}>
        <Stack flexDirection="row" alignItems="center" gap={2}>
          <img
            src="https://picsum.photos/200/300"
            className="h-20 w-20 rounded-full"
          />
          <Typography className="text-white" variant="h5" fontWeight={700}>
            {influencer?.name && influencer?.name !== "" && influencer?.name}
          </Typography>
        </Stack>
        <Grid container padding="0" gap={3.2}>
          <Grid item xs={2.8}>
            <DetailCard
              title="Trust Score"
              percentage={
                influencer?.trustScore && influencer?.trustScore + "%"
              }
              description="Based on 127 verified claims"
              Icon={<TrendingUpIcon className="text-primary" />}
            />
          </Grid>
          <Grid item xs={2.8}>
            <DetailCard
              title="Yearly Revenue"
              percentage={"--"}
              description="Estimated earning"
              Icon={<AttachMoneyIcon className="text-primary" />}
            />
          </Grid>
          <Grid item xs={2.8}>
            <DetailCard
              title="Products"
              percentage={"--"}
              description="Recommended products"
              Icon={<LocalMallOutlinedIcon className="text-primary" />}
            />
          </Grid>
          <Grid item xs={2.8}>
            <DetailCard
              title="Followers"
              percentage={
                influencer?.followersCount && influencer?.followersCount + "+"
              }
              description="Total Following"
              Icon={<TrendingUpIcon className="text-primary" />}
            />
          </Grid>
        </Grid>
        <Box width="100%">
          <Box sx={{ borderBottom: 2, borderColor: "#1C2432" }} mb={3}>
            <Tabs
              aria-label="basic tabs example"
              textColor="inherit"
              className="border-b-2 border-primary w-fit"
              value={0}
              sx={{
                "& .css-1qltlow-MuiTabs-indicator": {
                  background: "none",
                },
              }}
            >
              <Tab
                className="!text-primary !font-semibold !border-b-4 !border-primary !capitalize"
                label="Claim Analysis"
                value={0}
              />
            </Tabs>
          </Box>
          <Box
            padding="28px"
            borderRadius="8px"
            className="bg-white/5 border-2 border-gray-700"
            mb={4}
          >
            <Stack gap={4}>
              <CustomInput
                placeHolder="Search Claims"
                StartIcon={<SearchIcon className="text-grayColor" />}
                onChange={(e) => setSearchVal(e?.target?.value)}
              />
              <Stack flexDirection="row" gap={4}>
                <Stack gap={1.5}>
                  <Typography
                    className="text-grayColor"
                    variant="body2"
                    fontWeight={700}
                  >
                    Verification Status
                  </Typography>
                  <Stack flexDirection="row" gap={1.5}>
                    {VERIFICATION_STATUS &&
                      Object.values(VERIFICATION_STATUS)?.length > 0 &&
                      Object.values(VERIFICATION_STATUS)?.map((item, index) => (
                        <Button
                          key={"tab--" + item + index}
                          onClick={() => setSelectedStatuses(item)}
                          variant="contained"
                          className={`${
                            selectedStatuses === item
                              ? "!bg-primary"
                              : "!bg-white/5 hover:!bg-white/30"
                          } !text-white !cursor-pointer !capitalize !rounded-lg`}
                        >
                          {item}
                        </Button>
                      ))}
                  </Stack>
                </Stack>
                <Stack gap={1.5}>
                  <Typography
                    className="text-grayColor"
                    variant="body2"
                    fontWeight={700}
                  >
                    Sort By
                  </Typography>
                  <Stack flexDirection="row" gap={2} alignItems={"center"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
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
                          "& .css-1umw9bq-MuiSvgIcon-root": {
                            color: "#828995",
                          },
                          "& .css-1dune0f-MuiInputBase-input-MuiOutlinedInput-input":
                            {
                              padding: "6px 14px",
                            },
                          "& .css-5wchs2-MuiDateCalendar-root": {
                            backgroundColor: "red !important",
                          },
                        }}
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                      />
                    </LocalizationProvider>
                    <FilterListIcon
                      onClick={() => handleFilterData()}
                      className="bg-secondary hover:bg-secondary/70 p-2 !text-4xl text-grayColor rounded-md cursor-pointer border-2 border-gray-700"
                    />
                  </Stack>
                </Stack>
              </Stack>
              <Stack flexDirection="row" gap={1} alignItems="center">
                <FilterAltOutlinedIcon className="text-grayColor" />
                <Typography
                  className="text-grayColor"
                  variant="body2"
                  fontWeight={700}
                >
                  Active Filters:
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Typography
            className="text-grayColor"
            variant="body2"
            fontWeight={700}
            mb={4}
          >
            Showing {filteredData?.length ?? "0"} claims
          </Typography>
          <Stack gap={3}>
            {filteredData &&
              filteredData?.length > 0 &&
              filteredData?.map((item, index) => (
                <FilterCard
                  item={item}
                  key={"claims--" + item?.content + item?._id}
                  index={index}
                  length={filteredData?.length - 1}
                />
              ))}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Detail;
