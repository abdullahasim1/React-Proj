import { Box, Typography } from "@mui/material";

const Description = () => {
  return (
    <Box sx={{ mt: { xs: 7, lg: "auto" }, my: "auto", maxWidth: "800px", px: 5 }}>
      
      <Typography sx={{ fontSize: { xs: 25, md: 40 }, fontWeight: 600 }} gutterBottom>
        The Modern LOS
      </Typography>

      <Typography fontSize={18} color="text.secondary">
        A unique web-based, end-to-end innovative LOS for residential mortgage lending.
        <br />
        LendingPad offers a comprehensive solution that includes built-in features
        and real-time updates, cross-departmental collaboration, insightful management,
        and analytics, all while helping you stay compliant.
      </Typography>

    </Box>
  );
};

export default Description;