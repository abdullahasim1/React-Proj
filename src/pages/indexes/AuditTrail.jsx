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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loadIndexEntries } from "../../utils/indexStorage";

const AuditTrail = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(loadIndexEntries);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      if (a.date === b.date) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.date < b.date ? 1 : -1;
    });
  }, [entries]);

  const latestDate = sortedEntries[0]?.date ?? "—";

  const clearAll = () => {
    localStorage.removeItem("index_entries");
    localStorage.removeItem("index_master");
    setEntries([]);
  };

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
            Audit Trail
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Every update creates a new immutable entry (localStorage for now).
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            <Chip label={`Entries: ${entries.length}`} size="small" variant="outlined" />
            <Chip label={`Latest date: ${latestDate}`} size="small" variant="outlined" />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button variant="outlined" onClick={() => navigate("/indexes/search")}>
            Search
          </Button>
          <Button variant="contained" color="error" onClick={clearAll}>
            Clear Local Data
          </Button>
        </Stack>
      </Stack>

      <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)" }}>
        <CardContent>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              boxShadow: "none",
              overflow: "auto",
              maxHeight: 650,
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {["Index Name", "Date", "Value", "Notes", "Entered By", "Timestamp (UTC)"].map((h) => (
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
                {sortedEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ py: 7 }}>
                        <Typography fontWeight={800}>No audit entries</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Update indexes from the dashboard grid to create an audit trail.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedEntries.map((entry, idx) => (
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
                      <TableCell sx={{ minWidth: 200 }}>
                        {entry.notes || (
                          <Typography variant="caption" color="textSecondary">
                            —
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{entry.createdBy}</TableCell>
                      <TableCell>
                        {new Date(entry.createdAt).toISOString().replace("T", " ").slice(0, 19)}
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

export default AuditTrail;

