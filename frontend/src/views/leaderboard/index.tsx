import {
  Button,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import LeaderboardCard from "../../components/common/card";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import SignalCellularAltOutlinedIcon from "@mui/icons-material/SignalCellularAltOutlined";
import CustomTable from "../../components/common/table";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { LEADERBOARDS_TAB } from "../../enums/enums";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import React, { useState } from "react";
import api from "../../service";
import { ANALYTICS_TYPE, CLAIM_STATS, INFLUENCER_TYPE } from "../../types";
import toast from "react-hot-toast";

const Leaderboard = () => {
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = React.useState<null | HTMLElement>(
    null
  );
  const open = Boolean(openDropdown);
  const [allInfluencer, setAllInfluencer] = React.useState<INFLUENCER_TYPE[]>();
  const [analytics, setAnalytics] = React.useState<ANALYTICS_TYPE>();
  const [loading, setLoading] = useState<boolean>(false);

  const getAllInfluencer = async () => {
    setLoading(true);
    try {
      const [influencerResponse, analyticsResponse] = await Promise.all([
        api.get("/api/influencer"),
        api.get("/api/influencer/analytics"),
      ]);

      if (influencerResponse?.status === 200) {
        setAllInfluencer(influencerResponse?.data?.data);
      }

      if (analyticsResponse?.status === 200) {
        setAnalytics(analyticsResponse?.data?.data);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast?.error(error.message);
      } else {
        toast?.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllInfluencer();
  }, []);

  const columns = [
    {
      field: "rank",
      headerName: "Rank",
      renderCell: (params: { value: string; row: INFLUENCER_TYPE }) => {
        const findIndex = allInfluencer?.findIndex(
          (item) => item.id === params?.row?.id
        );

        return (
          <>
            <Typography
              variant="body2"
              className="text-white h-full flex items-center"
            >
              #{(findIndex !== undefined ? findIndex + 1 : "")}
            </Typography>
          </>
        );
      },
    },
    {
      field: "name",
      headerName: "INFLUENCER",
      renderCell: (params: { value: string }) => (
        <Typography
          variant="body2"
          className="text-white h-full flex items-center"
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "category",
      headerName: "CATEGORY",
      renderCell: () => (
        <Typography
          variant="body2"
          className="text-white h-full flex items-center capitalize"
        >
          Medicine
        </Typography>
      ),
    },
    {
      field: "trend",
      headerName: "TREND",
      renderCell: (params: { value: number; row: INFLUENCER_TYPE }) => (
        <Typography
          variant="body2"
          fontWeight={700}
          className={`h-full flex items-center ${
            params?.row?.trustScore >= 90 ? "text-primary" : "text-red-500"
          }`}
        >
          {params?.row?.trustScore >= 90 ? (
            <TrendingUpIcon />
          ) : (
            <TrendingDownIcon />
          )}
        </Typography>
      ),
    },
    {
      field: "trustScore",
      headerName: "TRUST SCORE",
      renderCell: (params: { value: number }) => (
        <Typography
          variant="body2"
          fontWeight={700}
          className={`h-full flex items-center ${
            params?.value >= 90 ? "text-primary" : "text-yellow-500"
          }`}
        >
          {params?.value}%
        </Typography>
      ),
    },
    {
      field: "followerCount",
      headerName: "FOLLOWERS",
      renderCell: (params: { value: string }) => (
        <Typography
          variant="body2"
          className="text-white h-full flex items-center"
        >
          {params.value}+
        </Typography>
      ),
    },
    {
      field: "claimStats",
      headerName: "VERIFIED CLAIMS",
      renderCell: (params: { value: CLAIM_STATS }) => (
        <Typography
          variant="body2"
          className="text-white h-full flex items-center"
        >
          {params?.value?.verifiedClaims}
        </Typography>
      ),
    },
    {
      field: "id",
      headerName: "Options",
      renderCell: (param: { value: string }) => (
        <>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => setOpenDropdown(event.currentTarget)}
          >
            <GridMoreVertIcon className="text-white" />
          </IconButton>
          <Menu
            sx={{
              "& .css-1tktgsa-MuiPaper-root-MuiPopover-paper-MuiMenu-paper": {
                backgroundColor: "#101827",
              },
            }}
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={openDropdown}
            open={open}
            onClose={() => setOpenDropdown(null)}
            slotProps={{
              paper: {
                style: {
                  width: "20ch",
                },
              },
            }}
          >
            <MenuItem
              className="!text-grayColor"
              key="detail"
              onClick={() => {
                navigate({
                  pathname: ROUTES.DETAIL,
                  search: param?.value.toString(),
                });
                setOpenDropdown(null);
              }}
            >
              Detail
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Stack spacing={4} mb={2}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={600} className="text-white">
            Influencer Trust Leaderboard
          </Typography>
          <Typography fontWeight={400} className="text-grayColor" width="68%">
            Real-time ranking of health influencers bases on scientific
            accuracy, credibility, and transparency. Updated daily using
            AI-powered analysis.
          </Typography>
        </Stack>
        <Grid container padding="0" gap={3.6}>
          <Grid item xs={3.8}>
            <LeaderboardCard
              Icon={
                <PeopleAltOutlinedIcon
                  className="text-primary"
                  fontSize="large"
                />
              }
              number={
                analytics?.activeInfluencers
                  ? analytics?.activeInfluencers
                  : "--"
              }
              title="Active Influencers"
              loading={loading}
            />
          </Grid>
          <Grid item xs={3.8}>
            <LeaderboardCard
              Icon={
                <CheckCircleOutlineOutlinedIcon
                  className="text-primary"
                  fontSize="large"
                />
              }
              number={
                analytics?.verifiedClaims ? analytics?.verifiedClaims : "--"
              }
              title="Claims Verified"
              loading={loading}
            />
          </Grid>
          <Grid item xs={3.8}>
            <LeaderboardCard
              Icon={
                <SignalCellularAltOutlinedIcon
                  className="text-primary"
                  fontSize="large"
                />
              }
              number={
                analytics?.averageTrustScore
                  ? Math.floor(analytics?.averageTrustScore)
                  : "--"
              }
              title="Average Trust Score"
              loading={loading}
            />
          </Grid>
        </Grid>
        <CustomTable
          loading={loading}
          columns={columns}
          rows={allInfluencer ?? []}
          tabs={LEADERBOARDS_TAB}
          filterKey="category"
          sortKey="rank"
          headerButton={
            <Button
              onClick={() => navigate(ROUTES.RESEARCH)}
              variant="contained"
              size="small"
              className="!bg-white/5 hover:!bg-primary !text-white !text-sm !capitalize"
              startIcon={<AddIcon />}
            >
              Add new
            </Button>
          }
        />
      </Stack>
    </Container>
  );
};

export default Leaderboard;
