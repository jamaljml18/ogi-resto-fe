'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  DAYS_LIST,
  PRESET_COMPANIES,
  PRESET_DIVISIONS,
  PRESET_LOCATIONS,
  sortMenusNaturally
} from '../models/initialData';
import { menuModel } from '../models/menuModel';
import { orderModel } from '../models/orderModel';
import { authModel } from '../models/authModel';
import { useKasbonPresenter } from './useKasbonPresenter';
import { useOrderSchedulePresenter } from './useOrderSchedulePresenter';
import {useCustomerOrderPresenter} from './useCustomerOrderPresenter';

export function useCateringPresenter({ initialAdminOpen = false } = {}) {
  const schedule = useOrderSchedulePresenter();
  const { orderMode,setOrderMode,todayName,tomorrowName,todayDateStr,tomorrowDateStr,
    todayIsoDate,tomorrowIsoDate,customDate,setCustomDate,
    customDayName,customDateStr,activeSelectedDay } = schedule;

  // Menus & Filters Pelanggan
  const [menus, setMenus] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Admin States
  const [showAdminModal, setShowAdminModal] = useState(initialAdminOpen);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [adminLoginForm, setAdminLoginForm] = useState({ username: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('schedule'); // 'schedule' | 'orders' | 'kasbon'

  // Admin Schedules
  const [adminScheduleDay, setAdminScheduleDay] = useState('Senin');
  const [adminAllMenus, setAdminAllMenus] = useState([]);
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
  const toastTimer = useRef(null);
  useEffect(() => () => clearTimeout(toastTimer.current),[]);
  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setAdminToast(msg);
    toastTimer.current = setTimeout(() => setAdminToast(''),3500);
  }, []);

  // Clock in admin
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(
        now.toLocaleDateString('id-ID', {
          timeZone: 'Asia/Jakarta',
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }) +
          ' • ' +
          now.toLocaleTimeString('id-ID', { hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta' }) +
          ' WIB'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleApiError = useCallback((error) => {
    if (error.status === 401) {authModel.clearToken();setAdminToken('');setIsAdminLoggedIn(false);}
    showToast(error.message || 'Permintaan gagal.');
  },[showToast]);
  const kasbon = useKasbonPresenter({token:adminToken,isLoggedIn:isAdminLoggedIn,onError:handleApiError,showToast});
  const {kasbonOrders} = kasbon;
  const [catalogError,setCatalogError] = useState('');
  const [catalogDay,setCatalogDay] = useState('');
  const catalogReady = catalogDay === activeSelectedDay;
  const customer = useCustomerOrderPresenter({menus,catalogReady,catalogError,schedule});
  const {setCart} = customer;
  const menuRequest = useRef(0);
  useEffect(() => {
    const token = authModel.getToken();
    if (!token) return;
    const controller = new AbortController();
    authModel.validateSession(token,controller.signal).then(() => {
      if (!controller.signal.aborted) {setAdminToken(token);setIsAdminLoggedIn(true);}
    }).catch(error => {if (!controller.signal.aborted) handleApiError(error);});
    return () => controller.abort();
  },[handleApiError]);

  const loadCustomerMenus = useCallback(async (dayToFetch,signal) => {
    const requestId = ++menuRequest.current;
    try {
      const data = await menuModel.getMenuForDay(dayToFetch,signal);
      if (signal?.aborted || requestId !== menuRequest.current) return;
      const list = sortMenusNaturally(data.menus);
      setMenus(list);setCatalogDay(dayToFetch);setCatalogError('');
      setCart(prev => Object.fromEntries(Object.entries(prev).filter(([id]) => list.some(menu => menu.id === id))));
    } catch(error) {
      if (signal?.aborted || requestId !== menuRequest.current) return;
      setMenus([]);setCatalogDay('');setCatalogError(error.message || 'Gagal memuat menu.');
    }
  },[setCart]);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => loadCustomerMenus(activeSelectedDay,controller.signal),0);
    return () => {clearTimeout(timer);controller.abort();};
  },[activeSelectedDay,loadCustomerMenus]);

  // Load Admin Data (Menus & Schedules)
  const loadAdminData = useCallback(async (signal) => {
    try {
      const data = await menuModel.getAllMenus(adminToken,signal);
      if (signal?.aborted) return;
      if (data && Array.isArray(data.menus)) {
        setAdminAllMenus(sortMenusNaturally(data.menus));
        if (data.schedules) {
          setAdminSchedules(data.schedules);
        }
      }
    } catch(error) {
      if (!signal?.aborted) handleApiError(error);
    }
  }, [adminToken,handleApiError]);

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
  const loadOrdersHistory = useCallback(async (signal) => {
    try {
      const filters = buildOrderFilterParams();
      const data = await orderModel.getOrders(filters, adminToken,signal);
      if (signal?.aborted) return;
      if (data && Array.isArray(data.orders)) {
        setOrdersHistory(data.orders);
      }
    } catch(error) {
      if (!signal?.aborted) {setOrdersHistory([]);handleApiError(error);}
    }
  }, [buildOrderFilterParams, adminToken,handleApiError]);

  useEffect(() => {
    if (!isAdminLoggedIn) return;
    const controller = new AbortController();
    const timer = setTimeout(() => loadAdminData(controller.signal),0);
    return () => {clearTimeout(timer);controller.abort();};
  },[isAdminLoggedIn,loadAdminData]);
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    const controller = new AbortController();
    const timer = setTimeout(() => loadOrdersHistory(controller.signal),250);
    return () => {clearTimeout(timer);controller.abort();};
  },[isAdminLoggedIn,loadOrdersHistory]);

  // Filter Menu Pelanggan
  const categories = useMemo(() => ['Semua',...new Set(['Karbohidrat','Sayur','Lauk','Alat Makan',...menus.map(m => m.category),...adminAllMenus.map(m => m.category)])],[menus,adminAllMenus]);

  const filteredMenus = useMemo(() => {
    if (!catalogReady) return [];
    const list = menus.filter((item) => {
      const matchCategory =
        activeCategory === 'Semua' || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
    return sortMenusNaturally(list);
  }, [menus, activeCategory, searchQuery,catalogReady]);

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
      setAdminLoginError(err.message || 'Login gagal.');
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

  const handleSaveSchedules = async () => {
    setIsSavingSchedule(true);
    try {
      await menuModel.saveSchedules(adminSchedules,adminToken);
      showToast('Jadwal menu berhasil disimpan.');
      loadCustomerMenus(activeSelectedDay);
    } catch(error) {handleApiError(error);}
    finally {setIsSavingSchedule(false);}
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
    } catch(error) {handleApiError(error);return;}

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
      handleApiError(err);
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
      handleApiError(err);
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
      (sum, ord) => sum + (Number(ord.total_price ?? ord.totalPrice) || 0),
      0
    );
    const averageOrderValue =
      totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;
    return { totalTransactions, totalRevenue, averageOrderValue };
  }, [ordersHistory]);

  const totalPortionsSold = useMemo(() => {
    return ordersHistory.reduce((acc, curr) => {
      if (!Array.isArray(curr.items)) return acc;
      return acc + curr.items.filter(item => item && !item._meta).reduce((sum,item) => sum + (Number(item.qty) || 0),0);
    }, 0);
  }, [ordersHistory]);

  // Hitung akumulasi harian per pemesan pada tanggal yang sama (Item 3)
  const userDailyTotals = useMemo(() => {
    const map = {};
    ordersHistory.forEach((ord) => {
      const uName = (ord.user_name || ord.userName || '').trim().toLowerCase();
      const oDate = ord.order_date || (ord.created_at ? ord.created_at.split('T')[0] : '');
      const key = JSON.stringify([uName,ord.company,ord.division,oDate]);
      map[key] = (map[key] || 0) + (Number(ord.total_price || ord.totalPrice) || 0);
    });
    return map;
  }, [ordersHistory]);

  const userDailyOrderCounts = useMemo(() => {
    const map = {};
    ordersHistory.forEach((ord) => {
      const uName = (ord.user_name || ord.userName || '').trim().toLowerCase();
      const oDate = ord.order_date || (ord.created_at ? ord.created_at.split('T')[0] : '');
      const key = JSON.stringify([uName,ord.company,ord.division,oDate]);
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

  const handleExportCsv = async () => {
    try {await orderModel.exportCsv(buildOrderFilterParams(),adminToken);}
    catch(error) {handleApiError(error);}
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
    totalMenusCount: catalogReady ? menus.length : 0,

    ...customer,

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

    ...kasbon,
    availableDivisions,
    availableCompanies,
    availableLocations,
    catalogError,
    catalogReady
  };
}
