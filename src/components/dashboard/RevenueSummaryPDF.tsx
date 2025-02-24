import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { DatabaseOrder } from '@/types/database';
import { pdfStyles } from './pdf-components/pdfStyles';
import { PDFHeader } from './pdf-components/PDFHeader';
import { PDFSummary } from './pdf-components/PDFSummary';
import { 
  calculateMonthlyData, 
  calculateYearlyData, 
  calculateQuarterlyData, 
  calculateDailyData,
  monthNames 
} from './utils/revenueCalculations';

interface RevenueSummaryPDFProps {
  periodType: string;
  startDate: string;
  endDate: string;
  orders: DatabaseOrder[];
  totalRevenue: number;
  totalOrders: number;
}

const RevenueSummaryPDF: React.FC<RevenueSummaryPDFProps> = ({
  periodType,
  startDate,
  endDate,
  orders,
  totalRevenue,
  totalOrders,
}) => {
  if (periodType === 'decade') {
    const yearlyData = calculateYearlyData(orders);
    const sortedYears = Object.keys(yearlyData).sort();

    return (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <PDFHeader 
            title="Revenue Summary" 
            subtitle={`${periodType} Report: ${startDate} - ${endDate}`} 
          />

          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.col1}>Year</Text>
            <Text style={pdfStyles.col2}>Total Orders</Text>
            <Text style={pdfStyles.col3}>Total Revenue</Text>
          </View>

          {sortedYears.map((year) => (
            <View key={year} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.col1}>{year}</Text>
              <Text style={pdfStyles.col2}>{yearlyData[year].totalOrders}</Text>
              <Text style={pdfStyles.col3}>
                ${yearlyData[year].totalRevenue.toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={pdfStyles.divider} />

          <PDFSummary
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
            extraSummary={[
              { label: 'Total Years', value: sortedYears.length }
            ]}
          />
        </Page>
      </Document>
    );
  }

  if (periodType === 'year') {
    const monthlyData = calculateMonthlyData(orders);

    return (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <PDFHeader 
            title="Revenue Summary" 
            subtitle={`Yearly Report: ${startDate} - ${endDate}`} 
          />

          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.col1}>Month</Text>
            <Text style={pdfStyles.col2}>Total Orders</Text>
            <Text style={pdfStyles.col3}>Total Revenue</Text>
          </View>

          {monthNames.map((month, index) => {
            const monthData = monthlyData[index] || { totalOrders: 0, totalRevenue: 0 };
            return (
              <View key={month} style={pdfStyles.tableRow}>
                <Text style={pdfStyles.col1}>{month}</Text>
                <Text style={pdfStyles.col2}>{monthData.totalOrders}</Text>
                <Text style={pdfStyles.col3}>
                  ${monthData.totalRevenue.toFixed(2)}
                </Text>
              </View>
            );
          })}

          <View style={pdfStyles.divider} />

          <PDFSummary
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
          />
        </Page>
      </Document>
    );
  }

  if (periodType === 'quarter') {
    const quarterData = calculateQuarterlyData(orders);

    return (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <PDFHeader 
            title="Revenue Summary" 
            subtitle={`Q${quarterData.quarter} Report: ${startDate} - ${endDate}`} 
          />

          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.col1}>Month</Text>
            <Text style={pdfStyles.col2}>Total Orders</Text>
            <Text style={pdfStyles.col3}>Total Revenue</Text>
          </View>

          {quarterData.months.map((month) => {
            const monthData = quarterData.monthlyData[month] || { totalOrders: 0, totalRevenue: 0 };
            return (
              <View key={month} style={pdfStyles.tableRow}>
                <Text style={pdfStyles.col1}>{month}</Text>
                <Text style={pdfStyles.col2}>{monthData.totalOrders}</Text>
                <Text style={pdfStyles.col3}>
                  ${monthData.totalRevenue.toFixed(2)}
                </Text>
              </View>
            );
          })}

          <View style={pdfStyles.divider} />

          <PDFSummary
            totalOrders={quarterData.totalOrders}
            totalRevenue={quarterData.totalRevenue}
            extraSummary={[
              { label: 'Quarter', value: quarterData.quarter }
            ]}
          />
        </Page>
      </Document>
    );
  }

  // Monthly layout with daily breakdown
  const dailyData = calculateDailyData(orders);
  
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <PDFHeader 
          title="Revenue Summary" 
          subtitle={`Monthly Report: ${startDate} - ${endDate}`} 
        />

        <View style={pdfStyles.tableHeader}>
          <Text style={pdfStyles.col1}>Date</Text>
          <Text style={pdfStyles.col2}>Total Orders</Text>
          <Text style={pdfStyles.col3}>Total Revenue</Text>
        </View>

        {dailyData.map((day) => (
          <View key={day.date} style={pdfStyles.tableRow}>
            <Text style={pdfStyles.col1}>{day.date}</Text>
            <Text style={pdfStyles.col2}>{day.totalOrders}</Text>
            <Text style={pdfStyles.col3}>
              ${day.totalRevenue.toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={pdfStyles.divider} />

        <PDFSummary
          totalOrders={totalOrders}
          totalRevenue={totalRevenue}
        />
      </Page>
    </Document>
  );
};

export default RevenueSummaryPDF;
