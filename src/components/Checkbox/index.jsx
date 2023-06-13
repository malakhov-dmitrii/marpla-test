import React, {forwardRef} from 'react'

import Checkbox from '@mui/material/Checkbox'

import CheckboxBlankIcon from '../../icons/CheckboxBlank'
import CheckboxMarkedIcon from '../../icons/CheckboxMarked'
import CheckboxIndeterminateIcon from '../../icons/CheckboxIndeterminate'

import styles from './index.module.scss'

export default React.memo(forwardRef((props, ref) => {
	const {color, disabled, onChange, checked, ...rest} = props

	return (
		<Checkbox
			ref={ref}
			className={styles.root}
			onChange={disabled ? undefined : onChange}
			checked={checked}
			checkedIcon={<CheckboxMarkedIcon fill={color} />}
			icon={<CheckboxBlankIcon />}
			indeterminateIcon={<CheckboxIndeterminateIcon fill={color} />}
			{...rest}
		/>
	)
}))
