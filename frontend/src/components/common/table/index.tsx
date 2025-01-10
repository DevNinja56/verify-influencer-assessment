import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button, Chip, Stack } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../config";

type Column = {
  field: string;
  headerName: string;
};

type Row = {
  id: string | number;
  [key: string]: unknown;
};

type Tab = {
  label: string;
  value: string;
};

type CustomTableProps = {
  columns: Column[];
  rows: Row[];
  tabs?: Tab[];
  filterKey: string;
  sortKey: string;
  headerButton?: React.ReactElement;
  loading?: boolean;
};

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  rows,
  tabs,
  filterKey,
  sortKey,
  headerButton,
  loading,
}) => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = React.useState<string>("all");
  const [highestFirst, setHighestFirst] = React.useState<boolean>(false);

  const customizedColumns = columns.map((col) => ({
    ...col,
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    drag: false,
    headerClassName: "bg-secondary/90 text-grayColor",
  }));

  const paginationModel = { page: 0, pageSize: 5 };

  const filteredRows =
    selectedTab === "all" || selectedTab === "medicine"
      ? rows
      : rows.filter((item) => item?.[filterKey] === selectedTab);

  const sortedRows = highestFirst
    ? [...filteredRows].sort((a, b) => {
        const aValue = a[sortKey] as number | string;
        const bValue = b[sortKey] as number | string;
        return bValue > aValue ? -1 : 1;
      })
    : filteredRows;

  return (
    <Stack gap={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Stack direction="row" gap="20px">
          {tabs &&
            tabs?.length > 0 &&
            tabs?.map((item, index) => (
              <Chip
                onClick={() => setSelectedTab(item?.value)}
                key={"tab--" + item?.value + index}
                label={item?.label}
                variant="filled"
                className={`${
                  selectedTab === item?.value
                    ? "!bg-primary"
                    : "!bg-white/5 hover:!bg-white/30"
                } !text-white !cursor-pointer`}
              />
            ))}
        </Stack>
        <Stack direction="row" gap="20px">
          {headerButton && headerButton}
          <Button
            onClick={() => setHighestFirst(!highestFirst)}
            variant="contained"
            size="small"
            className={`${
              highestFirst
                ? "!bg-primary !text-white"
                : "!bg-white/5 !text-grayColor"
            } !text-sm !capitalize`}
            startIcon={<SwapVertIcon />}
          >
            Highest First
          </Button>
        </Stack>
      </Stack>
      <Paper>
        <DataGrid
          loading={loading}
          className="bg-secondary/95 text-white"
          rows={sortedRows && sortedRows.length > 0 ? sortedRows : []}
          columns={customizedColumns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          hideFooterSelectedRowCount={true}
          disableColumnResize={true}
          onRowClick={(row) =>
            navigate({
              pathname: ROUTES.DETAIL.replace(":id", row.id.toString()),
            })
          }
          sx={{
            borderColor: "#6A717E",
            "& .MuiDataGrid-cell": {
              borderColor: "#6A717E",
            },
            "& .MuiDataGrid-columnHeader": {
              borderBottom: "none !important",
            },
            "& .MuiDataGrid-withBorderColor": {
              borderColor: "#6A717E",
            },
            "& .css-1gak8h1-MuiToolbar-root-MuiTablePagination-toolbar": {
              color: "white",
            },
            "& .css-1gak8h1-MuiToolbar-root-MuiTablePagination-toolbar svg": {
              color: "white",
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-scrollbarFiller": {
              backgroundColor: "#272F3C",
              borderBottom: "none !important",
            },
            "& .css-ok32b7-MuiDataGrid-overlay": {
              backgroundColor: "transparent !important",
              color: "white",
            },
            "& .MuiDataGrid-row": {
              cursor: "pointer",
            },
          }}
        />
      </Paper>
    </Stack>
  );
};

export default CustomTable;
