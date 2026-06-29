import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { imageToBase64 } from '../lib/gemini';

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams();
  const router = useRouter();

  async function handleAnalyze() {
    const base64Image = await imageToBase64(photoUri);
    console.log('Base64 length:', base64Image.length); // para ma-confirm
    router.push({ pathname: '/ResultScreen', params: { base64Image } });
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="contain" />

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.retakeButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
          <Text style={styles.buttonText}>Analyze</Text>
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
    justifyContent: 'space-around', 
    padding: 20,
    backgroundColor: '#111',
  },
  retakeButton: { 
    backgroundColor: '#5A6472', 
    padding: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  analyzeButton: { 
    backgroundColor: '#5B3FA3', 
    padding: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});