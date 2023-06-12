import React from 'react'

export default function TabPanel({children, value, index}) {
	return (
		<div style={{display: value === index ? 'block' : 'none'}}>{children}</div>
	)
}
