import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilterListIcon from '@mui/icons-material/FilterList'; // Import the filter icon

export default function LeaderboardDialogSelect({ setSelections, selections, theme }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (_, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const handleChange = (event, field) => {
    setSelections({
      ...selections,
      [field]: event.target.value,
    });
  };

  const renderSelectField = (label, field, value, options, theme) => (
    <FormControl
      sx={{
        m: 1,
        minWidth: 120,
        background: theme.background, // Apply background color from theme
        '& .MuiInputLabel-root': {
          color: theme.text, // Label text color
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.textTypeBox, // Border color for the input box
          },
          '&:hover fieldset': {
            borderColor: theme.title, // Change border color on hover
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.title, // Focused border color
          },
        },
      }}
      key={field}
    >
      <InputLabel style={{ color: theme.text }}>{label}</InputLabel>
      <Select
        sx={{
          background: theme.background, // Select dropdown background
          color: theme.text, // Text color
          '& .MuiSelect-icon': {
            color: theme.text, // Icon color
          },
        }}
        value={value}
        onChange={(event) => handleChange(event, field)}
        input={<OutlinedInput label={label} />}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              backgroundColor: theme.background, // Menu item background
              color: theme.text, // Menu item text color
              '&:hover': {
                backgroundColor: theme.textTypeBox, // Background color on hover
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  // Options for each select field
  const selectOptions = {
    language: [
      { value: 'english', label: 'English' },
      { value: 'chinese', label: 'Chinese' },
    ],
    difficulty: [
      { value: 'normal', label: 'Normal' },
      { value: 'hard', label: 'Hard' },
    ],
    timer: [
      { value: "15", label: '15 seconds' },
      { value: "30", label: '30 seconds' },
      { value: "60", label: '60 seconds' },
      { value: "90", label: '90 seconds' },
    ],
  };

  return (
    <div>
      <IconButton
        onClick={handleClickOpen}
        sx={{
          borderRadius: 0,
          bgcolor: theme.background,
        }}
        aria-label="filter"
      >
        <Box display="flex" alignItems="center">
          <Typography
            variant="button"
            sx={{
              mr: 1,
              color: theme.textTypeBox
            }}
          >
            Filter
          </Typography>
          <FilterListIcon sx={{ color: theme.textTypeBox }} />
        </Box>
      </IconButton>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose} >
        <DialogTitle sx={{ background: theme.background }}>Select Options</DialogTitle>
        <DialogContent sx={{ background: theme.background }}>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap', background: theme.background }}>
            {Object.keys(selectOptions).map((field) =>
              renderSelectField(
                field.charAt(0).toUpperCase() + field.slice(1),
                field,
                selections[field],
                selectOptions[field],
                theme
              )
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: theme.background }}>
          <Button onClick={handleClose} sx={{ color: theme.textTypeBox }}>
            Cancel
          </Button>
          <Button onClick={handleClose} sx={{ color: theme.textTypeBox }}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
