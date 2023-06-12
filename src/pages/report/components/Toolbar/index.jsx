import React from 'react'
import {createPortal} from 'react-dom'
import {actions} from '../QueriesAndWordsTables'

import {
	GridToolbarExport,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium'
import Button from '../../../../components/Button'
import IconButton from '../../../../components/IconButton'

import FilterIcon from '../../../../icons/Filter'
import PlusIcon from '../../../../icons/Plus'
import DeleteIcon from '../../../../icons/Delete'
import FileDownloadIcon from '../../../../icons/FileDownload'

import tableStyles from '../../../../components/DataGrid/index.module.scss'

export default function Toolbar(props) {
	const {
		checkedQueries,
		currentAction,
		deleteEverywhere,
		onClickAddPhrases,
		isLoadingAction,
		onClickActionButton,
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
				<IconButton variant="secondary" onClick={onClickAddPhrases}>
					<PlusIcon />
				</IconButton>
			{checkedQueries.length > 0 &&
				actions.map(action => (
					<Button
						key={action.id}
						variant={action.variant}
						startIcon={<action.icon />}
						onClick={() => onClickActionButton(action)}
					>
						{action.name}
					</Button>
				))}
			{checkedQueries.length > 0 && (
				<Button
					variant="negative"
					startIcon={<DeleteIcon />}
					onClick={deleteEverywhere}
					isLoading={isLoadingAction && currentAction.id === 'del_all'}
				>
					Удалить везде
				</Button>
			)}
			<GridToolbarExport
				variant={'secondary'}
				startIcon={<FileDownloadIcon />}
				printOptions={{disableToolbarButton: true}}
			/>
		</div>,
		toolbarPortalRef.current
	)
}
