import { Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";

interface AddressBlocksProps {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
}

export const AddressBlocks = ({
  customerName,
  customerAddress,
  customerPhone,
}: AddressBlocksProps) => (
  <View style={styles.addressBlocks}>
    <View style={styles.addressBlock}>
      <Text style={styles.addressTitle}>BILL TO</Text>
      <Text>{customerName}</Text>
      <Text>{customerAddress}</Text>
      <Text>{customerPhone}</Text>
    </View>
    <View style={styles.addressBlock}>
      <Text style={styles.addressTitle}>SHIP TO</Text>
      <Text>{customerName}</Text>
      <Text>{customerAddress}</Text>
      <Text>{customerPhone}</Text>
    </View>
  </View>
);