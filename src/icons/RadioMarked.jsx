import React, {forwardRef} from 'react'
import Color from 'color'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<g>
			<rect
				width="24"
				height="24"
				rx="12"
				fill={props.fill ? Color(props.fill).fade(0.8) : '#F2F2F2'}
			/>
			<circle cx="12" cy="12" r="6" fill={props.fill || '#32558F'} />
		</g>
	</Template>
))
