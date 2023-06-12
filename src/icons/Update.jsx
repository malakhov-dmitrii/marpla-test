import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M4.48682 5.29102C4.90103 5.29102 5.23682 5.6268 5.23682 6.04102V9.04102H8.23682C8.65103 9.04102 8.98682 9.3768 8.98682 9.79102C8.98682 10.2052 8.65103 10.541 8.23682 10.541H4.48682C4.0726 10.541 3.73682 10.2052 3.73682 9.79102V6.04102C3.73682 5.6268 4.0726 5.29102 4.48682 5.29102Z"
			fill="#828282"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10.5123 4.52152C11.9914 4.2273 13.5245 4.3783 14.9178 4.95542C16.3111 5.53254 17.5019 6.50986 18.3398 7.76378C19.1776 9.0177 19.6248 10.4919 19.6248 12C19.6248 13.5081 19.1776 14.9823 18.3398 16.2362C17.5019 17.4902 16.3111 18.4675 14.9178 19.0446C13.5245 19.6217 11.9914 19.7727 10.5123 19.4785C9.03316 19.1843 7.67451 18.4581 6.60814 17.3917C6.31524 17.0988 6.31524 16.6239 6.60814 16.331C6.90103 16.0381 7.3759 16.0381 7.6688 16.331C8.52539 17.1876 9.61676 17.771 10.8049 18.0073C11.993 18.2436 13.2246 18.1224 14.3438 17.6588C15.463 17.1952 16.4196 16.4101 17.0926 15.4029C17.7656 14.3956 18.1248 13.2114 18.1248 12C18.1248 10.7886 17.7656 9.60439 17.0926 8.59714C16.4196 7.58988 15.463 6.80483 14.3438 6.34124C13.2246 5.87765 11.993 5.75636 10.8049 5.99269C9.61676 6.22903 8.52539 6.81238 7.6688 7.66897L5.01715 10.3206C4.72425 10.6135 4.24938 10.6135 3.95649 10.3206C3.66359 10.0277 3.66359 9.55286 3.95649 9.25996L6.60814 6.60831C7.67451 5.54194 9.03316 4.81573 10.5123 4.52152Z"
			fill="#828282"
		/>
	</Template>
))
