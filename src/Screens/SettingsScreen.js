import React from 'react';
import { View, Text, Button } from 'react-native';
import tw from 'twrnc';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={tw`flex-1 justify-center items-center bg-blue-500`}>
      <Text style={tw`text-white text-xl font-bold mb-4`}>Settings Screen</Text>

      {/* Contoh tombol kembali ke Home */}
      <Button
        title="Back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}