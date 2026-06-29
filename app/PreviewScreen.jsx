import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { imageToBase64 } from '../lib/gemini';

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams();
  const router = useRouter();

  async function handleAnalyze(promptKey) {
    const base64Image = await imageToBase64(photoUri);
    console.log('Base64 length:', base64Image.length);
    router.push({ pathname: '/ResultScreen', params: { base64Image, promptKey } });
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="contain" />

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.retakeButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.personaRow}>
        <TouchableOpacity style={styles.academicButton} onPress={() => handleAnalyze('academic')}>
          <Text style={styles.buttonText}>Academic Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.safetyButton} onPress={() => handleAnalyze('safety')}>
          <Text style={styles.buttonText}>Safety Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inventoryButton} onPress={() => handleAnalyze('inventory')}>
          <Text style={styles.buttonText}>Inventory Analysis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  preview: { flex: 1 },
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    paddingTop: 16,
    backgroundColor: '#111',
  },
  personaRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 16,
    backgroundColor: '#111',
  },
  retakeButton: { 
    backgroundColor: '#5A6472', 
    padding: 14, 
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    marginBottom: 8,
  },
  academicButton: { backgroundColor: '#2E5BBA', padding: 10, borderRadius: 8, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  safetyButton: { backgroundColor: '#BA2E2E', padding: 10, borderRadius: 8, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  inventoryButton: { backgroundColor: '#2EBA5B', padding: 10, borderRadius: 8, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
});