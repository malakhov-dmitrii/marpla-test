import React, {useCallback, useState} from 'react'
import {useSnackbar} from 'notistack'
import {useParams} from 'react-router-dom'
import classnames from 'classnames'
import useApi from '../../../../api/useApi'
import {
	dateToDDMM,
	DDMMtoDate,
	getTodayAndYesterdayKeys,
} from '../../../../utils/utils'
import {renderDateCell} from '../../utils/cellRenderers'
import subDays from 'date-fns/subDays'

import UpdateClockwiseIcon from '../../../../icons/UpdateClockwise'
import CompareIcon from '../../../../icons/Compare'

import styles from './index.module.scss'

export default function TodayDateCell(props) {
	const {params} = props

	const {todayKey} = getTodayAndYesterdayKeys(Object.keys(params.row))

	return renderDateCell(params, {
		reverse: true,
	})
}
