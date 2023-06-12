import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<g fill={'none'}>
			<path
				d="M4.08301 4.91699V19.5003H19.083"
				strokeWidth="1.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M7 11H10V15H14V8H19V12"
				strokeWidth="1.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
	</Template>
))
