'use client';
import {useState,useMemo,useRef} from 'react';
import {orderModel} from '../models/orderModel';
import {summarizeCart} from '../models/cartModel';
export function useCustomerOrderPresenter({menus,catalogReady,catalogError,schedule,onWaitingOrder,waitingForPayment=false}) {
  const {orderMode,todayName,tomorrowName,customDayName,todayIsoDate,tomorrowIsoDate,customDate,defaultCustomIsoDate} = schedule;
  const [checkoutError,setCheckoutError] = useState('');
  const submitting = useRef(false);
  const checkoutAttempt = useRef(null);
  // Keranjang
  const [cart, setCart] = useState({});

  // Modals Pelanggan
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data Diri
  const [formData, setFormData] = useState({
    userName: '',
    company: 'PT Bright Mobile Telecommunication',
    division: '',
    location: '',
    notes: '',
    paymentMethod: 'Cash'
  });

  // Cart Actions
  const handleAddToCart = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const handleClearCart = () => setCart({});

  const cartSummary = useMemo(() => catalogReady
    ? summarizeCart(cart,menus) : {itemsList:[],totalItems:0,totalPrice:0},[cart,menus,catalogReady]);

  // Submit Order Pelanggan
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (waitingForPayment) {
      setCheckoutError('Selesaikan pembayaran pesanan sebelumnya terlebih dahulu.'); return;
    }
    if (cartSummary.totalItems === 0 || submitting.current || catalogError || !catalogReady) return;
    submitting.current = true;
    setCheckoutError('');

    setIsSubmitting(true);
    const chosenScheduleDay =
      orderMode === 'today'
        ? todayName
        : orderMode === 'tomorrow'
        ? tomorrowName
        : customDayName;

    const chosenIsoDate =
      orderMode === 'today'
        ? todayIsoDate
        : orderMode === 'tomorrow'
        ? tomorrowIsoDate
        : (customDate || defaultCustomIsoDate);

    const payload = {
      userName: formData.userName,
      company: formData.company,
      division: formData.division,
      location: formData.location,
      notes: formData.notes || '',
      paymentMethod: formData.paymentMethod || 'Cash',
      items: cartSummary.itemsList,
      totalPrice: cartSummary.totalPrice,
      orderDay:
        orderMode === 'today'
          ? `Hari Ini (${chosenScheduleDay})`
          : orderMode === 'tomorrow'
          ? `Besok (${chosenScheduleDay})`
          : `PO (${chosenScheduleDay})`,
      orderDate: chosenIsoDate
    };

    const signature = JSON.stringify(payload);
    if (!checkoutAttempt.current || checkoutAttempt.current.signature !== signature) {
      const bytes = new Uint8Array(32);
      const token = typeof crypto !== 'undefined' && crypto.getRandomValues
        ? Array.from(crypto.getRandomValues(bytes), byte => byte.toString(16).padStart(2, '0')).join('') : undefined;
      checkoutAttempt.current = { signature, token };
    }
    if (checkoutAttempt.current.token) payload.paymentToken = checkoutAttempt.current.token;

    try {
      const resData = await orderModel.submitOrder(payload);
      if (!resData.success || !resData.order) throw new Error('Konfirmasi pesanan dari server tidak valid.');
      if (resData.order.payment_status === 'waiting') onWaitingOrder?.(resData.order);
      checkoutAttempt.current = null;
      setLastSubmittedOrder(resData.order);
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
      setCart({});
    } catch(error) {
      setCheckoutError(error.message || 'Pesanan belum tersimpan. Silakan coba kembali.');
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };


  return {cart,setCart,cartSummary,handleAddToCart,handleRemoveFromCart,handleClearCart,
    formData,setFormData,showCheckoutModal,setShowCheckoutModal,showSuccessModal,setShowSuccessModal,
    lastSubmittedOrder,isSubmitting,handleSubmitOrder,checkoutError};
}
