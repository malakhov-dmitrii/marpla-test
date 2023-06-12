import React, {
	useCallback,
	useEffect,
	useState,
	useMemo,
	useRef,
	forwardRef,
} from 'react'
import classnames from 'classnames'
import hotkeys from 'hotkeys-js'
import {
	DataGridPremium,
	GridToolbarQuickFilter,
	GridToolbarFilterButton,
	GridToolbarExport,
	GRID_CHECKBOX_SELECTION_COL_DEF,
	getGridNumericOperators,
	getGridStringOperators,
	ruRU,
} from '@mui/x-data-grid-premium'
import {arrayEnd} from '../../utils/utils.js'

import Button from '../Button'
import Checkbox from '../Checkbox'
import Input from '../Input'

import FilterIcon from '../../icons/Filter'
import FileDownloadIcon from '../../icons/FileDownload'
import SearchIcon from '../../icons/Search'
import CopyIcon from '../../icons/Copy'

import styles from './index.module.scss'
import {objectCountKeys} from '../../utils/utils.js'

ruRU.components.MuiDataGrid.defaultProps.localeText.columnMenuManageColumns =
	'Настроить столбцы'

const filterOperators = [
	...getGridNumericOperators(),
	...getGridStringOperators(),
].filter(
	(item, index, array) => array.findIndex(f => f.value === item.value) === index
)

const BaseButton = forwardRef((props, ref) => {
	if (props.children === 'Remove all') {
		return (
			<Button ref={ref} {...props} size="small">
				Очистить фильтры
			</Button>
		)
	} else if (
		props.children === 'Добавить фильтр' ||
		props.children === 'Показать все' ||
		props.children === 'Скрыть все'
	) {
		return <Button ref={ref} {...props} size="small" />
	} else {
		return <Button ref={ref} {...props} />
	}
})

const nullOrUndefined = value => value === null || value === undefined

const BaseTextField = props => {
	if (props.type === 'search') {
		return (
			<Input
				{...props}
				type={'text'}
				className={styles.input}
				placeholder={'Поиск'}
				icon={<SearchIcon />}
			/>
		)
	} else {
		return <Input {...props} type={'text'} className={undefined} />
	}
}

const Toolbar = () => {
	return (
		<div className={styles.toolbar}>
			<GridToolbarQuickFilter />
			<GridToolbarFilterButton
				// @ts-ignore
				variant={'secondary'}
				startIcon={<FilterIcon />}
			/>
			<GridToolbarExport
				variant={'secondary'}
				startIcon={<FileDownloadIcon />}
				printOptions={{disableToolbarButton: true}}
			/>
		</div>
	)
}

