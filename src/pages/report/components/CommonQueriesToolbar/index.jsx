import React from 'react'
import {createPortal} from 'react-dom'
import classnames from 'classnames'

import {
	GridToolbarExport,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium'

import FilterIcon from '../../../../icons/Filter'
import FileDownloadIcon from '../../../../icons/FileDownload'

import tableStyles from '../../../../components/DataGrid/index.module.scss'

export default function CommonQueriesToolbar(props) {
	const {
		toolbarPortalRef,
	} = props

	if (!toolbarPortalRef?.current) return null

	return createPortal(
		<div className={tableStyles.toolbar}>
			<GridToolbarQuickFilter
				quickFilterParser={query => [query.trim()]}
				debounceMs={0}
				//quickFilterFormatter={quickFilterValues => quickFilterValues.join('')}
			/>

			<GridToolbarFilterButton
				variant={'secondary'}
				startIcon={<FilterIcon />}
			/>
			<GridToolbarExport
				variant="secondary"
				startIcon={<FileDownloadIcon />}
				printOptions={{disableToolbarButton: true}}
			/>
		</div>,
		toolbarPortalRef.current
	)
}
