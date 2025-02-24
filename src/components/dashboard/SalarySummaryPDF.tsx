import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

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
});

interface SalarySummaryPDFProps {
  month: string;
  year: number;
  revenue: number;
  expenses: {
    salaries: number;
    overhead: number;
    other: number;
  };
}

const SalarySummaryPDF = ({ month, year, revenue, expenses }: SalarySummaryPDFProps) => {
  const totalExpenses = expenses.salaries + expenses.overhead + expenses.other;
  const netIncome = revenue - totalExpenses;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image 
            src="/lovable-uploads/2d198e73-340f-4f23-abbe-ff6410f42c69.png"
            style={styles.logo}
          />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Test Project</Text>
            <Text style={styles.companyAddress}>5655 a generate Washington Dr</Text>
            <Text style={styles.companyAddress}>Alexandria, VA, 22312</Text>
          </View>
          <Text style={styles.title}>Monthly Salary Summary</Text>
          <Text style={styles.subtitle}>{`${month} ${year}`}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Category</Text>
            <Text style={styles.col2}>Amount</Text>
            <Text style={styles.col3}>Percentage</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.col1}>Total Revenue</Text>
            <Text style={styles.col2}>${revenue.toFixed(2)}</Text>
            <Text style={styles.col3}>100%</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.col1}>Salaries</Text>
            <Text style={styles.col2}>${expenses.salaries.toFixed(2)}</Text>
            <Text style={styles.col3}>{((expenses.salaries / revenue) * 100).toFixed(1)}%</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.col1}>Overhead Costs</Text>
            <Text style={styles.col2}>${expenses.overhead.toFixed(2)}</Text>
            <Text style={styles.col3}>{((expenses.overhead / revenue) * 100).toFixed(1)}%</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.col1}>Other Expenses</Text>
            <Text style={styles.col2}>${expenses.other.toFixed(2)}</Text>
            <Text style={styles.col3}>{((expenses.other / revenue) * 100).toFixed(1)}%</Text>
          </View>
        </View>

        <View style={styles.total}>
          <Text style={styles.totalLabel}>Net Income:</Text>
          <Text style={styles.totalValue}>${netIncome.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default SalarySummaryPDF;