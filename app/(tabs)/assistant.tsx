import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from '@/types';
import { quickQuestions, getAssistantResponse } from '@/data/mock-assistant';

export default function AssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Dobrý den! 👋 Jsem váš MND asistent. Jak vám mohu pomoci?\n\nMůžete se mě zeptat na vaše platby, smlouvy, spotřebu nebo cokoli dalšího.',
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      text: text.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAssistantResponse(text);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        text: response,
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View className={`mx-4 mb-3 ${item.isUser ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          item.isUser
            ? 'bg-[#00A651] rounded-br-md'
            : 'bg-white rounded-bl-md shadow-sm'
        }`}
      >
        <Text
          className={`text-sm leading-5 ${
            item.isUser ? 'text-white' : 'text-[#1B1B1B]'
          }`}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F5F5F5]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 8 }}
      />

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <View className="px-4 pb-2">
          <Text className="text-xs text-[#6B7280] mb-2">Časté dotazy:</Text>
          <View className="flex-row flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <TouchableOpacity
                key={q.id}
                className="bg-white rounded-full px-3.5 py-2 border border-[#E5E7EB]"
                onPress={() => sendMessage(q.label)}
              >
                <Text className="text-xs text-[#00A651] font-medium">
                  {q.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Quick Help Categories */}
      {messages.length <= 1 && (
        <View className="px-4 pb-2">
          <Text className="text-xs text-[#6B7280] mb-2 mt-2">
            Rychlá nápověda:
          </Text>
          <View className="flex-row gap-2">
            {[
              { icon: 'flame', label: 'Plyn', color: '#F59E0B', bg: '#FEF3C7' },
              {
                icon: 'flash',
                label: 'Elektřina',
                color: '#3B82F6',
                bg: '#DBEAFE',
              },
              {
                icon: 'help-circle',
                label: 'Reklamace',
                color: '#EF4444',
                bg: '#FEE2E2',
              },
              {
                icon: 'document-text',
                label: 'Smlouvy',
                color: '#00A651',
                bg: '#E8F5E9',
              },
            ].map((cat, i) => (
              <TouchableOpacity
                key={i}
                className="flex-1 rounded-xl p-3 items-center"
                style={{ backgroundColor: cat.bg }}
                onPress={() => sendMessage(`Mám dotaz ohledně: ${cat.label}`)}
              >
                <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                <Text
                  className="text-xs font-medium mt-1"
                  style={{ color: cat.color }}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Input Bar */}
      <View className="flex-row items-end px-4 py-3 bg-white border-t border-[#E5E7EB]">
        <TextInput
          className="flex-1 bg-[#F5F5F5] rounded-2xl px-4 py-3 text-sm text-[#1B1B1B] max-h-24"
          placeholder="Napište svůj dotaz..."
          placeholderTextColor="#9CA3AF"
          value={input}
          onChangeText={setInput}
          multiline
          onSubmitEditing={() => sendMessage(input)}
        />
        <TouchableOpacity
          className="ml-2 w-11 h-11 rounded-full bg-[#00A651] items-center justify-center"
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
          style={{ opacity: input.trim() ? 1 : 0.5 }}
        >
          <Ionicons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
