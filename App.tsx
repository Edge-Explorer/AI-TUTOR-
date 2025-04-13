import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  Switch,
  ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; // Import BlurView from expo-blur

const { width, height } = Dimensions.get('window');

const AI_TUTOR_APP = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [serverStatus, setServerStatus] = useState('unknown');

  // Configure server URL based on platform with fallback options.
  // For Android physical devices or emulators that do not map localhost, replace with your PC's IP.
  const SERVER_URLS = Platform.select({
    ios: ['http://localhost:8000', 'http://127.0.0.1:8000'],
    android: ['http://localhost:8000'], // <--- this is the correct one for ADB reverse
    default: ['http://localhost:8000', 'http://127.0.0.1:8000']
  });
  
  const [currentServerUrlIndex, setCurrentServerUrlIndex] = useState(0);
  const currentServerUrl = SERVER_URLS[currentServerUrlIndex];

  // Try alternative server URL if the first one fails
  const tryAlternativeServerUrl = () => {
    if (currentServerUrlIndex < SERVER_URLS.length - 1) {
      setCurrentServerUrlIndex(currentServerUrlIndex + 1);
      return true;
    }
    return false;
  };

  // Check server connection on app start and when server URL changes
  useEffect(() => {
    checkServerConnection();
  }, [currentServerUrlIndex]);

  const checkServerConnection = async () => {
    setServerStatus('checking');
    try {
      console.log(`Checking server connection to ${currentServerUrl}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${currentServerUrl}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setServerStatus('connected');
        console.log('Server connection successful!');
      } else {
        setServerStatus('error');
        console.log('Server returned an error status');
        
        // Try alternative server URL
        if (tryAlternativeServerUrl()) {
          console.log('Trying alternative server URL...');
        }
      }
    } catch (exception) {
      console.error('Server connection exception:', exception);
      setServerStatus('error');
      
      // Check if the exception is an AbortError
      if (exception instanceof DOMException && exception.name === 'AbortError') {
        console.log('Connection timeout');
      }
      
      if (tryAlternativeServerUrl()) {
        console.log('Trying alternative server URL...');
      }
    }
  };

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log(`Sending request to ${currentServerUrl}/chat`);
      
      // Set up timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minute timeout
      
      const response = await fetch(`${currentServerUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ question }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.response) {
        setAnswer(data.response);
      } else {
        setAnswer('Sorry, could not get an answer.');
      }
    } catch (exception) {
      console.error('Error submitting question:', exception);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      // Check if exception is an AbortError
      if (exception instanceof DOMException && exception.name === 'AbortError') {
        errorMessage = 'Request timed out. The server might be busy processing your question. Try a shorter question or try again later.';
      } 
      // Check if it's another type of Error with a message property
      else if (exception instanceof Error && exception.message) {
        errorMessage = `Request failed: ${exception.message}. Please check your connection and try again.`;
      }
      
      setAnswer(errorMessage);
      
      // Try reconnecting to server
      checkServerConnection();
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => {
    setQuestion('');
    setAnswer('');
  };

  // Retry connection button handler
  const handleRetryConnection = () => {
    checkServerConnection();
  };

  // Colors for light and dark modes
  const colors = {
    light: {
      background: 'rgba(245, 247, 250, 0.92)',
      primary: '#4776E6',
      secondary: '#8E54E9',
      text: '#333333',
      subtitleText: '#666666',
      inputBackground: 'rgba(255, 255, 255, 0.95)',
      inputText: '#333333',
      answerBackground: 'rgba(255, 255, 255, 0.95)',
      answerText: '#333333',
      sendButtonBg: '#4776E6',
      clearButtonBg: '#ff6b6b',
      headerBackground: '#4776E6',
      errorText: '#e53935',
      backgroundOverlay: 'rgba(255, 255, 255, 0.65)'
    },
    dark: {
      background: 'rgba(18, 18, 18, 0.88)',
      primary: '#3D5AFE',
      secondary: '#243B55',
      text: '#FFFFFF',
      subtitleText: '#BBBBBB',
      inputBackground: 'rgba(42, 42, 42, 0.95)',
      inputText: '#FFFFFF',
      answerBackground: 'rgba(30, 30, 30, 0.95)',
      answerText: '#FFFFFF',
      sendButtonBg: '#3D5AFE',
      clearButtonBg: '#B71C1C',
      headerBackground: '#141E30',
      errorText: '#ff6e6e',
      backgroundOverlay: 'rgba(0, 0, 0, 0.65)'
    }
  };

  // Get current theme colors
  const currentColors = isDarkMode ? colors.dark : colors.light;

  // Render server status indicator
  const renderServerStatus = () => {
    let statusColor = '#999';
    let statusText = 'Checking server...';
    
    if (serverStatus === 'connected') {
      statusColor = '#4CAF50';
      statusText = 'Server connected';
    } else if (serverStatus === 'error') {
      statusColor = '#F44336';
      statusText = 'Server connection failed';
    } else if (serverStatus === 'unknown') {
      statusColor = '#FFC107';
      statusText = 'Server status unknown';
    }
    
    return (
      <View style={styles.serverStatusContainer}>
        {/* Replace backdropFilter with BlurView */}
        <BlurView
          intensity={5}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.blurViewContent}>
          <View style={styles.statusRow}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: currentColors.subtitleText }]}>
              {statusText}
            </Text>
          </View>
          
          {serverStatus === 'error' && (
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: currentColors.sendButtonBg }]} 
              onPress={handleRetryConnection}
            >
              <Text style={styles.retryButtonText}>Retry Connection</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const backgroundImage = 'https://static.vecteezy.com/system/resources/previews/008/506/639/non_2x/hand-drawn-physic-formulas-science-knowledge-education-chem-formula-and-physics-math-formula-and-physics-white-background-hand-drawn-line-math-formula-and-physics-formula-png.png';

  return (
    <ImageBackground 
      source={{ uri: backgroundImage }} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: currentColors.backgroundOverlay }]} />
      <View style={[styles.container]}>
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "dark-content"} 
          backgroundColor={currentColors.headerBackground}
        />
        
        {/* Header */}
        <View style={[styles.header, { backgroundColor: currentColors.headerBackground }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Math & Science AI Tutor</Text>
              <Text style={styles.subtitle}>Your personal education assistant</Text>
            </View>
            
            {/* Theme Toggle */}
            <View style={styles.themeToggleContainer}>
              <MaterialIcons name={isDarkMode ? "nightlight-round" : "wb-sunny"} size={24} color="#FFFFFF" />
              <Switch 
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                style={styles.themeSwitch}
              />
            </View>
          </View>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.mainContent}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Server Status */}
            {renderServerStatus()}
            
            {/* Input Container */}
            <View style={styles.questionSection}>
              <Text style={[styles.sectionTitle, { 
                color: currentColors.text
              }]}>
                Ask Your Question
              </Text>
              
              <View style={[
                styles.inputContainer,
                { backgroundColor: currentColors.inputBackground },
                isFocused && [styles.inputContainerFocused, { borderColor: currentColors.primary }]
              ]}>
                <TextInput
                  style={[
                    styles.input,
                    { color: currentColors.inputText }
                  ]}
                  placeholder="Enter a math or science question..."
                  placeholderTextColor="#a0a0a0"
                  value={question}
                  onChangeText={setQuestion}
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                
                {question.length > 0 && (
                  <TouchableOpacity 
                    style={styles.clearInputButton}
                    onPress={clearInput}
                  >
                    <MaterialIcons name="close" size={20} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  { backgroundColor: currentColors.sendButtonBg },
                  (!question.trim() || loading) && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={!question.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <View style={styles.submitButtonContent}>
                    <Text style={styles.submitButtonText}>
                      Get Answer
                    </Text>
                    <MaterialIcons name="send" size={20} color="#FFFFFF" style={styles.sendIcon} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            {/* Answer Container */}
            <View style={styles.answerSection}>
              <Text style={[styles.sectionTitle, { 
                color: currentColors.text
              }]}>
                AI Tutor Response
              </Text>
              
              <View style={[
                styles.answerContainer,
                { backgroundColor: currentColors.answerBackground }
              ]}>
                {answer ? (
                  <ScrollView 
                    style={styles.answerScrollView}
                    showsVerticalScrollIndicator={true}
                    persistentScrollbar={true}
                    contentContainerStyle={styles.answerScrollContent}
                  >
                    <Text style={[
                      styles.answerText, 
                      { color: currentColors.answerText }
                    ]}>
                      {answer}
                    </Text>
                  </ScrollView>
                ) : (
                  <View style={styles.emptyAnswer}>
                    <Text style={[styles.emptyAnswerText, { 
                      color: currentColors.subtitleText
                    }]}>
                      Ask a question and I'll help you understand math and science concepts!
                    </Text>
                  </View>
                )}
              </View>
              {answer && (
                <View style={styles.scrollHintContainer}>
                  <MaterialIcons name="swap-vert" size={16} color={currentColors.subtitleText} />
                  <Text style={[styles.scrollHintText, { color: currentColors.subtitleText }]}>
                    Scroll to see more
                  </Text>
                </View>
              )}
            </View>
            
            {/* Footer Banner */}
            <View style={[
              styles.footerBanner, 
              { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }
            ]}>
              <Text style={[styles.footerText, { 
                color: currentColors.subtitleText
              }]}>
                I'm specialized in math and science topics only
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeSwitch: {
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  serverStatusContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden', // Important for BlurView to be properly contained
    position: 'relative',
  },
  blurViewContent: {
    padding: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
  },
  retryButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  questionSection: {
    marginBottom: 20,
  },
  answerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  inputContainer: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  inputContainerFocused: {
    borderWidth: 2,
  },
  input: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  clearInputButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  sendIcon: {
    marginLeft: 8,
  },
  answerContainer: {
    borderRadius: 15,
    minHeight: 200,
    maxHeight: height * 0.4, // Make it responsive to screen height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  answerScrollView: {
    padding: 15,
  },
  answerScrollContent: {
    flexGrow: 1,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
  },
  emptyAnswer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyAnswerText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scrollHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  scrollHintText: {
    fontSize: 12,
    marginLeft: 4,
  },
  footerBanner: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    fontStyle: 'italic',
  }
});

export default AI_TUTOR_APP;





//before running it check your adb devices connection
//adb devices
//it will show something like these
//* daemon not running; starting now at tcp:5037
//* daemon started successfully
//List of devices attached
//RZ8NA2F91HR     device
//after that put these cmd in your terminal
//adb reverse tcp:8000 tcp:8000
//8000

//now your frontend will make the server connection to your device
//and you can run your frontend
