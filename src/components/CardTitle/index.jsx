import React from 'react'
import classnames from 'classnames'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import styles from './index.module.scss'

export default function CardTitle(props) {
	const {
		borderBottom,
		transparent,
		className,
		children,
		classes = {},
		...rest
	} = props

	return (
		<Box
			className={classnames(
				styles.root,
				className,
				classes.root,
				transparent && styles.transparent,
				borderBottom && styles.borderBottom
			)}
			{...rest}
		>
			{typeof children === 'string' ? (
				<Typography shade={900} variant="subtitle1bold">
					{children}
				</Typography>
			) : (
				children
			)}
		</Box>
	)
}
