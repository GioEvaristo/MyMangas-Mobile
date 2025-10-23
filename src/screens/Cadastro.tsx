// Dupla: Gabriel Machado e Giovanna Fonseca
// Turma: 3º Informática

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, Pressable } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function CadastroScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const cadastrar = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, senha);
            navigation.navigate("Login");
        } catch (error) {
            setErro("Erro ao cadastrar: " + error);
        }
    };
    return (
        <View style={styles.container}>
            <Image style={{ width: 360, height: 160 }} source={require("../../assets/myMangas.png")}></Image>
            <Text style={styles.title}>Cadastro</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                style={styles.input}
            />
            {erro ? <Text style={styles.error}>{erro}</Text> : null}
            <Pressable style={{
                borderRadius: 10, padding: 4, marginBottom: 250, justifyContent: 'center', alignItems: 'center', alignContent: 'center', backgroundColor: '#8DA9FF'
            }} onPress={cadastrar}><Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Entrar</Text></Pressable>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#ffad6fff',
    paddingHorizontal: 16,
    },

    title: {
        flex: 0,
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 20,
        color: "white",
    },
    input: {
        backgroundColor: "#fdfbc0ff",
        borderWidth: 2,
        borderColor: "#8DA9FF",
        padding: 8,
        marginBottom: 10,
        borderRadius: 15,
    },
    error: {
        color: "red",
        marginBottom: 10
    },

});