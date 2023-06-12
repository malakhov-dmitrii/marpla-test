import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M16.773 8.28765C17.0659 7.99476 17.0659 7.51989 16.773 7.22699C16.4801 6.9341 16.0052 6.9341 15.7123 7.22699L12 10.9393L8.28765 7.22699C7.99476 6.9341 7.51989 6.9341 7.22699 7.22699C6.9341 7.51989 6.9341 7.99476 7.22699 8.28765L10.9393 12L7.22706 15.7123C6.93417 16.0052 6.93417 16.48 7.22706 16.7729C7.51996 17.0658 7.99483 17.0658 8.28772 16.7729L12 13.0607L15.7123 16.7729C16.0052 17.0658 16.48 17.0658 16.7729 16.7729C17.0658 16.48 17.0658 16.0052 16.7729 15.7123L13.0607 12L16.773 8.28765Z"
		/>
	</Template>
))
