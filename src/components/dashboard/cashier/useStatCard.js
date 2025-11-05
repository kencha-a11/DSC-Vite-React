const useStatCards = (dashboardData) => {
  return useMemo(() => {
    if (!dashboardData || !dashboardData.data) return [];

    return [
      {
        key: "totalSales",
        value: `₱ ${dashboardData.data.total_sales?.current?.toLocaleString() || 0}`,
        percentageChange: Math.abs(
          parseFloat(dashboardData.data.total_sales?.change_percentage) || 0
        ),
        isIncrease: !dashboardData.data.total_sales?.change_percentage?.includes("-"),
      },
      {
        key: "totalItems",
        value: dashboardData.data.total_items_sold?.current || 0,
        percentageChange: Math.abs(
          parseFloat(dashboardData.data.total_items_sold?.change_percentage) || 0
        ),
        isIncrease: !dashboardData.data.total_items_sold?.change_percentage?.includes("-"),
      },
      {
        key: "totalTransactions",
        value: dashboardData.data.total_transactions?.current || 0,
        percentageChange: Math.abs(
          parseFloat(dashboardData.data.total_transactions?.change_percentage) || 0
        ),
        isIncrease: !dashboardData.data.total_transactions?.change_percentage?.includes("-"),
      },
      {
        key: "totalLogs",
        value: formatHours(dashboardData.data.total_logged_hours),
        percentageChange: 0,
        isIncrease: true,
      },
    ];
  }, [dashboardData]);
};
