import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import IndexGrid from "../../components/IndexGrid";

export default function Dashboard() {
  const navigate = useNavigate();

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
            Daily Index Dashboard
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => navigate("/indexes/search")}
          >
            Search
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/indexes/audit")}
          >
            Audit Trail
          </Button>
          <Button variant="contained" onClick={() => navigate("/indexes/list")}>
            Index List
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          p: 2,
        }}
      >
        <IndexGrid />
      </Box>
    </Box>
  );
}
