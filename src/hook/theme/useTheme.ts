
import { RootState } from '@/storage'
import { ThemeType } from '@/types'
import { useSelector } from 'react-redux'

const useTheme = () => {

    const { theme }: { theme: ThemeType } = useSelector((state: RootState) => state.theme)

    return { theme }
}

export { useTheme }