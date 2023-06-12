import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<g style={{mixBlendMode: 'multiply'}}>
			<g style={{mixBlendMode: 'multiply'}}>
				<rect width="24" height="24" rx="4" fill="#F2F2F2" />
			</g>
		</g>
	</Template>
))
