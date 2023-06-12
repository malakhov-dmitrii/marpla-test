import React from 'react'
import classnames from 'classnames'

import Typography from '@mui/material/Typography'

import styles from './index.module.scss'

export default function _Typography(props) {
	const {shade = 800, className, classes = {}, ...rest} = props

	return (
		<Typography
			className={classnames(styles.root, className, styles[`shade-${shade}`])}
			{...rest}
		/>
	)
}
