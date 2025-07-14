import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#6c757d',
        },
        background: {
            default: '#ffffff',
            paper: '#f5f5f5',
        },
        text: {
            primary: '#000000',
            secondary: '#5f6368',
        },
        customColors: {
            blue: '#422bff',
            pink: '#ff69ac',
        },
    },
});

export default theme;
