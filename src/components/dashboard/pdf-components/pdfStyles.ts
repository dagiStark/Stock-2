
import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  col1: { width: '33%' },
  col2: { width: '33%' },
  col3: { width: '34%' },
  summary: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    marginVertical: 10,
  }
});
