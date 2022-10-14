import React, { FC, useState, useEffect } from 'react'
import { UnexpectedError } from '../../../libs/Misc'
import moment from 'moment'

type Props = {
  combinedJson: string
  setCodeCallback: (code: string) => void
}

type SavedItem = {
  ts: number
  content: string
}

const TIMER_SEC = 60
const LS_BACKUP_KEY = 'autosave'
const MAX_NUM_BACKUPS = 5

const getFromLocalStorage = (): Array<SavedItem> => {
  const stored = window.localStorage.getItem(LS_BACKUP_KEY)
  let savedBackups: Array<SavedItem> = []
  try {
    savedBackups = stored ? JSON.parse(stored) : []
  } catch (e) {
    throw new UnexpectedError(
      `Could not retrieve backup due to malformed JSON: ${stored}`
    )
  }
  return savedBackups
}

const backupToLocalStorage = (text: string) => {
  const savedBackups = getFromLocalStorage()
  if (savedBackups.some((saved) => saved.content === text)) {
    console.log('Similar backup exists, no need to backup current.')
    return
  }
  console.log('Backing up current')
  savedBackups.unshift({ ts: new Date().getTime(), content: text })
  while (savedBackups.length > MAX_NUM_BACKUPS) {
    savedBackups.pop()
  }
  window.localStorage.setItem(LS_BACKUP_KEY, JSON.stringify(savedBackups))
}

const Autosaves: FC<Props> = (props: Props) => {
  const [savedItems, setSavedItems] = useState<Array<SavedItem>>([])

  useEffect(() => {
    // Initialize saved items
    try {
      setSavedItems(getFromLocalStorage())
    } catch (e) {
      alert(
        'Warning: backups are not working for some reason, please make sure to frequently save your work somewhere safe. See console for more details on the error.'
      )
      console.error(e)
    }
    // Set timer
    const intervalId = setInterval(() => {
      try {
        backupToLocalStorage(props.combinedJson)
        setSavedItems(getFromLocalStorage())
      } catch (e) {
        console.error(e)
        alert(e)
      }
    }, TIMER_SEC * 1000)
    return () => clearInterval(intervalId)
  }, [props.combinedJson])

  return (
    <>
      <div className="text-gray-2 text-sm pb-1">Autosaves</div>
      {savedItems.length == 0 && (
        <div className="text-gray-5 text-center text-xs italic pb-1">
          No autosaves yet
        </div>
      )}
      {savedItems.map((savedItem) => (
        <div
          key={savedItem.ts}
          className="rounded border border-gray-5 text-gray-3 p-1 mt-1 text-center text-xs hover:bg-gray-6 active:bg-gray-5 select-none cursor-pointer"
          onClick={() => props.setCodeCallback(savedItem.content)}
        >
          {moment(savedItem.ts).fromNow()}
        </div>
      ))}
    </>
  )
}

export default Autosaves
