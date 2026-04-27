import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from '@/types';
import { quickQuestions, getAssistantResponse } from '@/data/mock-assistant';
import { getUserInsights } from '@/utils/insights';
import { Tones } from '@/constants/colors';

function TypingDots() {
  const a = useRef(new Animated.Value(0.3)).current;
  const b = useRef(new Animated.Value(0.3)).current;
  const c = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const make = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      );
    const animations = [make(a, 0), make(b, 150), make(c, 300)];
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, [a, b, c]);

  const Dot = ({ v }: { v: Animated.Value }) => (
    <Animated.View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#94A3B8',
        marginHorizontal: 2,
        opacity: v,
      }}
    />
  );

  return (
    <View className="flex-row items-center bg-white px-4 py-3 rounded-2xl rounded-bl-md self-start mx-4 mb-3">
      <Dot v={a} />
      <Dot v={b} />
      <Dot v={c} />
    </View>
  );
}

const fmtTime = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

export default function AssistantScreen() {
  const insights = useMemo(() => getUserInsights().slice(0, 3), []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Dobrý den! 👋 Jsem váš MND asistent. Mohu vám pomoci s platbami, smlouvami, spotřebou nebo čímkoli dalším — máte k dispozici i pár návrhů níže.',
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      text: text.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    timerRef.current = setTimeout(() => {
      try {
        const response = getAssistantResponse(text);
        setMessages((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            text: response,
            isUser: false,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            text: 'Omlouvám se, došlo k chybě. Zkuste to prosím znovu.',
            isUser: false,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 700);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 80);
    return () => clearTimeout(t);
  }, [messages, isTyping]);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => {
    const isUser = item.isUser;
    return (
      <View className={`mx-4 mb-2 ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <View className="flex-row items-center mb-1 ml-1">
            <View className="w-5 h-5 rounded-full bg-mnd-green items-center justify-center mr-1.5">
              <Ionicons name="sparkles" size={11} color="#fff" />
            </View>
            <Text className="text-2xs font-semibold text-ink-muted">
              MND Asistent
            </Text>
          </View>
        )}
        <View
          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
            isUser ? 'bg-mnd-green rounded-br-md' : 'bg-white rounded-bl-md'
          }`}
          style={
            !isUser
              ? {
                  shadowColor: '#0F172A',
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                }
              : undefined
          }
        >
          <Text
            className={`text-sm leading-5 ${
              isUser ? 'text-white' : 'text-ink'
            }`}
          >
            {item.text}
          </Text>
        </View>
        <Text
          className={`text-2xs text-ink-subtle mt-1 ${
            isUser ? 'mr-1' : 'ml-1'
          }`}
        >
          {fmtTime(item.timestamp)}
        </Text>
      </View>
    );
  }, []);

  const showOnboarding = messages.length <= 1;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 8 }}
        ListFooterComponent={isTyping ? <TypingDots /> : null}
      />

      {showOnboarding && insights.length > 0 && (
        <View className="px-4 pb-3">
          <Text className="text-xs font-semibold text-ink-muted mb-2">
            ✨ Návrhy podle vašich dat
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {insights.map((ins) => {
              const c = Tones[ins.tone];
              return (
                <Pressable
                  key={ins.id}
                  onPress={() => {
                    if (ins.cta?.route) {
                      router.push(ins.cta.route as any);
                    } else if (ins.cta?.query) {
                      sendMessage(ins.cta.query);
                    }
                  }}
                  style={{ width: 260, marginRight: 10 }}
                >
                  {({ pressed }) => (
                    <View
                      className="rounded-2xl p-3.5"
                      style={{
                        backgroundColor: c.bg,
                        borderWidth: 1,
                        borderColor: c.border,
                        opacity: pressed ? 0.85 : 1,
                      }}
                    >
                      <View className="flex-row items-center mb-1.5">
                        <View
                          className="w-7 h-7 rounded-full items-center justify-center mr-2"
                          style={{ backgroundColor: c.solid }}
                        >
                          <Ionicons name={ins.icon} size={14} color="#fff" />
                        </View>
                        <Text
                          className="text-sm font-bold flex-1"
                          style={{ color: c.text }}
                          numberOfLines={1}
                        >
                          {ins.title}
                        </Text>
                      </View>
                      <Text
                        className="text-xs leading-4"
                        style={{ color: c.text, opacity: 0.9 }}
                        numberOfLines={3}
                      >
                        {ins.message}
                      </Text>
                      {ins.cta && (
                        <View className="flex-row items-center mt-2">
                          <Text
                            className="text-xs font-bold"
                            style={{ color: c.text }}
                          >
                            {ins.cta.label}
                          </Text>
                          <Ionicons
                            name="arrow-forward"
                            size={12}
                            color={c.text}
                            style={{ marginLeft: 4 }}
                          />
                        </View>
                      )}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {showOnboarding && (
        <View className="px-4 pb-2">
          <Text className="text-xs font-semibold text-ink-muted mb-2">
            Časté dotazy
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <Pressable key={q.id} onPress={() => sendMessage(q.label)}>
                {({ pressed }) => (
                  <View
                    className="rounded-full px-3.5 py-2 bg-white"
                    style={{
                      borderWidth: 1,
                      borderColor: '#E5E7EB',
                      opacity: pressed ? 0.7 : 1,
                    }}
                  >
                    <Text className="text-xs font-semibold text-mnd-green">
                      {q.label}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View className="flex-row items-end px-4 py-3 bg-white border-t border-line-subtle">
        <TextInput
          className="flex-1 bg-surface-subtle rounded-2xl px-4 py-3 text-sm text-ink max-h-24"
          placeholder="Napište svůj dotaz..."
          placeholderTextColor="#94A3B8"
          value={input}
          onChangeText={setInput}
          multiline
          onSubmitEditing={() => sendMessage(input)}
        />
        <Pressable
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
        >
          {({ pressed }) => (
            <View
              className="ml-2 w-11 h-11 rounded-full bg-mnd-green items-center justify-center"
              style={{
                opacity: !input.trim() || isTyping ? 0.4 : pressed ? 0.85 : 1,
              }}
            >
              <Ionicons name="send" size={18} color="white" />
            </View>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
