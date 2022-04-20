import Cookies from 'js-cookie'
import React, { FC, useEffect, useMemo } from 'react'
import { init, logEvent as logEventApi, register } from '../api'

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
  logEvent: (name: string, data: any) => Promise.resolve({})
}

type Action =
  | { type: 'SET_GOID'; value?: string }
  | { type: 'SET_VISITOR_ID'; value?: string }

export const VisitorContext = React.createContext<State>(initialState)
VisitorContext.displayName = 'VisitorContext'

function visitorReducer(state: State, action: Action) {
  console.log(action)
  switch (action.type) {
    case 'SET_GOID': {
      if (action.value)
        Cookies.set('_goid', action.value, {
          sameSite: 'lax',
          httpOnly: false,
          secure: true
        })
      return {
        ...state,
        _goid: action.value
      }
    }
    case 'SET_VISITOR_ID': {
      if (action.value)
        Cookies.set('visitor_id', action.value, {
          sameSite: 'lax',
          httpOnly: false,
          secure: true
        })
      return {
        ...state,
        visitor_id: action.value
      }
    }
  }
}

export const VisitorProvider: FC = (props): JSX.Element => {
  const [state, dispatch] = React.useReducer(visitorReducer, initialState)

  const logEvent = (name: string, data: any) => logEventApi({ name, data })

  const memoValue = useMemo(
    () => ({
      ...state,
      logEvent
    }),
    [state]
  )

  useEffect(() => {
    const visitor = {
      _referrer: document.referrer,
      _origin: window.location.href
    }

    if (state._goid) {
      Object.assign(visitor, { _goid: state._goid })
    }

    init(visitor).then(
      ({ ok, data }) =>
        ok && dispatch({ type: 'SET_GOID', value: data._goid.toString() })
    )
  }, [])

  useEffect(() => {
    if (state._goid) {
      const visitor = { _goid: state._goid }

      register(visitor).then(
        ({ ok, data }) =>
          ok &&
          dispatch({
            type: 'SET_VISITOR_ID',
            value: data.visitor_id.toString()
          })
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
