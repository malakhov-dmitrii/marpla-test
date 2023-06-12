import React, {forwardRef} from 'react'
import classnames from 'classnames'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import styles from './index.module.scss'

const circularProgressSize = {
	default: 20,
	medium: 16,
	small: 12,
}

export default forwardRef((props, ref) => {
	const {
		children,
		variant = 'primary',
		size,
		isLoading,
		className,
		...rest
	} = props

	return (
		<Button
			ref={ref}
			className={classnames(
				styles.root,
				className,
				styles[`variant-${size === 'small' ? 'small' : variant}`],
				size && styles[`size-${size}`]
			)}
			{...rest}
		>
			{isLoading ? (
				<CircularProgress
					className={styles.preloader}
					size={circularProgressSize[size]}
					thickness={4.5}
				/>
			) : (
				<span className={styles.icon}>{children}</span>
			)}
		</Button>
	)
})
