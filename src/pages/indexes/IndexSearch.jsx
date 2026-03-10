import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loadIndexEntries } from "../../utils/indexStorage";

const IndexSearch = () => {

  const navigate = useNavigate();
  const entries = loadIndexEntries();

  const indexNames = useMemo(() => {
    return [...new Set(entries.map((e) => e.indexName))].sort();
  }, [entries]);

  const [query, setQuery] = useState({
    indexName: "",
    date: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {

    const name = query.indexName.trim();
    if (!name) return;

    const filtered = entries.filter((e) => {
      if (e.indexName !== name) return false;

      if (!query.date) return true;

      return e.date <= query.date;
    });

    if (!filtered.length) {
      setResult(null);
      return;
    }

    const latest = filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    setResult(latest);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f8fafc",
        p: { xs: 2, md: 4 },
      }}
    >

      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" fontWeight={800}>
          Index Search
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/indexes/audit")}
          >
            Audit Trail
          </Button>
        </Stack>
      </Stack>

      {/* Search Card */}

      <Box sx={{ maxWidth: 420, mx: "auto" }}>
        <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
          <CardContent>

            <Stack spacing={2}>

              <Typography variant="h6" fontWeight="bold">
                Find Index Value
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Search index value by name and optional date
              </Typography>

              <Divider />

              <TextField
                select
                label="Index Name"
                name="indexName"
                value={query.indexName}
                onChange={handleChange}
                fullWidth
              >
                {indexNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Date"
                type="date"
                name="date"
                value={query.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <Button
                variant="contained"
                size="large"
                onClick={handleSearch}
              >
                Search
              </Button>

              {result && (
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                    background: "#f1f5f9",
                  }}
                >
                  <Typography fontWeight="bold">
                    {result.indexName}
                  </Typography>

                  <Typography>
                    Value: <strong>{result.value}</strong>
                  </Typography>

                  <Typography color="text.secondary">
                    Date: {result.date}
                  </Typography>
                </Box>
              )}

            </Stack>

          </CardContent>
        </Card>
      </Box>

    </Box>
  );
};

export default IndexSearch;