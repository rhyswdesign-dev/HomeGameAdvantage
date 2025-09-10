import React from 'react';
import { Feather } from '@expo/vector-icons';

interface IconProps {
  name: keyof typeof Feather.glyphMap;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = '#FFFFFF' 
}) => {
  return <Feather name={name} size={size} color={color} />;
};

export default Icon;