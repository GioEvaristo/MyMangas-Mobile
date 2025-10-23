// Dupla: Gabriel Machado e Giovanna Fonseca
// Turma: 3º Informática

import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const [mangas, setMangas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [editando, setEditando] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setMangas([]);
      return;
    }
    const q = query(collection(db, 'livros'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dados = [];
      querySnapshot.forEach((doc) => {
        dados.push({ id: doc.id, ...doc.data() });
      });
      setMangas(dados);
    });
    return unsubscribe;
  }, [user]);

  const salvarManga = async () => {
    if (titulo.trim() === '' || autor.trim() === '') {
      Alert.alert('Erro', 'Para cadastrar um mangá é necessário preencher o título e o autor.');
      return;
    }
    try {
      if (editando) {
        const docRef = doc(db, 'livros', editando.id);
        await updateDoc(docRef, { titulo, autor });
      } else {
        await addDoc(collection(db, 'livros'), {titulo, autor, userId: user.uid,});
      }
      setTitulo("");
      setAutor("");
      setEditando(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o mangá.');
    }
  };
  const excluirManga = (id: string) => {
    Alert.alert(
      'Confirmação de Exclusão',
      'Deseja mesmo excluir esse belo mangá da sua estante?',
      [
        { text: 'Cancelar' },
        {
          text: 'Excluir',
          onPress: async () => {
            await deleteDoc(doc(db, 'livros', id));},
          },
      ]
    );
  };
  const deslogar = () => {
    signOut(auth);
  };
  const iniciarEdicao = (item) => {
    setTitulo(item.titulo);
    setAutor(item.autor);
    setEditando(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/myMangas.png')} 
          style={styles.logo}
        />
      </View>
      <View style={styles.lista}>
        <Text style={styles.title}>Título:</Text>
        <TextInput
          placeholder="Digite o título do mangá..."
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
        />
        <Text style={styles.title}>Autor:</Text>
        <TextInput
          placeholder="Digite o autor da obra..."
          style={styles.input}
          value={autor}
          onChangeText={setAutor}
        />
        <TouchableOpacity style={styles.addButton} onPress={salvarManga}>
          <Text style={styles.botao}>
            {editando ? 'Salvar Alterações' : 'Adicionar Mangá'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mangas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={require('../../assets/logomanga.webp')} style={styles.img}/>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitulo}>
                Título: {item.titulo}
              </Text>
              <Text style={styles.cardTitulo}>Autor: {item.autor}</Text>
            </View>
            <View style={{flexDirection: "row", gap: 5}}>
              <TouchableOpacity onPress={() => iniciarEdicao(item)}>
                <Ionicons name="pencil-outline" size={25} color="#1450c7ff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirManga(item.id)}>
                <Ionicons name="trash-outline" size={25} color="#1450c7ff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.botaoSair} onPress={deslogar}>
        <Text style={styles.textoSair}>SAIR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffad6fff',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 16,
  },
  logo: {
    width: 360,
    height: 160,
  },
  img: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  lista: {
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fdfbc0ff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#8DA9FF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botao: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#d4ffa7ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardTitulo: {
    fontWeight: '300',
    color: '#000',
    fontSize: 15,
  },
  botaoSair: {
    backgroundColor: '#8DA9FF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 16,
  },
  textoSair: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
