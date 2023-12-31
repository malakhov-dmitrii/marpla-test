import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M11.47 17.3024C11.1771 17.5952 11.1771 18.0701 11.47 18.363C11.7629 18.6559 12.2378 18.6559 12.5307 18.363L18.3605 12.5332C18.3722 12.5217 18.3834 12.5098 18.3943 12.4975C18.5121 12.3651 18.5837 12.1906 18.5837 11.9994C18.5837 11.9017 18.565 11.8084 18.531 11.7229C18.4944 11.6304 18.4388 11.5438 18.364 11.469L12.5307 5.63568C12.2378 5.34279 11.7629 5.34279 11.47 5.63569C11.1771 5.92858 11.1771 6.40345 11.47 6.69635L16.023 11.2494L6.16699 11.2494C5.75278 11.2494 5.41699 11.5852 5.41699 11.9994C5.41699 12.4136 5.75278 12.7494 6.16699 12.7494L16.023 12.7494L11.47 17.3024Z"
		/>
	</Template>
))
