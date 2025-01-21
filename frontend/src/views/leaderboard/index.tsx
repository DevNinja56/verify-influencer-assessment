import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import LeaderboardCard from "../../components/common/card";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import SignalCellularAltOutlinedIcon from "@mui/icons-material/SignalCellularAltOutlined";
import CustomTable, { Tab } from "../../components/common/table";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config";
import React, { useState } from "react";
import api from "../../service";
import { ANALYTICS_TYPE, INFLUENCER_TYPE } from "../../types";
import toast from "react-hot-toast";
import { formatNumber } from "../../utils/formatNumber";

const Leaderboard = () => {
  const navigate = useNavigate();

  const [allInfluencer, setAllInfluencer] = React.useState<INFLUENCER_TYPE[]>();
  const [analytics, setAnalytics] = React.useState<ANALYTICS_TYPE>();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Tab[]>([]);

  const getAllInfluencer = async () => {
    setLoading(true);
    try {
      const [influencerResponse, analyticsResponse, categoriesResponse] =
        await Promise.all([
          api.get("/api/influencer"),
          api.get("/api/influencer/analytics"),
          api.get("/api/categories"),
        ]);

      if (influencerResponse?.status === 200) {
        setAllInfluencer(influencerResponse?.data?.data);
      }

      if (analyticsResponse?.status === 200) {
        setAnalytics(analyticsResponse?.data?.data);
      }

      if (categoriesResponse?.status === 200) {
        setCategories(
          categoriesResponse?.data?.data?.map(
            (cat: { categoryName: string; id: string }) => {
              return { label: cat.categoryName, value: cat.categoryName };
            }
          )
        );
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
              #{findIndex !== undefined ? findIndex + 1 : ""}
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
      field: "influencerCategory",
      headerName: "CATEGORY",
      renderCell: (params: { value: number }) => (
        <Typography
          variant="body2"
          className="text-white h-full flex items-center capitalize"
        >
          {params.value}
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
          {params?.value.toFixed(2)}%
        </Typography>
      ),
    },
    {
      field: "followerCount",
      headerName: "FOLLOWERS",
      renderCell: (params: { value: number }) => (
        <Typography
          variant="body2"
          className="text-white h-full flex items-center"
        >
          {formatNumber(params?.value || 0)}+
        </Typography>
      ),
    },
    {
      field: "verifiedClaims",
      headerName: "VERIFIED CLAIMS",
      renderCell: (params: { value: number }) => (
        <Typography
          variant="body2"
          className="text-white h-full flex items-center"
        >
          {params?.value}
        </Typography>
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
          tabs={categories}
          filterKey="influencerCategory"
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
