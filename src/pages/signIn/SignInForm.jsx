import { Box, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { handleSignIn } from '../../auth/AuthApiCalls';
import CustomLink from '../../components/CustomLink';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import PasswordInputField from '../../shared/PasswordInputField';
import InputField from '../../shared/InputField';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
});

const SignInForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: async values => {
      const isSuccess = await handleSignIn(values);
      if (isSuccess) navigate('/dashboard', { replace: true });
    },
  });

  return (
    <Box sx={{ p: { xs: 5, lg: 12 }, width: '100%', maxWidth: '800px' }}>
      <Typography fontWeight="500" fontSize={28} gutterBottom>
        Welcome back
      </Typography>
      <Typography fontWeight="400" fontSize={16} color="textSecondary" mb={3}>
        Please sign-in to your account and start the adventure.
      </Typography>

      <form onSubmit={formik.handleSubmit} noValidate autoComplete="off" style={{ marginTop: '20px' }}>
        <InputField formik={formik} name="email" label="Email Address" />
        <PasswordInputField formik={formik} name="password" label="Password" size="small" />
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <CustomLink to="/forgot-password" color="primary" sx={{ fontSize: '13px', fontWeight: 500 }}>
            Forgot Password?
          </CustomLink>
        </Box>
        <Button size="large" type="submit" color="primary" fullWidth variant="contained" sx={{ my: 2 }}>
          Sign In
        </Button>
        <Typography variant="body2" color="textSecondary" align="center" mt={2}>
          New on our platform? <CustomLink to="/signup" color="primary">Create a New Account</CustomLink>
        </Typography>
      </form>
    </Box>
  );
};

export default SignInForm;
