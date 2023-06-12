import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M15.3333 6.5C13.9066 6.5 12.75 7.6566 12.75 9.08333C12.75 10.5101 13.9066 11.6667 15.3333 11.6667C16.7601 11.6667 17.9167 10.5101 17.9167 9.08333C17.9167 7.6566 16.7601 6.5 15.3333 6.5ZM11.25 9.08333C11.25 6.82817 13.0782 5 15.3333 5C17.5885 5 19.4167 6.82817 19.4167 9.08333C19.4167 11.3385 17.5885 13.1667 15.3333 13.1667C13.0782 13.1667 11.25 11.3385 11.25 9.08333Z"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10.3333 5.25C8.9066 5.25 7.75 6.4066 7.75 7.83333C7.75 9.26007 8.9066 10.4167 10.3333 10.4167C10.8051 10.4167 11.2452 10.2909 11.6245 10.0715C11.983 9.86411 12.4418 9.98664 12.6492 10.3452C12.8566 10.7037 12.7341 11.1625 12.3755 11.3699C11.7742 11.7178 11.0758 11.9167 10.3333 11.9167C8.07817 11.9167 6.25 10.0885 6.25 7.83333C6.25 5.57817 8.07817 3.75 10.3333 3.75C11.9824 3.75 13.4016 4.72756 14.046 6.13158C14.2188 6.50804 14.0537 6.95328 13.6773 7.12606C13.3008 7.29885 12.8556 7.13374 12.6828 6.75728C12.2738 5.86629 11.3748 5.25 10.3333 5.25Z"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10.267 17.8317C13.2264 19.4729 17.4402 19.4729 20.3997 17.8317C20.1869 15.22 17.9999 13.1667 15.3333 13.1667C12.6668 13.1667 10.4797 15.22 10.267 17.8317ZM8.75 18.2501C8.75 14.6142 11.6975 11.6667 15.3333 11.6667C18.9692 11.6667 21.9167 14.6142 21.9167 18.2501C21.9167 18.5087 21.7835 18.749 21.5642 18.8861C17.9876 21.1214 12.679 21.1214 9.1025 18.8861C8.88321 18.749 8.75 18.5087 8.75 18.2501Z"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5.26697 16.5817C5.47976 13.9699 7.66677 11.9167 10.3333 11.9167C11.4683 11.9167 12.5144 12.2878 13.3599 12.9155C13.6925 13.1624 14.1623 13.0929 14.4092 12.7603C14.6561 12.4278 14.5866 11.958 14.254 11.7111C13.1588 10.898 11.8012 10.4167 10.3333 10.4167C6.69746 10.4167 3.75 13.3642 3.75 17.0001C3.75 17.2587 3.88321 17.499 4.1025 17.6361C5.59996 18.572 7.38644 19.1081 9.20327 19.2642C9.51081 19.2906 9.81971 19.3062 10.1288 19.311C10.543 19.3174 10.8839 18.9868 10.8903 18.5727C10.8967 18.1585 10.5661 17.8176 10.152 17.8112C9.87784 17.807 9.60405 17.7931 9.3317 17.7697C7.86811 17.6439 6.4598 17.243 5.26697 16.5817Z"
		/>
	</Template>
))