import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<path
			d="M8.66675 19.5H15.3334"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M12 16.1666V19.5"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M18.6667 4.5H5.33341C4.41294 4.5 3.66675 5.24619 3.66675 6.16667V14.5C3.66675 15.4205 4.41294 16.1667 5.33341 16.1667H18.6667C19.5872 16.1667 20.3334 15.4205 20.3334 14.5V6.16667C20.3334 5.24619 19.5872 4.5 18.6667 4.5Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
		/>
	</Template>
))
