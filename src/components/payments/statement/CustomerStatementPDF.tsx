
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Payment } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  customerInfo: {
    marginBottom: 20,
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    minHeight: 24,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
  },
  tableCell: {
    width: '16.66%',
    padding: 8,
  },
  total: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#6B7280',
  },
});

interface CustomerStatementPDFProps {
  customerName: string;
  payments: Payment[];
}

const CustomerStatementPDF = ({ customerName, payments }: CustomerStatementPDFProps) => {
  const totalRemaining = payments.reduce((sum, payment) => sum + payment.remainingBalance, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Customer Statement</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.customerInfo}>
          <Text>Customer Name: {customerName}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Order ID</Text>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Total</Text>
            <Text style={styles.tableCell}>Paid</Text>
            <Text style={styles.tableCell}>Remaining</Text>
            <Text style={styles.tableCell}>Status</Text>
          </View>

          {payments.map((payment) => (
            <View key={payment.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{payment.orderId}</Text>
              <Text style={styles.tableCell}>
                {new Date(payment.date).toLocaleDateString()}
              </Text>
              <Text style={styles.tableCell}>${payment.total.toFixed(2)}</Text>
              <Text style={styles.tableCell}>${payment.amount.toFixed(2)}</Text>
              <Text style={styles.tableCell}>${payment.remainingBalance.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{payment.status.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <Text>Total Remaining Balance: ${totalRemaining.toFixed(2)}</Text>
        </View>

        <Text style={styles.footer}>
          This statement includes all unpaid and partially paid invoices as of {new Date().toLocaleDateString()}.
        </Text>
      </Page>
    </Document>
  );
};

export default CustomerStatementPDF;
