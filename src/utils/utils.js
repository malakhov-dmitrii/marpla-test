const divideNumber = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
import escapeStringRegexp from 'escape-string-regexp'

const isNumeric = num =>
	typeof num === 'number' || /^-?[0-9]+(?:\.[0-9]+)?$/.test(String(num))

const objectCountKeys = obj => Object.keys(obj).length

const filterObject = (obj, f) => {
	return Object.fromEntries(
		Object.entries(obj).filter((pair, index) => f(pair[0], pair[1], index))
	)
}

const mapObject = (obj, f) => {
	return Object.fromEntries(
		Object.entries(obj).map((item, index) => f(item[0], item[1], index))
	)
}

const arrayEnd = arr => (arr.length === 0 ? null : arr[arr.length - 1])

const findChunks = ({searchWords, textToHighlight}) => {
	if (searchWords.length === 0) return []
	const allSearchWords = `(${searchWords.map(escapeStringRegexp).join('|')})`
	const regexp = new RegExp(
		`^${allSearchWords}$|^${allSearchWords}(?= )|(?<= )${allSearchWords}$|(?<= )${allSearchWords}(?= )`,
		'g'
	)
	return Array.from(textToHighlight.matchAll(regexp)).map(item => ({
		start: item.index,
		end: item.index + (item[0] || item[1] || item[2] || item[3]).length,
	}))
}

const isDDMM = str => /^\d{2}.\d{2}$/.test(str)

const DDMMtoDate = str => {
	const ref = new Date()
	return new Date(
		ref.getFullYear(),
		Number(str.substring(3, 5)) - 1,
		Number(str.substring(0, 2))
	)
}

const dateToDDMM = date =>
	`${String(date.getDate()).padStart(2, '0')}.${String(
		date.getMonth() + 1
	).padStart(2, '0')}`

const getTodayAndYesterdayKeys = tableColumns => {
	const todayKey = tableColumns.find(isDDMM)
	const yesterdayKey = tableColumns.filter(isDDMM)[1]
	return {todayKey, yesterdayKey}
}

const countOccurrences = (arr, needle) => {
	let c = 0
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === needle) {
			c++
		}
	}
	return c
}

const getRawData = async url => {
	const response = await fetch(url)
	return await response.json()
}

export {
	divideNumber,
	isNumeric,
	objectCountKeys,
	filterObject,
	mapObject,
	arrayEnd,
	findChunks,
	isDDMM,
	dateToDDMM,
	DDMMtoDate,
	getTodayAndYesterdayKeys,
	countOccurrences,
	getRawData
}
