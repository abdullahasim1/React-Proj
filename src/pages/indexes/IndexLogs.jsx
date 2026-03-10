import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loadIndexEntries, loadIndexMaster } from "../../utils/indexStorage";

const IndexLogs = () => {
  const navigate = useNavigate();
  const [entries] = useState(loadIndexEntries);
  const [master] = useState(loadIndexMaster);

  const indexNames = useMemo(() => {
    const fromEntries = [...new Set(entries.map((e) => e.indexName).filter(Boolean))];
    const merged = [...new Set([...master, ...fromEntries])].sort((a, b) =>
      a.localeCompare(b),
    );
    return merged;
  }, [entries, master]);

  const [selectedIndex, setSelectedIndex] = useState(indexNames[0] || "");

  const filtered = useMemo(() => {
    if (!selectedIndex) return [];
    return entries
      .filter((e) => e.indexName === selectedIndex)
      .sort((a, b) => {
        if (a.date === b.date) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.date < b.date ? 1 : -1;
      });
  }, [entries, selectedIndex]);

  const latestDate = filtered[0]?.date ?? "—";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 20% 0%, rgba(86,159,64,0.14) 0%, rgba(248,250,252,1) 55%)",
        p: { xs: 2, md: 4 },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Index Logs
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Only logs for the selected index (name, date, value, time).
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            <Chip label={`Total entries: ${entries.length}`} size="small" variant="outlined" />
            <Chip label={`Latest for index: ${latestDate}`} size="small" variant="outlined" />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </Stack>
      </Stack>

      <Card
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Autocomplete
              options={indexNames}
              value={selectedIndex}
              onChange={(_, value) => setSelectedIndex(value || "")}
              size="small"
              sx={{ minWidth: 260 }}
              renderInput={(params) => (
                <TextField {...params} label="Select Index" placeholder="Type to search..." />
              )}
            />
            {selectedIndex && (
              <Chip label={`Showing logs for: ${selectedIndex}`} size="small" />
            )}
          </Stack>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              boxShadow: "none",
              maxHeight: 600,
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {["Index Name", "Date", "Value", "Time (UTC)"].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 800,
                        bgcolor: "grey.50",
                        borderBottom: "1px solid rgba(15, 23, 42, 0.10)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!selectedIndex || filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Box sx={{ py: 6 }}>
                        <Typography fontWeight={700}>
                          No logs for this index yet
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Use the Update button on the dashboard to create log entries.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((entry, idx) => (
                    <TableRow
                      key={entry.id}
                      hover
                      sx={{
                        bgcolor: idx % 2 === 0 ? "white" : "grey.50",
                        "& td": { borderBottom: "1px solid rgba(15, 23, 42, 0.06)" },
                      }}
                    >
                      <TableCell>{entry.indexName}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>{entry.value}</TableCell>
                      <TableCell>
                        {new Date(entry.createdAt).toISOString().slice(11, 19)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IndexLogs;

