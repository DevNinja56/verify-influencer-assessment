import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ResearchCard from "./ResearchCard";
import CustomInput from "../../../components/common/input";
import TimeRangeCard from "./TimeRangeCard";
import ResearchCheckbox from "./ResearchCheckbox";
import AddIcon from "@mui/icons-material/Add";
import AddJournalCard from "./AddJournalCard";
import toast from "react-hot-toast";
import api from "../../../service";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../config";
import FullScreenLoader from "../../../components/common/fullScreenLoader";

const ResearchContainer = () => {
  const navigate = useNavigate();

  const [selectedCard, setSelectedCard] = React.useState("specificInfluencer");
  const [selectedTimeRange, setSelectedTimeRange] = React.useState("allTime");
  const [isCheckedRevenueAnalysis, setIsCheckedRevenueAnalysis] =
    React.useState(false);
  const [isCheckedScientificJournals, setIsCheckedScientificJournals] =
    React.useState(false);
  const [journals, setJournals] = React.useState<string[]>([]);
  const [selectedJournals, setSelectedJournals] = React.useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setInfluencerNames] = React.useState<string[]>([]);

  const [payload, setPayload] = useState({
    name: "",
    journals: selectedJournals,
    analyzeInfluencer: "",
    notes: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    setPayload((prev) => ({ ...prev, journals: selectedJournals }));
  }, [selectedJournals]);

  const getInfluencerNames = async () => {
    const response = await api.get("/api/influencer/names");
    if (response && response.status === 200) {
      setInfluencerNames(response?.data?.data);
    }
  };

  React.useEffect(() => {
    getInfluencerNames();
  }, []);

  const handleJournalFields = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number
  ) => {
    const updatedJournals = [...journals];
    updatedJournals[index] = e.target.value;
    setJournals(updatedJournals);
  };

  const handleJournalClick = (journal: string) => {
    setSelectedJournals((prev) => {
      if (prev.includes(journal)) {
        return prev.filter((item) => item !== journal);
      } else {
        return [...prev, journal];
      }
    });
  };

  const handleAddNewJournal = () => {
    const newJournal = "";
    setJournals((prev) => [...prev, newJournal]);
  };

  const handleSubmitFrom = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!payload?.name) {
      toast.error("Please enter an Influencer Name.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/influencer/research", {
        ...payload,
        notes: payload.notes === "" ? {} : payload.notes,
        journals: payload?.journals?.length > 0 ? payload?.journals : {},
        includeRevenueAnalysis: isCheckedRevenueAnalysis,
        verifyWithScientificJournals: isCheckedScientificJournals,
        timeRange: selectedTimeRange,
      });
      if (response && response.status === 200) {
        toast.success(response?.data?.message);
        navigate(ROUTES.DETAIL.replace(":id", response.data?.data?.id));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitFrom} className="w-full">
        <Stack gap={4}>
          <Grid container padding="0" gap={4}>
            <Grid item xs={5.8}>
              <ResearchCard
                selectedCard={selectedCard}
                type={"specificInfluencer"}
                onClick={() => setSelectedCard("specificInfluencer")}
                heading="Specific Influencer"
                title="Research a known health Influencer by name"
              />
            </Grid>
            <Grid item xs={5.8}>
              <ResearchCard
                selectedCard={selectedCard}
                type={"discoverNew"}
                onClick={() => setSelectedCard("discoverNew")}
                heading="Discover New"
                title="Find and analyze new health influencers"
              />
            </Grid>
          </Grid>
          <Grid container padding="0" gap={4}>
            <Grid item xs={5.8}>
              <Stack gap={4}>
                <Stack gap={1}>
                  <Typography
                    className="text-white"
                    variant="body1"
                    fontWeight={600}
                  >
                    Time Range
                  </Typography>
                  <Grid container padding="0" gap={2}>
                    <Grid item xs={5.8}>
                      <TimeRangeCard
                        selectedTimeRange={selectedTimeRange}
                        type={"lastWeek"}
                        onClick={() => setSelectedTimeRange("Last Week")}
                        title="Last Week"
                      />
                    </Grid>
                    <Grid item xs={5.8}>
                      <TimeRangeCard
                        selectedTimeRange={selectedTimeRange}
                        type={"lastMonth"}
                        onClick={() => setSelectedTimeRange("Last Month")}
                        title="Last Month"
                      />
                    </Grid>
                    <Grid item xs={5.8}>
                      <TimeRangeCard
                        selectedTimeRange={selectedTimeRange}
                        type={"lastYear"}
                        onClick={() => setSelectedTimeRange("Last Year")}
                        title="Last Year"
                      />
                    </Grid>
                    <Grid item xs={5.8}>
                      <TimeRangeCard
                        selectedTimeRange={selectedTimeRange}
                        type={"allTime"}
                        onClick={() => setSelectedTimeRange("All Time")}
                        title="All Time"
                      />
                    </Grid>
                  </Grid>
                </Stack>
                <Stack gap={1}>
                  <CustomInput
                    onChange={(e) =>
                      setPayload((prev) => ({
                        ...prev,
                        name: e?.target?.value,
                      }))
                    }
                    fieldLabel="Influencer Name"
                    placeHolder="Invluencer Name"
                    type="text"
                  />
                </Stack>

                <CustomInput
                  onChange={(e) =>
                    setPayload((prev) => ({
                      ...prev,
                      analyzeInfluencer: e?.target?.value,
                    }))
                  }
                  fieldLabel="Claims To Analyze Per Influencer"
                  placeHolder="Enter Number"
                  type="number"
                />
              </Stack>
            </Grid>
            <Grid item xs={5.8}>
              <Stack gap={4}>
                <CustomInput
                  fieldLabel="Products to Find Per Influencer"
                  placeHolder="Enter Number"
                  type="number"
                />
                <ResearchCheckbox
                  title="--"
                  heading="Include Revenue Analysis"
                  isChecked={isCheckedRevenueAnalysis}
                  setIsChecked={setIsCheckedRevenueAnalysis}
                />
                <ResearchCheckbox
                  title="--"
                  heading="Verify With Scientific Journals"
                  isChecked={isCheckedScientificJournals}
                  setIsChecked={setIsCheckedScientificJournals}
                />
              </Stack>
            </Grid>
          </Grid>
          <Stack gap={2}>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography className="text-white" fontWeight={600}>
                Scientific Journals
              </Typography>
              <Stack flexDirection="row" alignItems="center" gap={2}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  className="text-primary cursor-pointer hover:text-primary/80"
                  onClick={() => setSelectedJournals(journals)}
                >
                  Select All
                </Typography>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  className="!border-gray-400 !h-4"
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  className="text-primary cursor-pointer hover:text-primary/80"
                  onClick={() => setSelectedJournals([])}
                >
                  Deselect All
                </Typography>
              </Stack>
            </Stack>
            <Grid container padding="0" gap={2.2}>
              {journals?.length > 0 &&
                journals.map((item, index) => (
                  <Grid item xs={5.9} key={"journal--" + index}>
                    <AddJournalCard
                      onChange={(e) => handleJournalFields(e, index)}
                      selectedJournals={selectedJournals}
                      type={item}
                      onClick={() => handleJournalClick(item)}
                    />
                  </Grid>
                ))}
            </Grid>
            <Stack
              gap={1}
              alignItems="center"
              flexDirection="row"
              className="cursor-pointer"
              onClick={handleAddNewJournal}
            >
              <AddIcon className="text-primary" />
              <Typography
                variant="body2"
                fontWeight={600}
                className="text-primary"
              >
                Add New Journal
              </Typography>
            </Stack>
          </Stack>
          <Stack gap={2}>
            <CustomInput
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  notes: e?.target?.value,
                }))
              }
              isTextArea
              fieldLabel="Notes for Research Assistant"
              placeHolder="Enter Notes"
            />
          </Stack>

          <Stack justifyContent="end" width="100%" flexDirection="row">
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="medium"
              className="hover:!bg-primary/80 !bg-primary !text-white !text-sm !capitalize w-fit"
              startIcon={!loading && <AddIcon />}
            >
              {loading ? (
                <CircularProgress size="16px" color="inherit" />
              ) : (
                "Start Research"
              )}
            </Button>
          </Stack>
        </Stack>
      </form>

      <FullScreenLoader open={loading} />
    </>
  );
};

export default ResearchContainer;
