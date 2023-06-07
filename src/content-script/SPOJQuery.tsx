import { GearIcon } from '@primer/octicons-react'
import { useEffect, useState } from 'preact/hooks'
import { memo, useCallback, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Browser from 'webextension-polyfill'
import { captureEvent } from '../analytics'
import { Answer } from '../messaging'
import SPOJFeedback from './SPOJFeedback'
import { isBraveBrowser, shouldShowRatingTip } from './utils.js'

export type QueryStatus = 'success' | 'error' | undefined

interface Props {
  problem_ids: any
  problem_ids_done: any
  promptSource: string
  onStatusChange?: (status: QueryStatus) => void
}

function get_elements_by_inner(word) {
  let res = []
  let elems = [...document.getElementsByTagName('a')];
  elems.forEach((elem) => {
      if(elem.outerHTML.includes(word)) {
          res.push(elem)
      }
  })
  return(res)
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function isElementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}

function SPOJQuery(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [done, setDone] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [status, setStatus] = useState<QueryStatus>()
  const [reError, setReError] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)

  useEffect(() => {
    props.onStatusChange?.(status)
  }, [props, status])

  useEffect(() => {
    const port = Browser.runtime.connect()
    const listener = (msg: any) => {
      console.log("msg", msg)
      if (msg.score) {
        setAnswer(msg)
        setStatus('success')
      } else if (msg.error) {
        setError(msg.error)
        setStatus('error')
      } else if (msg.event === 'DONE') {
        setDone(true)
        // setReQuestionDone(true)
      }
    }
    port.onMessage.addListener(listener)
    port.postMessage({ problem_ids: props.problem_ids })
    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [props.problem_ids, retry])

  // retry error on focus
  useEffect(() => {
    const onFocus = () => {
      if (error && (error == 'UNAUTHORIZED' || error === 'CLOUDFLARE')) {
        setError('')
        setRetry((r) => r + 1)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [error])

  useEffect(() => {
    props.problem_ids_done = []
    shouldShowRatingTip().then((show) => setShowTip(show))
  }, [])

  useEffect(() => {
    if (status === 'success') {
      console.log('answer', answer)
      captureEvent('show_answer', { host: location.host, language: navigator.language })
    }
  }, [props.problem_ids, status])

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  if (answer) {
    console.log("Final answer", answer);
    let matching_elems = get_elements_by_inner(answer.problem_id);
    let desired_matching_elem = undefined;
    for(let i = 0; i < matching_elems.length; i++) {
      if (matching_elems[i].text == answer.problem_id) {
        desired_matching_elem = matching_elems[i];
        break;
      }
    }
    if (desired_matching_elem) {
      let bghex = rgbToHex(Math.round(answer.score), 0, 0);
      try {
        // if (!isElementInViewport(desired_matching_elem)) desired_matching_elem.scrollIntoView({behavior: 'smooth'});
        desired_matching_elem.style.backgroundColor = bghex.toString()
        if (!props.problem_ids_done) props.problem_ids_done = []
        props.problem_ids_done.push(answer.problem_id);
      } catch (error) {
        console.log("scrollIntoView failed", error);
      }
      console.log("problem_id len", props.problem_ids.length);
      console.log("problem_ids_done len", props.problem_ids_done.length);
    }
  }

  return ( <p></p> )
}

export default memo(SPOJQuery)
