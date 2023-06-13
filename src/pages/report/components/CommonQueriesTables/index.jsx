import React, {
	useCallback,
	useDeferredValue,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'
import {renderFixedCell, valueGetter} from '../../utils/cellRenderers.jsx'
import {
	GRID_CHECKBOX_SELECTION_COL_DEF,
	GridCellCheckboxRenderer,
	GridHeaderCheckbox,
	useGridApiRef,
} from '@mui/x-data-grid-premium'
import {
	arrayEnd,
	countOccurrences,
	filterObject,
	findChunks,
} from '../../../../utils/utils.js'
import {useDebouncedCallback} from 'use-debounce'

import DataGrid from '../../../../components/DataGrid'
import Checkbox from '../../../../components/Checkbox'
import Link from '../../../../components/Link'
import Tabs from '../../../../components/Tabs'
import Tab from '../../../../components/Tab'
import CustomTab from '../../../../components/CustomTab'
import Highlighter from 'react-highlight-words'
import Toolbar from '../CommonQueriesToolbar'
import CellPhrase from '../CellPhrase'
import BaseButton from '../BaseButton'
import BaseTextField from '../BaseTextField'

import CompareIcon from '../../../../icons/Compare'
import CheckboxIndeterminateIcon from '../../../../icons/CheckboxIndeterminate'
import CheckboxMarkedIcon from '../../../../icons/CheckboxMarked'
import CheckboxBlankIcon from '../../../../icons/CheckboxBlank'

import styles from './index.module.scss'
import tableStyles from '../../../../components/DataGrid/index.module.scss'
import { memo } from 'react'

const nullOrUndefined = value => value === null || value === undefined

const sortComparator = (a, b) => {
	if (typeof a === 'string' || typeof b === 'string') {
		return String(a).localeCompare(String(b))
	}
	if (nullOrUndefined(a) && nullOrUndefined(b)) {
		return 0
	}
	if (nullOrUndefined(a)) {
		return -1
	}
	if (nullOrUndefined(b)) {
		return 1
	}
	return a - b
}


export default function CommonQueriesTables(props) {
	const {
		lists,
		rangeTab,
		radioValue,
		queriesTabData,
		existenceInProjectRadioValue,
	} = props

// console.log(queriesTabData);

	const toolbarPortalRef = useRef()
	const inputValueRef = useRef('')

	const [queriesTableSortModel, setQueriesTableSortModel] = useState([])
	const [wordsTableSortModel, setWordsTableSortModel] = useState([])

	const [columnTab, setColumnTab] = useState('queries')

	const [tableRows, setTableRows] = useState([])
	const [checkedQueries, setCheckedQueries] = useState([])
	const [rightTableRows, setRightTableRows] = useState([])
	const [selectedQueriesCells, setSelectedQueriesCells] = useState({})
	const deferredSelectedQueriesCells = useDeferredValue(selectedQueriesCells)
	const filterButtonContainerEl = useRef(null)
	const wordsMentions = useRef({})
	const leftTableCheckAllCheckboxState = useRef('unchecked')

	const leftTableApiRef = useGridApiRef()
	const rightTableApiRef = useGridApiRef()

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
	const visibleWordsRows = useRef([])
	const onGridStateChange = useDebouncedCallback(params => {
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
			setVisibleWordsRowsCount(
				existenceInProjectRadioValue === 'all'
					? lists[rangeTab].words[radioValue].length
					: undefined
			)
		} else {
			visibleWordsRows.current = newVisibleRowIds
			setVisibleWordsRowsCount(newVisibleRowsCount)
			setVisibleQueriesRowsCount(
				existenceInProjectRadioValue === 'all'
					? lists[rangeTab].phrases[radioValue].length
					: undefined
			)
		}
	}, 50)

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
			checkedQueries.length < lists[rangeTab].phrases[radioValue].length
		) {
			setCheckedQueries(lists[rangeTab].phrases[radioValue].map(row => row.q))
		} else {
			setCheckedQueries([])
		}
	}, [checkedQueries, lists, rangeTab, radioValue])

	const onCheckVisibleQueries = useCallback(() => {
		const visibleRows = rightTableRows.filter(row => row.queries)
		if (
			checkedQueries.length >= 0 &&
			checkedQueries.length < visibleRows.length
		) {
			setCheckedQueries(
				Array.from(
					new Set(checkedQueries.concat(visibleRows.map(row => row.q)))
				)
			)
		} else {
			setCheckedQueries(
				checkedQueries.filter(id => !visibleRows.some(row => row.q === id))
			)
		}
	}, [checkedQueries, rightTableRows])

	const onCheckWords = useCallback(
		newCheckedWords => {
			if (visibleWordsRows.current.length === newCheckedWords.length) {
				const isFilterActivated =
					visibleWordsRows.current.length <
					lists[rangeTab].words[radioValue].length
				const indexOfPhrase = phraseId => {
					return newCheckedWords.findIndex(word => {
						const query = leftTableApiRef.current.getRow(word)
						return query.phrases.includes(phraseId)
					})
				}

				setCheckedQueries(prevCheckedQueries =>
					prevCheckedQueries.reduce((acc, phraseId) => {
						const idx = indexOfPhrase(phraseId)
						if (idx !== -1) {
							newCheckedWords.splice(idx, 1)
							return [...acc, phraseId]
						}
						return acc
					}, [])
				)

				if (isFilterActivated && newCheckedWords.length > 0) {
					const filteredQueries = newCheckedWords.reduce((acc, word) => {
						const queryPhrases = leftTableApiRef.current.getRow(word).phrases
						const newIds = queryPhrases.filter(id => !acc.includes(id))
						return [...acc, ...newIds]
					}, [])

					setCheckedQueries(prev =>
						Array.from(new Set([...prev, ...filteredQueries]))
					)
				} else {
					setCheckedQueries([])
				}
			} else {
				const newCheckedQueries = newCheckedWords.reduce((acc, word) => {
					const queryPhrases = leftTableApiRef.current.getRow(word).phrases
					for (const queryId of checkedQueries) {
						if (!queryPhrases.includes(queryId)) {
							return acc
						}
					}
					return [...acc, ...queryPhrases]
				}, [])

				setCheckedQueries(newCheckedQueries)
			}
		},
		[checkedQueries, lists, rangeTab, radioValue, leftTableApiRef.current]
	)

	useEffect(() => {
		if (columnTab === 'queries') {
			setQueriesTableSortModel(prev =>
				prev.length === 0 ? [{field: 'popular_wb', sort: 'desc'}] : prev
			)
			setTableRows([...lists[rangeTab].phrases[radioValue]])
		} else if (columnTab === 'words') {
			setWordsTableSortModel(prev =>
				prev.length === 0 ? [{field: 'popular_wb', sort: 'desc'}] : prev
			)
		}
	}, [columnTab, lists, rangeTab, radioValue])

	const pureSelectedWords = useMemo(
		() =>
			Object.keys(
				filterObject(
					deferredSelectedQueriesCells,
					(key, value) => value.queries_and_words === true //todo: remove key !== "null" when stable
				)
			),
		[deferredSelectedQueriesCells]
	)

	const setRightTableRowsCallback = useDebouncedCallback(() => {
		if (columnTab === 'words') {
			const filteredQueries = lists[rangeTab].phrases[radioValue].map(item => {
				const hasCheckedWords = item.words.some(word =>
					pureSelectedWords.includes(word)
				)
				//console.log(rowObject)
				return {
					...item,
					queries: hasCheckedWords ? item.q : null,
				}
			})

			setRightTableRows(filteredQueries)
			setTableRows([...lists[rangeTab].words[radioValue]])
		}
	}, 50)

	useEffect(() => {
		setRightTableRowsCallback()
	}, [columnTab, lists, radioValue, rangeTab, pureSelectedWords])

	useEffect(() => {
		setCheckedQueries([])
		setSelectedQueriesCells({})
	}, [columnTab, rangeTab, existenceInProjectRadioValue])

	const showWordsTable = useMemo(() => columnTab === 'words', [columnTab])

	useEffect(() => {
		if (showWordsTable) {
			setLeftTableWidthPercent(50)
		} else {
			setLeftTableWidthPercent(100)
		}
	}, [columnTab, showWordsTable])

	const _tableRows = useMemo(() => {
		if (!tableRows.length || !queriesTabData) return [];

		if (existenceInProjectRadioValue === 'all') {
			return [...tableRows]
		}
		if (columnTab === 'queries') {
			const projectPhrasesSet =
				queriesTabData?.response?.all_phrases || new Set()
			return [
				...tableRows.filter(({q}) =>
					existenceInProjectRadioValue === 'added'
						? projectPhrasesSet.has(q)
						: !projectPhrasesSet.has(q)
				),
			]
		} else {
			const wordToPhraseIdsSource =
				queriesTabData?.response?.word_to_phrase_ids?.all?.all || {}
			return [
				...tableRows.filter(({word}) =>
					existenceInProjectRadioValue === 'added'
						? Boolean(wordToPhraseIdsSource[word])
						: !wordToPhraseIdsSource[word]
				),
			]
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [existenceInProjectRadioValue, columnTab, tableRows, queriesTabData])

	return (
		<>
			<div ref={toolbarPortalRef} />
			<div
				className={classnames(
					styles.tables,
					showWordsTable && styles.showWordsTable
				)}
			>
				<DataGrid
					id="common_queries_left"
					apiRef={leftTableApiRef}
					getRowId={row => row.q || row.word}
					style={{
						width: `${leftTableWidthPercent}%`,
					}}
					unstable_cellSelectionModel={selectedQueriesCells}
					unstable_onCellSelectionModelChange={setSelectedQueriesCells}
					onRowSelectionModelChange={
						columnTab === 'queries' ? setCheckedQueries : onCheckWords
					}
					rowSelectionModel={columnTab === 'queries' ? checkedQueries : []}
					height={600}
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
							isAddButtonDisabled: rangeTab === '0',
						},
					}}
					slots={{
						Toolbar,
						BaseCheckbox: Checkbox,
						BaseButton,
						BaseTextField,
					}}
					checkboxSelection
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
										visibleWordsRows.current.length > 0 &&
										visibleWordsRows.current.every(word =>
											(
												leftTableApiRef.current.getRow(word) || {phrases: []}
											)?.phrases?.every(phraseId =>
												checkedQueries.includes(phraseId)
											)
										)

									const indeterminate =
										!checked &&
										checkedQueries.length > 0 &&
										visibleWordsRows.current.length > 0 &&
										visibleWordsRows.current.some(word =>
											(
												leftTableApiRef.current.getRow(word) || {phrases: []}
											)?.phrases?.every(phraseId =>
												checkedQueries.includes(phraseId)
											)
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
											rightTableApiRef.current
												?.getRow(checkedQueryId)
												?.words.includes(params.row.word)
												? acc + 1
												: acc,
										0
									)
									if (
										matchCheckedQueriesCount ===
										wordsMentions.current[
											`${rangeTab}_${radioValue}_${existenceInProjectRadioValue}_${params.row.word}`
										]
									) {
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
							valueGetter: ({row}) => row.q || row.word,
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
													visibleWordsRowsCount ===
														lists[rangeTab].words[radioValue].length ||
													columnTab === 'queries'
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
													visibleQueriesRowsCount ===
														lists[rangeTab].phrases[radioValue].length ||
													columnTab === 'words'
														? visibleWordsRowsCount
														: undefined
												}
											/>
										}
										value="words"
									/>
								</Tabs>
							),
							//renderCell: params => <i>{console.log(params)}</i>,
						},
						{
							field: 'popular_wb',
							headerName: 'Частота WB',
							headerAlign: 'right',
							align: 'right',
							sortComparator,
							//flex: 1,
							//resizable: false,
							getApplyQuickFilterFn: undefined,
							valueGetter,
							renderCell: renderFixedCell,
						},
						...(columnTab === 'words'
							? [
									{
										field: 'mentions',
										headerName: 'Упоминания',
										headerAlign: 'right',
										align: 'right',
										getApplyQuickFilterFn: undefined,
										valueGetter: ({row}) => {
											const key = `${rangeTab}_${radioValue}_${existenceInProjectRadioValue}_${row.word}`
											if (typeof wordsMentions.current[key] === 'number') {
												return wordsMentions.current[key]
											} else {
												if (existenceInProjectRadioValue === 'all') {
													const value = countOccurrences(
														lists[rangeTab].allWords[radioValue],
														row.word
													)
													wordsMentions.current[key] = value
													return value
												} else {
													const wordToPhraseIdsSource =
														queriesTabData?.response?.word_to_phrase_ids?.all
															?.all || {}
													let value = 0
													lists[rangeTab].phrases[radioValue].forEach(
														({words}) => {
															if (
																existenceInProjectRadioValue === 'added' &&
																wordToPhraseIdsSource[row.word]
															) {
																words.includes(row.word) && value++
															} else if (
																existenceInProjectRadioValue === 'not_added' &&
																!wordToPhraseIdsSource[row.word]
															) {
																words.includes(row.word) && value++
															}
														}
													)
													wordsMentions.current[key] = value
													return value
												}
											}
										},
										renderCell: renderFixedCell,
									},
							  ]
							: []),
					]}
					rows={_tableRows}
					onStateChange={onGridStateChange}
				/>
				{showWordsTable && (
					<span
						className={styles.moveTablesLine}
						onMouseDown={startMovingTables}
						style={{height: `600px`}}
					/>
				)}
				{showWordsTable && (
					<DataGrid
						id="common_queries_right"
						apiRef={rightTableApiRef}
						getRowId={row => row.q}
						style={{
							width: `${100 - leftTableWidthPercent}%`,
						}}
						sortModel={queriesTableSortModel}
						onSortModelChange={setQueriesTableSortModel}
						onRowSelectionModelChange={setCheckedQueries}
						height={600}
						checkboxSelection
						 rowSelectionModel={checkedQueries}
                        slots={{
                            Toolbar: undefined,
                            BaseCheckbox: Checkbox,
                        }}
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
                        }}
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
								//sortComparator: (a, b) => a?.text.localeCompare(b?.text) || 0,
								//valueGetter: params => params.value?.text || '-',
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
							{
								field: 'popular_wb',
								headerName: 'Частота WB',
								headerAlign: 'right',
								align: 'right',
								sortComparator,
								getApplyQuickFilterFn: undefined,
								//resizable: false,
								//flex: 1,
								valueGetter,
								renderCell: renderFixedCell,
							},
						]}
						rows={rightTableRows}
					/>
				)}
			</div>
		</>
	)
}
