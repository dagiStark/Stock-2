
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles';

interface PDFSummaryProps {
  totalOrders: number;
  totalRevenue: number;
  extraSummary?: { label: string; value: string | number }[];
}

export const PDFSummary: React.FC<PDFSummaryProps> = ({ 
  totalOrders, 
  totalRevenue, 
  extraSummary = [] 
}) => (
  <View style={pdfStyles.summary}>
    {extraSummary.map((item, index) => (
      <View key={index} style={pdfStyles.summaryRow}>
        <Text style={pdfStyles.bold}>{item.label}:</Text>
        <Text>{item.value}</Text>
      </View>
    ))}
    <View style={pdfStyles.summaryRow}>
      <Text style={pdfStyles.bold}>Total Orders:</Text>
      <Text>{totalOrders}</Text>
    </View>
    <View style={pdfStyles.summaryRow}>
      <Text style={pdfStyles.bold}>Total Revenue:</Text>
      <Text>${totalRevenue.toFixed(2)}</Text>
    </View>
  </View>
);
