import { Alert, Button, StyleSheet, Text, View, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

const DetailsScreen = ({ route, navigation }) => {

  /* 2. Get the param */
  const { itemId, itemdTitle, itemdPriority, itemdDue, itemdDescription, itemdIsCompleted } = route.params;
  const [isCompleted, setIsCompleted] = useState(itemdIsCompleted);
  const [loading, setLoading] = useState(false);

  const handleMarkCompleted = async () => {
    setLoading(true);
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, {
      isCompleted: true,
    });
    setIsCompleted(true);
    setLoading(false);
  };

  const handleDeleteItem = async () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            setLoading(true);
            const itemRef = doc(db, "items", itemId);
            await deleteDoc(itemRef);
            setLoading(false);
            navigation.goBack();  // Navigate back to the ListScreen after deletion
          },
          style: "destructive"
        }
      ]
    );
  };

  return (

    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>{JSON.stringify(itemdTitle)}</Text>
      <Text>Description: {JSON.stringify(itemdDescription)}</Text>
      <Text>Due date: {JSON.stringify(itemdDue)}</Text>
      <Text>Priority: {itemdPriority ? 'High' : 'Low'}</Text>
      <Text>Completed: {isCompleted ? 'Yes' : 'No'}</Text>

      <Button
        title={isCompleted ? 'Completed' : 'Mark as Completed'}
        color="#0dde46"
        onPress={handleMarkCompleted}
        disabled={isCompleted}
      />

      <Button
        title="Delete"
        color="red"
        onPress={handleDeleteItem}
      />

      <Modal
        transparent={true}
        animationType="none"
        visible={loading}
        onRequestClose={() => { }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={loading} size="small" color="#ffff" />
          </View>
        </View>
      </Modal>

    </View>
  )
}

export default DetailsScreen

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
})