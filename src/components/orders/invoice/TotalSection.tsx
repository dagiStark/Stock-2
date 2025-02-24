
import { Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";

interface TotalSectionProps {
  total: number;
  totalWeight: number;
}

export const TotalSection = ({ total, totalWeight }: TotalSectionProps) => (
  <View style={styles.totals}>
    <View style={styles.totalWeightRow}>
      <Text style={styles.totalLabel}>Total Weight:</Text>
      <Text style={styles.totalValue}>{totalWeight.toFixed(2)} lbs</Text>
    </View>
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Subtotal:</Text>
      <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
    </View>
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Tax:</Text>
      <Text style={styles.totalValue}>$0.00</Text>
    </View>
    <View style={styles.totalRowBold}>
      <Text style={styles.totalLabel}>Total:</Text>
      <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
    </View>
  </View>
);
