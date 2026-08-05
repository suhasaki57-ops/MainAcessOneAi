import { createTheme } from '@mui/material/styles';

export const muiDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0284c7',
    },
    background: {
      default: '#020617',
      paper: '#0f172a',
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  shape: {
    borderRadius: 12,
  },
});
