import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native'
import defaultStyle from '@/styles/style'
import { colors, paperThemeColors } from '@/constants/tokens'
import TabHeader from '@/components/TabHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import FloatingSearchBar from '@/components/FloatingSearchBar/FloatingSearchBar'
import SearchButton from '@/components/FloatingSearchBar/SearchButton'
import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { i18nTokens } from '@/i18n/i18nTokens'
import { tagContext } from '@/app/_layout'
import { Divider, Portal, Snackbar } from 'react-native-paper'
import { UniformListUtilComponent } from '@/components/ListUtilComponents'

export default function TagsTab() {
    // const [visible, setVisible] = useState(false)
    const [undoDeleteSnackbarVisible, setUndoDeleteSnackbarVisible] = useState(false)

    const onDismissUndoDeleteSnackbar = () => {
        setUndoDeleteSnackbarVisible(false)
    }

    const { t } = useTranslation()

    const [newTagName, setNewTagName] = useState('')
    const tagManagement = useContext(tagContext)
    if (!tagManagement) {
        throw new Error('Tag context is not available')
    }
    const { tags, addTag, deleteTag } = tagManagement

    const handleAddTag = () => {
        try {
            addTag(newTagName)
            setNewTagName('')
        } catch (error: any) {
            console.error(error)
            Alert.alert(
                t(i18nTokens.alert.errorTitle),
                t(i18nTokens.tabs.tagsContent.errorMsg.failToAddTag),
            )
        }
    }

    const handleDeleteTag = (tagName: string) => {
        // setUndoDeleteSnackbarVisible(true)
        Alert.alert(
            t(i18nTokens.tabs.tagsContent.deleteTagTitle),
            t(i18nTokens.tabs.tagsContent.deleteTagMsg, { tagName }),
            [
                {
                    text: t(i18nTokens.alert.cancelButtonText),
                    style: 'cancel',
                },
                {
                    text: t(i18nTokens.alert.deleteButtonText),
                    style: 'destructive',
                    onPress: () => {
                        try {
                            deleteTag(tagName)
                        } catch (error) {
                            console.error('Failed to delete tag:', error)
                            Alert.alert(
                                t(i18nTokens.alert.errorTitle),
                                t(i18nTokens.tabs.tagsContent.errorMsg.failToDeleteTag),
                            )
                        }
                    },
                },
            ],
        )
    }

    const renderTagItem = ({ item }: { item: string }) => (
        <View style={styles.tagItem}>
            <Text style={styles.tagText}>{item}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTag(item)}>
                <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={{ backgroundColor: colors.background, height: '100%' }}>
            <SafeAreaView
                style={{
                    ...defaultStyle.container,
                    backgroundColor: colors.primaryOpacity30,
                    height: 'auto',
                }}
            >
                <TabHeader
                    tabTitle={i18nTokens.tabs.tags}
                    iconName={'tags'}
                    rotate={'-15deg'}
                    translateY={-35}
                    translateX={-30}
                />
                <View style={{ backgroundColor: '#fff', height: '86%' }}>
                    {/*<FloatingSearchBar visible={visible} />*/}
                    {/*<SearchButton visible={visible} onPress={setVisible} />*/}

                    {/* Input Area for tag name */}
                    <View style={styles.addTagContainer}>
                        <TextInput
                            style={styles.tagInput}
                            value={newTagName}
                            onChangeText={setNewTagName}
                            placeholder={t(i18nTokens.tabs.tagsContent.inputPlaceHolder)}
                            placeholderTextColor={colors.textMuted}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddTag}>
                            <Text style={styles.addButtonText}>
                                {t(i18nTokens.tabs.tagsContent.addTagButton)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tag List */}
                    <FlatList
                        data={tags}
                        renderItem={renderTagItem}
                        keyExtractor={(item) => item}
                        style={styles.tagList}
                        contentContainerStyle={
                            tags.length === 0 ? styles.emptyTagList : { paddingBottom: 140 }
                        }
                        ItemSeparatorComponent={Divider}
                        ListEmptyComponent={
                            <UniformListUtilComponent
                                text={t(i18nTokens.tabs.tagsContent.listEmptyComponent)}
                            />
                        }
                        ListFooterComponent={
                            tags.length === 0 ? null : (
                                <UniformListUtilComponent
                                    text={t(i18nTokens.tabs.tagsContent.listFooterComponent)}
                                />
                            )
                        }
                    />

                    {/* Snack Bar for undo delete */}
                    <Portal>
                        <Snackbar
                            visible={undoDeleteSnackbarVisible}
                            duration={1500}
                            onDismiss={onDismissUndoDeleteSnackbar}
                            style={{
                                // position: 'relative',
                                // backgroundColor: '#fff',
                                bottom: 140,
                            }}
                        >
                            Undo Delete
                        </Snackbar>
                    </Portal>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    addTagContainer: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    tagInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.textMutedOpacity30Light,
        borderRadius: 8,
        padding: 12,
        marginRight: 8,
        color: colors.text,
        backgroundColor: colors.background,
    },
    addButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    tagList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    emptyTagList: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    tagText: {
        fontSize: 16,
        color: colors.text,
    },
    deleteButton: {
        backgroundColor: paperThemeColors.error,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
})
