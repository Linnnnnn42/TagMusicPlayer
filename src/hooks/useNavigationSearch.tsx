import { SearchBarProps } from 'react-native-screens'
import { colors } from '@/constants/tokens'
import { useLayoutEffect, useState } from 'react'
import { useNavigation } from 'expo-router'

const defaultSearchOptions: SearchBarProps = {
    tintColor: colors.primary,
    hideWhenScrolling: false,
}

export const useNavigationSearch = ({
    searchBarOptions,
}: {
    searchBarOptions?: SearchBarProps
}) => {
    const [search, setSearch] = useState('')

    const navigation = useNavigation()

    const handleOnChangeText: SearchBarProps['onChangeText'] = ({ nativeEvent: { text } }) => {
        // Equal to...
        // (event) => {
        //     const text = event.nativeEvent.text;
        //     setSearch(text);
        // }

        setSearch(text)
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                ...defaultSearchOptions,
                ...searchBarOptions,
                onChangeText: handleOnChangeText,
            },
        })
    }, [navigation, searchBarOptions])

    return search
}
