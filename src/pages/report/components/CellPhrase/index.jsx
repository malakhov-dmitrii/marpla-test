import React from 'react'

import Link from '../../../../components/Link'

export default function CellPhrase(props) {
	const {phrase} = props

	return (
		<Link
			blank
			underline={'hover'}
			to={`https://www.wildberries.ru/catalog/0/search.aspx?sort=popular&search=${encodeURIComponent(
				phrase
			)}`}
		>
			{phrase}
		</Link>
	)
}
