
import { Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import { formatDate } from "./utils";

interface InvoiceHeaderProps {
  orderId: string;
  date: string;
}

export const InvoiceHeader = ({ orderId, date }: InvoiceHeaderProps) => (
  <View style={styles.header}>
    <View style={styles.companyInfo}>
      <Text style={styles.companyName}>B&E Wholesa</Text>
      <Text style={styles.companyAddress}>5655 Washington Dr</Text>
      <Text style={styles.companyAddress}>Alexandria, VA 22312</Text>
      <Text style={styles.companyAddress}>Tel: (703) 212-8909</Text>
    </View>
    <View style={styles.invoiceMetadata}>
      <Text>INVOICE NO.</Text>
      <Text>{orderId.slice(0, 8)}</Text>
      <Text style={{ marginTop: 8 }}>DATE</Text>
      <Text>{formatDate(date)}</Text>
    </View>
  </View>
);
