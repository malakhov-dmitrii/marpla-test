import React from 'react'
import Tabs from '@mui/material/Tabs'
import Divider from '@mui/material/Divider'
import styles from './index.module.scss'

const Tabs_ = props => {
	const {onChange, divider, classes = {}, ...rest} = props

	return (
		<>
			<Tabs
				classes={Object.assign({}, styles, classes)}
				textColor="inherit"
				onChange={onChange}
				{...rest}
			/>
			{divider && <Divider />}
		</>
	)
}

export default Tabs_
