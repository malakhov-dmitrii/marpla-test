import React, {useCallback} from 'react'
import classnames from 'classnames'

import styles from './index.module.scss'

const Link_ = props => {
	const {
		block,
		to,
		blank,
		inheritColor = false,
		underline,
		stopPropagation,
		children,
		className,
		...rest
	} = props

	const aProps = {
		//this fixes warning
		target: blank ? '_blank' : '_self',
		rel: blank ? 'noreferrer noopener' : '',
	}

	const onClick = useCallback(
		e => {
			stopPropagation && e.stopPropagation()
		},
		[stopPropagation]
	)

	return <a
			href={to}
			className={classnames(
				styles.root,
				className,
				block && styles.block,
				underline && styles[`underline-${underline}`],
				inheritColor && styles.inheritColor
			)}
			onClick={onClick}
			{...aProps}
			{...rest}
		>
			{children}
		</a>
}

export default Link_
