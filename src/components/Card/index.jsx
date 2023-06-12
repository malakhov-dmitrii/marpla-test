import React, {forwardRef} from 'react'
import classnames from 'classnames'

import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'

import styles from './index.module.scss'

export default forwardRef((props, ref) => {
	const {children, isLoading, inner, className, classes = {}, ...rest} = props

	return (
		<Card
			className={classnames(
				styles.root,
				className,
				classes.root,
				inner && styles.inner
			)}
			ref={ref}
			{...rest}
		>
			{isLoading && (
				<Skeleton
					className={styles.skeleton}
					variant="rectangular"
					animation="wave"
				/>
			)}
			{children}
		</Card>
	)
})
