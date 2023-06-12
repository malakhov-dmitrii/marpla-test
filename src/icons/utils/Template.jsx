import React, {forwardRef} from 'react'

import SvgIcon from '@mui/material/SvgIcon'

export default forwardRef((props, ref) => {
	const {getTags, tags, ...rest} = props
	getTags && getTags(tags)

	return <SvgIcon ref={ref} {...rest} />
})
