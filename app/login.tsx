import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth-store';

export default function LoginScreen() {
  const [email, setEmail] = useState('jan.dvorak@email.cz');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleLogin = () => {
    login(email, password);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-8">
          {/* MND Logo */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 rounded-2xl bg-[#00A651] items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">M</Text>
            </View>
            <Text className="text-2xl font-bold text-[#1B1B1B]">
              MND Klient
            </Text>
            <Text className="text-[#6B7280] mt-1">
              Správa vašich energií na jednom místě
            </Text>
          </View>

          {/* Email */}
          <Text className="text-sm font-medium text-[#1B1B1B] mb-1.5">
            E-mail
          </Text>
          <View className="flex-row items-center bg-[#F5F5F5] rounded-xl px-4 py-3.5 mb-4">
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-base text-[#1B1B1B]"
              placeholder="vas@email.cz"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <Text className="text-sm font-medium text-[#1B1B1B] mb-1.5">
            Heslo
          </Text>
          <View className="flex-row items-center bg-[#F5F5F5] rounded-xl px-4 py-3.5 mb-2">
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-base text-[#1B1B1B]"
              placeholder="Vaše heslo"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot password */}
          <TouchableOpacity className="self-end mb-8">
            <Text className="text-[#00A651] text-sm font-medium">
              Zapomenuté heslo?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-[#00A651] rounded-xl py-4 items-center mb-6"
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold">
              Přihlásit se
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-[#E5E7EB]" />
            <Text className="mx-4 text-[#6B7280] text-sm">nebo</Text>
            <View className="flex-1 h-px bg-[#E5E7EB]" />
          </View>

          {/* Social Login */}
          <View className="flex-row gap-4">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-[#F5F5F5] rounded-xl py-3.5">
              <Ionicons name="logo-google" size={20} color="#1B1B1B" />
              <Text className="ml-2 text-sm font-medium text-[#1B1B1B]">
                Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-[#F5F5F5] rounded-xl py-3.5">
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text className="ml-2 text-sm font-medium text-[#1B1B1B]">
                Facebook
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom text */}
          <View className="items-center mt-8 mb-4">
            <Text className="text-xs text-[#6B7280] text-center">
              Přihlášením souhlasíte se zpracováním osobních údajů
            </Text>
            <Text className="text-xs text-[#6B7280] mt-1">
              © 2026 MND Energie a.s.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
