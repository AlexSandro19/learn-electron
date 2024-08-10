import { Button, Input, Stack, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function InputBox({ input, textFieldId, textFieldLabel, textFieldName, handleInputChange, handleInputCancel, handleInputSubmit }) {
  return (
    <>
      <Stack direction="row" alignItems="center" gap={1}>
        <TextField
          required
          fullWidth
          id={textFieldId}
          label={textFieldLabel}
          name={textFieldName}
          autoComplete={textFieldName}
          value={input}
          onChange={handleInputChange}
        />
        <IconButton
          onClick={handleInputSubmit}
        >
          <CheckCircleIcon />
        </IconButton>
        <IconButton
          onClick={handleInputCancel}
        >
          <CancelIcon />
        </IconButton>
      </Stack>
    </>
  )
}
