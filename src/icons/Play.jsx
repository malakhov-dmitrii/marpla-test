import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<path
			d="M7.5 12.4016C7.5 8.74302 7.5 6.91374 8.68303 6.22776C9.86606 5.54178 11.4434 6.45642 14.5982 8.2857L14.7679 8.38411C17.9226 10.2134 19.5 11.128 19.5 12.5C19.5 13.872 17.9226 14.7866 14.7679 16.6159L14.5982 16.7143C11.4434 18.5436 9.86606 19.4582 8.68303 18.7722C7.5 18.0863 7.5 16.257 7.5 12.5984L7.5 12.4016Z"
			stroke="currentColor"
			fill="none"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</Template>
))
