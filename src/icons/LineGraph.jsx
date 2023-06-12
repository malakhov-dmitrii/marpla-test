import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<g fill="none">
			<path
				d="M4.08301 4.91699V19.5003H19.083"
				strokeWidth="1.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M7.83301 14.0837L11.583 10.3337L14.4997 13.2503L18.6663 8.66699"
				strokeWidth="1.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
	</Template>
))
