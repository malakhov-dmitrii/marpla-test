import React from 'react'
import classnames from 'classnames'

import CircularProgress from '@mui/material/CircularProgress'

import BlockedIcon from '../../icons/Blocked.jsx'
import MinusIcon from '../../icons/Minus.jsx'
import TickIcon from '../../icons/Tick.jsx'

import styles from './index.module.scss'

export default function CellValue(props) {
	const {
		value,
		status,
		isLoading,
		faded,
		border,
		color,
		noSpacing,
		className,
		classes = {},
		...rest
	} = props

	const render = () => {
		if (status) {
			return {
				success: <TickIcon className={styles.green} />,
				blocked: <BlockedIcon className={styles.red} />,
				minus: <MinusIcon className={styles.red} />,
			}[status]
		} else if (isLoading) {
			return (
				<CircularProgress thickness={4} size={16} className={styles.progress} />
			)
		} else {
			return value
		}
	}

	const forceTransparency = isLoading || status

	return (
		<div
			className={classnames(
				styles.root,
				className,
				classes.root,
				styles[`color-${forceTransparency ? 'transparent' : color}`],
				!forceTransparency && faded && styles.faded,
				!forceTransparency && border && styles.border,
				noSpacing && styles.noSpacing
			)}
			{...rest}
		>
			{render()}
		</div>
	)
}
