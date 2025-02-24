import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { Order } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    alignSelf: 'center',
  },
  companyInfo: {
    marginBottom: 20,
    textAlign: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  companyAddress: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  col1: {
    width: "40%",
  },
  col2: {
    width: "30%",
    textAlign: "right",
  },
  col3: {
    width: "30%",
    textAlign: "right",
  },
  total: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  customerInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    marginBottom: 5,
  },
});

interface OrderRevenueSummaryPDFProps {
  order: Order;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const OrderRevenueSummaryPDF = ({ order, items }: OrderRevenueSummaryPDFProps) => {
  const totalRevenue = order.total;
  const totalCost = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const grossProfit = totalRevenue - totalCost;
  const profitMargin = ((grossProfit / totalRevenue) * 100).toFixed(1);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image 
            src="/lovable-uploads/2d198e73-340f-4f23-abbe-ff6410f42c69.png"
            style={styles.logo}
          />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Logo</Text>
            <Text style={styles.companyAddress}>5655 a generate Washington Dr</Text>
            <Text style={styles.companyAddress}>Alexandria, VA, 22312</Text>
          </View>
          <Text style={styles.title}>Order Revenue Summary</Text>
          <Text style={styles.subtitle}>Order ID: {order.id}</Text>
          <Text style={styles.subtitle}>
            Date: {new Date(order.date).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.label}>Customer Information</Text>
          <Text style={styles.value}>{order.customerName}</Text>
          <Text style={styles.value}>{order.customerPhone}</Text>
          <Text style={styles.value}>{order.customerAddress}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Category</Text>
            <Text style={styles.col2}>Amount</Text>
            <Text style={styles.col3}>Percentage</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.col1}>Total Revenue</Text>
            <Text style={styles.col2}>${totalRevenue.toFixed(2)}</Text>
            <Text style={styles.col3}>100%</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.col1}>Total Cost</Text>
            <Text style={styles.col2}>${totalCost.toFixed(2)}</Text>
            <Text style={styles.col3}>{((totalCost / totalRevenue) * 100).toFixed(1)}%</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.col1}>Gross Profit</Text>
            <Text style={styles.col2}>${grossProfit.toFixed(2)}</Text>
            <Text style={styles.col3}>{profitMargin}%</Text>
          </View>
        </View>

        <View style={styles.total}>
          <Text style={styles.totalLabel}>Profit Margin:</Text>
          <Text style={styles.totalValue}>{profitMargin}%</Text>
        </View>
      </Page>
    </Document>
  );
};

export default OrderRevenueSummaryPDF;