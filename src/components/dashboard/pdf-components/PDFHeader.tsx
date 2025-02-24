
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles';

interface PDFHeaderProps {
  title: string;
  subtitle: string;
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ title, subtitle }) => (
  <View style={pdfStyles.header}>
    <Text style={pdfStyles.title}>{title}</Text>
    <Text style={pdfStyles.subtitle}>{subtitle}</Text>
  </View>
);
