import React from 'react'
import Tab from '@mui/material/Tab'
import styles from './index.module.scss'

const Tab_ = props => {
	const {border, ...rest} = props

	return (
		<Tab
			classes={styles}
			sx={{borderRight: border ? '1px solid #f2f2f2' : ''}}
			{...rest}
		/>
	)
}

export default Tab_
