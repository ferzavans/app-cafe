import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

const VIEW_W = 360;
const VIEW_H = 220;
/** Where the coffee drips: under the V60, above the carafe (viewBox units). */
const DRIP_X = 250;
const DRIP_FROM = 132;
const DRIP_TO = 160;

/**
 * Illustrated hero: a hand grinder next to a V60 brewing into a small carafe,
 * with a drop of coffee falling on a loop.
 */
export function CoffeeScene({ height = 200 }: { height?: number }) {
  const [width, setWidth] = useState(0);
  const drop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(drop, { toValue: 1, duration: 1100, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [drop]);

  // The SVG keeps its aspect ratio centered; map viewBox units to pixels for the drop.
  const scale = width ? Math.min(width / VIEW_W, height / VIEW_H) : 0;
  const offsetX = (width - VIEW_W * scale) / 2;
  const offsetY = (height - VIEW_H * scale) / 2;

  return (
    <View style={{ height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
        <Defs>
          <LinearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#9AA1A8" />
            <Stop offset="0.45" stopColor="#E4E7EA" />
            <Stop offset="1" stopColor="#8A9097" />
          </LinearGradient>
          <LinearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
            <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.12" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.3" />
          </LinearGradient>
          <LinearGradient id="brew" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7A4A2A" />
            <Stop offset="1" stopColor="#2E1A0F" />
          </LinearGradient>
        </Defs>

        {/* warm light behind the scene */}
        <Circle cx="250" cy="110" r="95" fill="#C8873A" opacity="0.16" />
        <Circle cx="95" cy="120" r="70" fill="#F3E2CF" opacity="0.07" />

        {/* counter, drawn wider than the viewBox so it reaches both edges on wide screens */}
        <Rect x={-VIEW_W} y="184" width={VIEW_W * 3} height="36" fill="#2B1D14" opacity="0.55" />
        <Rect x={-VIEW_W} y="183" width={VIEW_W * 3} height="2" fill="#F3E2CF" opacity="0.18" />

        {/* hand grinder */}
        <G>
          <Rect x="74" y="178" width="40" height="7" rx="2" fill="#5B3A24" />
          <Rect x="70" y="96" width="48" height="84" rx="9" fill="url(#steel)" />
          <Rect x="70" y="140" width="48" height="16" fill="#9C6638" />
          <Line x1="70" y1="143" x2="118" y2="143" stroke="#7A4C28" strokeWidth="1.5" />
          <Line x1="70" y1="153" x2="118" y2="153" stroke="#7A4C28" strokeWidth="1.5" />
          <Rect x="66" y="88" width="56" height="11" rx="4" fill="#6E757C" />
          <Rect x="91" y="70" width="6" height="20" rx="2" fill="#5D646B" />
          <Path d="M94 72 L146 60" stroke="#4E555C" strokeWidth="6" strokeLinecap="round" />
          <Ellipse cx="148" cy="56" rx="8" ry="10" fill="#A0673A" />
          <Ellipse cx="146" cy="53" rx="3" ry="4" fill="#C98F5C" opacity="0.7" />
        </G>

        {/* beans */}
        {[
          [36, 181, -20],
          [50, 186, 25],
          [136, 184, -35],
          [152, 187, 10],
          [168, 182, 40],
        ].map(([x, y, r]) => (
          <G key={`${x}`} rotation={r} origin={`${x}, ${y}`}>
            <Ellipse cx={x} cy={y} rx="6" ry="4" fill="#4A2C1A" />
            <Path d={`M${x - 4} ${y} Q${x} ${y - 2} ${x + 4} ${y}`} stroke="#C8873A" strokeWidth="1" fill="none" />
          </G>
        ))}

        {/* steam */}
        <Path d="M238 76 q-6 -10 0 -20 q6 -10 0 -20" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M256 80 q-6 -10 0 -20 q6 -10 0 -22" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* carafe */}
        <Path
          d="M232 132 L268 132 L272 144 Q292 160 286 176 Q282 185 270 185 L230 185 Q218 185 214 176 Q208 160 228 144 Z"
          fill="url(#glass)"
          stroke="#FFFFFF"
          strokeOpacity="0.6"
          strokeWidth="2"
        />
        <Path d="M212 166 Q211 172 214 176 Q218 184 230 184 L270 184 Q282 184 286 176 Q289 172 288 166 Z" fill="url(#brew)" />
        <Ellipse cx="250" cy="166" rx="38" ry="3" fill="#8B5A35" opacity="0.8" />
        <Path d="M222 150 Q218 160 220 170" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* V60 */}
        <Rect x="230" y="124" width="40" height="8" rx="3" fill="#E9E1D8" />
        <Path d="M218 92 L282 92 L263 125 L237 125 Z" fill="#F7F2EC" />
        <Path d="M282 92 L263 125 L256 125 L274 92 Z" fill="#E2D8CD" />
        <Line x1="236" y1="96" x2="246" y2="122" stroke="#E2D8CD" strokeWidth="1.5" />
        <Line x1="250" y1="96" x2="250" y2="122" stroke="#E2D8CD" strokeWidth="1.5" />
        <Line x1="264" y1="96" x2="254" y2="122" stroke="#E2D8CD" strokeWidth="1.5" />
        <Path d="M282 98 Q298 100 296 110 Q294 118 276 116" stroke="#F7F2EC" strokeWidth="5" fill="none" />
        <Rect x="212" y="86" width="76" height="8" rx="4" fill="#FFFFFF" />
        <Ellipse cx="250" cy="94" rx="28" ry="4" fill="#5A3A26" />

        {/* thin stream under the dripper */}
        <Line x1={DRIP_X} y1={DRIP_FROM - 4} x2={DRIP_X} y2={DRIP_FROM + 2} stroke="#3B2416" strokeWidth="2.5" strokeLinecap="round" />
      </Svg>

      {width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.drop,
            {
              left: offsetX + DRIP_X * scale - 3,
              top: offsetY + DRIP_FROM * scale,
              opacity: drop.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] }),
              transform: [{ translateY: drop.interpolate({ inputRange: [0, 1], outputRange: [0, (DRIP_TO - DRIP_FROM) * scale] }) }],
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  drop: {
    position: 'absolute',
    width: 6,
    height: 8,
    borderRadius: 3,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    backgroundColor: '#3B2416',
  },
});
