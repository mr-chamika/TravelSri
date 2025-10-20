import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

// Import services
import bookingService from '../../../services/bookingService';
import { HotelAuthService } from '../../../services/hotelAuthService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EarningsPage = () => {
  // State variables
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('year'); // 'year', 'month', 'week'
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    weeklyEarnings: 0,
    dailyEarnings: 0,
    totalBookings: 0,
    averageBookingValue: 0,
    platformCommission: 0,
    topPerformingRoom: { type: '', revenue: 0 },
    occupancyRate: 0,
    earningsByRoomType: {},
    earningsByMonth: {},
    earningsByDayOfWeek: {},
    earningsTrend: []
  });

  // Report generation state
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [reportType, setReportType] = useState('detailed'); // 'detailed', 'summary', 'custom'
  const [reportDateRange, setReportDateRange] = useState('month'); // 'week', 'month', 'quarter', 'year', 'custom'
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  
  // Refs for chart capture
  const trendChartRef = useRef(null);
  const roomTypeChartRef = useRef(null);
  const dayOfWeekChartRef = useRef(null);

  // Fetch booking data from API
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await bookingService.getAllBookings();
        setBookings(data);
        processEarningsData(data);
      } catch (err) {
        console.error('Failed to fetch bookings for earnings page:', err);
        setError('Failed to load earnings data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Process bookings to calculate earnings statistics
  const processEarningsData = (bookingsData) => {
    // Skip processing if no data
    if (!bookingsData || bookingsData.length === 0) {
      return;
    }

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    
    // Initialize data structures
    let totalEarnings = 0;
    let monthlyEarnings = 0;
    let weeklyEarnings = 0;
    let dailyEarnings = 0;
    const earningsByRoomType = {};
    const roomTypeBookingCounts = {};
    const earningsByMonth = {};
    const earningsByDayOfWeek = { 
      'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 
      'Thursday': 0, 'Friday': 0, 'Saturday': 0 
    };
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize monthly data
    monthNames.forEach(month => {
      earningsByMonth[month] = 0;
    });
    
    // Process each booking
    bookingsData.forEach(booking => {
      const amount = booking.totalCost || booking.totalAmount || 0;
      const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
      const roomType = booking.roomType || 'Unknown';
      
      // Total earnings
      totalEarnings += amount;
      
      // Monthly earnings (current month)
      if (bookingDate >= startOfCurrentMonth) {
        monthlyEarnings += amount;
      }
      
      // Weekly earnings (current week)
      if (bookingDate >= startOfCurrentWeek) {
        weeklyEarnings += amount;
      }
      
      // Daily earnings (today)
      if (isSameDay(bookingDate, now)) {
        dailyEarnings += amount;
      }
      
      // Earnings by room type
      if (!earningsByRoomType[roomType]) {
        earningsByRoomType[roomType] = 0;
        roomTypeBookingCounts[roomType] = 0;
      }
      earningsByRoomType[roomType] += amount;
      roomTypeBookingCounts[roomType]++;
      
      // Earnings by month
      const monthIndex = bookingDate.getMonth();
      const monthName = monthNames[monthIndex];
      earningsByMonth[monthName] += amount;
      
      // Earnings by day of week
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][bookingDate.getDay()];
      earningsByDayOfWeek[dayOfWeek] += amount;
    });

    // Calculate new metrics
    const totalBookings = bookingsData.length;
    const averageBookingValue = totalBookings > 0 ? totalEarnings / totalBookings : 0;

    // Find top performing room type
    let topPerformingRoom = { type: 'None', revenue: 0 };
    Object.entries(earningsByRoomType).forEach(([roomType, revenue]) => {
      if (revenue > topPerformingRoom.revenue) {
        topPerformingRoom = { type: roomType, revenue };
      }
    });

    // Calculate occupancy rate (simplified estimate based on booked rooms)
    // Assuming total capacity of 50 rooms (adjust this based on your actual capacity)
    const totalRooms = 50;
    const bookedRooms = new Set(); // Use Set to avoid counting the same room multiple times
    bookingsData.forEach(booking => {
      if (booking.roomNumber) {
        bookedRooms.add(booking.roomNumber.toString());
      }
    });
    const occupancyRate = Math.min(100, (bookedRooms.size / totalRooms) * 100);
    
    // Generate earnings trend data (last 12 months)
    const earningsTrend = [];
    const today = new Date();
    
    // Go back 12 months from current month
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = format(monthDate, 'MMM');
      const monthYear = format(monthDate, 'MMM yyyy');
      
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);
      
      // Filter bookings for this month
      let monthlyTotal = 0;
      bookingsData.forEach(booking => {
        const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
        if (bookingDate >= startDate && bookingDate <= endDate) {
          monthlyTotal += (booking.totalCost || booking.totalAmount || 0);
        }
      });
      
      earningsTrend.push({
        month: monthName,
        monthYear,
        amount: monthlyTotal
      });
    }
    
    // Calculate platform commission (10% of total revenue)
    const platformCommission = totalEarnings * 0.1;
    
    setEarningsData({
      totalEarnings,
      monthlyEarnings,
      weeklyEarnings,
      dailyEarnings,
      totalBookings,
      averageBookingValue,
      platformCommission,
      topPerformingRoom,
      occupancyRate,
      earningsByRoomType,
      earningsByMonth,
      earningsByDayOfWeek,
      earningsTrend
    });
  };

  // Get filtered data based on date range
  const getFilteredBookings = () => {
    if (!bookings || bookings.length === 0) {
      return [];
    }

    const now = new Date();
    let startDate;
    
    // Filter based on selected date range
    switch(dateRange) {
      case 'week':
        // Get bookings from last 7 days
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        // Get bookings from last 30 days
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
        break;
      case 'year':
      default:
        // Get bookings from last 12 months
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
    }
    
    return bookings.filter(booking => {
      const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
      return bookingDate >= startDate && bookingDate <= now;
    });
  };

  // Get filtered data
  const filteredBookings = getFilteredBookings();
  
  // Process filtered data for room type
  const getFilteredRoomTypeData = () => {
    const roomTypeData = {};
    
    filteredBookings.forEach(booking => {
      const amount = booking.totalCost || booking.totalAmount || 0;
      const roomType = booking.roomType || 'Unknown';
      
      if (!roomTypeData[roomType]) {
        roomTypeData[roomType] = 0;
      }
      roomTypeData[roomType] += amount;
    });
    
    return roomTypeData;
  };
  
  // Process filtered data for day of week
  const getFilteredDayOfWeekData = () => {
    const dayOfWeekData = { 
      'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 
      'Thursday': 0, 'Friday': 0, 'Saturday': 0 
    };
    
    filteredBookings.forEach(booking => {
      const amount = booking.totalCost || booking.totalAmount || 0;
      const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][bookingDate.getDay()];
      
      dayOfWeekData[dayOfWeek] += amount;
    });
    
    return dayOfWeekData;
  };
  
  // Get total revenue from filtered data
  const getFilteredTotalRevenue = () => {
    return filteredBookings.reduce((total, booking) => {
      return total + (booking.totalCost || booking.totalAmount || 0);
    }, 0);
  };
  
  // ========== REPORT GENERATION FUNCTIONS ==========
  
  // Get hotel name from authenticated user
  const getHotelName = () => {
    const user = HotelAuthService.getCurrentUser();
    return user?.hotelName || 'Hotel';
  };
  
  // Get bookings for report based on selected date range
  const getReportBookings = () => {
    if (!bookings || bookings.length === 0) return [];
    
    const now = new Date();
    let startDate, endDate = now;
    
    if (reportDateRange === 'custom') {
      if (!customDateRange.start || !customDateRange.end) return [];
      startDate = new Date(customDateRange.start);
      endDate = new Date(customDateRange.end);
    } else {
      switch(reportDateRange) {
        case 'week':
          startDate = new Date();
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date();
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate = new Date();
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate = new Date();
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = new Date();
          startDate.setMonth(now.getMonth() - 1);
      }
    }
    
    return bookings.filter(booking => {
      const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
      return bookingDate >= startDate && bookingDate <= endDate;
    });
  };
  
  // Calculate report statistics
  const getReportStats = (reportBookings) => {
    if (!reportBookings || reportBookings.length === 0) {
      return {
        totalRevenue: 0,
        totalBookings: 0,
        averageBookingValue: 0,
        commission: 0,
        netRevenue: 0,
        roomTypeBreakdown: {},
        statusBreakdown: {},
        paymentMethodBreakdown: {}
      };
    }
    
    let totalRevenue = 0;
    const roomTypeBreakdown = {};
    const statusBreakdown = {};
    const paymentMethodBreakdown = {};
    
    reportBookings.forEach(booking => {
      const amount = booking.totalCost || booking.totalAmount || 0;
      totalRevenue += amount;
      
      // Room type breakdown
      const roomType = booking.roomType || 'Unknown';
      roomTypeBreakdown[roomType] = (roomTypeBreakdown[roomType] || 0) + amount;
      
      // Status breakdown
      const status = booking.status || 'Unknown';
      statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
      
      // Payment method breakdown
      const paymentMethod = booking.paymentMethod || 'Unknown';
      paymentMethodBreakdown[paymentMethod] = (paymentMethodBreakdown[paymentMethod] || 0) + amount;
    });
    
    const totalBookings = reportBookings.length;
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const commission = totalRevenue * 0.1; // 10% commission
    const netRevenue = totalRevenue - commission;
    
    return {
      totalRevenue,
      totalBookings,
      averageBookingValue,
      commission,
      netRevenue,
      roomTypeBreakdown,
      statusBreakdown,
      paymentMethodBreakdown
    };
  };
  
  // Format date range for report header
  const getReportDateRangeText = () => {
    if (reportDateRange === 'custom') {
      if (!customDateRange.start || !customDateRange.end) return 'Custom Range';
      return `${format(new Date(customDateRange.start), 'MMM dd, yyyy')} - ${format(new Date(customDateRange.end), 'MMM dd, yyyy')}`;
    }
    
    const now = new Date();
    let startDate;
    
    switch(reportDateRange) {
      case 'week':
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        return `${format(startDate, 'MMM dd, yyyy')} - ${format(now, 'MMM dd, yyyy')}`;
      case 'month':
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
        return `${format(startDate, 'MMM dd, yyyy')} - ${format(now, 'MMM dd, yyyy')}`;
      case 'quarter':
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 3);
        return `${format(startDate, 'MMM dd, yyyy')} - ${format(now, 'MMM dd, yyyy')}`;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
        return `${format(startDate, 'MMM dd, yyyy')} - ${format(now, 'MMM dd, yyyy')}`;
      default:
        return 'Last Month';
    }
  };
  
  // Generate PDF Report
  const generatePDFReport = async () => {
    try {
      setIsGeneratingReport(true);
      
      console.log('Starting PDF generation...');
      
      const reportBookings = getReportBookings();
      console.log('Report bookings:', reportBookings.length);
      
      const stats = getReportStats(reportBookings);
      console.log('Report stats:', stats);
      
      // Helper function for currency formatting (defined locally)
      const formatCurrencyForPDF = (amount) => {
        return new Intl.NumberFormat('en-LK', {
          style: 'currency',
          currency: 'LKR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
      };
      
      // Create PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;
      
      console.log('PDF document created');
      
      // Header
      doc.setFillColor(255, 198, 0); // Yellow theme
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont(undefined, 'bold');
      doc.text(`${getHotelName()}`, pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text('Financial Report', pageWidth / 2, 25, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPosition = 45;
      
      console.log('Header added');
      
      // Report Info
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Report Type: ${reportType === 'detailed' ? 'Detailed' : reportType === 'summary' ? 'Summary' : 'Custom'}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Period: ${getReportDateRangeText()}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Total Bookings: ${stats.totalBookings}`, 14, yPosition);
      yPosition += 12;
      
      console.log('Report info added');
      
      // Summary Statistics
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255, 152, 0);
      doc.text('Financial Summary', 14, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 8;
      
      const summaryData = [
        ['Metric', 'Amount'],
        ['Total Revenue', formatCurrencyForPDF(stats.totalRevenue)],
        ['Platform Commission (10%)', formatCurrencyForPDF(stats.commission)],
        ['Net Revenue', formatCurrencyForPDF(stats.netRevenue)],
        ['Average Booking Value', formatCurrencyForPDF(stats.averageBookingValue)],
      ];
      
      console.log('Summary data prepared');
      
      autoTable(doc, {
        startY: yPosition,
        head: [summaryData[0]],
        body: summaryData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [255, 198, 0], textColor: [255, 255, 255] },
        margin: { left: 14, right: 14 },
      });
      
      yPosition = doc.lastAutoTable.finalY + 12;
      
      console.log('Summary table added');
      
      // Room Type Breakdown
      if (reportType !== 'summary') {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 152, 0);
        doc.text('Revenue by Room Type', 14, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
        
        const roomTypeData = [
          ['Room Type', 'Revenue', 'Percentage'],
          ...Object.entries(stats.roomTypeBreakdown).map(([type, amount]) => [
            type,
            formatCurrencyForPDF(amount),
            `${((amount / stats.totalRevenue) * 100).toFixed(1)}%`
          ])
        ];
        
        console.log('Room type data prepared');
        
        autoTable(doc, {
          startY: yPosition,
          head: [roomTypeData[0]],
          body: roomTypeData.slice(1),
          theme: 'grid',
          headStyles: { fillColor: [255, 198, 0], textColor: [255, 255, 255] },
          margin: { left: 14, right: 14 },
        });
        
        yPosition = doc.lastAutoTable.finalY + 12;
        console.log('Room type table added');
      }
      
      // Booking Status Breakdown
      if (reportType === 'detailed') {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 152, 0);
        doc.text('Booking Status Distribution', 14, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
        
        const statusData = [
          ['Status', 'Count', 'Percentage'],
          ...Object.entries(stats.statusBreakdown).map(([status, count]) => [
            status,
            count.toString(),
            `${((count / stats.totalBookings) * 100).toFixed(1)}%`
          ])
        ];
        
        console.log('Status data prepared');
        
        autoTable(doc, {
          startY: yPosition,
          head: [statusData[0]],
          body: statusData.slice(1),
          theme: 'grid',
          headStyles: { fillColor: [255, 198, 0], textColor: [255, 255, 255] },
          margin: { left: 14, right: 14 },
        });
        
        yPosition = doc.lastAutoTable.finalY + 12;
        console.log('Status table added');
        
        // Detailed Bookings List
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 152, 0);
        doc.text('Detailed Booking List', 14, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
        
        const bookingsData = [
          ['Date', 'Guest', 'Room Type', 'Status', 'Amount'],
          ...reportBookings.slice(0, 50).map(booking => [
            format(booking.createdAt ? new Date(booking.createdAt) : new Date(), 'MMM dd, yyyy'),
            booking.guestName || 'N/A',
            booking.roomType || 'N/A',
            booking.status || 'N/A',
            formatCurrencyForPDF(booking.totalCost || booking.totalAmount || 0)
          ])
        ];
        
        console.log('Bookings data prepared');
        
        autoTable(doc, {
          startY: yPosition,
          head: [bookingsData[0]],
          body: bookingsData.slice(1),
          theme: 'striped',
          headStyles: { fillColor: [255, 198, 0], textColor: [255, 255, 255] },
          margin: { left: 14, right: 14 },
          styles: { fontSize: 8 },
        });
        
        console.log('Bookings table added');
      }
      
      // Footer on all pages
      console.log('Adding footers...');
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        doc.text(
          `${getHotelName()} - Confidential`,
          14,
          pageHeight - 10
        );
      }
      
      console.log('Footers added, saving PDF...');
      
      // Save PDF
      const fileName = `Financial_Report_${getHotelName().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      
      console.log('PDF saved successfully!');
      
  setIsGeneratingReport(false);
  setShowReportOptions(false);
  toast.success('✅ PDF report generated successfully!');
      
    } catch (error) {
  console.error('Error generating PDF report:', error);
  console.error('Error stack:', error.stack);
  console.error('Error message:', error.message);
  toast.error(`❌ Failed to generate report. Error: ${error.message}`);
  setIsGeneratingReport(false);
    }
  };
  
  // Print Report (opens print dialog)
  const printReport = () => {
    window.print();
  };
  
  // ========== END REPORT GENERATION FUNCTIONS ==========
  
  // Chart title suffix based on filter
  const getFilterTitle = () => {
    switch(dateRange) {
      case 'week': return '(Last 7 Days)';
      case 'month': return '(Last 30 Days)';
      case 'year': return '(Last 12 Months)';
      default: return '';
    }
  };
  
  // Chart data for monthly earnings trend
  const monthlyEarningsTrendData = {
    labels: earningsData.earningsTrend.map(item => item.month),
    datasets: [
      {
        label: `Revenue ${getFilterTitle()} (LKR)`,
        data: earningsData.earningsTrend.map(item => item.amount),
        borderColor: 'rgba(255, 198, 0, 1)',
        backgroundColor: 'rgba(255, 198, 0, 0.5)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart data for earnings by room type
  const filteredRoomTypeData = getFilteredRoomTypeData();
  const roomTypeLabels = Object.keys(filteredRoomTypeData);
  const roomTypeEarningsData = {
    labels: roomTypeLabels,
    datasets: [
      {
        label: `Revenue by Room Type ${getFilterTitle()}`,
        data: roomTypeLabels.map(type => filteredRoomTypeData[type]),
        backgroundColor: [
          'rgba(255, 198, 0, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for earnings by day of week
  const filteredDayOfWeekData = getFilteredDayOfWeekData();
  const dayOfWeekLabels = Object.keys(filteredDayOfWeekData);
  const dayOfWeekData = {
    labels: dayOfWeekLabels,
    datasets: [
      {
        label: `Revenue by Day of Week ${getFilterTitle()}`,
        data: dayOfWeekLabels.map(day => filteredDayOfWeekData[day]),
        backgroundColor: 'rgba(255, 198, 0, 0.8)',
        borderColor: 'rgba(255, 198, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'LKR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {/* Print Styles - Hide everything except earnings content when printing */}
      <style>
        {`
          @media print {
            /* Hide everything by default */
            body * {
              visibility: hidden;
            }
            
            /* Show only the printable earnings content */
            #printable-earnings-content,
            #printable-earnings-content * {
              visibility: visible;
            }
            
            /* Position printable content at top-left */
            #printable-earnings-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            
            /* Hide buttons and interactive elements */
            .no-print,
            button,
            .print-hide {
              display: none !important;
            }
            
            /* Remove backgrounds for print */
            body {
              background: white !important;
            }
            
            /* Optimize charts for print */
            canvas {
              max-width: 100% !important;
              height: auto !important;
            }
            
            /* Page breaks */
            .page-break-before {
              page-break-before: always;
            }
            
            .page-break-after {
              page-break-after: always;
            }
            
            /* Ensure tables print properly */
            table {
              page-break-inside: avoid;
            }
            
            /* Print header styling */
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #FFC600;
            }
            
            /* Remove shadows and transitions for print */
            * {
              box-shadow: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
      
      <div className="p-6" id="printable-earnings-content">
        {/* Print Header - Only visible when printing */}
        <div className="print-header hidden print:block mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{getHotelName()} - Financial Report</h1>
          <p className="text-gray-600 mt-2">Generated: {format(new Date(), 'MMMM dd, yyyy HH:mm')}</p>
          <p className="text-gray-600">Period: {dateRange === 'week' ? 'Last 7 Days' : dateRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'}</p>
        </div>
        
        <header className="mb-8 flex justify-between items-center print-hide">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Revenue Analytics</h2>
            <p className="text-gray-600">Track your hotel's financial performance</p>
          </div>
          
          {/* Report Generation Button */}
          <div className="flex gap-3 no-print">
            <button
              onClick={() => setShowReportOptions(true)}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <span className="material-icons">description</span>
              <span className="font-medium">Generate Report</span>
            </button>
            
            <button
              onClick={printReport}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              title="Print Current View"
            >
              <span className="material-icons">print</span>
              <span className="font-medium">Print</span>
            </button>
          </div>
        </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title={`${dateRange === 'week' ? 'Weekly' : dateRange === 'month' ? 'Monthly' : 'Annual'} Revenue`}
              value={formatCurrency(getFilteredTotalRevenue())}
              icon="attach_money"
              color="bg-yellow-100 text-yellow-800"
              subtext={dateRange === 'week' ? 'Last 7 days' : dateRange === 'month' ? 'Last 30 days' : 'Last 12 months'}
            />
            <StatCard
              title={`${dateRange === 'week' ? 'Weekly' : dateRange === 'month' ? 'Monthly' : 'Annual'} Bookings`}
              value={filteredBookings.length}
              icon="book_online"
              color="bg-blue-100 text-blue-800"
              subtext={dateRange === 'week' ? 'Last 7 days' : dateRange === 'month' ? 'Last 30 days' : 'Last 12 months'}
            />
            <StatCard
              title="Top Room Type"
              value={earningsData.topPerformingRoom.type || "None"}
              icon="star"
              color="bg-green-100 text-green-800"
              subtext={earningsData.topPerformingRoom.revenue ? formatCurrency(earningsData.topPerformingRoom.revenue) : "No data"}
            />
            <StatCard
              title="Platform Commission"
              value={formatCurrency(getFilteredTotalRevenue() * 0.1)}
              icon="percent"
              color="bg-purple-100 text-purple-800"
              subtext="10% of filtered revenue"
            />
          </div>

          {/* Date Range Filter */}
          <div className="flex mb-6 gap-2">
            <button
              className={`px-4 py-2 rounded-md ${
                dateRange === 'year' ? 'bg-yellow-300 text-black' : 'bg-gray-200'
              }`}
              onClick={() => setDateRange('year')}
            >
              Year
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                dateRange === 'month' ? 'bg-yellow-300 text-black' : 'bg-gray-200'
              }`}
              onClick={() => setDateRange('month')}
            >
              Month
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                dateRange === 'week' ? 'bg-yellow-300 text-black' : 'bg-gray-200'
              }`}
              onClick={() => setDateRange('week')}
            >
              Week
            </button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Earnings Trend Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
              <div className="h-80">
                <Line data={monthlyEarningsTrendData} options={chartOptions} />
              </div>
            </div>

            {/* Revenue by Room Type */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue by Room Type</h3>
              <div className="h-80">
                <Pie data={roomTypeEarningsData} options={chartOptions} />
              </div>
            </div>

            {/* Revenue by Day of Week */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue by Day of Week</h3>
              <div className="h-80">
                <Bar data={dayOfWeekData} options={chartOptions} />
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                Revenue Summary {getFilterTitle()}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {dateRange === 'week' ? '(Last 7 Days)' : 
                   dateRange === 'month' ? '(Last 30 Days)' : 
                   '(Last 12 Months)'}
                </span>
              </h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left">Room Type</th>
                    <th className="py-2 text-right">Revenue</th>
                    <th className="py-2 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(filteredRoomTypeData).map(([type, amount]) => {
                    const filteredTotal = getFilteredTotalRevenue();
                    const percentage = filteredTotal > 0 ? (amount / filteredTotal) * 100 : 0;
                    
                    return (
                      <tr key={type} className="border-b border-gray-100">
                        <td className="py-3">{type}</td>
                        <td className="py-3 text-right font-medium">{formatCurrency(amount)}</td>
                        <td className="py-3 text-right font-medium">{percentage.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50">
                    <td className="py-3 font-bold">Total</td>
                    <td className="py-3 text-right font-bold">{formatCurrency(getFilteredTotalRevenue())}</td>
                    <td className="py-3 text-right font-bold">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Monthly Revenue Distribution {getFilterTitle()}
            </h3>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                Total filtered revenue: {formatCurrency(getFilteredTotalRevenue())}
              </p>
              <div className="text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
                {dateRange === 'week' ? 'Weekly View' : 
                 dateRange === 'month' ? 'Monthly View' : 
                 'Yearly View'}
              </div>
            </div>
            <div className="h-80">
              <Bar
                data={{
                  labels: Object.keys(earningsData.earningsByMonth),
                  datasets: [
                    {
                      label: `Revenue ${getFilterTitle()}`,
                      data: Object.values(earningsData.earningsByMonth),
                      backgroundColor: 'rgba(255, 198, 0, 0.8)',
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
          
          {/* Revenue Breakdown After Commission */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Revenue Breakdown & Financial Analysis</h3>
            <div className="flex flex-col md:flex-row items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mr-5">
                <span className="material-icons text-purple-500 text-3xl">account_balance</span>
              </div>
              <div>
                <h4 className="text-xl font-bold">Platform Commission & Net Earnings</h4>
                <p className="text-gray-500">
                  Comprehensive financial breakdown of your hotel revenue
                </p>
              </div>
              <div className="ml-auto mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <span className="material-icons text-sm mr-1">payments</span>
                  Financial Summary
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-1">{dateRange === 'week' ? 'Weekly' : dateRange === 'month' ? 'Monthly' : 'Annual'} Revenue</h5>
                <p className="text-xl font-bold">
                  {formatCurrency(getFilteredTotalRevenue())}
                </p>
                <p className="text-xs text-gray-500">
                  gross bookings value ({dateRange === 'week' ? 'last 7 days' : dateRange === 'month' ? 'last 30 days' : 'last 12 months'})
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-1">Platform Commission</h5>
                <p className="text-xl font-bold text-red-600">
                  - {formatCurrency(getFilteredTotalRevenue() * 0.1)}
                </p>
                <p className="text-xs text-gray-500">10% service fee</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-1">Net Revenue</h5>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(getFilteredTotalRevenue() * 0.9)}
                </p>
                <p className="text-xs text-gray-500">after platform fees</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-medium text-gray-700 mb-4">Revenue Distribution by Category</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Earning Room Type */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center mb-3">
                    <span className="material-icons text-yellow-500 mr-2">hotel</span>
                    <h5 className="font-medium">Top Performing Room Type</h5>
                    <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Top Earner
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold">{earningsData.topPerformingRoom.type || 'None'}</p>
                      <p className="text-sm text-gray-500">
                        {earningsData.totalEarnings > 0 
                          ? `${Math.round((earningsData.topPerformingRoom.revenue / earningsData.totalEarnings) * 100)}% of revenue`
                          : 'No revenue data'
                        }
                      </p>
                    </div>
                    <p className="text-lg font-bold">
                      {formatCurrency(earningsData.topPerformingRoom.revenue)}
                    </p>
                  </div>
                </div>
                
                {/* Revenue By Period */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center mb-3">
                    <span className="material-icons text-blue-500 mr-2">calendar_today</span>
                    <h5 className="font-medium">Revenue By Period</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Current Month</p>
                      <p className="font-medium">{formatCurrency(earningsData.monthlyEarnings)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Current Week</p>
                      <p className="font-medium">{formatCurrency(earningsData.weeklyEarnings)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Today</p>
                      <p className="font-medium">{formatCurrency(earningsData.dailyEarnings)}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                      <p className="text-sm font-medium">{dateRange === 'week' ? 'Last 7 Days' : dateRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'}</p>
                      <p className="font-medium text-yellow-600">{formatCurrency(getFilteredTotalRevenue())}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Financial Metrics and Insights */}
            <div className="mt-6 p-5 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                <span className="material-icons text-blue-600 mr-2">insights</span>
                Financial Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-blue-800 font-medium">Average Booking Value</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(filteredBookings.length > 0 
                      ? getFilteredTotalRevenue() / filteredBookings.length 
                      : 0)}
                  </p>
                  <p className="text-xs text-blue-600">{dateRange === 'week' ? 'Last 7 days' : dateRange === 'month' ? 'Last 30 days' : 'Last 12 months'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Room Occupancy</p>
                  <p className="text-lg font-bold">{Math.round(earningsData.occupancyRate)}%</p>
                  <p className="text-xs text-blue-600">Current rate</p>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Revenue per Available Room</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(earningsData.occupancyRate > 0 
                      ? getFilteredTotalRevenue() / (earningsData.occupancyRate / 100 * 50) 
                      : 0)}
                  </p>
                  <p className="text-xs text-blue-600">{dateRange === 'week' ? 'Weekly' : dateRange === 'month' ? 'Monthly' : 'Annual'} calculation</p>
                </div>
              </div>
            </div>
          </div>
          

        </>
      )}
      
      {/* Report Options Modal */}
      {showReportOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-white text-3xl">assessment</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Generate Financial Report</h3>
                    <p className="text-yellow-100 text-sm">Customize and download your financial report</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportOptions(false)}
                  className="text-white hover:bg-yellow-600 rounded-full p-1 transition-colors"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Report Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <span className="material-icons text-lg align-middle mr-1">article</span>
                  Report Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setReportType('summary')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      reportType === 'summary'
                        ? 'border-yellow-500 bg-yellow-50 shadow-md'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <span className="material-icons text-2xl block mb-2 text-yellow-600">summarize</span>
                    <span className="block font-medium text-sm">Summary</span>
                    <span className="block text-xs text-gray-500">Quick overview</span>
                  </button>
                  
                  <button
                    onClick={() => setReportType('detailed')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      reportType === 'detailed'
                        ? 'border-yellow-500 bg-yellow-50 shadow-md'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <span className="material-icons text-2xl block mb-2 text-yellow-600">description</span>
                    <span className="block font-medium text-sm">Detailed</span>
                    <span className="block text-xs text-gray-500">Full breakdown</span>
                  </button>
                  
                  <button
                    onClick={() => setReportType('custom')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      reportType === 'custom'
                        ? 'border-yellow-500 bg-yellow-50 shadow-md'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <span className="material-icons text-2xl block mb-2 text-yellow-600">tune</span>
                    <span className="block font-medium text-sm">Custom</span>
                    <span className="block text-xs text-gray-500">Customize fields</span>
                  </button>
                </div>
              </div>
              
              {/* Date Range Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <span className="material-icons text-lg align-middle mr-1">date_range</span>
                  Date Range
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['week', 'month', 'quarter', 'year', 'custom'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setReportDateRange(range)}
                      className={`py-2 px-3 rounded-lg border-2 font-medium text-sm transition-all ${
                        reportDateRange === range
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 hover:border-yellow-300 text-gray-600'
                      }`}
                    >
                      {range === 'week' && 'Last Week'}
                      {range === 'month' && 'Last Month'}
                      {range === 'quarter' && 'Last Quarter'}
                      {range === 'year' && 'Last Year'}
                      {range === 'custom' && 'Custom'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Custom Date Range Inputs */}
              {reportDateRange === 'custom' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Report Preview Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-icons text-blue-600">info</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2">Report Preview</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Type:</strong> {reportType === 'detailed' ? 'Detailed Report' : reportType === 'summary' ? 'Summary Report' : 'Custom Report'}</li>
                      <li>• <strong>Period:</strong> {getReportDateRangeText()}</li>
                      <li>• <strong>Bookings:</strong> {getReportBookings().length} bookings</li>
                      <li>• <strong>Total Revenue:</strong> {formatCurrency(getReportStats(getReportBookings()).totalRevenue)}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 justify-end">
              <button
                onClick={() => setShowReportOptions(false)}
                disabled={isGeneratingReport}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button
                onClick={generatePDFReport}
                disabled={isGeneratingReport || (reportDateRange === 'custom' && (!customDateRange.start || !customDateRange.end))}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGeneratingReport ? (
                  <>
                    <span className="material-icons animate-spin">refresh</span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons">download</span>
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, subtext }) => {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-xs font-medium tracking-wider">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtext && <p className="text-sm text-gray-600 mt-1">{subtext}</p>}
        </div>
        <div className="p-2 rounded-full bg-white bg-opacity-80 shadow-sm">
          <span className={`material-icons text-3xl text-yellow-500`}>
            {icon}
          </span>
        </div>
      </div>
      <div className="h-1 w-full bg-yellow-400 mt-3"></div>
    </div>
  );
};

export default EarningsPage;