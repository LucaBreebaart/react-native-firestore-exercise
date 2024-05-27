import { Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import { getMyBucketList } from '../services/DbService';
import { useFocusEffect } from '@react-navigation/native';

const ListScreen = ({ navigation }) => {

    const goToAdd = () => { navigation.navigate("Add") }

    const [bucketItems, setBucketItems] = useState([])

    const [refreshing, setRefreshing] = useState(false);

    // useEffect(() => {
    //     handleGettingOfData()
    // }, [])

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            handleGettingOfData()
            
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                // do nothing
            };
        }, [])
    )

    const handleGettingOfData = async () => {
        var allData = await getMyBucketList()
        // console.log("data:" + allData)
        setBucketItems(allData)
        setRefreshing(false);
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => {
            navigation.navigate("Details", {
                itemId: item.id,
                itemdTitle: item.title,
                itemdPriority: item.priority,
                itemdDue: item.due,
                itemdDescription: item.description,
                itemdIsCompleted: item.isCompleted,
            });
        }}>
            <Text style={item.isCompleted ? styles.completedText : null}>
                {item.title}
            </Text>
            {item.priority ? <AntDesign name="star" size={24} color="orange" /> : null}
        </TouchableOpacity>
    );


    return (
        <SafeAreaView>
            <View style={styles.container}>

                <Pressable style={styles.addButton} onPress={goToAdd}>
                    <Text style={styles.addButtonText}>Add</Text>
                    <Entypo name="bucket" size={16} color="green" />
                </Pressable>

                {/* THIS WILL LOOP FOR EACH ITEM - scroll view or flatlist - must be able to scroll through the list so that im able to scroll if the list is too long */}


                {/* {
                    bucketItems != [] ? (
                        bucketItems.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate("Details")}>
                                <Text>{item.title}</Text>

                                {item.priority ? <AntDesign name="star" size={24} color="orange" /> : null}
                            </TouchableOpacity>
                        ))

                    ) : (
                        <Text>No items</Text>
                    )
                } */}

                {/* END LOOP */}

                <FlatList
                    data={bucketItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    onRefresh={handleGettingOfData}
                    refreshing={refreshing}
                    ListEmptyComponent={<Text>No Items</Text>}
                />

            </View>

        </SafeAreaView>
    )
}

export default ListScreen

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    card: {
        width: '100%',
        backgroundColor: 'white',
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: 'white',
        borderColor: 'green',
        borderWidth: 2,
        padding: 10,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    },
    addButtonText: {
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold'
    }
})