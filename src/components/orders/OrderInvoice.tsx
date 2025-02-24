
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { Order, InvoiceType } from "@/types";
import { styles } from "./invoice/styles";
import { formatDate } from "./invoice/utils";

interface OrderInvoiceProps {
  order: Order;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    weightPerItem?: number;
  }>;
  invoiceType: InvoiceType;
}

const OrderInvoice = ({ order, items, invoiceType }: OrderInvoiceProps) => {
  const totalWeight = items.reduce((sum, item) => {
    return sum + ((item.weightPerItem || 0) * item.quantity);
  }, 0);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0; // Add tax calculation if needed
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Logo</Text>
            <Text style={styles.companyAddress}>5655 Washington Dr</Text>
            <Text style={styles.companyAddress}>Alexandria, VA 22312</Text>
            <Text style={styles.companyAddress}>Tel: (703) 212-8909</Text>
          </View>
          <View style={styles.invoiceTitleContainer}>
            <Text style={styles.invoiceTitle}>
              {invoiceType === 'packing-slip' ? 'PACKING LIST' : 'INVOICE'}
            </Text>
          </View>
          <View style={styles.invoiceMetadata}>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>INVOICE NO.</Text>
              <Text>{order.id.slice(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>DATE</Text>
              <Text>{formatDate(order.date)}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>CUSTOMER NO.</Text>
              <Text>{order.id.slice(0, 6).toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Address Blocks */}
        <View style={styles.addressBlocks}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>SOLD TO</Text>
            <Text style={styles.addressText}>{order.customerName}</Text>
            <Text style={styles.addressText}>{order.customerAddress}</Text>
            <Text style={styles.addressText}>{order.customerPhone}</Text>
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>SHIP TO</Text>
            <Text style={styles.addressText}>{order.customerName}</Text>
            <Text style={styles.addressText}>{order.customerAddress}</Text>
            <Text style={styles.addressText}>{order.customerPhone}</Text>
          </View>
        </View>

        {/* Order Information */}
        <View style={styles.orderInfo}>
          <View style={styles.orderInfoGrid}>
            <View style={styles.orderInfoItem}>
              <Text style={styles.orderInfoLabel}>PURCHASE ORDER NO.</Text>
              <Text style={styles.orderInfoValue}>{order.id.slice(0, 8)}</Text>
            </View>
            <View style={styles.orderInfoItem}>
              <Text style={styles.orderInfoLabel}>ORDER DATE</Text>
              <Text style={styles.orderInfoValue}>{formatDate(order.date)}</Text>
            </View>
            <View style={styles.orderInfoItem}>
              <Text style={styles.orderInfoLabel}>SHIP VIA</Text>
              <Text style={styles.orderInfoValue}>Ground</Text>
            </View>
            <View style={styles.orderInfoItem}>
              <Text style={styles.orderInfoLabel}>TERMS</Text>
              <Text style={styles.orderInfoValue}>{order.paymentMethod}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.qtyCol]}>QTY</Text>
            <Text style={[styles.tableCell, styles.itemNumberCol]}>ITEM #</Text>
            <Text style={[styles.tableCell, styles.descriptionCol]}>DESCRIPTION</Text>
            <Text style={[styles.tableCell, styles.weightCol]}>WEIGHT</Text>
            {invoiceType === 'standard' && (
              <>
                <Text style={[styles.tableCell, styles.priceCol]}>UNIT PRICE</Text>
                <Text style={[styles.tableCell, styles.totalCol]}>TOTAL</Text>
              </>
            )}
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.qtyCol]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.itemNumberCol]}>-</Text>
              <Text style={[styles.tableCell, styles.descriptionCol]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.weightCol]}>
                {((item.weightPerItem || 0) * item.quantity).toFixed(2)} lbs
              </Text>
              {invoiceType === 'standard' && (
                <>
                  <Text style={[styles.tableCell, styles.priceCol]}>
                    ${item.price.toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, styles.totalCol]}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </>
              )}
            </View>
          ))}
        </View>

        {/* Totals and Comments Section */}
        <View style={styles.totalsSection}>
          <View style={styles.comments}>
            <Text style={styles.commentTitle}>COMMENTS</Text>
            <Text style={styles.commentText}>
              Payment is due within 30 days. Late payments are subject to a 2% monthly charge.
              {"\n"}All goods remain the property of Logo until paid in full.
            </Text>
          </View>
          {invoiceType === 'standard' && (
            <View style={styles.totalsTable}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax</Text>
                <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRowBold}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Original</Text>
      </Page>
    </Document>
  );
};

export default OrderInvoice;
