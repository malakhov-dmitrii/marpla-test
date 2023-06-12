import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M18 9.75C18.4142 9.75 18.75 9.41421 18.75 9C18.75 8.58579 18.4142 8.25 18 8.25H6C5.58579 8.25 5.25 8.58579 5.25 9C5.25 9.41421 5.58579 9.75 6 9.75L18 9.75ZM18 15.75C18.4142 15.75 18.75 15.4142 18.75 15C18.75 14.5858 18.4142 14.25 18 14.25L6 14.25C5.58579 14.25 5.25 14.5858 5.25 15C5.25 15.4142 5.58579 15.75 6 15.75L18 15.75Z"
		/>
	</Template>
))
