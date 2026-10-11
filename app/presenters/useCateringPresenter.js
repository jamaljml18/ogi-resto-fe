'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  INITIAL_MENUS,
  DAYS_LIST,
  PRESET_COMPANIES,
  PRESET_DIVISIONS,
  PRESET_LOCATIONS,
  sortMenusNaturally
} from '../models/initialData';
import { menuModel } from '../models/menuModel';
import { orderModel } from '../models/orderModel';
import { authModel } from '../models/authModel';

export function useCateringPresenter({ initialAdminOpen = false } = {}) {
  // Mode Pesan: 'today' (Pesan Hari Ini), 'tomorrow' (Pre-Order Besok), 'custom' (Pre-Order Tanggal Pilihan)
  const [orderMode, setOrderMode] = useState('today');

  const indonesianDays = useMemo(
    () => ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    []
  );

  // Perhitungan Hari Ini & Besok secara Real-time
  const { todayName, tomorrowName, todayDateStr, tomorrowDateStr, todayIsoDate, tomorrowIsoDate, defaultCustomIsoDate } = useMemo(() => {
    const now = new Date();
    const todayIdx = now.getDay();
    const tomorrowIdx = (todayIdx + 1) % 7;

    const tDate = new Date(now);
    tDate.setDate(tDate.getDate() + 1);

    const twoDaysLater = new Date(now);
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);

    const toIso = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      todayName: indonesianDays[todayIdx],
      tomorrowName: indonesianDays[tomorrowIdx],
      todayDateStr: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      tomorrowDateStr: tDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      todayIsoDate: toIso(now),
      tomorrowIsoDate: toIso(tDate),
      defaultCustomIsoDate: toIso(twoDaysLater)
    };
  }, [indonesianDays]);

  // Tanggal Kustom yang Ditentukan Pengguna (Pre-Order Mandiri)
  const [customDate, setCustomDate] = useState('');

  // Pastikan customDate terinisialisasi
  useEffect(() => {
    if (!customDate && defaultCustomIsoDate) {
      setCustomDate(defaultCustomIsoDate);
    }
  }, [defaultCustomIsoDate, customDate]);

  const { customDayName, customDateStr } = useMemo(() => {
    const activeDateVal = customDate || defaultCustomIsoDate;
    if (!activeDateVal) return { customDayName: tomorrowName, customDateStr: tomorrowDateStr };
    const parts = activeDateVal.split('-');
    if (parts.length !== 3) return { customDayName: tomorrowName, customDateStr: tomorrowDateStr };
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayIdx = d.getDay();
    return {
      customDayName: indonesianDays[dayIdx] || 'Senin',
      customDateStr: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  }, [customDate, defaultCustomIsoDate, indonesianDays, tomorrowName, tomorrowDateStr]);

  const activeSelectedDay =
    orderMode === 'today'
      ? todayName
      : orderMode === 'tomorrow'
      ? tomorrowName
      : customDayName;

  // Menus & Filters Pelanggan
  const [menus, setMenus] = useState(INITIAL_MENUS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

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

  // Admin States
  const [showAdminModal, setShowAdminModal] = useState(initialAdminOpen);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [adminLoginForm, setAdminLoginForm] = useState({ username: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('schedule'); // 'schedule' | 'orders' | 'kasbon'

  // Admin Kasbon States
  const [kasbonMonth, setKasbonMonth] = useState(new Date().getMonth() + 1);
  const [kasbonYear, setKasbonYear] = useState(new Date().getFullYear());
  const [kasbonCompany, setKasbonCompany] = useState('Semua');
  const [kasbonDivision, setKasbonDivision] = useState('Semua');
  const [kasbonOrders, setKasbonOrders] = useState([]);

  // Admin Schedules
  const [adminScheduleDay, setAdminScheduleDay] = useState('Senin');
  const [adminAllMenus, setAdminAllMenus] = useState(INITIAL_MENUS);
  const [adminSchedules, setAdminSchedules] = useState({});
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [adminScheduleSearch, setAdminScheduleSearch] = useState('');
  const [adminScheduleCategory, setAdminScheduleCategory] = useState('Semua');
  const [adminToast, setAdminToast] = useState('');
  const [clockTime, setClockTime] = useState('');

  // Modals Menu Admin
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const [editingMenuForm, setEditingMenuForm] = useState(null);
  const [newMenuForm, setNewMenuForm] = useState({
    name: '',
    price: '',
    category: 'Karbohidrat',
    days: {
      Senin: true,
      Selasa: true,
      Rabu: true,
      Kamis: true,
      Jumat: true,
      Sabtu: true,
      Minggu: true
    }
  });

  // Admin Orders
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [adminOrdersSearch, setAdminOrdersSearch] = useState('');
  const [adminOrdersFilter, setAdminOrdersFilter] = useState({
    company: 'Semua',
    division: 'Semua',
    location: 'Semua',
    day: 'Semua',
    dateFilterType: 'all', // 'all', 'single', 'range', 'month_year'
    singleDate: '',
    startDate: '',
    endDate: '',
    month: 'Semua',
    year: new Date().getFullYear().toString()
  });

  // Helper Toast
  const showToast = useCallback((msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(''), 3500);
  }, []);

  // Check URL pathname for /ogi trigger if not already opened
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const search = window.location.search;
      if (pathname === '/ogi' || pathname.startsWith('/ogi/') || search.includes('admin')) {
        setShowAdminModal(true);
      }
    }
  }, []);

  // Clock in admin
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }) +
          ' • ' +
          now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
          ' WIB'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Auto-login from saved token
  useEffect(() => {
    const savedToken = authModel.getToken();
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Fetch Menu Pelanggan Berdasarkan Hari Aktif
  const loadCustomerMenus = useCallback(async (dayToFetch) => {
    try {
      const data = await menuModel.getMenuForDay(dayToFetch);
      if (data && Array.isArray(data.menus)) {
        setMenus(sortMenusNaturally(data.menus));
      }
    } catch {
      // Offline fallback: filter INITIAL_MENUS
      setMenus(sortMenusNaturally(INITIAL_MENUS));
    }
  }, []);

  useEffect(() => {
    loadCustomerMenus(activeSelectedDay);
  }, [activeSelectedDay, loadCustomerMenus]);

  // Load Admin Data (Menus & Schedules)
  const loadAdminData = useCallback(async () => {
    try {
      const data = await menuModel.getAllMenus(adminToken);
      if (data && Array.isArray(data.menus)) {
        setAdminAllMenus(sortMenusNaturally(data.menus));
        if (data.schedules) {
          setAdminSchedules(data.schedules);
        }
      }
    } catch {
      // Offline fallback
      setAdminAllMenus(sortMenusNaturally(INITIAL_MENUS));
    }
  }, [adminToken]);

  // Helper membuat parameter filter pesanan
  const buildOrderFilterParams = useCallback(() => {
    const filters = {
      search: adminOrdersSearch,
      company: adminOrdersFilter.company,
      division: adminOrdersFilter.division,
      location: adminOrdersFilter.location,
      day: adminOrdersFilter.day
    };

    if (adminOrdersFilter.dateFilterType === 'today') {
      filters.date = todayIsoDate;
    } else if (adminOrdersFilter.dateFilterType === 'single' && adminOrdersFilter.singleDate) {
      filters.date = adminOrdersFilter.singleDate;
    } else if (adminOrdersFilter.dateFilterType === 'range') {
      if (adminOrdersFilter.startDate) filters.startDate = adminOrdersFilter.startDate;
      if (adminOrdersFilter.endDate) filters.endDate = adminOrdersFilter.endDate;
    } else if (adminOrdersFilter.dateFilterType === 'month_year') {
      if (adminOrdersFilter.year && adminOrdersFilter.year !== 'Semua') {
        filters.year = adminOrdersFilter.year;
      }
      if (adminOrdersFilter.month && adminOrdersFilter.month !== 'Semua') {
        filters.month = adminOrdersFilter.month;
      }
    }
    return filters;
  }, [adminOrdersSearch, adminOrdersFilter, todayIsoDate]);

  // Load Orders History
  const loadOrdersHistory = useCallback(async () => {
    try {
      const filters = buildOrderFilterParams();
      const data = await orderModel.getOrders(filters, adminToken);
      if (data && Array.isArray(data.orders)) {
        setOrdersHistory(data.orders);
      }
    } catch {
      // Fallback
      setOrdersHistory([]);
    }
  }, [buildOrderFilterParams, adminToken]);

  // Load Kasbon Data khusus
  const loadKasbonData = useCallback(async () => {
    try {
      const data = await orderModel.getOrders(
        {
          month: kasbonMonth,
          year: kasbonYear,
          company: kasbonCompany === 'Semua' ? undefined : kasbonCompany,
          division: kasbonDivision === 'Semua' ? undefined : kasbonDivision
        },
        adminToken
      );
      if (data && Array.isArray(data.orders)) {
        setKasbonOrders(data.orders);
      }
    } catch {
      setKasbonOrders([]);
    }
  }, [kasbonMonth, kasbonYear, kasbonCompany, kasbonDivision, adminToken]);

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminData();
      loadOrdersHistory();
      loadKasbonData();
    }
  }, [isAdminLoggedIn, loadAdminData, loadOrdersHistory, loadKasbonData]);

  // Filter Menu Pelanggan
  const categories = ['Semua', 'Karbohidrat', 'Sayur', 'Lauk', 'Alat Makan'];

  const filteredMenus = useMemo(() => {
    const list = menus.filter((item) => {
      const matchCategory =
        activeCategory === 'Semua' || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
    return sortMenusNaturally(list);
  }, [menus, activeCategory, searchQuery]);

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

  // Cart Summary
  const cartSummary = useMemo(() => {
    let totalItems = 0;
    let totalPrice = 0;
    const itemsList = [];

    // Gunakan map master gabungan dari adminAllMenus dan INITIAL_MENUS agar selalu ketemu
    const allKnownMenusMap = {};
    INITIAL_MENUS.forEach((m) => {
      allKnownMenusMap[m.id] = m;
    });
    adminAllMenus.forEach((m) => {
      allKnownMenusMap[m.id] = m;
    });

    Object.entries(cart).forEach(([id, qty]) => {
      if (qty > 0) {
        const item = allKnownMenusMap[id] || menus.find((m) => m.id === id);
        if (item) {
          const subtotal = item.price * qty;
          totalItems += qty;
          totalPrice += subtotal;
          itemsList.push({
            id: item.id,
            name: item.name,
            price: item.price,
            qty,
            subtotal
          });
        }
      }
    });

    return { totalItems, totalPrice, itemsList };
  }, [cart, menus, adminAllMenus]);

  // Submit Order Pelanggan
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartSummary.totalItems === 0) return;

    setIsSubmitting(true);
    const chosenScheduleDay =
      orderMode === 'today'
        ? todayName
        : orderMode === 'tomorrow'
        ? tomorrowName
        : customDayName;

    const chosenDateStr =
      orderMode === 'today'
        ? todayDateStr
        : orderMode === 'tomorrow'
        ? tomorrowDateStr
        : customDateStr;

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

    try {
      const resData = await orderModel.submitOrder(payload);
      setLastSubmittedOrder(resData.order || payload);
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
      setCart({});
    } catch {
      // Fallback lokal jika server offline
      const fallbackOrder = {
        ...payload,
        payment_method: payload.paymentMethod,
        order_number: 'ORD-' + Date.now(),
        order_date: new Date().toISOString().split('T')[0]
      };
      setLastSubmittedOrder(fallbackOrder);
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
      setCart({});
    } finally {
      setIsSubmitting(false);
    }
  };

  // Login Admin
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginError('');

    try {
      const data = await authModel.login(adminLoginForm.username, adminLoginForm.password);
      setAdminToken(data.token);
      setIsAdminLoggedIn(true);
      authModel.setToken(data.token);
      showToast('🎉 Berhasil masuk ke Panel Admin Ogi Resto!');
      setAdminLoginForm({ username: '', password: '' });
    } catch (err) {
      // Fallback credential
      if (
        adminLoginForm.username === 'admin' &&
        adminLoginForm.password === 'admin123'
      ) {
        const dummyToken = 'demo-token-' + Date.now();
        setAdminToken(dummyToken);
        setIsAdminLoggedIn(true);
        authModel.setToken(dummyToken);
        showToast('🎉 Masuk dalam Mode Demo Admin!');
        setAdminLoginForm({ username: '', password: '' });
      } else {
        setAdminLoginError(err.message || 'Username atau password salah');
      }
    }
  };

  // Logout Admin
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminToken('');
    authModel.clearToken();
    showToast('👋 Anda telah keluar dari Panel Admin');
  };

  // Toggle Ketersediaan Menu per Hari
  const toggleMenuDayAvailability = (menuId, day) => {
    setAdminSchedules((prev) => {
      const menuDays = prev[menuId] || {};
      const current = menuDays[day] !== false;
      return {
        ...prev,
        [menuId]: {
          ...menuDays,
          [day]: !current
        }
      };
    });
  };

  // Bulk Aktifkan / Nonaktifkan Semua Menu
  const handleBulkToggleDay = (status) => {
    setAdminSchedules((prev) => {
      const updated = { ...prev };
      adminAllMenus.forEach((m) => {
        const currentDays = updated[m.id] || {};
        updated[m.id] = {
          ...currentDays,
          [adminScheduleDay]: status
        };
      });
      return updated;
    });
    showToast(
      `⚡ Semua menu berhasil di-${status ? 'aktifkan' : 'nonaktifkan'} untuk hari ${adminScheduleDay}`
    );
  };

  // Simpan Jadwal Mingguan
  const handleSaveSchedules = async () => {
    setIsSavingSchedule(true);
    try {
      await menuModel.saveSchedules(adminSchedules, adminToken);
      showToast(`💾 Jadwal menu berhasil disimpan secara permanen!`);
      loadCustomerMenus(activeSelectedDay);
    } catch {
      showToast(`💾 Jadwal menu tersimpan secara lokal.`);
      loadCustomerMenus(activeSelectedDay);
    } finally {
      setIsSavingSchedule(false);
    }
  };

  // Tambah Menu Baru
  const handleAddNewMenu = async (e) => {
    e.preventDefault();
    if (!newMenuForm.name.trim()) return;

    try {
      const res = await menuModel.createMenu(
        {
          name: newMenuForm.name,
          price: parseInt(newMenuForm.price, 10) || 0,
          category: newMenuForm.category,
          schedules: newMenuForm.days
        },
        adminToken
      );
      if (res && res.menu) {
        setAdminAllMenus((prev) => sortMenusNaturally([...prev, res.menu]));
      }
    } catch {
      const dummyId = 'm-' + Date.now();
      const dummyMenu = {
        id: dummyId,
        name: newMenuForm.name,
        price: parseInt(newMenuForm.price, 10) || 0,
        category: newMenuForm.category
      };
      setAdminAllMenus((prev) => sortMenusNaturally([...prev, dummyMenu]));
    }

    showToast(`🎉 Menu "${newMenuForm.name}" berhasil ditambahkan!`);
    setShowAddMenuModal(false);
    setNewMenuForm({
      name: '',
      price: '',
      category: 'Karbohidrat',
      days: {
        Senin: true,
        Selasa: true,
        Rabu: true,
        Kamis: true,
        Jumat: true,
        Sabtu: true,
        Minggu: true
      }
    });
    loadAdminData();
    loadCustomerMenus(activeSelectedDay);
  };

  // Open Edit Menu Modal
  const handleOpenEditModal = (menu) => {
    const menuDays = adminSchedules[menu.id] || {};
    const daysObj = {};
    DAYS_LIST.forEach((d) => {
      daysObj[d] = menuDays[d] !== false;
    });

    setEditingMenuForm({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      category: menu.category,
      days: daysObj
    });
    setShowEditMenuModal(true);
  };

  // Save Edited Menu
  const handleSaveEditedMenu = async (e) => {
    e.preventDefault();
    if (!editingMenuForm || !editingMenuForm.name.trim()) return;

    try {
      await menuModel.updateMenu(
        editingMenuForm.id,
        {
          name: editingMenuForm.name,
          price: parseInt(editingMenuForm.price, 10) || 0,
          category: editingMenuForm.category,
          schedules: editingMenuForm.days
        },
        adminToken
      );

      setAdminAllMenus((prev) =>
        sortMenusNaturally(
          prev.map((m) =>
            m.id === editingMenuForm.id
              ? {
                  ...m,
                  name: editingMenuForm.name,
                  price: parseInt(editingMenuForm.price, 10) || 0,
                  category: editingMenuForm.category
                }
              : m
          )
        )
      );

      setAdminSchedules((prev) => ({
        ...prev,
        [editingMenuForm.id]: editingMenuForm.days
      }));

      showToast(`✨ Menu "${editingMenuForm.name}" berhasil diperbarui!`);
      setShowEditMenuModal(false);
      loadCustomerMenus(activeSelectedDay);
    } catch (err) {
      showToast('Gagal mengupdate menu: ' + err.message);
    }
  };

  // Delete Menu
  const handleDeleteMenu = async (menu) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus menu "${menu.name}" secara permanen?`
    );
    if (!confirmDelete) return;

    try {
      await menuModel.deleteMenu(menu.id, adminToken);
      setAdminAllMenus((prev) => prev.filter((m) => m.id !== menu.id));
      showToast(`🗑️ Menu "${menu.name}" berhasil dihapus.`);
      loadCustomerMenus(activeSelectedDay);
    } catch (err) {
      showToast('Gagal menghapus menu: ' + err.message);
    }
  };

  // Filter Menu di Halaman Admin Jadwal
  const filteredAdminMenus = useMemo(() => {
    const list = adminAllMenus.filter((m) => {
      const matchCat =
        adminScheduleCategory === 'Semua' || m.category === adminScheduleCategory;
      const matchSearch = m.name
        .toLowerCase()
        .includes(adminScheduleSearch.toLowerCase());
      return matchCat && matchSearch;
    });
    return sortMenusNaturally(list);
  }, [adminAllMenus, adminScheduleCategory, adminScheduleSearch]);

  const activeCountForDay = useMemo(() => {
    return adminAllMenus.filter((m) => {
      const isAvailable = adminSchedules[m.id]
        ? adminSchedules[m.id][adminScheduleDay] !== false
        : true;
      return isAvailable;
    }).length;
  }, [adminAllMenus, adminSchedules, adminScheduleDay]);

  // Orders Summaries
  const ordersSummary = useMemo(() => {
    const totalTransactions = ordersHistory.length;
    const totalRevenue = ordersHistory.reduce(
      (sum, ord) => sum + (ord.total_price || ord.totalPrice || 0),
      0
    );
    const averageOrderValue =
      totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;
    return { totalTransactions, totalRevenue, averageOrderValue };
  }, [ordersHistory]);

  const totalPortionsSold = useMemo(() => {
    return ordersHistory.reduce((acc, curr) => {
      if (!Array.isArray(curr.items)) return acc;
      return acc + curr.items.reduce((sum, item) => sum + (item.qty || 1), 0);
    }, 0);
  }, [ordersHistory]);

  // Hitung akumulasi harian per pemesan pada tanggal yang sama (Item 3)
  const userDailyTotals = useMemo(() => {
    const map = {};
    ordersHistory.forEach((ord) => {
      const uName = (ord.user_name || ord.userName || '').trim().toLowerCase();
      const oDate = ord.order_date || (ord.created_at ? ord.created_at.split('T')[0] : '');
      const key = `${uName}___${oDate}`;
      map[key] = (map[key] || 0) + (Number(ord.total_price || ord.totalPrice) || 0);
    });
    return map;
  }, [ordersHistory]);

  const userDailyOrderCounts = useMemo(() => {
    const map = {};
    ordersHistory.forEach((ord) => {
      const uName = (ord.user_name || ord.userName || '').trim().toLowerCase();
      const oDate = ord.order_date || (ord.created_at ? ord.created_at.split('T')[0] : '');
      const key = `${uName}___${oDate}`;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [ordersHistory]);

  // Daftar divisi gabungan: preset default + divisi yang ada di database riwayat transaksi
  const availableDivisions = useMemo(() => {
    const set = new Set(PRESET_DIVISIONS);
    ordersHistory.forEach((o) => {
      if (o.division && o.division.trim() && o.division !== 'Semua') {
        set.add(o.division.trim());
      }
    });
    kasbonOrders.forEach((o) => {
      if (o.division && o.division.trim() && o.division !== 'Semua') {
        set.add(o.division.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [ordersHistory, kasbonOrders]);

  // Daftar perusahaan gabungan: preset default + perusahaan yang ada di database transaksi
  const availableCompanies = useMemo(() => {
    const set = new Set(PRESET_COMPANIES);
    ordersHistory.forEach((o) => {
      if (o.company && o.company.trim() && o.company !== 'Semua') {
        set.add(o.company.trim());
      }
    });
    kasbonOrders.forEach((o) => {
      if (o.company && o.company.trim() && o.company !== 'Semua') {
        set.add(o.company.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [ordersHistory, kasbonOrders]);

  // Daftar lokasi pengantaran gabungan
  const availableLocations = useMemo(() => {
    const set = new Set(PRESET_LOCATIONS);
    ordersHistory.forEach((o) => {
      if (o.location && o.location.trim() && o.location !== 'Semua') {
        set.add(o.location.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [ordersHistory]);

  // Matrix Rekap Kasbon Bulanan (Item 5)
  const monthlyKasbonMatrix = useMemo(() => {
    const daysInMonth = new Date(kasbonYear, kasbonMonth, 0).getDate();
    const MONTH_NAMES = [
      '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthName = MONTH_NAMES[kasbonMonth] || `Bulan ${kasbonMonth}`;
    const userMap = {};

    kasbonOrders.forEach((ord) => {
      const uName = (ord.user_name || ord.userName || '').trim();
      if (!uName) return;
      if (kasbonDivision !== 'Semua' && ord.division && ord.division.toLowerCase() !== kasbonDivision.toLowerCase()) {
        return;
      }
      const key = `${uName}___${ord.company || ''}___${ord.division || ''}`;
      if (!userMap[key]) {
        userMap[key] = {
          userName: uName,
          company: ord.company || '-',
          division: ord.division || '-',
          location: ord.location || '-',
          days: {},
          totalKasbon: 0,
          totalCash: 0,
          totalOrdersCount: 0
        };
      }

      const ordDate = ord.order_date || (ord.created_at ? ord.created_at.split('T')[0] : '');
      let dayNum = 0;
      if (ordDate) {
        const parts = ordDate.split('-');
        dayNum = parseInt(parts[2], 10);
      }

      const isKasbon = ord.payment_method === 'Kasbon' || ord.paymentMethod === 'Kasbon';
      const p = Number(ord.total_price || ord.totalPrice) || 0;

      if (dayNum >= 1 && dayNum <= daysInMonth) {
        if (!userMap[key].days[dayNum]) {
          userMap[key].days[dayNum] = {
            hasKasbon: false,
            hasCash: false,
            kasbonAmount: 0,
            cashAmount: 0,
            orderCount: 0
          };
        }
        userMap[key].days[dayNum].orderCount += 1;
        if (isKasbon) {
          userMap[key].days[dayNum].hasKasbon = true;
          userMap[key].days[dayNum].kasbonAmount += p;
        } else {
          userMap[key].days[dayNum].hasCash = true;
          userMap[key].days[dayNum].cashAmount += p;
        }
      }

      if (isKasbon) {
        userMap[key].totalKasbon += p;
      } else {
        userMap[key].totalCash += p;
      }
      userMap[key].totalOrdersCount += 1;
    });

    const userList = Object.values(userMap).sort(
      (a, b) => b.totalKasbon - a.totalKasbon || a.userName.localeCompare(b.userName)
    );

    const totalKasbonAmount = userList.reduce((sum, u) => sum + u.totalKasbon, 0);
    const totalCashAmount = userList.reduce((sum, u) => sum + u.totalCash, 0);
    const usersWithKasbonCount = userList.filter((u) => u.totalKasbon > 0).length;

    return {
      monthName,
      daysInMonth,
      rows: userList,
      users: userList,
      totalUsersCount: userList.length,
      totalKasbonAmount,
      totalCashAmount,
      usersWithKasbonCount
    };
  }, [kasbonOrders, kasbonMonth, kasbonYear, kasbonDivision]);

  const handleExportKasbonCsv = () => {
    const url = orderModel.getExportKasbonCsvUrl(
      { month: kasbonMonth, year: kasbonYear, company: kasbonCompany, division: kasbonDivision },
      adminToken
    );
    window.open(url, '_blank');
  };

  // Export CSV
  const handleExportCsv = () => {
    const filters = buildOrderFilterParams();
    const url = orderModel.getExportCsvUrl(filters, adminToken);
    window.open(url, '_blank');
  };

  const handleResetOrdersFilter = () => {
    setAdminOrdersSearch('');
    setAdminOrdersFilter({
      company: 'Semua',
      division: 'Semua',
      location: 'Semua',
      day: 'Semua',
      dateFilterType: 'all',
      singleDate: '',
      startDate: '',
      endDate: '',
      month: 'Semua',
      year: new Date().getFullYear().toString()
    });
  };

  return {
    // Mode
    orderMode,
    setOrderMode,
    todayName,
    tomorrowName,
    todayDateStr,
    tomorrowDateStr,
    todayIsoDate,
    tomorrowIsoDate,
    customDate,
    setCustomDate,
    customDayName,
    customDateStr,
    activeSelectedDay,

    // Customer Menu & Catalog
    menus,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    categories,
    filteredMenus,
    totalMenusCount: menus.length,

    // Cart
    cart,
    cartSummary,
    handleAddToCart,
    handleRemoveFromCart,
    handleClearCart,

    // Form Checkout & Modals
    formData,
    setFormData,
    showCheckoutModal,
    setShowCheckoutModal,
    showSuccessModal,
    setShowSuccessModal,
    lastSubmittedOrder,
    isSubmitting,
    handleSubmitOrder,

    // Admin State & Controls
    showAdminModal,
    setShowAdminModal,
    isAdminLoggedIn,
    adminToken,
    clockTime,
    adminLoginForm,
    setAdminLoginForm,
    adminLoginError,
    showAdminPassword,
    setShowAdminPassword,
    handleAdminLogin,
    handleAdminLogout,
    adminActiveTab,
    setAdminActiveTab,
    adminScheduleDay,
    setAdminScheduleDay,
    adminScheduleSearch,
    setAdminScheduleSearch,
    adminScheduleCategory,
    setAdminScheduleCategory,
    filteredAdminMenus,
    adminAllMenus,
    adminSchedules,
    activeCountForDay,
    isSavingSchedule,
    handleSaveSchedules,
    toggleMenuDayAvailability,
    handleBulkToggleDay,
    adminToast,

    // Admin Add Menu
    showAddMenuModal,
    setShowAddMenuModal,
    newMenuForm,
    setNewMenuForm,
    handleAddNewMenu,

    // Admin Edit Menu
    showEditMenuModal,
    setShowEditMenuModal,
    editingMenuForm,
    setEditingMenuForm,
    handleOpenEditModal,
    handleSaveEditedMenu,

    // Admin Delete Menu
    handleDeleteMenu,

    // Admin Orders
    ordersSummary,
    totalPortionsSold,
    ordersHistory,
    adminOrdersSearch,
    setAdminOrdersSearch,
    adminOrdersFilter,
    setAdminOrdersFilter,
    handleResetOrdersFilter,
    handleExportCsv,
    userDailyTotals,
    userDailyOrderCounts,

    // Admin Kasbon
    kasbonMonth,
    setKasbonMonth,
    kasbonYear,
    setKasbonYear,
    kasbonCompany,
    setKasbonCompany,
    kasbonDivision,
    setKasbonDivision,
    availableDivisions,
    availableCompanies,
    availableLocations,
    monthlyKasbonMatrix,
    handleExportKasbonCsv
  };
}
