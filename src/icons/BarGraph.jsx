import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<g fill={'none'}>
			<path
				d="M9.91667 9.5H5.75V19.5H9.91667M9.91667 9.5V4.5H14.0833V11.1667M9.91667 9.5V19.5M14.0833 19.5V11.1667M14.0833 19.5H18.25V11.1667H14.0833M14.0833 19.5H9.91667"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
	</Template>
))
