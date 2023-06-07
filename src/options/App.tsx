import { Button, CssBaseline, GeistProvider, Radio, Text, Toggle, useToasts } from '@geist-ui/core'
import { Plus } from '@geist-ui/icons'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import '../base.css'
import {
  getUserConfig,
  Language,
  Prompt,
  SitePrompt,
  Theme,
  TriggerMode,
  TRIGGER_MODE_TEXT,
  updateUserConfig,
} from '../config'
import logo from '../logo.png'
import { detectSystemColorScheme, getExtensionVersion } from '../utils'
import AddNewPromptModal from './AddNewPromptModal'
import PromptCard from './PromptCard'
import ProviderSelect from './ProviderSelect'

function OptionsPage(props: { theme: Theme; onThemeChange: (theme: Theme) => void }) {
  const [triggerMode, setTriggerMode] = useState<TriggerMode>(TriggerMode.Always)
  const [language, setLanguage] = useState<Language>(Language.Auto)
  const [prompt, setPrompt] = useState<string>(Prompt)
  const [promptOverrides, setPromptOverrides] = useState<SitePrompt[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const { setToast } = useToasts()

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.triggerMode)
      setLanguage(config.language)
      setPrompt(config.prompt)
      setPromptOverrides(config.promptOverrides)
    })
  }, [])

  const closeModalHandler = useCallback(() => {
    setModalVisible(false)
  }, [])

  const onTriggerModeChange = useCallback(
    (mode: TriggerMode) => {
      setTriggerMode(mode)
      updateUserConfig({ triggerMode: mode })
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [setToast],
  )

  const onThemeChange = useCallback(
    (theme: Theme) => {
      updateUserConfig({ theme })
      props.onThemeChange(theme)
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [props, setToast],
  )

  const onLanguageChange = useCallback(
    (language: Language) => {
      updateUserConfig({ language })
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [setToast],
  )

  return (
    <div className="container mx-auto">
      <nav className="flex flex-row justify-between items-center mt-5 px-2">
        <div className="flex flex-row items-center gap-2">
          <img src={logo} className="w-10 h-10 rounded-lg" />
          <span className="font-semibold">SPOJDifficultyAssistant(v{getExtensionVersion()})</span>
        </div>
        <div className="flex flex-row gap-3">
          <a
            href="https://github.com/ishandutta2007/chatgpt-competitive-programming-extension/issues"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </a>
          <a
            href="https://github.com/ishandutta2007/competitive-programming-problem-difficulty-extension"
            target="_blank"
            rel="noreferrer"
          >
            Source code
          </a>
        </div>
      </nav>
      <main className="w-[600px] mx-auto mt-14">
        <Text h2>Options</Text>
        Nothing much to confugure at this point.Do create an issue at <a href="https://github.com/ishandutta2007/competitive-programming-problem-difficulty-extension/issues"> github </a> if you need to make something configurable.
      </main>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(Theme.Auto)

  const themeType = useMemo(() => {
    if (theme === Theme.Auto) {
      return detectSystemColorScheme()
    }
    return theme
  }, [theme])

  useEffect(() => {
    getUserConfig().then((config) => setTheme(config.theme))
  }, [])

  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <OptionsPage theme={theme} onThemeChange={setTheme} />
    </GeistProvider>
  )
}

export default App
