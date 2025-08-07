import Container from "@/components/Container";
import { db } from "@/lib/db";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { DashboardCard, DashboardCardProps } from "./components/DashboardCard";

const getSalesData = async () => {
  try {
    const data = await db.order.aggregate({
      _sum: { pricePaid: true },
      _count: true,
    });

    return {
      amount: (data._sum.pricePaid || 0) / 100,
      numberOfSales: data._count,
    };
  } catch (error) {
    console.error(`Error fetching sales data`, error);
    return {
      amount: 0,
      numberOfSales: 0,
    };
  }
};

const getUserData = async () => {
  try {
    const [userCount, orderData] = await Promise.all([
      db.user.count(),
      db.order.aggregate({
        _sum: { pricePaid: true },
      }),
    ]);

    return {
      userCount,
      avgValuePerPerson:
        userCount === 0
          ? 0
          : (orderData?._sum?.pricePaid ?? 0 / userCount) / 100,
    };
  } catch (error) {
    console.log("Error fetching userCount and orderData", error);
    return {
      userCount: 0,
      avgValuePerPerson: 0,
    };
  }
};

async function getProductData() {
  try {
    const [activeCount, inactiveCount] = await Promise.all([
      db.product.count({ where: { isAvailableForPurchase: true } }),
      db.product.count({ where: { isAvailableForPurchase: false } }),
    ]);

    return { activeCount, inactiveCount };
  } catch (error) {
    return { activeCount: 0, inactiveCount: 0 };
  }
}

export default async function AdminPage() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  const cards: DashboardCardProps[] = [
    {
      title: "Sales",
      subtitle: `${formatNumber(salesData?.numberOfSales)} Orders`,
      body: formatCurrency(salesData?.amount),
    },
    {
      title: "Customers",
      subtitle: `${formatCurrency(userData?.avgValuePerPerson)} Average Value`,
      body: formatNumber(userData?.userCount),
    },
    {
      title: "Active Products",
      subtitle: `${formatNumber(productData?.inactiveCount)} Inactive`,
      body: formatNumber(productData.activeCount),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <DashboardCard key={i} {...card} />
        ))}
      </div>
    </>
  );
}
