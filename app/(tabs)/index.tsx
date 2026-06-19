import { ActivityIndicator, Button, FlatList, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../../components/Themed';
import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from '../../api/todo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {Todos} from '../../api/todo';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';

export default function TabOneScreen() {
  const [todo,setTodo]=useState('')
  const queryClient=useQueryClient();


  // useEffect(()=>{  //we can do this to prefetch some data before the user navigates to that screen
  //   queryClient.prefetchQuery({
  //     queryKey:['todos',2],
  //     queryFn:()=>{getTodoById(2)},
  //   }
  //   );
  // });
  //to get the data
  const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });
  const addMutation=useMutation({
    mutationFn:createTodo,
    onSuccess:(data)=>{
      queryClient.invalidateQueries({queryKey:['todos']}); //todoQuery runs automatically after this
    },
  })

  const deleteMutation=useMutation({
    mutationFn:deleteTodo,
    onSuccess:(data)=>{
      queryClient.invalidateQueries({queryKey:['todos']}); //todoQuery runs automatically after this
    },
  })
  const updateQueryClient=(updateTodo:Todos)=>{ //our custom client so we dont invalidate all the queries (Increases Performance)
    queryClient.setQueryData(['todos'], (data:any) => {
      if (!data) return [updateTodo];
      return data.map((todo:Todos) => {
        if(todo.id===updateTodo.id){
          return updateTodo;
        }
        return todo;
      });
    });
  }

  const updateMutation=useMutation({
    mutationFn:updateTodo,
    onSuccess:updateQueryClient,
  })

const addTodo=()=>{
      addMutation.mutate(todo);
  };

  

 const renderTodo: ListRenderItem<Todos> = ({ item }) => {
  
  const deleteTodo=()=>{
    deleteMutation.mutate(item.id); 
   };
  
  const toggleDone = () => {
    updateMutation.mutate({ ...item, done: !item.done });
  };
  return (
    <View style={styles.todoContainer}>
      <TouchableOpacity onPress={toggleDone} style={styles.todo} >
        {item.done ? (
          <Ionicons name="checkmark-circle" size={24} color="green" />
        ) : (
          <Ionicons name="checkmark-circle-outline" size={24} color="black" />
        )}
        <Text style={styles.todoText}>{item.text}</Text>
        <Ionicons name="trash" size={24} color="red" onPress={deleteTodo} />
      </TouchableOpacity>
    </View>
  );
};
return (
  <View style={styles.container}>
    <View style={styles.form}>
      <TextInput placeholder="Add todo" onChangeText={setTodo} value={todo} style={styles.input}/>
      <Button title="Add" onPress={addTodo} />
    </View>
    {todosQuery. isLoading ? <ActivityIndicator size={'large'} /> : null}
    {todosQuery.isError ? <Text>Couldn't load todos :</Text> : null}
    <FlatList data={todosQuery.data} renderItem={renderTodo} keyExtractor={(item) => item.id.toString()} />
  </View>);
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },todoContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  padding:10,
gap:10,
marginVertical:4,
backgroundColor:"white"},
todo:{
  flex:1,
  flexDirection: 'row',
  alignItems: 'center',
  
},todoText:{
  flex:1,
  marginLeft:10,
  fontSize:16,
},form:{
  flexDirection: 'row',
  marginVertical: 20,
  alignItems: 'center',
},input:{
  flex:1,
  borderWidth:1,
  height:40,
  borderColor:'gray',
  padding:10,
  borderRadius:4,
  backgroundColor:'white',}
});
