import Grid from "@mui/material/Grid";
import AuthCard from '../../shared/AuthCard';
import Description from './Description';
import SignInForm from './SignInForm';

const SignIn = () => {
  return (
    <Grid container sx={{ minHeight: '100vh', width: '100%', px: 1, m: 0 }}>
      <Grid size={{ xs: 12, md: 6 }} sx={{ my: 1 }}>
        <AuthCard>
          <Description />
        </AuthCard>
      </Grid>
      <Grid
        size={{ xs: 12, md: 6 }}
        container
        justifyContent="center"
        alignItems="center"
      >
        <SignInForm />
      </Grid>
    </Grid>
  );
};

export default SignIn;
