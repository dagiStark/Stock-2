
import { Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";

interface Item {
  name: string;
  quantity: number;
  price: number;
  weightPerItem?: number;
  totalWeight?: number;
}

interface ItemsTableProps {
  items: Item[];
  showPrices?: boolean;
}

export const ItemsTable = ({ items, showPrices = true }: ItemsTableProps) => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      <Text style={[styles.cell, styles.qtyCol]}>QTY</Text>
      <Text style={[styles.cell, styles.descriptionCol]}>DESCRIPTION</Text>
      <Text style={[styles.cell, styles.weightCol]}>WEIGHT/UNIT</Text>
      <Text style={[styles.cell, styles.weightCol]}>TOTAL WEIGHT</Text>
      {showPrices && (
        <>
          <Text style={[styles.cell, styles.priceCol]}>UNIT PRICE</Text>
          <Text style={[styles.cell, styles.totalCol]}>TOTAL</Text>
        </>
      )}
    </View>

    {items.map((item, index) => (
      <View key={index} style={styles.tableRow}>
        <Text style={[styles.cell, styles.qtyCol]}>{item.quantity}</Text>
        <Text style={[styles.cell, styles.descriptionCol]}>{item.name}</Text>
        <Text style={[styles.cell, styles.weightCol]}>
          {item.weightPerItem ? `${item.weightPerItem.toFixed(2)} lbs` : '-'}
        </Text>
        <Text style={[styles.cell, styles.weightCol]}>
          {item.totalWeight ? `${item.totalWeight.toFixed(2)} lbs` : '-'}
        </Text>
        {showPrices && (
          <>
            <Text style={[styles.numericCell, styles.priceCol]}>
              ${item.price.toFixed(2)}
            </Text>
            <Text style={[styles.numericCell, styles.totalCol]}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </>
        )}
      </View>
    ))}
  </View>
);
