import React from 'react'
import classnames from 'classnames'

import Radio from '@mui/material/Radio'

import RadioMarkedIcon from '../../icons/RadioMarked.jsx'
import RadioBlankIcon from '../../icons/RadioBlank.jsx'

import styles from './index.module.scss'

export default function _Radio(props) {
	const {color, checked, className, classes = {}, ...rest} = props

	return (
		<Radio
			className={classnames(styles.root, className, classes.root)}
			checkedIcon={<RadioMarkedIcon fill={color} />}
			icon={<RadioBlankIcon fill={color} />}
			checked={checked}
			{...rest}
		/>
	)
}
