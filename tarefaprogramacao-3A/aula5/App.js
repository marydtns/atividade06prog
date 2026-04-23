import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import api from './api';
import { login, cadastrar } from './auth';

const Stack = createNativeStackNavigator();

// ================= LOGIN =================
function TelaLogin({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');

  const fazerLogin = () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    login(email, senha)
      .then((userCredential) => {
        Alert.alert("Sucesso", "Login realizado!");

        navigation.reset({
          index: 0,
          routes: [{ name: 'ListaDeContatos' }],
        });
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          Alert.alert("Erro", "Usuário não encontrado");
        } else if (error.code === "auth/wrong-password") {
          Alert.alert("Erro", "Senha incorreta");
        } else {
          Alert.alert("Erro", "Falha ao fazer login");
        }
      });
  };

  return (
    <View style={styles.container}>
      <Image style={styles.tinyLogo} source={{
        uri: 'https://marketplace.canva.com/A5alg/MAESXCA5alg/1/tl/canva-user-icon-MAESXCA5alg.png',
      }} />

      <View style={styles.container_inputs}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          onChangeText={setEmail}
          value={email}
        />

        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          onChangeText={setSenha}
          value={senha}
          secureTextEntry
        />
      </View>

      <View style={styles.container_btn}>
        <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
          <Text style={styles.texto}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.texto}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


// ================= CADASTRO =================
function TelaCadastro({ navigation }) {
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');

  const salvar = () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    cadastrar(email, senha)
      .then(() => {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        navigation.goBack();
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Erro", "Email já cadastrado");
        } else if (error.code === "auth/weak-password") {
          Alert.alert("Erro", "Senha deve ter pelo menos 6 caracteres");
        } else {
          Alert.alert("Erro", "Erro ao cadastrar");
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_inputs}>
        <Text>Nome</Text>
        <TextInput style={styles.input} onChangeText={setNome} value={nome} />

        <Text>Email</Text>
        <TextInput style={styles.input} onChangeText={setEmail} value={email} />

        <Text>Senha</Text>
        <TextInput style={styles.input} onChangeText={setSenha} value={senha} secureTextEntry />
      </View>

      <TouchableOpacity style={styles.botao} onPress={salvar}>
        <Text style={styles.texto}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ================= LISTA =================
function ListadeContatos({ navigation }) {
  const [contatos, setContatos] = React.useState([]);

  const carregarContatos = () => {
    api.get('/contatos')
      .then(res => setContatos(res.data))
      .catch((err) => {
        console.log(err);
        Alert.alert("Erro", "Erro ao carregar contatos. Verifique a API.");
      });
  };

  React.useEffect(() => {
    carregarContatos();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('CadastroDeContato', { atualizar: carregarContatos })}>
          <Text style={{ fontSize: 25, marginRight: 15 }}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FAEBD7' }}>
      <FlatList
        data={contatos}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Nenhum contato encontrado
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemLista}
            onPress={() =>
              navigation.navigate('AlteracaoDeContatos', {
                ...item,
                atualizar: carregarContatos
              })
            }
          >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.telefone}>{item.telefone}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ================= EDITAR =================
function AlteracaodeContatos({ route, navigation }) {
  const { id, nome, telefone, email, atualizar } = route.params;

  const [novoNome, setNovoNome] = React.useState(nome);
  const [novoTelefone, setNovoTelefone] = React.useState(telefone);
  const [novoEmail, setNovoEmail] = React.useState(email);

  const alterar = () => {
    api.put(`/contatos/${id}`, {
      nome: novoNome,
      telefone: novoTelefone,
      email: novoEmail
    }).then(() => {
      if (atualizar) atualizar();
      navigation.goBack();
    }).catch(() => {
      Alert.alert("Erro", "Erro ao atualizar contato");
    });
  };

  const excluir = () => {
    api.delete(`/contatos/${id}`)
      .then(() => {
        if (atualizar) atualizar();
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert("Erro", "Erro ao excluir contato");
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_inputs}>
        <TextInput style={styles.input} value={novoNome} onChangeText={setNovoNome} />
        <TextInput style={styles.input} value={novoTelefone} onChangeText={setNovoTelefone} />
        <TextInput style={styles.input} value={novoEmail} onChangeText={setNovoEmail} />

        <TouchableOpacity style={styles.botao} onPress={alterar}>
          <Text style={styles.texto}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botao, { backgroundColor: 'red' }]} onPress={excluir}>
          <Text style={styles.texto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ================= CADASTRO CONTATO =================
function CadastrodeContato({ navigation, route }) {
  const atualizar = route.params?.atualizar;

  const [novoNome, setNovoNome] = React.useState('');
  const [novoTelefone, setNovoTelefone] = React.useState('');
  const [novoEmail, setNovoEmail] = React.useState('');

  const salvar = () => {
    api.post('/contatos', {
      nome: novoNome,
      telefone: novoTelefone,
      email: novoEmail
    }).then(() => {
      if (atualizar) atualizar();
      navigation.goBack();
    }).catch(() => {
      Alert.alert("Erro", "Erro ao salvar contato");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_inputs}>
        <TextInput style={styles.input} placeholder="Nome" value={novoNome} onChangeText={setNovoNome} />
        <TextInput style={styles.input} placeholder="Telefone" value={novoTelefone} onChangeText={setNovoTelefone} />
        <TextInput style={styles.input} placeholder="Email" value={novoEmail} onChangeText={setNovoEmail} />

        <TouchableOpacity style={styles.botao} onPress={salvar}>
          <Text style={styles.texto}>Salvar Contato</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ================= APP =================
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={TelaLogin} />
        <Stack.Screen name="Cadastro" component={TelaCadastro} />
        <Stack.Screen name="ListaDeContatos" component={ListadeContatos} />
        <Stack.Screen name="AlteracaoDeContatos" component={AlteracaodeContatos} />
        <Stack.Screen name="CadastroDeContato" component={CadastrodeContato} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ================= ESTILOS =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAEBD7', alignItems: 'center', justifyContent: 'center' },
  tinyLogo: { width: 50, height: 50 },
  input: { backgroundColor: '#fff', height: 40, margin: 12, borderWidth: 1, padding: 10, width: 200 },
  botao: { backgroundColor: '#149e02ff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  texto: { color: '#fff', fontWeight: 'bold' },
  container_btn: { gap: 10, marginTop: 10, width: 200 },
  container_inputs: { width: 200, marginTop: 20 },
  itemLista: { padding: 15, borderBottomWidth: 1, backgroundColor: '#fff' },
  nome: { fontSize: 18, fontWeight: 'bold' },
  telefone: { fontSize: 16, color: 'gray' }
});