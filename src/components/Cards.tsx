import { ImageBackground, Pressable, Text, View, Image } from 'react-native';
import { colors, radii, spacing, buttons, standardText } from '../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export function WideCard({
  image, title, subtitle, onPress,
}: { image: string; title: string; subtitle?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ marginRight: spacing(1.5) }}>
      <ImageBackground
        source={{ uri: image }}
        imageStyle={{ borderRadius: radii.lg }}
        style={{ width: 260, height: 140, overflow: 'hidden' }}>
        <LinearGradient colors={['transparent','rgba(0,0,0,0.6)']}
          style={{ flex: 1, justifyContent: 'flex-end', padding: spacing(1.5) }}>
          <Text style={{ color: 'white', fontWeight: '800' }}>{title}</Text>
          {subtitle ? <Text style={{ color: '#EEE' }}>{subtitle}</Text> : null}
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

export function SquareCard({
  image, title, subtitle, onPress,
}: { image: string; title: string; subtitle?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ width: 180, marginRight: spacing(1.5) }}>
      <ImageBackground
        source={{ uri: image }}
        imageStyle={{ borderRadius: radii.md }}
        style={{ height: 120, borderRadius: radii.md, overflow: 'hidden' }}>
        <LinearGradient colors={['transparent','rgba(0,0,0,0.55)']}
          style={{ flex: 1, justifyContent: 'flex-end', padding: spacing(1) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: '700' }}>{title}</Text>
            <Ionicons name="chevron-forward" size={16} color="white" style={{ marginLeft: 4 }} />
          </View>
        </LinearGradient>
      </ImageBackground>
      {subtitle ? <Text style={{ color: colors.muted, marginTop: 6 }}>{subtitle}</Text> : null}
    </Pressable>
  );
}

export function GameTile({
  icon = 'stopwatch-outline', title, difficulty, onPress,
}: { icon?: any; title: string; difficulty: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}
      style={{ width: 180, backgroundColor: colors.card, borderRadius: radii.md, padding: spacing(2),
               marginRight: spacing(1.5), borderColor: colors.line, borderWidth: 1 }}>
      <View style={{ backgroundColor: colors.card, width: 52, height: 52, borderRadius: 26,
                     alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <Ionicons name={icon} size={26} color={colors.gold} />
      </View>
      <Text style={{ color: colors.text, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: colors.muted, marginTop: 2 }}>Difficulty: {difficulty}</Text>
    </Pressable>
  );
}

export function HeroCard({ image, title, subtitle, cta }: { image: string; title: string; subtitle?: string; cta?: string }) {
  return (
    <ImageBackground source={{ uri: image }} imageStyle={{ borderRadius: radii.lg }}
      style={{ height: 180, borderRadius: radii.lg, overflow: 'hidden' }}>
      <LinearGradient colors={['transparent','rgba(0,0,0,0.65)']}
        style={{ flex: 1, justifyContent: 'flex-end', padding: spacing(2) }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>{title}</Text>
        {subtitle ? <Text style={{ color: '#EEE', marginTop: 2 }}>{subtitle}</Text> : null}
        {cta ? (
          <View style={{ marginTop: spacing(1.25), alignSelf: 'flex-start',
                         backgroundColor: colors.gold, paddingHorizontal: spacing(2),
                         paddingVertical: 8, borderRadius: 999, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#120D07', fontWeight: '800' }}>{cta}</Text>
            <Ionicons name="chevron-forward" size={14} color="#120D07" style={{ marginLeft: 6 }} />
          </View>
        ) : null}
      </LinearGradient>
    </ImageBackground>
  );
}

export function ToolPromo({ image, title, subtitle }: { image: string; title: string; subtitle?: string }) {
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: radii.lg, borderWidth: 1,
                   borderColor: colors.line, overflow: 'hidden' }}>
      <Image source={{ uri: image }} style={{ height: 150, width: '100%' }} />
      <View style={{ padding: spacing(2) }}>
        <Text style={{ color: colors.text, fontWeight: '800', marginBottom: 4 }}>{title}</Text>
        {subtitle ? <Text style={{ color: colors.muted }}>{subtitle}</Text> : null}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing(1.25) }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 999, paddingHorizontal: spacing(1.5),
                         paddingVertical: 8, borderWidth: 1, borderColor: colors.line }}>
            <Text style={{ color: colors.text }}>🔥 Partner Pick</Text>
          </View>
          <View style={{ backgroundColor: colors.gold, borderRadius: 999,
                         paddingHorizontal: spacing(1.5), paddingVertical: 8 }}>
            <Text style={{ color: '#120D07', fontWeight: '800' }}>Challenge with This</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function VideoCard({ image, title, duration }: { image: string; title: string; duration: string }) {
  return (
    <View style={{ width: '48%', marginBottom: spacing(1.5) }}>
      <ImageBackground source={{ uri: image }} imageStyle={{ borderRadius: radii.md }}
        style={{ height: 120, borderRadius: radii.md, overflow: 'hidden', alignItems:'center', justifyContent:'center' }}>
        <View style={{ backgroundColor:'rgba(0,0,0,0.55)', width:48, height:48, borderRadius:24,
                       alignItems:'center', justifyContent:'center' }}>
          <Ionicons name="play" size={20} color="white" />
        </View>
      </ImageBackground>
      <Text style={{ color: colors.text, fontWeight: '700', marginTop: 6 }}>{title}</Text>
      <Text style={{ color: colors.muted }}>Watch Now • {duration}</Text>
    </View>
  );
}

export function SpotlightCard({ avatar, name, bio }: { avatar: string; name: string; bio: string }) {
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: radii.lg, borderWidth:1, borderColor: colors.line,
                   padding: spacing(2), flexDirection:'row', gap: spacing(1.5), alignItems:'center' }}>
      <Image source={{ uri: avatar }} style={{ width:64, height:64, borderRadius:32 }} />
      <View style={{ flex:1 }}>
        <Text style={{ color: colors.text, fontWeight:'800' }}>{name}</Text>
        <Text style={{ color: colors.muted, marginTop: 2 }} numberOfLines={3}>{bio}</Text>
        <View style={{ marginTop: spacing(1.25), backgroundColor: colors.card, borderRadius: 999,
                       alignSelf:'flex-start', paddingHorizontal: spacing(2), paddingVertical: 8,
                       borderWidth:1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontWeight:'700' }}>Follow</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.text} style={{ marginLeft: 6 }} />
        </View>
      </View>
    </View>
  );
}
