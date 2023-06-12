import React from 'react'
import {divideNumber} from '../../utils/utils.js'

import Radio from '../Radio'
import FormControlLabel from '@mui/material/FormControlLabel'

import styles from './index.module.scss'

export default function RadioLabel(props) {
	const {checked, count, label, color, className, ...rest} = props
	const hasCount = count || count === 0

	return (
		<FormControlLabel
			checked={checked}
			classes={styles}
			className={className}
			control={<Radio className={styles.radio} color={color} {...rest} />}
			label={
				hasCount ? (
					<span>
						<span style={{color}}>{label}</span>
						<span className={styles.count}>{divideNumber(count)}</span>
					</span>
				) : (
					<span style={{color}}>{label}</span>
				)
			}
		/>
	)
}
