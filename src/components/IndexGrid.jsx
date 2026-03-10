import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";

import { indexes as mockIndexes } from "../data/mockIndexes";
import {
  ensureSeedFromMock,
  getLatestEntryByIndex,
  loadIndexEntries,
  loadIndexMaster,
  saveIndexEntries,
  saveIndexMaster,
} from "../utils/indexStorage";

const IndexGrid = () => {
  const navigate = useNavigate();

  ensureSeedFromMock(mockIndexes);

  const [rowData, setRowData] = useState(() => {
    const entries = loadIndexEntries();
    const master = loadIndexMaster();
    const latestMap = getLatestEntryByIndex(entries);

    const names = master.length ? master : Array.from(latestMap.keys());

    return names.map((name, idx) => {
      const latest = latestMap.get(name);

      return {
        id: idx + 1,
        indexName: name,
        currentDate: latest?.date ?? "",
        currentValue: latest?.value ?? "",
        newDate: latest?.date ?? "",
        newValue: latest?.value ?? "",
      };
    });
  });

  const [selectedId, setSelectedId] = useState(
    rowData.length ? rowData[0].id : null,
  );

  const selectedRow =
    rowData.find((row) => row.id === selectedId) || rowData[0] || null;

  const indexOptions = Array.from(
    new Set(rowData.map((row) => row.indexName).filter(Boolean)),
  );

  const updateIndex = (row) => {
    const indexName = String(row.indexName || "").trim();
    if (!indexName) return;

    const effectiveValue =
      row.newValue === "" ? row.currentValue : row.newValue;

    const effectiveDate = String(row.newDate || row.currentDate).trim();
    if (!effectiveDate) return;

    const currentUserRaw = localStorage.getItem("auth_user");

    let currentUserEmail = "unknown";

    try {
      if (currentUserRaw) {
        const parsed = JSON.parse(currentUserRaw);
        if (parsed?.email) currentUserEmail = parsed.email;
      }
    } catch { /* empty */ }

    const entries = loadIndexEntries();

    const nextId =
      entries.length > 0 ? Math.max(...entries.map((e) => e.id || 0)) + 1 : 1;

    const newEntry = {
      id: nextId,
      indexName,
      date: effectiveDate,
      value: effectiveValue,
      createdBy: currentUserEmail,
      createdAt: new Date().toISOString(),
    };

    const updatedEntries = [...entries, newEntry];

    saveIndexEntries(updatedEntries);

    const master = loadIndexMaster();
    saveIndexMaster([...master, indexName]);

    setRowData((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? {
              ...item,
              currentDate: effectiveDate,
              currentValue: effectiveValue,
              newValue: "",
            }
          : item,
      ),
    );
  };

  return (
    <Stack spacing={2}>
      <Typography fontWeight={700}>Daily Index Form</Typography>

      {selectedRow && (
        <Card
          sx={{ borderRadius: 3, boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}
        >
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Autocomplete
                options={indexOptions}
                value={selectedRow.indexName || ""}
                onChange={(_, newValue) => {
                  const target = rowData.find(
                    (row) => row.indexName === newValue,
                  );

                  if (target) setSelectedId(target.id);
                }}
                size="small"
                sx={{ minWidth: 240 }}
                renderInput={(params) => (
                  <TextField {...params} label="Index Name" />
                )}
              />

              <Box>
                <Typography variant="caption">ID: {selectedRow.id}</Typography>
              </Box>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Current</Typography>

                <Stack spacing={1.2}>
                  <TextField
                    label="Current Date"
                    value={selectedRow.currentDate}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="Current Value"
                    value={selectedRow.currentValue}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">New</Typography>

                <Stack spacing={1.2}>
                  <TextField
                    label="New Date"
                    type="date"
                    value={selectedRow.newDate}
                    onChange={(e) =>
                      setRowData((prev) =>
                        prev.map((r) =>
                          r.id === selectedRow.id
                            ? { ...r, newDate: e.target.value }
                            : r,
                        ),
                      )
                    }
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    label="New Value"
                    value={selectedRow.newValue}
                    onChange={(e) =>
                      setRowData((prev) =>
                        prev.map((r) =>
                          r.id === selectedRow.id
                            ? { ...r, newValue: e.target.value }
                            : r,
                        ),
                      )
                    }
                    fullWidth
                    size="small"
                  />
                </Stack>
              </Grid>
            </Grid>

            <Stack direction="row" sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => updateIndex(selectedRow)}
              >
                Update
              </Button>

              <Button
                variant="outlined"
                sx={{ ml: 1 }}
                onClick={() => navigate("/indexes/logs")}
              >
                View Logs
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default IndexGrid;
