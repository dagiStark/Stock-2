import React, { useState } from 'react';
import './Invoice.css';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Item {
  id: string;
  name: string;
  qtyReq: number;
  qtyShipped: number;
  itemNo: string;
  description: string;
  weightPerItem: number;
  totalWeight: number;
  unitPrice: number;
  extendedPrice: number;
}

function Invoice() {
  const { toast } = useToast();
  
  // Static company info
  const companyInfo = {
    name: 'AGT Foods',
    addressLine1: '2185 Francis Hugues',
    addressLine2: 'Laval, QC H7S 1N5',
    country: 'Canada',
    phone: '(450) 669-2663',
    fax: '(450) 667-6799',
  };

  // Auto-generated fields
  const [invoiceNumber] = useState(`IN${Date.now().toString().slice(-6)}`);
  const [invoiceDate] = useState(new Date().toLocaleDateString());
  const [orderDate] = useState(new Date().toLocaleDateString());
  const [pageNumber] = useState(1);

  // User input fields
  const [customerInfo, setCustomerInfo] = useState({
    number: 'W12220',
    name: '',
    address: '',
    city: '',
    country: '',
    phone: '',
  });

  const [orderInfo, setOrderInfo] = useState({
    location: '',
    salesperson: '',
    shipVia: '',
    terms: 'C.O.D.',
    taxNumber: '',
  });

  const [items, setItems] = useState<Item[]>([{
    id: crypto.randomUUID(),
    name: '',
    qtyReq: 0,
    qtyShipped: 0,
    itemNo: '',
    description: '',
    weightPerItem: 0,
    totalWeight: 0,
    unitPrice: 0,
    extendedPrice: 0,
  }]);

  const [comments, setComments] = useState('');

  // Calculate item totals without state updates
  const calculateItemTotals = (item: Item): Item => {
    return {
      ...item,
      totalWeight: Number((item.weightPerItem * item.qtyShipped).toFixed(2)),
      extendedPrice: Number((item.unitPrice * item.qtyShipped).toFixed(2))
    };
  };

  // Handle item changes
  const handleItemChange = (id: string, field: keyof Item, value: string | number) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id !== id) return item;
        const updatedItem = { ...item, [field]: Number(value) || value };
        return calculateItemTotals(updatedItem);
      })
    );
  };

  // Calculate totals
  const totalWeight = items.reduce((sum, item) => sum + item.totalWeight, 0);
  const totalQty = items.reduce((sum, item) => sum + item.qtyShipped, 0);
  const subtotal = items.reduce((sum, item) => sum + item.extendedPrice, 0);
  const usdTax = 0; // Implement tax calculation if needed
  const invoiceTotal = subtotal + usdTax;

  // Add new item row
  const addItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      name: '',
      qtyReq: 0,
      qtyShipped: 0,
      itemNo: '',
      description: '',
      weightPerItem: 0,
      totalWeight: 0,
      unitPrice: 0,
      extendedPrice: 0,
    };
    setItems(prev => [...prev, newItem]);
  };

  // Remove item row
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const footerNotes = [
    "Frais d'administration de 2% par mois (26% par année) sur les comptes passés dus.",
    'Administration charge of 2% per month (26% per year) on all accounts over due.',
    "La facture n'a été exécutée et complétée que de la marchandise livrée ou due.",
    'AGT Inc. reserves the right to retain ownership of goods until the invoice amount is paid in full.',
  ];

  // Save functionality
  const handleSave = async () => {
    try {
      // First, insert the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerInfo.name,
          customer_address: customerInfo.address,
          customer_phone: customerInfo.phone,
          customer_number: customerInfo.number,
          shipping_name: customerInfo.name,
          shipping_address: customerInfo.address,
          shipping_city: customerInfo.city,
          shipping_country: customerInfo.country,
          shipping_phone: customerInfo.phone,
          salesperson: orderInfo.salesperson,
          ship_via: orderInfo.shipVia,
          location: orderInfo.location,
          terms: orderInfo.terms,
          tax_number: orderInfo.taxNumber,
          total_amount: invoiceTotal,
          comments: comments,
          invoice_number: invoiceNumber
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Then, insert all order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        item_number: item.itemNo,
        description: item.description,
        quantity: item.qtyShipped,
        quantity_required: item.qtyReq,
        unit_price: item.unitPrice,
        weight_per_item: item.weightPerItem
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Success",
        description: "Invoice saved successfully",
      });
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast({
        title: "Error",
        description: "Failed to save invoice",
        variant: "destructive",
      });
    }
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-wrapper">
      <div className="action-buttons">
        <button onClick={handleSave} className="action-button save-button">
          Save Invoice
        </button>
        <button onClick={handlePrint} className="action-button print-button">
          Print Invoice
        </button>
      </div>
      <div className="invoice-container">
        <div className="invoice-header">
          <div className="company-info">
            <h2>{companyInfo.name}</h2>
            <p>{companyInfo.addressLine1}</p>
            <p>{companyInfo.addressLine2}</p>
            <p>{companyInfo.country}</p>
            <p>Phone: {companyInfo.phone}</p>
            <p>Fax: {companyInfo.fax}</p>
          </div>
          <div className="invoice-title">
            <h1>Facture / Invoice</h1>
          </div>
          <div className="invoice-details">
            <div>
              <strong>No. DE FACTURE / INVOICE No.</strong><br />
              {invoiceNumber}
            </div>
            <div>
              <strong>DATE DE FACTURE / INVOICE DATE</strong><br />
              {invoiceDate}
            </div>
            <div>
              <strong>No. DU CLIENT / CUSTOMER No.</strong><br />
              <input
                type="text"
                value={customerInfo.number}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, number: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="sold-ship-section">
          <div className="address-box">
            <div className="address-title">Sold To</div>
            <input
              type="text"
              placeholder="Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="City"
              value={customerInfo.city}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Country"
              value={customerInfo.country}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, country: e.target.value }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Phone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="input-field"
            />
          </div>
          <div className="address-box">
            <div className="address-title">Ship To</div>
            <input
              type="text"
              placeholder="Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="City"
              value={customerInfo.city}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Country"
              value={customerInfo.country}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, country: e.target.value }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Phone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>

        <div className="order-info-section">
          <div>
            <p><strong>Purchase Order No.</strong><br />{invoiceNumber}</p>
            <p><strong>Date de la commande / Order Date</strong><br />{orderDate}</p>
          </div>
          <div>
            <p><strong>Vendeur / Salesperson</strong><br />
              <input
                type="text"
                value={orderInfo.salesperson}
                onChange={(e) => setOrderInfo(prev => ({ ...prev, salesperson: e.target.value }))}
                className="input-field"
              />
            </p>
          </div>
          <div>
            <p><strong>Expedié par / Ship Via</strong><br />
              <input
                type="text"
                value={orderInfo.shipVia}
                onChange={(e) => setOrderInfo(prev => ({ ...prev, shipVia: e.target.value }))}
                className="input-field"
              />
            </p>
            <p><strong>Location</strong><br />
              <input
                type="text"
                value={orderInfo.location}
                onChange={(e) => setOrderInfo(prev => ({ ...prev, location: e.target.value }))}
                className="input-field"
              />
            </p>
          </div>
          <div>
            <p><strong>Conditions / Terms</strong><br />
              <input
                type="text"
                value={orderInfo.terms}
                onChange={(e) => setOrderInfo(prev => ({ ...prev, terms: e.target.value }))}
                className="input-field"
              />
            </p>
            <p><strong>No. de Taxe / Tax No.</strong><br />
              <input
                type="text"
                value={orderInfo.taxNumber}
                onChange={(e) => setOrderInfo(prev => ({ ...prev, taxNumber: e.target.value }))}
                className="input-field"
              />
            </p>
          </div>
          <div>
            <p><strong>Page</strong><br />{pageNumber}</p>
          </div>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>QTE REQ</th>
              <th>QTY SHIPPED</th>
              <th>Item #</th>
              <th>Description</th>
              <th>Poids / Weight (lbs)</th>
              <th>Total Weight (lbs)</th>
              <th>Prix Unitaire / Unit Price</th>
              <th>Extension / Extended Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    className="input-field"
                    placeholder="Item Name"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.qtyReq}
                    onChange={(e) => handleItemChange(item.id, 'qtyReq', e.target.value)}
                    className="input-field"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.qtyShipped}
                    onChange={(e) => handleItemChange(item.id, 'qtyShipped', e.target.value)}
                    className="input-field"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.itemNo}
                    onChange={(e) => handleItemChange(item.id, 'itemNo', e.target.value)}
                    className="input-field"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="input-field"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.weightPerItem}
                    onChange={(e) => handleItemChange(item.id, 'weightPerItem', e.target.value)}
                    className="input-field"
                  />
                </td>
                <td>{item.totalWeight.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                    className="input-field"
                  />
                </td>
                <td>{item.extendedPrice.toFixed(2)}</td>
                <td>
                  <button onClick={() => removeItem(item.id)} className="remove-btn">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addItem} className="add-btn">Add Item</button>

        <div className="summary-section">
          <div className="summary-left">
            <p><strong>POIDS TOTAL (lbs) / TOTAL WEIGHT (lbs):</strong> {totalWeight.toFixed(2)}</p>
            <p><strong>Qte Total / Total Qty:</strong> {totalQty.toFixed(2)}</p>
            <p>
              <strong>COMMENTAIRES / COMMENTS:</strong>
              <input
                type="text"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="input-field"
              />
            </p>
          </div>
          <div className="summary-right">
            <div className="line-item">
              <span>Sous-total / Subtotal:</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            <div className="line-item">
              <span>USDTAX:</span>
              <span>{usdTax.toFixed(2)}</span>
            </div>
            <div className="line-item total">
              <span>Total de la facture / Invoice Total:</span>
              <span>{invoiceTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="footer-notes">
          {footerNotes.map((note, index) => (
            <p key={index}>{note}</p>
          ))}
        </div>

        <div className="bottom-label">Original</div>
      </div>
    </div>
  );
}

export default Invoice;
