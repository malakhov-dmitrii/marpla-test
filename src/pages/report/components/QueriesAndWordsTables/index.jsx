import React, {
	useCallback,
	useDeferredValue,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'
import {
	renderReverseDateCell,
	renderReverseFixedCell,
	valueGetter,
} from '../../utils/cellRenderers.jsx'
import {
	GRID_CHECKBOX_SELECTION_COL_DEF,
	GridCellCheckboxRenderer,
	GridHeaderCheckbox,
} from '@mui/x-data-grid-premium'
import {
	arrayEnd,
	filterObject,
	findChunks,
	isDDMM,
	getTodayAndYesterdayKeys,
} from '../../../../utils/utils.js'
import {useDebouncedCallback} from 'use-debounce'
import {useGridApiRef} from '@mui/x-data-grid-premium'

import DataGrid from '../../../../components/DataGrid'
import Checkbox from '../../../../components/Checkbox'
import Link from '../../../../components/Link'
import Tabs from '../../../../components/Tabs'
import Tab from '../../../../components/Tab'
import CustomTab from '../../../../components/CustomTab'
import Highlighter from 'react-highlight-words'
import CellValue from '../../../../components/CellValue'
import Toolbar from '../Toolbar'
import CellPhrase from '../CellPhrase'
import BaseButton from '../BaseButton'
import BaseTextField from '../BaseTextField'

import CompareIcon from '../../../../icons/Compare'
import CheckboxMarkedIcon from '../../../../icons/CheckboxMarked'
import CheckboxIndeterminateIcon from '../../../../icons/CheckboxIndeterminate'
import CheckboxBlankIcon from '../../../../icons/CheckboxBlank'
import CopyIcon from '../../../../icons/Copy'
import DeleteIcon from '../../../../icons/Delete'
import ArrowRightIcon from '../../../../icons/ArrowRight'

import styles from './index.module.scss'
import tableStyles from '../../../../components/DataGrid/index.module.scss'

const numberOrNull = v => (typeof v === 'number' ? v : null)
export const actions = [
	{
		id: 'move',
		name: 'Переместить',
		dialogTitle: 'Переместить фразы',
		icon: ArrowRightIcon,
		variant: 'blue',
		successMessage: 'Фразы успешно перемещены',
		actionText: 'Выберите списки, в которые нужно переместить эти фразы',
	},
	{
		id: 'copy',
		name: 'Дублировать',
		dialogTitle: 'Дублировать фразы',
		icon: CopyIcon,
		variant: 'primary',
		successMessage: 'Фразы успешно дублированы',
		actionText: 'Выберите списки, в которые нужно дублировать эти фразы',
	},
	{
		id: 'del',
		name: 'Удалить',
		dialogTitle: 'Удалить фразы',
		icon: DeleteIcon,
		variant: 'negative',
		successMessage: 'Фразы успешно удалены',
		actionText: 'Выберите списки, из которых нужно удалить эти фразы',
	},
]

export default function QueriesAndWordsTables(props) {
	const {
		response,
		rangeTab,
		radioValue,
		renameList,
		deleteList,
		setQueriesTabData,
		radiosRef,
	} = props
	const toolbarPortalRef = useRef()
	const inputValueRef = useRef('')

	const [queriesTableSortModel, setQueriesTableSortModel] = useState([])
	const [wordsTableSortModel, setWordsTableSortModel] = useState([])

	const [columnTab, setColumnTab] = useState('queries')

	const [leftTablePinnedColumns, setLeftTablePinnedColumns] = useState({
		left: [
			GRID_CHECKBOX_SELECTION_COL_DEF.field,
			'queries_and_words',
			'queries',
			'Карточек',
			'Частота WB',
			'top',
			'delta',
			'top_delta',
		],
	})

	const [tableRows, setTableRows] = useState([])
	const [tableColumns, setTableColumns] = useState([])
	const [checkedQueries, setCheckedQueries] = useState([])
	//const [checkedWords, setCheckedWords] = useState([])
	const [rightTableRows, setRightTableRows] = useState([])
	const [rightTableColumns, setRightTableColumns] = useState([])
	const [selectedQueriesCells, setSelectedQueriesCells] = useState({})
	const deferredSelectedQueriesCells = useDeferredValue(selectedQueriesCells)
	const filterButtonContainerEl = useRef(null)
	const leftTableCheckAllCheckboxState = useRef('unchecked')

	const [isFiltersButtonsDisabled, setIsFiltersButtonsDisabled] = useState(true)
	const [isEqualsActivated, setIsEqualsActivated] = useState(false)
	const [isMinusActivated, setIsMinusActivated] = useState(false)
	const [isFiltersActivated, setIsFiltersActivated] = useState(false)
	const getApplyQuickFilterFn = useCallback(
		query => {
			if (query === '') return null
			const words = query.toLowerCase().split(' ')
			if (isEqualsActivated) {
				return ({value}) => {
					return query === value
				}
			} else if (isMinusActivated) {
				return ({value}) => {
					return words.every(word => !value.includes(word))
				}
			}
			return ({value}) => {
				return words.every(word => value.includes(word))
			}
		},
		[isMinusActivated, isEqualsActivated]
	)

	const [visibleQueriesRowsCount, setVisibleQueriesRowsCount] = useState(0)
	const [visibleWordsRowsCount, setVisibleWordsRowsCount] = useState(0)
	//const [visibleQueriesRowsCount, setVisibleQueriesRowsCount] = useState([])
	const visibleWordsRows = useRef([])
	const onGridStateChange = useDebouncedCallback(params => {
		if (!response) return
		setIsFiltersActivated(
			params.filter.filterModel.items.filter(item => item.value !== '').length >
				0
		)
		const allVisibleRowsEntries = Object.entries(
			params.filter.visibleRowsLookup
		)
		const newVisibleRowIds = []
		for (const [wordOrQuery, isVisible] of allVisibleRowsEntries) {
			if (isVisible) {
				newVisibleRowIds.push(wordOrQuery)
			}
		}
		const newVisibleRowsCount = newVisibleRowIds.length
		if (columnTab === 'queries') {
			setVisibleQueriesRowsCount(newVisibleRowsCount)
			setVisibleWordsRowsCount(response.word[rangeTab][radioValue].length)
		} else {
			visibleWordsRows.current = newVisibleRowIds
			setVisibleWordsRowsCount(newVisibleRowsCount)
			setVisibleQueriesRowsCount(
				response.tables_data[rangeTab][radioValue].length
			)
		}
	}, 50)
	const rightTableApiRef = useGridApiRef()
	const leftTableApiRef = useGridApiRef()

	const isMovingTables = useRef(false)
	const [leftTableWidthPercent, setLeftTableWidthPercent] = useState(50)
	const startMovingTables = useCallback(() => {
		isMovingTables.current = true
	}, [])
	const onMoveTables = useCallback(e => {
		if (!isMovingTables.current) return
		const tablesWrapper = document.getElementsByClassName(styles.tables)[0]
		if (!tablesWrapper) return
		document.body.style.cursor = 'col-resize'
		e.preventDefault()
		const rect = tablesWrapper.getBoundingClientRect()
		const x = e.clientX - rect.left
		let percentX = (x / tablesWrapper.offsetWidth) * 100
		if (percentX > 90) {
			percentX = 90
		} else if (percentX < 34) {
			percentX = 34
		}
		setLeftTableWidthPercent(percentX)
	}, [])
	useEffect(() => {
		const onMouseUp = () => {
			isMovingTables.current = false
			document.body.style.cursor = null
		}
		window.addEventListener('mousemove', onMoveTables)
		window.addEventListener('mouseup', onMouseUp)
		return () => {
			window.removeEventListener('mousemove', onMoveTables)
			window.removeEventListener('mouseup', onMouseUp)
		}
	}, [onMoveTables])

	const onCheckAllQueries = useCallback(() => {
		if (
			checkedQueries.length >= 0 &&
			checkedQueries.length < response.tables_data[rangeTab][radioValue].length
		) {
			setCheckedQueries(
				response.tables_data[rangeTab][radioValue].map(row => row.id)
			)
		} else {
			setCheckedQueries([])
		}
	}, [checkedQueries, response, rangeTab, radioValue])

	const onCheckVisibleQueries = useCallback(() => {
		const visibleRows = rightTableRows.filter(row => row.queries)
		if (
			checkedQueries.length >= 0 &&
			checkedQueries.length < visibleRows.length
		) {
			setCheckedQueries(
				Array.from(
					new Set(checkedQueries.concat(visibleRows.map(row => row.id)))
				)
			)
		} else {
			setCheckedQueries(
				checkedQueries.filter(id => !visibleRows.some(row => row.id === id))
			)
		}
	}, [checkedQueries, rightTableRows])

	const onCheckWords = useCallback(
		newCheckedWords => {
			if (visibleWordsRows.current.length === newCheckedWords.length) {
				const isFilterActivated =
					visibleWordsRows.current.length <
					response.word[rangeTab][radioValue].length
				const getNewCheckedQueries = () => {
					const newCheckedQueries = []
					for (const rightTableRow of rightTableRows) {
						if (
							rightTableRow.words.some(word =>
								visibleWordsRows.current.includes(word)
							)
						) {
							newCheckedQueries.push(rightTableRow.id)
						}
					}
					return newCheckedQueries
				}

				if (
					leftTableCheckAllCheckboxState.current === 'indeterminate' ||
					leftTableCheckAllCheckboxState.current === 'unchecked'
				) {
					const newCheckedQueries = getNewCheckedQueries()
					if (isFilterActivated) {
						setCheckedQueries(prev =>
							Array.from(new Set(prev.concat(newCheckedQueries)))
						)
					} else {
						setCheckedQueries(newCheckedQueries)
					}
				} else {
					if (isFilterActivated) {
						setCheckedQueries(prev =>
							prev.filter(
								prevQueryId =>
									!response.tables_data_id_to_row[prevQueryId].words.some(
										word => visibleWordsRows.current.includes(word)
									)
							)
						)
					} else {
						setCheckedQueries([])
					}
				}
				return
			}

			const lastCheckedWord = arrayEnd(newCheckedWords)
			setSelectedQueriesCells({[lastCheckedWord]: {queries_and_words: true}})
			const newCheckedQueries = []
			const checkboxStates = Object.fromEntries(
				newCheckedWords.map(word => {
					if (
						checkedQueries.length > 0 &&
						response.word_to_phrase_ids[rangeTab][radioValue][word].every(
							checkedQueryId => checkedQueries.includes(checkedQueryId)
						)
					) {
						//fully checked
						return [word, false]
					} else {
						return [word, true]
					}
				})
			)
			const checkedWordsTemp = Object.entries(checkboxStates)
				// eslint-disable-next-line no-unused-vars
				.filter(([_, state]) => state)
				.map(([word]) => word)
			for (let i = 0; i < rightTableRows.length; i++) {
				const item = rightTableRows[i]
				if (item.words.some(w => checkedWordsTemp.includes(w))) {
					newCheckedQueries.push(item.id)
				}
			}

			const concatCheckedQueries = Array.from(
				new Set(newCheckedQueries.concat(checkedQueries))
			)
			const uncheckedWords = Object.entries(checkboxStates)
				// eslint-disable-next-line no-unused-vars
				.filter(([_, state]) => !state)
				.map(([word]) => word)
			if (uncheckedWords.length > 0) {
				setCheckedQueries(
					concatCheckedQueries.filter(
						queryId =>
							!response.tables_data_id_to_row[queryId].words.some(word =>
								uncheckedWords.includes(word)
							)
					)
				)
			} else {
				setCheckedQueries(concatCheckedQueries)
			}
		},
		[checkedQueries, response, rangeTab, radioValue, rightTableRows]
	)

	useEffect(() => {
		if (!response) return
		 if (columnTab === 'queries') {
			setQueriesTableSortModel(prev =>
				prev.length === 0 ? [{field: 'Частота WB', sort: 'desc'}] : prev
			)
			setLeftTablePinnedColumns({
				left: [
					GRID_CHECKBOX_SELECTION_COL_DEF.field,
					'Запрос',
					'queries_and_words',
					'queries',
					'Карточек',
					'Частота WB',
					'top',
					'delta',
					'top_delta',
				],
			})
			setTableColumns(
				response.tables_cols
					.slice(1)
					.map(name => {
						const isDateValue = isDDMM(name)
						const align = isDateValue ? 'center' : 'right'
						return {
							field: name,
							headerName: name,
							headerAlign: align,
							align,
							getApplyQuickFilterFn: undefined,
							valueGetter,
							hideable: !isDateValue,
							renderCell: isDateValue
								? renderReverseDateCell
								: renderReverseFixedCell,
						}
					})
					.concat([
						{
							field: 'top',
							headerName: 'Топ',
							headerAlign: 'right',
							align: 'right',
							getApplyQuickFilterFn: undefined,
							valueGetter,
							renderCell: renderReverseFixedCell,
						},
						{
							field: 'delta',
							headerName: 'Дельта',
							headerAlign: 'right',
							align: 'right',
							getApplyQuickFilterFn: undefined,
							valueGetter,
							renderCell: renderReverseFixedCell,
						},
						{
							field: 'top_delta',
							headerName: 'Дельта ТОПа',
							headerAlign: 'right',
							align: 'right',
							width: 150,
							getApplyQuickFilterFn: undefined,
							valueGetter,
							renderCell: renderReverseFixedCell,
						},
					])
			)

			const {todayKey, yesterdayKey} = getTodayAndYesterdayKeys(
				response.tables_cols
			)
			setTableRows(
				response.tables_data[rangeTab][radioValue].map(item => {
					const dateValues = {}
					const numericDateValues = []
					let hasOverflowValues = false
					for (const key in item) {
						const value = item[key]
						if (isDDMM(key)) {
							dateValues[key] = value

							if (typeof value === 'number') {
								if (value <= 99990) {
									numericDateValues.push(value)
								} else {
									hasOverflowValues = true
								}
							}
						}
					}
					const hasNumericValues = numericDateValues.length > 0

					const todayDateValue = dateValues[todayKey]
					const yesterdayDateValue = dateValues[yesterdayKey]
					const isNumericTodayAndYesterday =
						typeof dateValues[todayKey] === 'number' &&
						typeof dateValues[yesterdayKey] === 'number'
					const isValidTodayAndYesterday =
						todayDateValue <= 99990 && yesterdayDateValue <= 99990
					const isDeltaCountable =
						isNumericTodayAndYesterday && isValidTodayAndYesterday
					const isNullTodayAndYesterday =
						dateValues[todayKey] === null && dateValues[yesterdayKey] === null

					const top = hasNumericValues ? Math.min(...numericDateValues) : null
					const delta = isDeltaCountable
						? yesterdayDateValue - todayDateValue
						: null
					const topDelta =
						hasNumericValues && isDeltaCountable ? top - todayDateValue : null
					return {
						queries_and_words: item['Запрос'],
						queries: item['Запрос'],
						top:
							top === null
								? hasOverflowValues
									? true
									: null
								: numberOrNull(top),
						delta: isNullTodayAndYesterday
							? null
							: isDeltaCountable
							? numberOrNull(delta)
							: true,
						top_delta: isNullTodayAndYesterday
							? null
							: isDeltaCountable
							? numberOrNull(topDelta)
							: true,
						...item,
					}
				})
			)
		} else if (columnTab === 'words') {
			setWordsTableSortModel(prev =>
				prev.length === 0 ? [{field: 'frequency', sort: 'desc'}] : prev
			)
			setLeftTablePinnedColumns({
				left: [],
			})
			setTableColumns([
				{
					field: 'in_index',
					headerName: 'В индексе?',
					headerAlign: 'center',
					align: 'center',
					getApplyQuickFilterFn: undefined,
					renderCell: ({value}) => (
						<CellValue status={value ? 'success' : 'minus'} />
					),
				},
				{
					field: 'mention',
					headerName: 'Упоминания',
					headerAlign: 'right',
					align: 'right',
					getApplyQuickFilterFn: undefined,
					valueGetter,
					renderCell: renderReverseFixedCell,
				},
				{
					field: 'unique_mentions',
					headerName: 'Уникальные упоминания',
					headerAlign: 'right',
					align: 'right',
					getApplyQuickFilterFn: undefined,
					valueGetter,
					renderCell: renderReverseFixedCell,
				},
				{
					field: 'frequency',
					headerName: 'Частотность',
					headerAlign: 'right',
					align: 'right',
					width: 150,
					getApplyQuickFilterFn: undefined,
					valueGetter,
					renderCell: renderReverseFixedCell,
				},
				...response.tables_cols.map(name => {
					const isDateValue = isDDMM(name)
					const align = isDateValue ? 'center' : 'right'
					return {
						field: name,
						headerName: name,
						headerAlign: align,
						align,
						getApplyQuickFilterFn: undefined,
						valueGetter,
						hideable: !isDateValue,
						renderCell: isDateValue
							? renderReverseDateCell
							: renderReverseFixedCell,
					}
				}),
			])
			//don't remove, don't ask
			requestAnimationFrame(() => {
				setQueriesTableSortModel(prev =>
					prev.length === 0 ? [{field: 'Частота WB', sort: 'desc'}] : prev
				)
			})
		}
	}, [
		columnTab,
		response,
		rangeTab,
		radioValue,
	])

	const pureSelectedWords = useMemo(
		() =>
			Object.keys(
				filterObject(
					deferredSelectedQueriesCells,
					(key, value) =>
						value.queries_and_words === true
				)
			),
		[deferredSelectedQueriesCells]
	)

	useEffect(() => {
		if (!response) return
		if (columnTab === 'words') {
			const filteredQueries = response.tables_data[rangeTab][radioValue].map(
				item => {
					const hasCheckedWords = item.words.some(word =>
						pureSelectedWords.includes(word)
					)
					return {
						...item,
						queries: hasCheckedWords ? item['Запрос'] : null,
					}
				}
			)

			setRightTableRows(filteredQueries)
			//console.log(filteredQueries.filter(item => item.queries !== null))
			setRightTableColumns(
				response.tables_cols.map(name => {
					const isDateValue = isDDMM(name)
					const align = isDateValue ? 'center' : 'right'
					return {
						field: name,
						headerName: name,
						headerAlign: align,
						align,
						valueGetter,
						renderCell: isDateValue
							? renderReverseDateCell
							: renderReverseFixedCell,
					}
				})
			)

			setTableRows(
				Object.values(response.word[rangeTab][radioValue]).map(item => ({
					id: item.word,
					queries_and_words: item.word,
					...item,
				}))
			)
		}
	}, [
		columnTab,
		response,
		radioValue,
		rangeTab,
		pureSelectedWords,
	])

	useEffect(() => {
		setCheckedQueries([])
		setSelectedQueriesCells({})
	}, [columnTab, rangeTab])

	useEffect(() => {
		if (columnTab === 'words') {
			setLeftTableWidthPercent(50)
		} else {
			setLeftTableWidthPercent(100)
		}
	}, [columnTab])

	const _tableRows = useMemo(() => {
		//update array link
		return [...tableRows]
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMinusActivated, tableRows, isEqualsActivated])

	const leftTableColumns = useMemo(
		() =>
			columnTab === 'queries'
				? tableColumns
				: tableColumns
						.filter(item =>
							[
								'queries_and_words',
								'mention',
								'frequency',
								'in_index',
							].includes(item.field)
						)
						.map(item => ({
							flex: columnTab === 'words' ? 1 : undefined,
							resizable: item.field !== 'frequency',
							...item,
						})),
		[columnTab, tableColumns]
	)

	const [dataGridHeight, setDataGridHeight] = useState(window.innerHeight - 404)
	useEffect(() => {
		const onResize = () => {
			setDataGridHeight(
				window.innerHeight - 314 - radiosRef.current.offsetHeight
			)
		}
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [radiosRef])

	useEffect(() => {
		setQueriesTabData({
			deleteList,
			renameList,
			tabs: response
				? Object.entries(response.tabs)
						.filter(([key]) => key !== 'all')
						.map(([key, value]) => ({
							id: key,
							name: value,
						}))
				: [],
			response,
		})
	}, [
		deleteList,
		renameList,
		setQueriesTabData,
		response,
	])

	return (
		<>
			<div ref={toolbarPortalRef} />
			<div
				className={classnames(
					styles.tables,
					columnTab === 'words' && styles.showWordsTable
				)}
			>
				<DataGrid
					id="report_left"
					style={{
						width: `${leftTableWidthPercent}%`,
					}}
					unstable_cellSelectionModel={selectedQueriesCells}
					unstable_onCellSelectionModelChange={setSelectedQueriesCells}
					onRowSelectionModelChange={
						columnTab === 'queries' ? setCheckedQueries : onCheckWords
					}
					rowSelectionModel={columnTab === 'queries' ? checkedQueries : []}
					height={dataGridHeight}
					slotProps={{
						toolbar: {
							checkedQueries,
							rangeTab,
							toolbarPortalRef,
						},
						baseButton: {
							filterButtonContainerEl,
							isFiltersActivated,
							size: 'medium',
						},
						baseTextField: {
							isEqualsActivated,
							isFiltersButtonsDisabled,
							isMinusActivated,
							setIsEqualsActivated,
							setIsMinusActivated,
							setIsFiltersButtonsDisabled,
							inputValueRef,
							filterButtonContainerEl,
						},
					}}
					slots={{
						Toolbar,
						BaseCheckbox: Checkbox,
						BaseButton,
						BaseTextField,
					}}
					checkboxSelection
					pinnedColumns={leftTablePinnedColumns}
					onPinnedColumnsChange={setLeftTablePinnedColumns}
					sortModel={
						columnTab === 'queries'
							? queriesTableSortModel
							: wordsTableSortModel
					}
					onSortModelChange={
						columnTab === 'queries'
							? setQueriesTableSortModel
							: setWordsTableSortModel
					}
					apiRef={leftTableApiRef}
					columns={[
						{
							...GRID_CHECKBOX_SELECTION_COL_DEF,
							minWidth: 40,
							width: 40,
							renderHeader: params => {
								if (columnTab === 'queries') {
									return (
										<GridHeaderCheckbox
											{...params}
											onChange={onCheckAllQueries}
										/>
									)
								} else {
									const checked =
										checkedQueries.length > 0 &&
										visibleWordsRows.current.every(word =>
											response.word_to_phrase_ids[rangeTab][radioValue][
												word
											].every(phraseId => checkedQueries.includes(phraseId))
										)

									const indeterminate =
										!checked &&
										visibleWordsRows.current.some(word =>
											response.word_to_phrase_ids[rangeTab][radioValue]?.[
												word
											]?.every(phraseId => checkedQueries.includes(phraseId))
										)
									leftTableCheckAllCheckboxState.current = checked
										? 'checked'
										: indeterminate
										? 'indeterminate'
										: 'unchecked'
									return (
										<GridHeaderCheckbox
											{...params}
											icon={
												checked ? (
													<CheckboxMarkedIcon />
												) : indeterminate ? (
													<CheckboxIndeterminateIcon />
												) : (
													<CheckboxBlankIcon />
												)
											}
										/>
									)
								}
							},
							renderCell: params => {
								let checked = false
								let indeterminate = false
								if (columnTab === 'words' && params.row.word) {
									const matchCheckedQueriesCount = checkedQueries.reduce(
										(acc, checkedQueryId) =>
											response.tables_data_id_to_row[
												checkedQueryId
											].words.includes(params.row.word)
												? acc + 1
												: acc,
										0
									)
									if (matchCheckedQueriesCount === params.row.unique_mentions) {
										checked = true
									} else if (matchCheckedQueriesCount > 0) {
										indeterminate = true
									}
								}
								return (
									<GridCellCheckboxRenderer
										{...params}
										indeterminate={indeterminate}
										icon={
											checked ? (
												<CheckboxMarkedIcon />
											) : indeterminate ? (
												<CheckboxIndeterminateIcon />
											) : (
												<CheckboxBlankIcon />
											)
										}
									/>
								)
							},
						},
						{
							field: 'queries_and_words',
							headerName: 'Запросы и слова',
							width: 460,
							getApplyQuickFilterFn,
							renderCell: ({value}) =>
								columnTab === 'queries' ? (
									<CellPhrase phrase={value} />
								) : (
									<span className={styles.accentText}>{value}</span>
								),
							renderHeader: () => (
								<Tabs
									value={columnTab}
									onChange={(_, tab) => setColumnTab(tab)}
									className={tableStyles.cellHeight}
									onClick={e => e.stopPropagation()}
									classes={{flexContainer: styles.tableTabsFlexContainer}}
								>
									<Tab
										className={tableStyles.cellHeight}
										border
										label={
											<CustomTab
												icon={CompareIcon}
												label={'Запросы'}
												count={
													response &&
													visibleWordsRowsCount ===
														response.word[rangeTab][radioValue].length
														? visibleQueriesRowsCount
														: undefined
												}
											/>
										}
										value="queries"
									/>
									<Tab
										className={tableStyles.cellHeight}
										label={
											<CustomTab
												icon={CompareIcon}
												label={'Слова'}
												count={
													response &&
													visibleQueriesRowsCount ===
														response.tables_data[rangeTab][radioValue].length
														? visibleWordsRowsCount
														: undefined
												}
											/>
										}
										value="words"
									/>
								</Tabs>
							),
						},
						...leftTableColumns,
					]}
					rows={_tableRows}
					onStateChange={onGridStateChange}
				/>
				{columnTab === 'words' && (
					<>
						<span
							className={styles.moveTablesLine}
							onMouseDown={startMovingTables}
							style={{height: `${dataGridHeight}px`}}
						/>
						<DataGrid
							id="report_right"
							style={{
								width: `${100 - leftTableWidthPercent}%`,
							}}
							sortModel={queriesTableSortModel}
							onSortModelChange={setQueriesTableSortModel}
							onRowSelectionModelChange={setCheckedQueries}
							rowSelectionModel={checkedQueries}
							height={dataGridHeight}
							slots={{Toolbar: undefined, BaseCheckbox: Checkbox}}
							initialState={{
								filter: {
									filterModel: {
										items: [
											{
												field: 'queries',
												operator: 'isNotEmpty',
											},
										],
									},
								},
								pinnedColumns: {
									left: [
										GRID_CHECKBOX_SELECTION_COL_DEF.field,
										'queries',
										'Карточек',
										'Частота WB',
									],
								},
							}}
							checkboxSelection
							columns={[
								{
									...GRID_CHECKBOX_SELECTION_COL_DEF,
									minWidth: 40,
									width: 40,
									renderHeader: params => (
										<GridHeaderCheckbox
											{...params}
											onChange={onCheckVisibleQueries}
										/>
									),
								},
								{
									field: 'queries',
									headerName: 'Запросы',
									width: 220,
									renderCell: ({value}) =>
										value ? (
											<Link
												blank
												underline={'hover'}
												to={`https://www.wildberries.ru/catalog/0/search.aspx?sort=popular&search=${value}`}
											>
												<Highlighter
													className={tableStyles.blueText}
													highlightClassName={tableStyles.highlight}
													searchWords={pureSelectedWords}
													autoEscape={true}
													textToHighlight={value}
													findChunks={findChunks}
												/>
											</Link>
										) : (
											''
										),
								},
								...rightTableColumns.filter(
									item =>
										isDDMM(item.headerName) ||
										['Карточек', 'Частота WB'].includes(item.field)
								),
							]}
							rows={rightTableRows}
							apiRef={rightTableApiRef}
						/>
					</>
				)}
			</div>
		</>
	)
}
