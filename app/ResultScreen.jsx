import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { analyzeImage } from '../lib/gemini';

const PROMPTS = {
  academic: `Act as a university professor. Looking at this image, provide an academic-style analysis in this exact JSON shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}`,
  safety: `Act as a workplace safety inspector. Looking at this image, identify any visible hazards, risks, or safety concerns. If none are visible, state that clearly. Respond in this exact JSON shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}`,
  inventory: `Act as an asset management clerk. Looking at this image, list every visible physical asset as a clean inventory list. Respond in this exact JSON shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}`,
};

export default function ResultScreen() {
  const { base64Image, promptKey, photoUri } = useLocalSearchParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runAnalysis();
  }, []);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const prompt = PROMPTS[promptKey] || PROMPTS.academic;
      const result = await analyzeImage(base64Image, prompt);
      console.log('Gemini response:', JSON.stringify(result));
      const textPart = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textPart) throw new Error('Empty response from Gemini');
      const clean = textPart.replace(/```json|```/g, '').trim();
      setAnalysis(JSON.parse(clean));
    } catch (err) {
      console.log('Error:', err.message);
      setError('Could not analyze this image. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retakeButton} onPress={() => router.back()}>
          <Text style={styles.retakeText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const personaLabels = {
    academic: '🎓 Academic Analysis',
    safety: '⚠️ Safety Analysis',
    inventory: '📦 Inventory Analysis',
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Photo Preview */}
        {photoUri && (
          <Image 
            source={{ uri: photoUri }} 
            style={styles.photoPreview} 
            resizeMode="cover"
          />
        )}

        <Text style={styles.personaTitle}>{personaLabels[promptKey] || 'Analysis'}</Text>
        
        <Text style={styles.sectionTitle}>Objects</Text>
        {analysis.objects.map((obj, i) => (
          <Text key={i} style={styles.listItem}>• {obj}</Text>
        ))}
        <Text style={styles.sectionTitle}>Context</Text>
        <Text style={styles.bodyText}>{analysis.context}</Text>
        <Text style={styles.sectionTitle}>Activities</Text>
        <Text style={styles.bodyText}>{analysis.activities}</Text>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Text style={styles.bodyText}>{analysis.recommendations}</Text>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.retakeButton} 
          onPress={() => router.push('/(tabs)/CameraScreen')}
        >
          <Text style={styles.buttonText}>📷 Take Another</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, padding: 20, paddingTop: 60 },
  scrollContent: { paddingBottom: 20 },
  photoPreview: { 
    width: '100%', 
    height: 200, 
    borderRadius: 12, 
    marginBottom: 16 
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  personaTitle: { fontSize: 22, fontWeight: 'bold', color: '#5B3FA3', marginBottom: 8 },
  loadingText: { marginTop: 12, color: '#5A6472' },
  errorText: { color: '#B3261E', textAlign: 'center', fontSize: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, color: '#1F2A44' },
  listItem: { fontSize: 15, marginTop: 4 },
  bodyText: { fontSize: 15, marginTop: 4, color: '#2B2F38' },
  bottomRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 16, 
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  backButton: { 
    backgroundColor: '#5A6472', 
    padding: 14, 
    borderRadius: 8, 
    flex: 1, 
    marginRight: 8,
    alignItems: 'center',
  },
  retakeButton: { 
    backgroundColor: '#5B3FA3', 
    padding: 14, 
    borderRadius: 8, 
    flex: 1, 
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  retakeText: { color: '#5B3FA3', fontWeight: 'bold', marginTop: 12 },
});