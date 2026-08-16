import type { PlatformPerformance } from "./paid-ads-data";
import styles from "./paid-ads-studio.module.css";

interface MiniTrendChartProps {
  platformName: string;
  trend: readonly number[];
}

export function MiniTrendChart({ platformName, trend }: MiniTrendChartProps) {
  const points = trend.length > 1 ? trend : [trend[0] ?? 0, trend[0] ?? 0];
  const minimum = Math.min(...points);
  const range = Math.max(...points) - minimum || 1;
  const chartWidth = 120;
  const chartHeight = 56;
  const padding = 6;
  const polylinePoints = points
    .map((point, index) => {
      const x = padding + (index * (chartWidth - padding * 2)) / (points.length - 1);
      const y = chartHeight - padding - ((point - minimum) / range) * (chartHeight - padding * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      className={styles.miniTrendChart}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      role="img"
      aria-label={`${platformName} performance trend`}
    >
      <path className={styles.miniTrendBaseline} d="M6 47 H114" />
      <polyline className={styles.miniTrendLine} points={polylinePoints} />
      <circle className={styles.miniTrendEndpoint} cx={polylinePoints.split(" ").at(-1)?.split(",")[0]} cy={polylinePoints.split(" ").at(-1)?.split(",")[1]} r="3" />
    </svg>
  );
}

export function PlatformPerformanceCard({ performance }: { performance: PlatformPerformance }) {
  return (
    <article className={styles.platformPerformanceCard} aria-labelledby={`${performance.platform}-performance-title`}>
      <header className={styles.performanceCardHeader}>
        <div className={styles.platformIdentity}>
          <img src={performance.logo} alt="" className={styles.platformLogo} />
          <div>
            <p className={styles.performanceEyebrow}>Platform performance</p>
            <h3 id={`${performance.platform}-performance-title`}>{performance.name}</h3>
          </div>
        </div>
        <MiniTrendChart platformName={performance.name} trend={performance.trend} />
      </header>

      <dl className={styles.performanceMetricGrid}>
        {performance.metrics.map((metric) => (
          <div key={metric.label} className={styles.performanceMetric}>
            <dt>{metric.label}</dt>
            <dd>{metric.value}</dd>
            <span className={styles.metricChange}>{metric.change}</span>
          </div>
        ))}
      </dl>

      <div className={styles.campaignActionRail} aria-label={`New ${performance.name} campaign presentation`}>
        <span>New campaign</span>
        <span aria-hidden="true">↗</span>
      </div>
    </article>
  );
}
