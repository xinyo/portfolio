import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
} from "recharts";
import { Temporal } from "temporal-polyfill";

import {
  formatOverviewDate,
  formatOverviewMonth,
  overviewMonthlyOrderData,
  overviewOrderStatusData,
} from "@/apps/factory/overview-model";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

export function OverviewView() {
  const { i18n, t } = useTranslation();
  const [timeRange, setTimeRange] = useState("90d");
  const locale = i18n.resolvedLanguage ?? i18n.language;

  const areaChartConfig = {
    visitors: {
      label: t("factory.views.overview.metrics.salesOrders"),
    },
    desktop: {
      label: t("factory.views.overview.metrics.salesOrders"),
      color: "var(--chart-1)",
    },
    mobile: {
      label: t("factory.views.overview.metrics.purchaseOrders"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const barChartConfig = {
    orders: {
      label: t("factory.views.overview.metrics.orders"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const lineChartConfig = {
    revenue: {
      label: t("factory.views.overview.metrics.revenue"),
      color: "var(--chart-1)",
    },
    cost: {
      label: t("factory.views.overview.metrics.cost"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const radarChartConfig = {
    estimatedHours: {
      label: t("factory.views.overview.metrics.estimatedHours"),
      color: "var(--chart-1)",
    },
    actualHours: {
      label: t("factory.views.overview.metrics.actualHours"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const formatStatus = (value: string | number) =>
    t(`factory.views.overview.statuses.${String(value)}`);

  const filteredData = chartData.filter((item) => {
    const date = Temporal.PlainDate.from(item.date);
    const referenceDate = Temporal.PlainDate.from("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = referenceDate.subtract({ days: daysToSubtract });
    return Temporal.PlainDate.compare(date, startDate) >= 0;
  });

  return (
    <section className="factory-view">
      <h2 className="pb-15">{t("factory.views.overview.title")}</h2>
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>{t("factory.views.overview.area.title")}</CardTitle>
            <CardDescription>
              {t("factory.views.overview.area.description")}
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label={t("factory.views.overview.area.rangeLabel")}
            >
              <SelectValue
                placeholder={t("factory.views.overview.area.last90Days")}
              />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                {t("factory.views.overview.area.last90Days")}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t("factory.views.overview.area.last30Days")}
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                {t("factory.views.overview.area.last7Days")}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={areaChartConfig}
            className="aspect-auto h-[250px] w-full"
            role="img"
            aria-label={t("factory.views.overview.area.description")}
          >
            <AreaChart data={filteredData} accessibilityLayer>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => formatOverviewDate(value, locale)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      formatOverviewDate(String(value), locale)
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <div className="grid gap-4 pt-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="pt-0">
          <CardHeader className="border-b py-5">
            <CardTitle>{t("factory.views.overview.bar.title")}</CardTitle>
            <CardDescription>
              {t("factory.views.overview.bar.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6">
            <ChartContainer
              config={barChartConfig}
              className="aspect-auto h-[220px] w-full"
              role="img"
              aria-label={t("factory.views.overview.bar.description")}
            >
              <BarChart data={overviewOrderStatusData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatStatus}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        formatStatus(String(value))
                      }
                      indicator="dot"
                    />
                  }
                />
                <Bar
                  dataKey="orders"
                  fill="var(--color-orders)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="pt-0">
          <CardHeader className="border-b py-5">
            <CardTitle>{t("factory.views.overview.line.title")}</CardTitle>
            <CardDescription>
              {t("factory.views.overview.line.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6">
            <ChartContainer
              config={lineChartConfig}
              className="aspect-auto h-[220px] w-full"
              role="img"
              aria-label={t("factory.views.overview.line.description")}
            >
              <LineChart data={overviewMonthlyOrderData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    formatOverviewMonth(value, locale)
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        formatOverviewMonth(String(value), locale)
                      }
                      indicator="dot"
                    />
                  }
                />
                <Line
                  dataKey="revenue"
                  type="natural"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="cost"
                  type="natural"
                  stroke="var(--color-cost)"
                  strokeWidth={2}
                  dot={false}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="pt-0 md:col-span-2 xl:col-span-1">
          <CardHeader className="border-b py-5">
            <CardTitle>{t("factory.views.overview.radar.title")}</CardTitle>
            <CardDescription>
              {t("factory.views.overview.radar.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6">
            <ChartContainer
              config={radarChartConfig}
              className="aspect-auto h-[220px] w-full"
              role="img"
              aria-label={t("factory.views.overview.radar.description")}
            >
              <RadarChart data={overviewOrderStatusData} accessibilityLayer>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        formatStatus(String(value))
                      }
                      indicator="dot"
                    />
                  }
                />
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="status"
                  tickFormatter={formatStatus}
                />
                <Radar
                  dataKey="estimatedHours"
                  fill="var(--color-estimatedHours)"
                  fillOpacity={0.25}
                  stroke="var(--color-estimatedHours)"
                  strokeWidth={2}
                />
                <Radar
                  dataKey="actualHours"
                  fill="var(--color-actualHours)"
                  fillOpacity={0.2}
                  stroke="var(--color-actualHours)"
                  strokeWidth={2}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
