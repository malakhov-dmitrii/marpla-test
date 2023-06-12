import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import {
	ThemeProvider,
	createTheme,
	StyledEngineProvider,
} from '@mui/material/styles'
import App from './App/index.jsx'
import './styles/global.scss'

const theme = createTheme({
	palette: {
		background: {
			default: '#f9f9f9',
		},
		divider: '#F2F2F2',
	},
	shape: {
		borderRadius: 8,
	},
	typography: {
		useNextVariants: true,
		fontSize: 14,
		fontFamily: `"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif`,
		h1: {
			fontSize: '96px',
			fontWeight: 300,
			lineHeight: '112px',
		},
		h2: {
			fontSize: '60px',
			fontWeight: 400,
			lineHeight: '72px',
		},
		h3: {
			fontSize: '50px',
			fontWeight: 600,
			lineHeight: '58px',
		},
		h4: {
			fontSize: '34px',
			fontWeight: 700,
			lineHeight: '36px',
		},
		h5: {
			fontSize: '24px',
			fontWeight: 700,
			lineHeight: '24px',
		},
		h6: {
			fontSize: '20px',
			fontWeight: 700,
			lineHeight: '24px',
		},
		subtitle1: {
			fontSize: '16px',
			fontWeight: 400,
			lineHeight: '24px',
		},
		subtitle1bold: {
			fontSize: '16px',
			fontWeight: 600,
			lineHeight: '24px',
		},
		body1: {
			fontSize: '16px',
			fontWeight: 400,
			lineHeight: '24px',
		},
		body2: {
			fontSize: '14px',
			fontWeight: 400,
			lineHeight: '20px',
		},
		button: {
			fontSize: '18px',
			fontWeight: 500,
			lineHeight: '20px',
			textTransform: 'none',
		},
		caption: {
			fontSize: '12px',
			fontWeight: 400,
			lineHeight: '16px',
		},
		overline: {
			fontSize: '10px',
			fontWeight: 500,
			lineHeight: '16px',
		},
	},
})

ReactDOM.createRoot(document.getElementById('root')).render(
	<ThemeProvider theme={theme}>
		<StyledEngineProvider injectFirst>
			<CssBaseline />
			<App />
		</StyledEngineProvider>
	</ThemeProvider>
)