export const DataGrid = props => {
	const {
		columns = [],
		autoHeight = false,
		width = '100%',
		height = 500,
		style,
		slots = {},
		unstable_cellSelectionModel,
		unstable_onCellSelectionModelChange,
		rows = [],
		getRowId,
		hideToolbar = false,
		sortModel: sortModelProp,
		onSortModelChange: onSortModelChangeProp,
		slotProps = {},
		disableCopying,
		onStateChange,
		className,
		...rest
	} = props

	const [sortModel, setSortModel] = useState([])
	const [selectedCells, setSelectedCells] = useState({})
	const [copyButtonPos, setCopyButtonPos] = useState(null)
	const sortedRowsId = useRef([])
	const rowIdToData = useRef({})
	const isTableSelectionCleared = useRef(true)

	const _onStateChange = useCallback(
		(...args) => {
			sortedRowsId.current = args[0].sorting.sortedRows
			rowIdToData.current = args[0].rows.dataRowIdToModelLookup
			onStateChange && onStateChange(...args)
		},
		[onStateChange]
	)

	const onSortModelChange = useCallback(
		value => {
			const setState = onSortModelChangeProp || setSortModel
			if (value.length === 1) {
				setState(prev => {
					const isSortExists = prev.some(sort => sort.field === value[0].field)
					if (isSortExists) {
						return value
					} else {
						return [...value, ...prev].slice(0, 2)
					}
				})
			} else if (value.length > 1) {
				setState(prev => {
					if (prev.length === value.length) {
						const existingSortItem = prev.find(prevSortItem =>
							value.some(
								newSortItem =>
									newSortItem.field === prevSortItem.field &&
									newSortItem.sort !== prevSortItem.sort
							)
						)
						const firstFilter = {
							...existingSortItem,
							sort: existingSortItem.sort === 'asc' ? 'desc' : 'asc',
						}
						return [
							firstFilter,
							...prev.filter(sort => sort.field !== existingSortItem.field),
						]
					} else {
						const newSortItem = arrayEnd(value)
						return [
							newSortItem,
							...prev.filter(sort => sort.field !== newSortItem.field),
						]
					}
				})
			} else {
				setState(value)
			}
		},
		[onSortModelChangeProp]
	)

	const sortComparator = useCallback((a, b) => {
		if (typeof a === 'string' || typeof b === 'string') {
			return String(a).localeCompare(String(b))
		}
		if (nullOrUndefined(a) && nullOrUndefined(b)) {
			return 0
		}
		if (nullOrUndefined(a)) {
			return 1
		}
		if (nullOrUndefined(b)) {
			return -1
		}
		return a - b
	}, [])

	const copyCells = useCallback(() => {
		const rowsOrder = {}
		for (const rowKey in selectedCells) {
			const cell = selectedCells[rowKey]
			const row = rowIdToData.current[rowKey]
			const rowIndex = sortedRowsId.current.findIndex(
				id => String(id) === rowKey
			)
			const rowArr = []
			for (const cellKey in cell) {
				const shouldBeCopied = cell[cellKey] && cellKey !== '__check__'
				if (shouldBeCopied) {
					const valueGetter = columns.find(
						column => column.field === cellKey
					)?.valueGetter
					const value = valueGetter
						? valueGetter({row, value: row[cellKey]})
						: row[cellKey]
					if (value !== undefined) {
						rowArr.push(value === null ? '-' : value)
					}
				}
			}
			if (rowArr.length) {
				rowsOrder[rowIndex] = rowArr
			}
		}
		const tableArr = Object.values(rowsOrder)
		if (tableArr.length) {
			const textToCopy = tableArr.map(row => row.join('\t')).join('\n')
			navigator.clipboard.writeText(textToCopy).then(
				() => {
					window.alert('Выделенные ячейки скопированы')
				},
				() => {
					window.alert('Копирование из браузера не поддерживается системой')
				}
			)
		}
	}, [selectedCells, columns])

	useEffect(() => {
		if (disableCopying || objectCountKeys(selectedCells) === 0) return

		hotkeys('ctrl+c, command+c', copyCells)

		return () => hotkeys.unbind('ctrl+c, command+c')
	}, [selectedCells, copyCells, disableCopying])

	const _unstable_onCellSelectionModelChange = useCallback(
		value => {
			window.getSelection()?.removeAllRanges()
			isTableSelectionCleared.current = false
			setSelectedCells(value)
			unstable_onCellSelectionModelChange &&
				unstable_onCellSelectionModelChange(value)
		},
		[setSelectedCells, unstable_onCellSelectionModelChange]
	)

	const onContextMenu = useCallback(
		e => {
			if (disableCopying || objectCountKeys(selectedCells) === 0) {
				return setCopyButtonPos(null)
			}
			e.preventDefault()
			const rect = e.currentTarget.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			setCopyButtonPos({top: y, left: x})
		},
		[selectedCells, disableCopying]
	)

	const onClick = useCallback(() => {
		setCopyButtonPos(null)
	}, [])

	const _columns = useMemo(
		() =>
			columns.map(item => ({
				sortComparator,
				...item,
				filterOperators,
				...(item.field === GRID_CHECKBOX_SELECTION_COL_DEF.field
					? {
							minWidth: 40,
							width: 40,
					  }
					: {}),
			})),
		[columns, sortComparator]
	)

	useEffect(() => {
		const onSelectionChange = () => {
			if (
				!isTableSelectionCleared.current &&
				window.getSelection()?.type !== 'Caret'
			) {
				isTableSelectionCleared.current = true
				setSelectedCells({})
				unstable_onCellSelectionModelChange &&
					unstable_onCellSelectionModelChange({})
			}
		}
		document.addEventListener('selectionchange', onSelectionChange)

		return () =>
			document.removeEventListener('selectionchange', onSelectionChange)
	}, [unstable_onCellSelectionModelChange])

	return (
		<div
			style={{width, height: autoHeight ? '' : height, ...style}}
			className={classnames(styles.wrapper, className)}
			onContextMenu={onContextMenu}
			onClick={onClick}
		>
			{copyButtonPos && (
				<Button
					className={styles.copyButton}
					variant={'additional'}
					startIcon={<CopyIcon />}
					style={copyButtonPos}
					onClick={copyCells}
				>
					Копировать
				</Button>
			)}
			<DataGridPremium
				columns={_columns}
				rows={rows}
				getRowClassName={({indexRelativeToCurrentPage}) =>
					classnames(
						styles.row,
						indexRelativeToCurrentPage % 2 === 0 && styles.odd
					)
				}
				unstable_cellSelection
				unstable_cellSelectionModel={
					unstable_cellSelectionModel || selectedCells
				}
				unstable_onCellSelectionModelChange={
					_unstable_onCellSelectionModelChange
				}
				getRowId={getRowId}
				autoHeight={autoHeight}
				sortModel={sortModelProp || sortModel}
				onSortModelChange={onSortModelChange}
				rowHeight={40}
				columnHeaderHeight={40}
				sortingOrder={['asc', 'desc']}
				classes={styles}
				localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
				componentsProps={{
					baseButton: {
						size: 'medium',
					},
					...slotProps,
				}}
				components={{
					Toolbar: hideToolbar ? undefined : Toolbar,
					BaseCheckbox: Checkbox,
					BaseButton,
					BaseTextField,
					...slots,
				}}
				showColumnVerticalBorder
				showCellVerticalBorder
				hideFooter
				disableRowSelectionOnClick
				disableMultipleRowSelection
				onStateChange={_onStateChange}
				{...rest}
			/>
		</div>
	)
}

export default DataGrid
