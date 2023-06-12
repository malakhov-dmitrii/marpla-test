import React from 'react'

import Checkbox from '../Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import styles from './index.module.scss'

export default function CheckboxLabel(props) {
	const {checked, label, className, ...rest} = props

	return (
		<FormControlLabel
			checked={checked}
			classes={styles}
			className={className}
			control={<Checkbox className={styles.checkbox} {...rest} />}
			label={label}
		/>
	)
}
