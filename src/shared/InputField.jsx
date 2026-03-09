import { Box, TextField, Typography } from '@mui/material';

const InputField = ({ formik, name, label, disabled = false, onChange, multiline = false, id, maxRows = 8, type = 'text', sideUi }) => {
  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
        <Typography fontSize={14} fontWeight="500">
          {label}
        </Typography>
        {sideUi ? sideUi : null}
      </Box>
      <TextField
        id={id}
        fullWidth
        name={name}
        type={type}
        placeholder={label}
        size="small"
        multiline={multiline}
        maxRows={multiline ? maxRows : undefined}
        disabled={disabled}
        value={formik.values[name] ?? ''}
        onChange={onChange ?? formik.handleChange}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
        spellCheck={true}
        slotProps={{ htmlInput: { min: 0 } }}
      />
    </Box>
  );
};

export default InputField;
