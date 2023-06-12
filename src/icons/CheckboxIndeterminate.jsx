import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<g style={{mixBlendMode: 'multiply'}}>
			<g style={{mixBlendMode: 'multiply'}}>
				<rect width="24" height="24" rx="4" fill="#F2F2F2" />
				<rect
					x="6"
					y="6"
					width="12"
					height="12"
					rx="2"
					fill={props.fill || '#32558F'}
					fillOpacity="0.6"
				/>
			</g>
		</g>
	</Template>
))
