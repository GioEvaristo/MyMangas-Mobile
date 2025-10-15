// Dupla: Gabriel Machado e Giovanna Fonseca
// Turma: 3º Informática

import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Pressable, FlatList, Image, StyleSheet } from "react-native";
import { db, auth } from '../../firebaseConfig';
import { signOut } from "firebase/auth";

export default function App({ usuario }) { // inserindo usuario de navigation
    const [livros, setLivros] = useState<any[]>([]);
    const [novoTexto, setNovoTexto] = useState("");
    const [novoAutor, setNovoAutor] = useState("");

    // Leitura em tempo real
    useEffect(() => {
        // sabendo qual usuario com uid
        const user = auth.currentUser;
        if (!user) {
            return;
        }

        const q = query(collection(db, "livros"), where("uid", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista: any[] = [];
            snapshot.forEach((doc) => {
                lista.push({ id: doc.id, ...doc.data() });
            });
            setLivros(lista);
        });
        return () => unsubscribe();
    }, []);

    // Criar tarefa
    const adicionarLivro = async () => {
        if ((novoTexto.trim() === "") && (novoAutor.trim() === "")) return;
        try {
            await addDoc(collection(db, "livros"), {
                titulo: novoTexto,
                autor: novoAutor,
                uid: usuario.uid, // associa usuario vindo da navegacao
            });
            setNovoTexto("");
            setNovoAutor("");

        } catch (error) {
            console.log("Erro: " + error)
        }

    };

    // Atualizar tarefa
    const atualizarLivro = async (id: string) => {
        const docRef = doc(db, "livros", id);
        await updateDoc(docRef, { titulo: "Atualizado!" });
    };

    // Deletar tarefa
    const deletarLivro = async (id: string) => {
        const docRef = doc(db, "livros", id);
        await deleteDoc(docRef);
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#f59a50" }}>
            <Image style={styles.logo} source={require("../../assets/myMangas.png")}></Image>
            <Text style={{ flex: 0, fontSize: 30, fontWeight: "bold", marginBottom: 20, color: "#4466e5" }}>
                Estante Virtual
            </Text>
            <Text style={styles.titulo}>Título da obra</Text>
            <TextInput
                placeholder='Título da obra'
                value={novoTexto}
                onChangeText={setNovoTexto}
                style={{
                    borderWidth: 1,
                    padding: 5,
                    marginBottom: 10,
                    borderRadius: 5,
                }}
            />
             <Text style={styles.titulo}>Autor da obra</Text>
            <TextInput
                placeholder='Autor da obra'
                value={novoAutor}
                onChangeText={setNovoAutor}
                style={{
                    borderWidth: 1,
                    padding: 5,
                    marginBottom: 10,
                    borderRadius: 5,
                }}
            />
            <Pressable style={{
                width: 200, borderRadius: 10, padding: 4, marginBottom: 30, justifyContent: 'center', alignItems: 'center', alignContent: 'center', backgroundColor: '#7fa2f3ff'
            }} onPress={adicionarLivro}><Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Adicionar Mangá</Text></Pressable>
            <FlatList
                data={livros}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.lista}>
                        <Image style={{ width: 40, height: 40 }} source={require("../../assets/logomanga.webp")} />
                        <View style={{ flexDirection: "column" }}>
                            <Text>Título: {item.titulo}</Text>
                            <Text>Autor: {item.autor}</Text>
                        </View>

                        <Pressable onPress={() => atualizarLivro(item.id)}><Image style={{ width: 30, height: 30 }} source={require('../../assets/botao-editar.png')} /></Pressable>
                        <Pressable onPress={() => deletarLivro(item.id)}><Image style={{ width: 30, height: 30 }} source={require('../../assets/remover-arquivo.png')} /></Pressable>
                    </View>
                )}
            />
            <Pressable style={{
                width: 100, borderRadius: 10, padding: 4, marginBottom: 30, justifyContent: 'center', alignItems: 'center', alignContent: 'center', backgroundColor: '#7fa2f3ff'
            }} onPress={() => signOut(auth)}><Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>SAIR</Text></Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "moccasin",
  },
  logo: {
    flex: 1,
    alignContent: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: 30,
    width: 360,
  },
  titulo: {
    fontSize: 16,
    marginTop: 5,
    color: "white",
  },
  lista: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffa502",
    color: "#fff",
  },
  texto: {
    borderWidth: 2,
    borderColor: "#FF9A00",
    padding: 10,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#FFE587",
    color: 'lightgray',
    fontWeight: "bold",
  },
  textobotao: {
    color: 'darkorange',
    fontWeight: "bold",
    fontSize: 15,
  },
  botaoadicionar: {
    alignSelf: "center",
    display: "flex",
    backgroundColor: "#caeefeff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    width: 160,
  },

});
