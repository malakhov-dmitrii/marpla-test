import React from 'react'
import classnames from 'classnames'

import CardContent from '@mui/material/CardContent'

import styles from './index.module.scss'

export default function _CardContent(props) {
	const {compact, className, classes = {}, ...rest} = props

	return (
		<CardContent
			className={classnames(
				styles.root,
				className,
				classes.root,
				compact && styles.compact
			)}
			{...rest}
		></CardContent>
	)
}
