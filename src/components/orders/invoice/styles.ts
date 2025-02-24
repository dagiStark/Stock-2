
import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  companyInfo: {
    width: "33%",
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  companyAddress: {
    marginBottom: 2,
    lineHeight: 1.4,
  },
  invoiceMetadata: {
    width: "33%",
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metadataLabel: {
    fontWeight: "bold",
  },
  invoiceTitleContainer: {
    width: "34%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  addressBlocks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  addressBlock: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#000000",
    padding: 10,
  },
  addressTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 12,
  },
  addressText: {
    lineHeight: 1.4,
  },
  orderInfo: {
    borderWidth: 1,
    borderColor: "#000000",
    padding: 10,
    marginBottom: 20,
  },
  orderInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  orderInfoItem: {
    width: "25%",
    marginBottom: 6,
  },
  orderInfoLabel: {
    fontWeight: "bold",
    fontSize: 9,
  },
  orderInfoValue: {
    marginTop: 2,
  },
  cell: {
    padding: 5,
  },
  numericCell: {
    padding: 5,
    textAlign: "right",
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    padding: 8,
    minHeight: 24,
  },
  qtyCol: { 
    width: "8%", 
    textAlign: "center" 
  },
  itemNumberCol: { 
    width: "12%", 
    textAlign: "center" 
  },
  descriptionCol: { 
    width: "35%", 
    textAlign: "left" 
  },
  weightCol: { 
    width: "15%", 
    textAlign: "right" 
  },
  priceCol: { 
    width: "15%", 
    textAlign: "right" 
  },
  totalCol: { 
    width: "15%", 
    textAlign: "right" 
  },
  tableCell: {
    justifyContent: "center",
  },
  totals: {
    marginTop: 20,
    width: "40%",
    alignSelf: "flex-end",
  },
  totalWeightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalsSection: {
    flexDirection: "row",
    marginTop: 20,
  },
  comments: {
    width: "60%",
    paddingRight: 20,
  },
  commentTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  totalsTable: {
    width: "40%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  totalRowBold: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderTopWidth: 2,
    borderTopColor: "#000000",
    fontWeight: "bold",
  },
  totalLabel: {
    width: "60%",
  },
  totalValue: {
    width: "40%",
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    fontStyle: "italic",
    color: "#666666",
  },
});
