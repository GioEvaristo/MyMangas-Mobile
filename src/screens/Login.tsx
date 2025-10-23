// Dupla: Gabriel Machado e Giovanna Fonseca
// Turma: 3º Informática

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, Pressable} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, senha);
        } catch (error) {
            setErro("Erro ao entrar: " + error);
        }
    };

    return (
        <View style={styles.container}>
            <Image style={{ width: 360, height: 160 }} source={require("../../assets/myMangas.png")}></Image>
            <Text style={styles.title}>Login</Text>
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
                secureTextEntry //não mostra o que foi digitado
                style={styles.input}
            />
            {erro ? <Text>{erro}</Text> : null}
            <Pressable style={{borderRadius: 10, padding: 4, marginBottom: 250, justifyContent: 'center', alignItems: 'center', alignContent: 'center', backgroundColor: '#8DA9FF'
                               }} onPress={login}><Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>ENTRAR</Text></Pressable>
            <Pressable style={{width: 200, borderRadius: 10, padding: 4, marginBottom: 100, justifyContent: 'center', alignItems: 'center', alignContent: 'center', backgroundColor: '#8DA9FF'
                               }} onPress={() => navigation.navigate("Cadastro")}><Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>CADASTRE-SE</Text></Pressable>
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
        color: "white"
    },
    input: {
        backgroundColor: "#fdfbc0ff",
        borderWidth: 2,
        borderColor: "#8DA9FF",
        padding: 8,
        marginBottom: 10,
        borderRadius: 15,
    },
});