import React, {forwardRef} from 'react'
import {divideNumber, isNumeric} from '../../utils/utils.js'
import classnames from 'classnames'

import CircularProgress from '@mui/material/CircularProgress'

import styles from './index.module.scss'

export default forwardRef((props, ref) => {
	const {
		icon: Icon,
		label,
		count,
		isLoading,
		className,
		classes = {},
		...rest
	} = props

	return (
		<div
			ref={ref}
			className={classnames(styles.root, className, classes.root)}
			{...rest}
		>
			{Icon && <Icon className={styles.icon} />}
			{label && <div className={styles.label}>{label}</div>}
			{!isLoading && (count || count === 0) && (
				<div className={styles.count}>
					{isNumeric(count) ? divideNumber(count) : count}
				</div>
			)}
			{isLoading && (
				<CircularProgress thickness={5} size={16} className={styles.progress} />
			)}
		</div>
	)
})
