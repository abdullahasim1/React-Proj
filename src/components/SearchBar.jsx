import { Box, TextField, Button } from "@mui/material";

const SearchBar = () => {
  return (
    <Box display="flex" gap={2} mb={3} alignItems="center">
      <TextField label="Index Name" size="small" />

      <TextField type="date" size="small" />

      <Button variant="contained">Search</Button>
    </Box>
  );
};

export default SearchBar;
