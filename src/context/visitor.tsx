import Cookies from 'js-cookie'
import React, { FC, useEffect, useMemo } from 'react'
import { init, logEvent, register } from '../api'
import Config from '../config'

interface State {
  _goid?: string
  visitor_id?: string
  // eslint-disable-next-line no-unused-vars
  logEvent: (name: string, data: any) => Promise<any>
}

const initialState = {
  _goid: Cookies.get('_goid'),
  visitor_id: Cookies.get('visitor_id'),
  // eslint-disable-next-line no-unused-vars
  logEvent: (name: string, data: any) => Promise.resolve({}),
}

type Action =
  | { type: 'SET_GOID'; value?: number }
  | { type: 'SET_VISITOR_ID'; value?: number }

export const VisitorContext = React.createContext<State>(initialState)
VisitorContext.displayName = 'VisitorContext'

function visitorReducer(state: State, action: Action) {
  console.log(action)
  switch (action.type) {
    case 'SET_GOID': {
      if (action.value)
        Cookies.set('_goid', action.value.toString(), {
          secure: Config.IS_PRODUCTION,
        })

      return {
        ...state,
        _goid: action.value?.toString(),
      }
    }
    case 'SET_VISITOR_ID': {
      if (action.value)
        Cookies.set('visitor_id', action.value.toString(), {
          secure: Config.IS_PRODUCTION,
        })

      return {
        ...state,
        visitor_id: action.value?.toString(),
      }
    }
  }
}

export const VisitorProvider: FC = (props): JSX.Element => {
  const [state, dispatch] = React.useReducer(visitorReducer, initialState)

  const memoValue = useMemo(
    () => ({
      ...state,
      logEvent,
    }),
    [state]
  )

  useEffect(() => {
    const visitor = {
      _referrer: document.referrer,
      _origin: window.location.href,
    }

    if (state._goid) {
      Object.assign(visitor, { _goid: parseInt(state._goid) })
    }

    init(visitor).then(
      ({ ok, data }) => ok && dispatch({ type: 'SET_GOID', value: data._goid })
    )
  }, [])

  useEffect(() => {
    if (state._goid) {
      const visitor = {
        _goid: parseInt(state._goid),
      }

      register(visitor).then(
        ({ ok, data }) =>
          ok && dispatch({ type: 'SET_VISITOR_ID', value: data.visitor_id })
      )
    }
  }, [state._goid])

  return <VisitorContext.Provider value={memoValue} {...props} />
}

export const useVisitor = () => {
  const context = React.useContext(VisitorContext)
  if (context === undefined) {
    throw new Error(`useVisitor must be used within a VisitorProvider`)
  }
  return context
}
