import React, {forwardRef, cloneElement} from 'react'
import classnames from 'classnames'

import _Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

import styles from './index.module.scss'

export const Button = forwardRef(
	(
		{
			fullWidth,
			size = 'medium',
			loadingText,
			children,
			startIcon: StartIcon,
			endIcon: EndIcon,
			variant = 'primary',
			isLoading = false,
			showProgressAnimation,
			className,
			...rest
		},
		ref
	) => {
		const hideIcons = loadingText && isLoading

		const _StartIcon = StartIcon
			? cloneElement(StartIcon, {className: styles.startIcon})
			: StartIcon
		const _EndIcon = EndIcon
			? cloneElement(EndIcon, {className: styles.endIcon})
			: EndIcon

		return (
			<_Button
				className={classnames(
					styles.root,
					className,
					size && styles[`size-${size}`],
					fullWidth && styles.fullWidth,
					isLoading && styles.loading,
					showProgressAnimation && styles.progress,
					variant && styles[`variant-${variant}`],
					_StartIcon && styles.pl18,
					_EndIcon && styles.pr18
				)}
				ref={ref}
				disableElevation
				{...rest}
			>
				{!hideIcons && _StartIcon && _StartIcon}
				{!loadingText && (
					<CircularProgress
						className={styles.preloader}
						size={size === 'small' ? 12 : 20}
						thickness={4.5}
					/>
				)}
				<Typography
					variant="button"
					className={classnames(
						styles.label,
						loadingText && isLoading && styles.pulse
					)}
				>
					{loadingText ? (isLoading ? loadingText : children) : children}
				</Typography>
				{!hideIcons && _EndIcon && _EndIcon}
			</_Button>
		)
	}
)

export default Button
